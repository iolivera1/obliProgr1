const sistema = new Sistema();

document.querySelector('btnEnviarLoginUsuario') 

function habilitarNavegacion() {
  let botones = document.querySelectorAll(".btnNavegacion");

  for (i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", navegar);
  }
}

habilitarNavegacion();

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

