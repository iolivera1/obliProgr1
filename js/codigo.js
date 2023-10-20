const WARNING_ICON = `<img src="img/warning.webp" height="20px" alt="Advertencia">`;
const DENIED_ICON = `<img src="img/error.webp" height="20px" alt="Denegado">`;
const APPROVED_ICON = `<img src="img/approved.webp" height="20px" alt="Aprobado">`;
let sistema = new Sistema();


habilitarNavegacion();


function habilitarNavegacion() {
  let botones = document.querySelectorAll(".btnNavegacion");

  for (i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", navegar);
  }
}

function navegar() {
  let boton = this;
  let idDivMostrar = "#" + boton.getAttribute("data-mostrar");
  mostrarPagina(idDivMostrar);
}

function mostrarPagina(id) {
  let divsOcultar = document.querySelectorAll(".seccionPagina");

  for (i = 0; i < divsOcultar.length; i++) {
    divsOcultar[i].style.display = "none";
  }

  document.querySelector(id).style.display = "block";
}


function crearUsuario()
{
  let nombre = document.querySelector("#txtNombreRegisto").value;
  let apellido = document.querySelector("#txtApellidoRegisto").value;
  let userName = document.querySelector("#txtUsernameRegistro").value;
  let contrasenia = document.querySelector("#txtContraseniaRegistro").value;
  let repeticionContrasenia = document.querySelector("#txtContraseniaRepeticionRegistro").value;
  let nroTarjetaCredito = document.querySelector("#txtTarjetaCreditoNumero").value;
  let cvc = document.querySelector("#txtCVC").value;

  let msjError = validacionDeRegistro(nombre, apellido, userName, contrasenia, repeticionContrasenia)
  if(msjError.length > 0)
  {
    document.querySelector("#pMsjErrorRegistroUsuario").innerHTML = msjError;
    return;
  }
  document.querySelector("#pMsjErrorRegistroUsuario").innerHTML =``;
  document.querySelector("#divRegistroFormaDePago").style.display = "block";
  if(!formaDePagoEsValida(nroTarjetaCredito, cvc)) return;

  document.querySelector("#pMsjErrorRegistroUsuario").innerHTML = `${APPROVED_ICON}`;
  sistema.crearUsuario(nombre, apellido, userName, contrasenia);
}


function validacionDeRegistro(nombre, apellido, userName, contrasenia, repeticionContrasenia)
{

  let msjError = ``;
  if(!nombre.length || !apellido.length)
  {
    msjError += `${DENIED_ICON} El nombre y apellido no pueden estar vacios<br>`;
  }
  if(!sistema.esNombreUsuarioValido(userName))
  {
    msjError += `${DENIED_ICON} El nombre de usuario debe tener entre 4 y 20 caracteres. No puede ser un numero <br>`;
  }
  if(!sistema.esContraseniaValida(contrasenia))
  {
    msjError += `${DENIED_ICON} La contrasenia debe tener al menos 5 caracteres y <br>
    por lo menos una letra mayuscula, una minuscula y un numero <br>`;
  }
  if(!sistema.contraseniasCoinciden(contrasenia, repeticionContrasenia))
  {
    msjError = `${DENIED_ICON} Las contrasenias no coinciden <br>`;
  }

  return msjError;
}


function formaDePagoEsValida(nroTarjetaCredito, cvc)
{
  let msjError = ``;
  if(!sistema.esTarjetaDeCreditoValida(nroTarjetaCredito, cvc))
  {
    msjError = `${WARNING_ICON} La forma de pago ingresada no es valida`;
  }

  document.querySelector("#pMsjErrorFormaPago").innerHTML = msjError;
  if(msjError.length === 0)
  {
    return true;
  }
  return false;
}

//eventos fijos

document.querySelector("#btnCrearUsuario").addEventListener("click", crearUsuario);