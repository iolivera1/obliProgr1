let sistema = new Sistema();
sistema.preCargarDatos();

//eventos fijos

document.querySelector("#btnLogin").addEventListener("click", login);

document
  .querySelector("#btnCrearUsuario")
  .addEventListener("click", crearUsuario);

document
  .querySelector("#slcTipoOptimizacion")
  .addEventListener("change", montarOpcionesInstancias);

document
  .querySelector("#slcStockOptimizacion")
  .addEventListener("change", montarOpcionesInstancias);

document
  .querySelector("#slcTipoInstancia")
  .addEventListener("change", mostrarPrecioInstanciaSeleccionada);

document
  .querySelector("#slcStockInstancia")
  .addEventListener("change", mostrarStockInstanciaSeleccionada);

document
  .querySelector("#btnModificarStock")
  .addEventListener("click", modificarStock);

document
  .querySelector("#btnAlquilarVM")
  .addEventListener("click", alquilarMaquinaVirtual);

document
  .querySelector("#slcEstadoAlquiler")
  .addEventListener("change", filtrarEstadoMaquinasVirtuales);

//fin eventos fijos

habilitarNavegacion();
mostrarPagina("#divLoginUsuario");
cargarOptimizaciones("#slcTipoOptimizacion");
cargarOptimizaciones("#slcStockOptimizacion");
agregarLogOuts();

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
  limpiarCampos(idDivMostrar);
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
 * Toma los botones de logout y les carga la funcionalidad
 */
function agregarLogOuts() {
  let botones = document.querySelectorAll(".aLogOut");

  botones.forEach((boton) => {
    boton.addEventListener("click", logout);
  });
}

/**
 * Validacion del registro de usuario, chequea nombre de usuario, contrasenia y forma de pago
 * Si se validan los datos y la forma de pago, se crea el usuario
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
  limpiarCampos("#divRegistroUsuarioNuevo");
  document.querySelector("#pMsjRegistroUsuario").innerHTML =
    MENSAJE_USUARIO_CREADO_CORRECTAMENTE;
  sistema.crearUsuario(nombre, apellido, userName, contrasenia);

  actualizarTablaUsuario();
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
  let msjError = sistema.validarDatosRegistro(
    nombre,
    apellido,
    userName,
    contrasenia,
    repeticionContrasenia
  );

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
 * @returns  true si la tarjeta es valida (segun validacion de sistema)
 */
function formaDePagoEsValida(nroTarjetaCredito, cvc) {
  let msjError = sistema.esTarjetaDeCreditoValida(nroTarjetaCredito, cvc);

  document.querySelector("#pMsjRegistroUsuario").innerHTML = msjError;

  if (msjError) {
    return false;
  }

  return true;
}

/**
 * En la seccion alquiler (o en seccion de stock), carga el segundo combo box dinamicamente usando el value del primer combo box
 * this seria en este contexto, el elemento <option> seleccionado en el primer select
 */
function montarOpcionesInstancias() {
  let idMsj = "#pMsjAlquilerInstancias";
  let idDiv = "#divTipoDeInstancia";
  let idSelect = "#slcTipoInstancia";
  if (sistema.esUsuarioAdmin(sistema.usuarioActual)) {
    idMsj = "#pMsjStockInstancias";
    idDiv = "#divStockTipoDeInstancia";
    idSelect = "#slcStockInstancia";
  }
  document.querySelector(idMsj).innerHTML = `<br><br>`;

  let opcionSelect = this.value;
  let divSelect = document.querySelector(idDiv);

  if (opcionSelect == -1) {
    document.querySelector(idMsj).innerHTML =
      MENSAJE_OPCION_INSTANCIA_SELECCIONADA;
    document.querySelector("#slcTipoInstancia").value = "-1";
    divSelect.style.display = "none";
  } else {
    cargarSelect(opcionSelect, idSelect);
    divSelect.style.display = "block";
  }
}

/**
 * Dependiendo de el valor del select de instancias (this.value) muestra un mensaje de error 
 * o carga el segundo select de opciones
 */
function montarOpcionesStockInstancias() {
  document.querySelector("#pMsjStockInstancias").innerHTML = `<br><br>`;

  let opcionSelect = this.value;
  let divSelect = document.querySelector("#divStockTipoDeInstancia");

  if (opcionSelect == -1) {
    document.querySelector("#pMsjStockInstancias").innerHTML =
      MENSAJE_OPCION_INSTANCIA_SELECCIONADA;
    divSelect.style.display = "none";
  } else {
    cargarSelect(opcionSelect, "#slcStockInstancia");
    divSelect.style.display = "block";
  }
}

/**
 * Si el filtro de vistas de instancias cambia, la tabla de instancias se actualiza
 */
function filtrarEstadoMaquinasVirtuales() {
  let option = Number(this.value);
  if (option === -1) {
    actualizarTablaInstanciasUsuario()
    return;
  }
  actualizarTablaInstanciasUsuarioFiltrada(option);
}

/**
 * Esta implementacion usa un array de objetos en lugar de un array asociativo
 */
function cargarOptimizaciones(id) {
  let options = "<option value='-1'>Seleccione una opcion</option>";
  for (let i = 0; i < sistema.optimizaciones.length; i++) {
    let option = `<option value="${sistema.optimizaciones[i].prefijo}">${sistema.optimizaciones[i].texto}</option>`;
    options += option;
  }
  document.querySelector(id).innerHTML = options;
}

/** Carga el segundo select de alquiler de forma dinamica, 
 * dependiendo de la optimizacion elegida en el primer select
 */
function cargarSelect(tipo, id) {
  let instancias = sistema.filtrarTiposDeInstanciasPorOptimizacion(tipo);
  if (!instancias.length) return;

  let opciones = `<option value="-1">Seleccione una opcion...</option>`;
  for (i = 0; i < instancias.length; i++) {
    opciones += `<option value="${instancias[i].id}">${instancias[i].tipo}.${instancias[i].tamanio}</option>`;
  }
  document.querySelector(id).innerHTML = opciones;
}

/**
 * Toma las propiedades de la opcion seleccionada y los muestra en pantalla
 * Las propiedades son el precio de alquiler y precio de la instancia seleccionada
 */
function mostrarPrecioInstanciaSeleccionada() {
  document.querySelector("#pMsjAlquilerInstancias").innerHTML = ``;
  let idSeleccion = this.value;
  let instanciaSeleccionada = sistema.buscarInstanciaporID(idSeleccion);
  if (!instanciaSeleccionada) return;

  let msjPrecio =
    TEXTO_$_ALQUILER +
    `<b>${instanciaSeleccionada.costoPorAlquiler}</b>` +
    TEXTO_$_ENCENDIDO +
    `<b>${instanciaSeleccionada.costoPorEncendido}</b>`;

  document.querySelector("#pMsjAlquilerInstancias").innerHTML = msjPrecio;
}

/** Crea un alquiler, si puede; muestra mensaje de resultado en pantalla
 *  El mensaje puede ser de error o de exito
 */
function alquilarMaquinaVirtual() {
  let opcionSelecionada = document.querySelector("#slcTipoInstancia").value;
  let idUsuario = sistema.usuarioActual.id;
  let mensajeAlquiler = sistema.crearAlquilerDeInstancia(
    idUsuario,
    opcionSelecionada
  );
  limpiarCampos("#divAlquilerDeInstancias");
  if (mensajeAlquiler === MENSAJE_ALQUILER_EXITOSO) {
    actualizarTablaInstancias();
    actualizarTablaInstanciasUsuario();
    actualizarTablaCostosUsuario();
    document.querySelector("#divTipoDeInstancia").style.display = "none";
  }
  document.querySelector("#pMsjAlquilerInstancias").innerHTML = mensajeAlquiler;
}

/**
 * Lleva a cabo el login de usuario, muestra un mensaje de error si no logra hacer el login
 */
function login() {
  let usuario = document.querySelector("#txtUsernameoLogin").value;
  let contraseña = document.querySelector("#txtContraseniaLogin").value;
  document.querySelector("#pErrorLogin").innerHTML = ``;

  let errorLogin = sistema.login(usuario, contraseña);
  if (errorLogin) {
    document.querySelector("#pErrorLogin").innerHTML = errorLogin;
    return;
  }
  limpiarCampos("#divLoginUsuario");
  mostarPrimeraPagina();
}

/**
 * Luego de realizado el login, se debe mostrar contenido dependiendo del rol del user actual
 */
function mostarPrimeraPagina() {
  let usuarioActualEsAdmin = sistema.esUsuarioAdmin(sistema.usuarioActual);
  if (usuarioActualEsAdmin) {
    mostrarPagina("#divListadoUsuarios");
    document.querySelector("#cabezalAdmin").style.display = "block";
  } else {
    mostrarPagina("#divAlquilerDeInstancias");
    document.querySelector("#cabezalUser").style.display = "block";
    actualizarTablaInstanciasUsuario();
    actualizarTablaCostosUsuario();
  }
}

/**
 * Lleva acabo el logout, saca los headers de navegacion y muestra el login
 * tambien se remueve el usuario actual
 */
function logout() {
  mostrarPagina("#divLoginUsuario");
  document.querySelector("#cabezalAdmin").style.display = "none";
  document.querySelector("#cabezalUser").style.display = "none";
  sistema.logout();
}

/** ADMIN ONLY
 * carga la tabla de usuarios registrados en el sistema
 */
function actualizarTablaUsuario() {
  let tabla = document.querySelector("#tablaUsuarios");
  let usuarios = sistema.usuarios;
  let resultado = "";
  usuarios.forEach((usuario) => {
    let usuarioActivo = sistema.esUsuarioActivo(usuario);
    resultado += `<tr><td>${usuario.nombreUsuario}</td><td>${
      usuario.estado
    }</td><td>
    <button class="btnAlternarEstadoUsuario" value="${usuario.id}">
    ${usuarioActivo ? "bloquear" : "activar"}
    </button></td></tr>`;
  });
  tabla.innerHTML = resultado;
  actualizarBotonesTablaUsuarios();
}

actualizarTablaUsuario();

/**
 * Toma los botones de la tabla usuarios y les otorga su funcionalidad
 */
function actualizarBotonesTablaUsuarios() {
  let botones = document.querySelectorAll(".btnAlternarEstadoUsuario");
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", actualizarEstadoUsuario);
  }
}

/**
 * Cambia el estado de usuario segun id, la cual esta cargada como value del boton que dispare el evento
 */
function actualizarEstadoUsuario() {
  const idUsuario = Number(this.value);
  let usuario = sistema.encontrarUsuarioPorId(idUsuario);
  if (!usuario) return;
  sistema.cambiarEstadoDeUsuario(usuario);
  actualizarTablaUsuario();
  actualizarTablaInstancias();
}

/**ADMIN ONLY
 * Carga la tabla de stock de instancias, calculando el ingreso total y el ingreso parcial por cada TipoInstancia
 */
function actualizarTablaInstancias() {
  let tablaBody = document.querySelector("#tableListadoInstancias");
  let instancias = sistema.tiposDeInstanciasDisponibles;
  let resultado = "";
  instancias.forEach((instancia) => {
    resultado += `
    <tr>
    <td>${instancia.tipo + "." + instancia.tamanio}</td>
    <td>${sistema.buscarCantidadMaquinasAlquiladasPorIdInstancia(
      instancia.id
    )}</td>
    <td>${sistema.obtenerStockActual(instancia.id)}</td>
    <td>${sistema.obtenerGananciaTotalPorTipoInstancia(instancia.id)}</td
    ></tr>`;
  });
  tablaBody.innerHTML = resultado;

  document.querySelector(
    "#ingresoTotalInstancias"
  ).innerHTML = `La ganancia total es: ${sistema.obtenerGananciaTotal()}`;
}

actualizarTablaInstancias();

/**
 * En la pantalla de alquiler, muestra el precio de alquiler y de encendido de la instancia seleccionada
 */
function mostrarStockInstanciaSeleccionada() {
  const id_instancia = this.value;
  let instanciaSeleccionada = sistema.buscarInstanciaporID(id_instancia);
  if (!instanciaSeleccionada) return;

  let msjStock = `El stock actual es: <b>${instanciaSeleccionada.stockActual}</b> maquinas disponibles`;

  document.querySelector("#pMsjStockActual").innerHTML = msjStock;
}

/**
 * Modifica el stock del tipoInstancia seleccionada, si es posible
 * Muestra un mensaje al terminar, puede ser de error o no
 */
function modificarStock() {
  const id_instancia = document.querySelector("#slcStockInstancia").value;
  const nuevoStock = Number(
    document.querySelector("#txtNuevoStockIngresado").value
  );
  let mensaje = sistema.modificarStock(id_instancia, nuevoStock);
  document.querySelector("#pMsjStockInstancias").innerHTML = mensaje;
  actualizarTablaInstancias();
}

/**
 * Carga la tabla de costos para el usuario, con todos sus alquileres y el costo total
 */
function actualizarTablaCostosUsuario() {
  let tablaBody = document.querySelector("#tableCostosAcumulados");
  let alquileres = sistema.buscarAlquileresDeUsuario(sistema.usuarioActual.id);
  let resultado = ``;
  alquileres.forEach((alquiler) => {
    let tipoInstanciaAlquilada = sistema.buscarInstanciaporID(
      alquiler.idInstancia
    );
    resultado += `
    <tr>
    <td>${
      tipoInstanciaAlquilada.tipo + "." + tipoInstanciaAlquilada.tamanio
    }</td>
    <td>${tipoInstanciaAlquilada.costoPorEncendido}</td>
    <td>${sistema.calcularIniciosDeAlquiler(alquiler.idAlquiler)}</td>
    <td>${sistema.obtenerGananciaPorAlquiler(alquiler)}</td
    ></tr>`;
  });
  tablaBody.innerHTML = resultado;

  document.querySelector(
    "#costoTotalInstancias"
  ).innerHTML = `El costo total es: ${sistema.obtenerCostoTotalDeUsuario(sistema.usuarioActual.id)}`;
}

/**
 * carga la tabla de alquileres del usuario actual, incluyendo sus botones de apagado y encendido
 */
function actualizarTablaInstanciasUsuario() {
  let tablaBody = document.querySelector("#tablaListadoDeInstanciasUsuario");
  let alquileres = sistema.buscarAlquileresDeUsuario(sistema.usuarioActual.id);

  let resultado = "";
  alquileres.forEach((alquiler) => {
    if (alquiler.habilitado) {
      let tipoInstanciaAlquilada = sistema.buscarInstanciaporID(
        alquiler.idInstancia
      );
      let textoBoton =
        sistema.obtenerEstadoAlquiler(alquiler.idAlquiler) ===
        INSTANCIA_ENCENDIDA
          ? "apagar"
          : "encender";

      resultado += `
        <tr>
        <td>${
          tipoInstanciaAlquilada.tipo + "." + tipoInstanciaAlquilada.tamanio
        }</td> 
        <td>${sistema.obtenerEstadoAlquiler(alquiler.idAlquiler)}</td>
        <td>${sistema.calcularIniciosDeAlquiler(alquiler.idAlquiler)}</td>
        <td><button class="btnCambiarEstadoInstancia" value="${
          alquiler.idAlquiler
        }">${textoBoton}</button>
        </td>
        </tr>`;
    }
  });

  tablaBody.innerHTML = resultado;
  agregarFuncionalidadBotonesInstancias();
}

/**Carga la tabla de alquileres del usuario teniendo en cuenta el filtro de apagadas/encendidas
 * 
 * @param {*} estado 
 */
function actualizarTablaInstanciasUsuarioFiltrada(estado) {
  let tablaBody = document.querySelector("#tablaListadoDeInstanciasUsuario");
  let alquileres = sistema.buscarAlquileresDeUsuario(sistema.usuarioActual.id);
  let resultado = "";
  alquileres.forEach((alquiler) => {
    if (alquiler.habilitado && alquiler.encendido == estado) {
      let tipoInstanciaAlquilada = sistema.buscarInstanciaporID(
        alquiler.idInstancia
      );
      let textoBoton =
        sistema.obtenerEstadoAlquiler(alquiler.idAlquiler) ===
        INSTANCIA_ENCENDIDA
          ? "apagar"
          : "encender";
      resultado += `
        <tr>
        <td>${
          tipoInstanciaAlquilada.tipo + "." + tipoInstanciaAlquilada.tamanio
        }</td> 
        <td>${sistema.obtenerEstadoAlquiler(alquiler.idAlquiler)}</td>
        <td>${sistema.calcularIniciosDeAlquiler(alquiler.idAlquiler)}</td>
        <td><button class="btnCambiarEstadoInstancia" value="${
          alquiler.idAlquiler
        }">${textoBoton}</button>
        </td>
        </tr>`;
    }
  });

  tablaBody.innerHTML = resultado;
  agregarFuncionalidadBotonesInstancias();
}

/**
 * Agrega la funcionalidad a los botones de encendido/apagado de los alquileres
 */
function agregarFuncionalidadBotonesInstancias() {
  let botones = document.querySelectorAll(".btnCambiarEstadoInstancia");
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", cambiarEstadoDeInstanciaAlquilada);
  }
}

/**
 * si el alquiler esta encendido, lo apaga y viceversa
 * actualiza la tabla de alquileres respetando el filtro
 */
function cambiarEstadoDeInstanciaAlquilada() {
  let idAlquiler = Number(this.value);
  let alquiler = sistema.buscarAlquilerPorId(idAlquiler);
  let valorFiltro = Number(document.querySelector("#slcEstadoAlquiler").value);
  sistema.cambiarEstadoDeAlquiler(alquiler);
  actualizarTablaInstancias();
  actualizarTablaCostosUsuario();
  if (valorFiltro === -1) {
    actualizarTablaInstanciasUsuario();
  } else {
    actualizarTablaInstanciasUsuarioFiltrada(valorFiltro);
  }
}

/** Limpia todos los inputs, selects y parrafos de un div
 *
 * @param {String} idDiv
 */
function limpiarCampos(idDiv) {
  if (idDiv === "#divTotalesAPagar" || idDiv === "#divInformeInstancias") {
    return;
  }
  let div = document.querySelector(idDiv);
  let campos = div.querySelectorAll("input, p, select");
  for (let i = 0; i < campos.length; i++) {
    switch (campos[i].tagName) {
      case "INPUT":
        campos[i].value = ``;
        break;
      case "SELECT":
        campos[i].value = "-1";
        break;
      case "P":
        campos[i].innerHTML = ``;
        break;
    }
  }
}

