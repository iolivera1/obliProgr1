const WARNING_ICON = `<img src="img/warning.webp" height="20px" alt="Advertencia">`;
const DENIED_ICON = `<img src="img/error.webp" height="20px" alt="Denegado">`;
const APPROVED_ICON = `<img src="img/approved.webp" height="20px" alt="Aprobado">`;
const TEXTO_ALQUILER = ` - Costo por alquiler: U$S`;
const TEXTO_ENCENDIDO = ` - costo de encendido: U$S`;
const TIPOS_INSTANCIA = [
  ["c7.small", "c7.medium", "c7.large"],
  ["r7.small", "r7.medium", "r7.large"],
  ["i7.medium", "i7.large"],
];
const PRECIOS_ALQUILER = [
  [20, 30, 50],
  [35, 50, 60],
  [30, 50],
];
const PRECIOS_ENCENDIDO = [
  [2.5, 3.5, 6.0],
  [4.0, 6.5, 7.0],
  [3.5, 6.5],
];
let sistema = new Sistema();
sistema.preCargarDatos();

//eventos fijos

document
  .querySelector("#btnCrearUsuario")
  .addEventListener("click", crearUsuario);

document
  .querySelector("#btnYaTengoUsuario")
  .addEventListener("click", limpiarRegistro);
document
  .querySelector("#slcTipoOptimizacion")
  .addEventListener("change", montarOpcionesInstancias);

document
  .querySelector("#slcTipoInstancia")
  .addEventListener("change", mostrarPrecioInstanciaSeleccionada);

document.querySelector("#btnLogin").addEventListener("click", login);
document
  .querySelector("#btnAlquilarVM")
  .addEventListener("click", alquilarMaquinaVirtual);

//fin eventos fijos

habilitarNavegacion();
mostrarPagina("#divLoginUsuario");

/**
 * Limpia la seccion de registro al cambiar de pagina
 */
function limpiarRegistro()
{
  document.querySelector("#txtNombreRegisto").value = ``;
  document.querySelector("#txtApellidoRegisto").value = ``;
  document.querySelector("#txtUsernameRegistro").value = ``;
  document.querySelector("#txtContraseniaRegistro").value = ``;
  document.querySelector("#txtContraseniaRepeticionRegistro").value = ``;
  document.querySelector("#txtTarjetaCreditoNumero").value = ``;
  document.querySelector("#txtCVC").value = ``;
  document.querySelector("#pMsjRegistroUsuario").innerHTML = ``;
  document.querySelector("#divRegistroFormaDePago").style.display = "none";

}

/**
 * Le da funcionalidad a los botones para navegar entre distintas partes de la pagina
 */
function habilitarNavegacion() {
  let botones = document.querySelectorAll(".btnNavegacion");

  for (i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", navegar);
  }
}

/**
 * Carga la ID del div que se quiere mostrar, ID esta cargada como atributo del boton
 */
function navegar() {
  let boton = this;
  let idDivMostrar = "#" + boton.getAttribute("data-mostrar");
  mostrarPagina(idDivMostrar);
}

/** Oculta todos los div de una clase y muestra el ingresado por parametro
 *
 * @param {String} id
 */
function mostrarPagina(id) {
  let divsOcultar = document.querySelectorAll(".seccionPagina");

  for (i = 0; i < divsOcultar.length; i++) {
    divsOcultar[i].style.display = "none";
  }
  document.querySelector(id).style.display = "block";
}

function agregarLogOuts() {
  let botones = document.querySelectorAll(".btnLogOut");

  botones.forEach((boton) => {
    boton.addEventListener("click", logout);
  });
}
agregarLogOuts();
/**
 * Validacion del registro de usuario, chequea nombre de usuario, contrasenia y forma de pago
 */
function crearUsuario() {
  let nombre = document.querySelector("#txtNombreRegisto").value;
  let apellido = document.querySelector("#txtApellidoRegisto").value;
  let userName = document.querySelector("#txtUsernameRegistro").value;
  let contrasenia = document.querySelector("#txtContraseniaRegistro").value;
  let repeticionContrasenia = document.querySelector(
    "#txtContraseniaRepeticionRegistro"
  ).value;
  let nroTarjetaCredito = document.querySelector(
    "#txtTarjetaCreditoNumero"
  ).value;
  let cvc = document.querySelector("#txtCVC").value;

  if (
    !datosDeRegistroSonValidos(
      nombre,
      apellido,
      userName,
      contrasenia,
      repeticionContrasenia
    )
  )
    return;

  document.querySelector("#divRegistroFormaDePago").style.display = "block";
  if (!formaDePagoEsValida(nroTarjetaCredito, cvc)) return;

  document.querySelector(
    "#pMsjRegistroUsuario"
  ).innerHTML = `${APPROVED_ICON} Usuario pendiente de activacion`;
  sistema.crearUsuario(nombre, apellido, userName, contrasenia);

  let tabla = document.querySelector("#tablaUsuarios");
  actualizarTablaUsuario(tabla);
}

/** Muetra mensaje de error por cada dato de registro que no cumpla sus condiciones de ingreso
 *
 * @param {String} nombre
 * @param {String} apellido
 * @param {String} userName
 * @param {String} contrasenia
 * @param {String} repeticionContrasenia
 * @returns true si no hay mensajes de error para mostrar; false en otro caso
 */
function datosDeRegistroSonValidos(nombre, apellido, userName, contrasenia, repeticionContrasenia) 
{
  let msjError = ``;
  if (!nombre.length || !apellido.length) {
    msjError += `${DENIED_ICON} El nombre y el apellido no pueden estar vacios<br>`;
  }
  if (sistema.existeNombreDeUsuario(userName)) {
    msjError += `${DENIED_ICON} El nombre de usuario ingresado ya esta en uso <br>`;
  }
  if (!sistema.esNombreUsuarioValido(userName)) {
    msjError += `${DENIED_ICON} El nombre de usuario debe tener entre 4 y 20 caracteres. No puede ser un numero <br>`;
  }
  if (!sistema.esContraseniaValida(contrasenia)) {
    msjError += `${DENIED_ICON} La contrasenia debe tener al menos 5 caracteres y
    por lo menos una letra mayuscula, una minuscula y un numero <br>`;
  }
  if (!sistema.contraseniasCoinciden(contrasenia, repeticionContrasenia)) {
    msjError = `${DENIED_ICON} Las contrasenias no coinciden <br>`;
  }

  document.querySelector("#pMsjRegistroUsuario").innerHTML = msjError;

  if (msjError.length > 0) {
    return false;
  }

  return true;
}

/** Valida forma de pago ingresada en login
 *
 * @param {Number} nroTarjetaCredito
 * @param {Number} cvc
 * @returns  true si la tarjeta es valida (segun algoritmo de Luhn)
 */
function formaDePagoEsValida(nroTarjetaCredito, cvc) {
  if (!nroTarjetaCredito || !cvc) return false;

  let msjError = ``;
  if (!sistema.esTarjetaDeCreditoValida(nroTarjetaCredito, cvc)) {
    msjError = `${WARNING_ICON} La forma de pago ingresada no es valida`;
  }

  document.querySelector("#pMsjRegistroUsuario").innerHTML = msjError;

  if (msjError.length > 0) {
    return false;
  }

  return true;
}

/**
 * En la seccion alquiler, carga el segundo combo box dinamicamente usando el value del primer combo box
 * this seria en este contexto, el elemento <option> seleccionado en el primer select
 */
function montarOpcionesInstancias() {
  document.querySelector("#pMsjAlquilerInstancias").innerHTML = `<br><br>`;
  
  this.value;
  let divSelect = document.querySelector("#divTipoDeInstancia");
  let selectCarga = document.querySelector("#slcTipoInstancia");
  document.querySelector("#pErrorAlquiler").innerHTML = ``;

  if (opcionSelect == -1) {
    document.querySelector(
      "#pErrorAlquiler"
    ).innerHTML = `${DENIED_ICON} Seleccione una opción`;
    divSelect.style.display = "none";
  } else {
    cargarSelect(selectCarga, opcionSelect);
    divSelect.style.display = "block";
  }
}

/** Carga el segundo select de forma mas rustica, pero agrega atributos custom a las opciones
 *
 * @param {*} select
 * @param {*} indice
 */
function cargarSelect(select, indice) {
  
  let opciones = TIPOS_INSTANCIA[indice];
  let preciosAlquiler = PRECIOS_ALQUILER[indice];
  let preciosEncendido = PRECIOS_ENCENDIDO[indice];
  while (select.options.length > 0) {
    select.remove(0);
  }

  let opcion = `<option value="-1">Seleccione una opcion...</option>`;

  select.innerHTML = opcion;

  for (i = 0; i < opciones.length; i++) {
    opcion = `<option value="${i}" data-precio_alquiler="${preciosAlquiler[i]}" data-precio_encendido="${preciosEncendido[i]}">${opciones[i]}</option>`;

    select.innerHTML += opcion;
  }
}

/**
 * Toma los atributos de la opcion seleccionada y los muestra en pantalla
 * Los atributos son el precio de alquiler y precio de la instancia seleccionada
 */
function mostrarPrecioInstanciaSeleccionada() {
  document.querySelector("#pMsjAlquilerInstancias").innerHTML = ``;
  let opcionSeleccionada = document.querySelector("#slcTipoInstancia").value;
  let selectOpciones = document.querySelector("#slcTipoInstancia");

  if (Number(opcionSeleccionada) === -1) {
    return;
  }

  let optionElement = selectOpciones.querySelector(`option[value="${opcionSeleccionada}"]`);
  let alquiler = optionElement.getAttribute("data-precio_alquiler");
  let encendido = optionElement.getAttribute("data-precio_encendido");

  let msjPrecio = `Esta instancia tiene un alquiler de <b>U$S ${alquiler}</b><br> 
  y un precio por encendido de <b>U$S ${encendido}</b>`;
  document.querySelector("#pMsjAlquilerInstancias").innerHTML = msjPrecio;
}

function alquilarMaquinaVirtual() {
  let opcionSelecionada = document.querySelector("#slcTipoInstancia");
  if (opcionSelecionada.value === -1) return;

  //aqui pondria mi validacion de stock, si tuviera una!
}

/**
 * Lleva a cabo el login de usuario, muestra un mensaje de error si no logra hacer el login
 * si logra el login muestra la pantalla de alquiler
 */
function login() {
  let usuario = document.querySelector("#txtUsernameoLogin");
  let contraseña = document.querySelector("#txtContraseniaLogin");
  document.querySelector("#pErrorLogin").innerHTML = ``;
  if (sistema.login(usuario.value, contraseña.value) === false) {
    document.querySelector(
      "#pErrorLogin"
    ).innerHTML = `${DENIED_ICON} La combinacion de usuario y contrasenha no son correctas`;
  } else {
    if (sistema.usuarioActual.esAdmin) {
      mostrarPagina("#divListadoUsuarios");
    } else {
      mostrarPagina("#divAlquilerDeInstancias");
    }
  }
  usuario.value = "";
  contraseña.value = "";
}

function logout() {
  sistema.logout();
  mostrarPagina("#divLoginUsuario");
}

function actualizarTablaUsuario() {
  let tabla = document.querySelector("#tablaUsuarios");
  let usuarios = sistema.usuarios;
  let resultado = "";
  usuarios.forEach((usuario) => {
    resultado += `<tr><td>${usuario.nombreUsuario}</td><td>${
      usuario.estado
    }</td><td>
    <button class="btnAlternarEstadoUsuario" value="${usuario.id}">${
      sistema.esUsuarioActivo(usuario) == true ? "deshabilitar" : "habilitar"
    }</button></td></tr>`;
  });
  tabla.innerHTML = resultado;
  actualizarEventosBotonesTabla();
}

actualizarTablaUsuario(); // el profe dijo que lo dejemos asi (?

//ojo! no podemos usar forEach
function actualizarEventosBotonesTabla() {
  let botones = document.querySelectorAll(".btnAlternarEstadoUsuario");

  for(let i = 0; i < botones.length; i++)
  {
    botones[i].addEventListener("click", actualizarEstadoUsuario);
  }
}

function actualizarEstadoUsuario() {
  const idUsuario = Number(this.value);

  let usuario = sistema.encontrarUsuarioPorId(idUsuario);

  if (
    usuario.estado === ESTADO_PENDIENTE ||
    usuario.estado === ESTADO_BLOQUEADO
  ) {
    usuario.estado = ESTADO_ACTIVO;
  } else {
    usuario.estado = ESTADO_BLOQUEADO;
  }

  actualizarTablaUsuario();
}
