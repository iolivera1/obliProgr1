const WARNING_ICON = `<img src="img/warning.webp" height="20px" alt="Advertencia">`;
const DENIED_ICON = `<img src="img/error.webp" height="20px" alt="Denegado">`;
const APPROVED_ICON = `<img src="img/approved.webp" height="20px" alt="Aprobado">`;
const TIPOS_INSTANCIA = [
  [
    "c7.small (costo por alquiler: U$S 20 - costo por encendido: USD 2.50)",
    "c7.medium (costo por alquiler: U$S 30 - costo por encendido: USD 3.50)",
    "c7.large (costo por alquiler: U$S 50 - costo por encendido: USD 6.00)",
  ],
  [
    "r7.small (costo por alquiler: U$S 35 - costo por encendido: USD 4.00)",
    "r7.medium (costo por alquiler: U$S 50 - costo por encendido: USD 6.50)",
    "r7.large (costo por alquiler: U$S 60 - costo por encendido: USD 7.00)",
  ],
  [
    "i7.medium (costo por alquiler: U$S 30 - costo por encendido: USD 3.50)",
    "i7.large (costo por alquiler: U$S 50 - costo por encendido: USD 6.50)",
  ],
];

let sistema = new Sistema();
sistema.preCargarDatos();

//eventos fijos

document
  .querySelector("#btnCrearUsuario")
  .addEventListener("click", crearUsuario);

document
  .querySelector("#slcTipoInstanciaSeleccionada")
  .addEventListener("change", montarOpcionesInstancias);

document.querySelector("#btnLogin").addEventListener('click', login);
document.querySelector("#btnLogOut").addEventListener('click', logout);
document.querySelector("#btnAlquilarVM").addEventListener('click', alquilarMaquinaVirtual);



//fin eventos fijos

habilitarNavegacion();
mostrarPagina("#divRegistroUsuarioNuevo");

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

  if (!datosDeRegistroSonValidos(nombre, apellido, userName, contrasenia, repeticionContrasenia)) return;

  document.querySelector("#divRegistroFormaDePago").style.display = "block";
  if (!formaDePagoEsValida(nroTarjetaCredito, cvc)) return;

  document.querySelector("#pMsjRegistroUsuario").innerHTML = `${APPROVED_ICON} Usuario pendiente de activacion`;
  sistema.crearUsuario(nombre, apellido, userName, contrasenia);
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
function datosDeRegistroSonValidos(
  nombre,
  apellido,
  userName,
  contrasenia,
  repeticionContrasenia
) {
  let msjError = ``;
  if (!nombre.length || !apellido.length) {
    msjError += `${DENIED_ICON} El nombre y el apellido no pueden estar vacios<br>`;
  }
  if(sistema.existeNombreDeUsuario(userName))
  {
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
 * @returns  true 
 */
function formaDePagoEsValida(nroTarjetaCredito, cvc) {
  if(!nroTarjetaCredito || !cvc) return false;
  
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
 */
function montarOpcionesInstancias() {
  let opcionSelect = Number(
    document.querySelector("#slcTipoInstanciaSeleccionada").value
  );
  let divSelect = document.querySelector("#divTipoDeInstancia");
  let select = document.querySelector("#slcTipoInstancia");
  document.querySelector("#pErrorAlquiler").innerHTML = ``;

  if (opcionSelect == -1) {
    document.querySelector(
      "#pErrorAlquiler"
    ).innerHTML = `${DENIED_ICON} Seleccione una opción`;
    divSelect.style.display = "none";
  } else {
    cargarSelect(select, opcionSelect);
    divSelect.style.display = "block";
  }
}

function alquilarMaquinaVirtual()
{
  
}

function cargarSelect(select, valor) {
  let opciones = TIPOS_INSTANCIA[valor];
  while (select.options.length > 0) {
    select.remove(0);
  }

  let option = document.createElement("option");
  option.value = -1;
  option.text = 'seleccione una opcion'
  select.add(option);

  for (i = 0; i < opciones.length; i++) {
    option = document.createElement("option");
    option.value = `opcion${i}`;
    option.text = opciones[i];
    select.add(option);
  }
}

/**
 * Lleva a cabo el login de usuario, muestra un mensaje de error si no logra hacer el login
 * si logra el login muestra la pantalla de alquiler
 */
function login() {
  let usuario = document.querySelector("#txtUsernameoLogin").value
  let contraseña = document.querySelector("#txtContraseniaLogin").value
  document.querySelector("#pErrorLogin").innerHTML = ``;
  if(sistema.login(usuario, contraseña) === false)
  {
    document.querySelector("#pErrorLogin").innerHTML = `${DENIED_ICON} La combinacion de usuario y contrasenha no son correctas`;
  }
  else
  {
    mostrarPagina("#divAlquilerDeInstancias");
  }
}

function logout()
{
  sistema.logout();
  mostrarPagina("#divLoginUsuario");

}