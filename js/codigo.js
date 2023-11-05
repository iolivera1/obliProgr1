const TEXTO_$_ALQUILER = ` - Costo por alquiler: U$S`;
const TEXTO_$_ENCENDIDO = `<br> - costo de encendido: U$S`;
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

  // document.querySelector('#btnVerListadoAlquileres').addEventListener('click', mostrar) aca coso

//fin eventos fijos

habilitarNavegacion();
mostrarPagina("#divLoginUsuario");
cargarOptimizaciones();

/**
 * Limpia la seccion de registro al cambiar de pagina
 */
function limpiarRegistro() {
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
  let repeticionContrasenia = document.querySelector("#txtContraseniaRepeticionRegistro").value;
  let nroTarjetaCredito = document.querySelector("#txtTarjetaCreditoNumero").value;
  let cvc = document.querySelector("#txtCVC").value;

  if (!datosDeRegistroSonValidos(nombre, apellido, userName, contrasenia, repeticionContrasenia)) return;

  document.querySelector("#divRegistroFormaDePago").style.display = "block";
  if (!formaDePagoEsValida(nroTarjetaCredito, cvc)) return;

  document.querySelector("#pMsjRegistroUsuario").innerHTML = MENSAJE_USUARIO_CREADO_CORRECTAMENTE;
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
  let msjError = sistema.validarDatosRegistro(nombre, apellido, userName, contrasenia, repeticionContrasenia)

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

  let opcionSelect = this.value;
  let divSelect = document.querySelector("#divTipoDeInstancia");
  document.querySelector("#pErrorAlquiler").innerHTML = ``;

  if (this.value == -1) {
    document.querySelector(
      "#pMsjAlquilerInstancias"
    ).innerHTML = `${DENIED_ICON} Seleccione una opción`;
    divSelect.style.display = "none";
  } else {
    cargarSelect(this.value);
    divSelect.style.display = "block";
  }
}

/**
 * Esta implementacion usa un array de objetos en lugar de un array asociativo
 */
function cargarOptimizaciones() {
  let options = "<option value='-1'>Seleccione una opcion</option>";
  for (let i = 0; i < sistema.optimizaciones.length; i++) {
    let option = `<option value="${sistema.optimizaciones[i].prefijo}">${sistema.optimizaciones[i].texto}</option>`;
    options += option;
  }
  document.querySelector("#slcTipoOptimizacion").innerHTML = options;
}


/** Carga el segundo select de alquiler de forma dinamica
  *
 */
function cargarSelect(tipo) {

  let instancias = sistema.filtrarTiposDeInstanciasPorOptimizacion(tipo);
  if(!instancias.length) return;

  let opciones = `<option value="-1">Seleccione una opcion...</option>`;
  for (i = 0; i < instancias.length; i++) {
    opciones += `<option value="${instancias[i].id}">${instancias[i].tipo}.${instancias[i].tamanio}</option>`;
  }
  document.querySelector("#slcTipoInstancia").innerHTML = opciones;
}

/**
 * Toma los atributos de la opcion seleccionada y los muestra en pantalla
 * Los atributos son el precio de alquiler y precio de la instancia seleccionada
 */
function mostrarPrecioInstanciaSeleccionada() {
  document.querySelector("#pMsjAlquilerInstancias").innerHTML = ``;
  let idSeleccion = this.value;
  let instanciaSeleccionada = sistema.buscarInstanciaporID(idSeleccion);
  if(!instanciaSeleccionada) return;

  let msjPrecio = TEXTO_$_ALQUILER + `<b>U$S${instanciaSeleccionada.costoPorAlquiler}</b>` + 
  TEXTO_$_ENCENDIDO + `<b>${instanciaSeleccionada.costoPorEncendido}</b>`;

  document.querySelector("#pMsjAlquilerInstancias").innerHTML = msjPrecio;
}

/** Crea un alquiler, si puede; muestra mensaje de resultado en pantalla
 * 
 * @returns true si puede crear un alquiler y asociarlo al usuario, false en otro caso
 */
function alquilarMaquinaVirtual() 
{
  let opcionSelecionada = document.querySelector("#slcTipoInstancia").value;
  let mensajeAlquiler = sistema.crearAlquilerDeInstancia(opcionSelecionada);
  document.querySelector("#pMsjAlquilerInstancias").innerHTML = mensajeAlquiler;
  return mensajeAlquiler === ALQUILER_EXITOSO;
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
    ).innerHTML = `${DENIED_ICON} La combinacion de usuario y contraseña no son correctas`;
  } else {
    if (
      sistema.usuarioActual.estado == ESTADO_PENDIENTE ||
      sistema.usuarioActual.estado == ESTADO_BLOQUEADO
    ) {
      document.querySelector(
        "#pErrorLogin"
      ).innerHTML = `${DENIED_ICON} El usuario necesita ser habilitado`;
      return;
    }
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

  for (let i = 0; i < botones.length; i++) {
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
