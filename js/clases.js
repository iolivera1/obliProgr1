const WARNING_ICON = `<img src="img/warning.webp" height="25px" alt="Advertencia">`;
const DENIED_ICON = `<img src="img/error.webp" height="25px" alt="Denegado">`;
const APPROVED_ICON = `<img src="img/approved.webp" height="25px" alt="Aprobado">`;

const TEXTO_$_ALQUILER = ` - Costo por alquiler: U$S`;
const TEXTO_$_ENCENDIDO = `<br> - costo de encendido: U$S`;

//mensajes de registro
const ERROR_REGISTRO_NOMBRE_APELLIDO = `${DENIED_ICON} El nombre y el apellido no pueden estar vacios<br>`;
const ERROR_REGISTRO_NOMBRE_USUARIO_INVALIDO = `${DENIED_ICON} El nombre de usuario debe tener entre 4 y 20 caracteres. No puede ser un numero <br>`;
const ERROR_REGISTRO_EXISTE_USUARIO = `${DENIED_ICON} El nombre de usuario ingresado ya esta en uso <br>`;
const ERROR_REGISTRO_CONTRASENIA_INVALIDA = `${DENIED_ICON} La contraseña debe tener al menos 5 caracteres y por lo menos una letra mayuscula, una minuscula y un numero <br>`;
const ERROR_REGISTRO_REPETICION_CONTRASENIA = `${DENIED_ICON} Las contraseñas no coinciden <br>`;
const ERROR_REGISTRO_FORMA_PAGO_INVALIDA = `${WARNING_ICON} La forma de pago ingresada no es valida`;
const MENSAJE_USUARIO_CREADO_CORRECTAMENTE = `${APPROVED_ICON} Usuario pendiente de activacion`;

//mensaje de login
const MENSAJE_ERROR_LOGIN = `${DENIED_ICON} La combinacion de usuario y contraseña no son correctas`;
const MENSAJE_USUARIO_INACTIVO = `${DENIED_ICON} El usuario necesita ser habilitado`;

const ESTADO_PENDIENTE = "pendiente";
const ESTADO_ACTIVO = "activo";
const ESTADO_BLOQUEADO = "bloqueado";
const OPTIMIZADA_COMPUTO = "c7";
const OPTIMIZADA_ALMACENAMIENTO = "i7";
const OPTIMIZADA_MEMORIA = "r7";
const TAMANIO_CHICO = "small";
const TAMANIO_MEDIO = "medium";
const TAMANIO_GRANDE = "large";

const MENSAJE_OPCION_INSTANCIA_SELECCIONADA = `${DENIED_ICON} Seleccione una opción`;
const MENSAJE_INSTANCIA_INCORRECTA = "Tipo de instancia incorrecto";
const MENSAJE_INSTANCIA_SIN_STOCK = "No hay stock";
const ALQUILER_EXITOSO = `${APPROVED_ICON} Alquiler de instancia exitoso`;

const MENSAJE_STOCK_INVALIDO = `${DENIED_ICON} El stock debe ser un numero positivo`;
const MENSAJE_STOCK_MENOR_AL_TOPE = `${DENIED_ICON} El stock no puede ser menor que las instancias ya alquiladas`;
const MENSAJE_STOCK_MODIFICADO_OK = `${APPROVED_ICON} Stock modificado correctamente`;


const INSTANCIA_ENCENDIDA = "Encendida";
const INSTANCIA_APAGADA = "Apagada";

//ID's globales
let idTipoInstancia = 0;
let idUsuario = 0;
let idAlquiler = 0;

class Sistema {
  constructor() {
    this.usuarios = [];
    this.usuarioActual = null;
    this.tiposDeInstanciasDisponibles = [];
    this.optimizaciones = [];
    this.alquileres = [];
  }

  /**Valida usuario y contrasenia, asigna al usuario actual si logra loguearlo
   *
   * @param {String} nombreUsuario
   * @param {String} contrasenia
   * @returns un mensaje de error si no puede realizar el login, null en otro caso
   */
  login(nombreUsuario, contrasenia) {
    if(!nombreUsuario || !contrasenia) return MENSAJE_ERROR_LOGIN;
    let usuario = this.encontrarUsuarioPorNombre(nombreUsuario);
    if(!usuario || usuario.contrasenia !== contrasenia) return MENSAJE_ERROR_LOGIN;
    if(usuario.estado === ESTADO_BLOQUEADO || usuario.estado === ESTADO_PENDIENTE) return MENSAJE_USUARIO_INACTIVO;
    this.usuarioActual = usuario;
    return null;
  }

  /**
   * Simplemente libera el usuario actual para ser coherente con lo que se vusaliza en pantalla
   */
  logout() {
    this.usuarioActual = null;
  }

  /** En este punto todas las validaciones se tienen que haber realizado
   *  Agrega un usuario al array de usuarios
   *
   * @param {String} nombre
   * @param {String} apellido
   * @param {String} nombreUsuario
   * @param {String} contrasenia
   */
  crearUsuario(nombre, apellido, nombreUsuario, contrasenia) {
    let usuario = new Usuario(nombre, apellido, nombreUsuario, contrasenia);
    this.usuarios.push(usuario);
  }

  /** Valida que los datos con los que se intenta registrar un usario sean validos
   * No incluye validaciones de forma de pago, ya que se activan al validar estos datos
   *
   * @param {String} nombre
   * @param {String} apellido
   * @param {String} nombreUsuario
   * @param {String} contrasenia
   * @param {String} contraseniaRepeticion
   * @returns {String} Mensaje de error si algun dato es invalido, null en otro caso
   */
  validarDatosRegistro(nombre, apellido, nombreUsuario, contrasenia, contraseniaRepeticion) 
  {
    let msjError = ``;
    msjError += !this.esNombreYApellidoValido(nombre, apellido)
      ? ERROR_REGISTRO_NOMBRE_APELLIDO
      : ``;
    msjError += !this.esNombreUsuarioValido(nombreUsuario)
      ? ERROR_REGISTRO_NOMBRE_USUARIO_INVALIDO
      : ``;
    msjError += this.existeNombreDeUsuario(nombreUsuario)
      ? ERROR_REGISTRO_EXISTE_USUARIO
      : ``;
    msjError += !this.esContraseniaValida(contrasenia)
      ? ERROR_REGISTRO_CONTRASENIA_INVALIDA
      : ``;
    msjError += !this.contraseniasCoinciden(contrasenia, contraseniaRepeticion)
      ? ERROR_REGISTRO_REPETICION_CONTRASENIA
      : ``;
    return msjError;
  }

  /** Valida nombre y apellido con el que se intenta registrar
   *
   * @param {String} nombre
   * @param {String} apellido
   * @returns {Boolean} true si alguno de los datos es vacio o un numero, false en otro caso
   */
  esNombreYApellidoValido(nombre, apellido) {
    return (nombre.length > 0 && apellido.length > 0 
      && !Number(nombre) && !Number(apellido));
  }

  /**Un nombre de usuario es valido si tiene al menos 4 caracteres y no mas de 20
   *
   * @param {String} nombreUsuario
   * @returns {Boolean} true si el usuario es valido, false en otro caso
   */
  esNombreUsuarioValido(nombreUsuario) {
    if (
      nombreUsuario.length < 4 ||
      nombreUsuario.length > 20 ||
      Number(nombreUsuario)
    ) {
      return false;
    }
    return true;
  }

  /** Validacion de registro: existencia de nombre de usuario
   *
   * @param {String} nombreUsuario
   * @returns {Boolean} true si el nombre de usuario que se quiere registrar ya esta en uso
   */
  existeNombreDeUsuario(nombreUsuario) {
    return this.encontrarUsuarioPorNombre(nombreUsuario) !== null;
  }

  /**
   *
   * @param {Usuario} usuario
   * @returns true si el usuario esta activo
   */
  esUsuarioActivo(usuario) {
    return usuario.estado === ESTADO_ACTIVO;
  }

  esUsuarioAdmin(usuario) {
    return usuario.esAdmin;
  }

  /** Toma un objeto de la clase Usuarios y le cambia el estado
   * Un usuario activo se cambia a bloqueado, y uno pendiente a activo
   * 
   * @param {Usuario} usuario 
   */
  cambiarEstadoDeUsuario(usuario)
  {
    if (
      usuario.estado === ESTADO_PENDIENTE ||
      usuario.estado === ESTADO_BLOQUEADO
    ) {
      usuario.estado = ESTADO_ACTIVO;
    } else {
      usuario.estado = ESTADO_BLOQUEADO;
    }
  }

  /**Busca un usuario por su nombre de usuario
   *
   * @param {String} nombreUsuario
   * @returns {Usuario} un objeto de la clase Usuarios, si lo encuentra en usuarios[]; null en otro caso
   */
  encontrarUsuarioPorNombre(nombreUsuario) {
    let usuario = null;
    let i = 0;
    while (i < this.usuarios.length && !usuario) {
      usuario =
        this.usuarios[i].nombreUsuario === nombreUsuario
          ? this.usuarios[i]
          : null;
      i++;
    }
    return usuario;
  }

  /**Busca un usuario por su ID, en el array de usuarios
   *
   * @param {Number} idUsuario
   * @returns {Usuario} un objeto de la clase Usuarios, si lo encuentra en usuarios[]; null en otro caso
   */
  encontrarUsuarioPorId(idUsuario) {
    let usuario = null;
    let i = 0;
    while (i < this.usuarios.length && !usuario) {
      usuario = this.usuarios[i].id === idUsuario ? this.usuarios[i] : null;
      i++;
    }
    return usuario;
  }

  /**
   * Validación de contraseña ingresada en el registro de usuario
   *
   * @param {String} contrasenia
   * @returns true si la contraseña ingresada es válida para asociar a un usuario, false en otro caso
   */
  esContraseniaValida(contrasenia) {
    if (contrasenia.length < 5) return false;
    let tieneMayuscula = false;
    let tieneMinuscula = false;
    let tieneNumero = false;
    let i = 0;
    while (
      i < contrasenia.length &&
      (!tieneMayuscula || !tieneMinuscula || !tieneNumero)
    ) {
      tieneMayuscula = this.esLetraMayuscula(contrasenia.charCodeAt(i))
        ? true
        : tieneMayuscula;
      tieneMinuscula = this.esLetraMinuscula(contrasenia.charCodeAt(i))
        ? true
        : tieneMinuscula;
      tieneNumero = this.esNumero(contrasenia.charAt(i)) ? true : tieneNumero;
      i++;
    }

    return tieneMayuscula && tieneMinuscula && tieneNumero;
  }

  /**
   * Validación de letra mayúscula
   *
   * @param {Number} letra
   */
  esLetraMayuscula(letra) {
    return letra >= 65 && letra <= 90;
  }

  /**
   * Validación de letra minúscula
   *
   * @param {Number} letra
   */
  esLetraMinuscula(letra) {
    return letra >= 97 && letra <= 122;
  }

  /**
   * Validación de número
   *
   * @param {String} caracter
   */
  esNumero(caracter) {
    return !isNaN(Number(caracter));
  }

  /**
   * Validación de contraseñas coinciden
   *
   * @param {String} contrasenia
   * @param {String} contraseniaRepeticion
   */
  contraseniasCoinciden(contrasenia, contraseniaRepeticion) {
    return contrasenia === contraseniaRepeticion;
  }

  /** Valida tarjeta de credito usando el algoritmo de Luhn;
   *  no funciona todavia jeje
   * @param {string} nroTarjeta
   * @param {Number} cvc
   * @returns mensaje de error si la forma de pago no es valida, null en otro caso
   */
  esTarjetaDeCreditoValida(nroTarjeta, cvc) {
    const LARGO_TARJETA = 16;
    if (nroTarjeta.length !== LARGO_TARJETA || cvc.length !== 3) return ERROR_REGISTRO_FORMA_PAGO_INVALIDA;
    let tarjetaConDuplicado = this.tarjetaConDuplicado(nroTarjeta);
    let sumaDeDigitos = this.tarjetaConDigitosSumados(tarjetaConDuplicado);
    let resultado = (sumaDeDigitos * 9) % 10;
    let digitoVerificador = Number(nroTarjeta.charAt(nroTarjeta.length - 1));
    return resultado === digitoVerificador ? null : ERROR_REGISTRO_FORMA_PAGO_INVALIDA;
  }

  /** toma cada digito del numero ingresado y duplica solo los que esten en
   *  posiciones pares antes de ingresarlo en resultado[]
   *
   * @param {Number} nroTarjeta
   * @returns [] array de numeros
   */
  tarjetaConDuplicado(nroTarjeta) {
    let resultado = [];

    for (let i = nroTarjeta.length - 2; i >= 0; i--) {
      let nro = Number(nroTarjeta.charAt(i));
      if (i % 2 === 0) {
        resultado.push(nro * 2);
      } else {
        resultado.push(nro);
      }
    }
    return resultado;
  }

  /**
   *
   * @param {Number} numeros
   * @returns Retorna la suma de todos los digitos de la tarjeta
   */
  tarjetaConDigitosSumados(numeros) {
    let resultado = 0;

    for (let i = 0; i < numeros.length; i++) {
      resultado += this.sumarDigitos(numeros[i]);
    }

    return resultado;
  }

  /** Si el numero ingresado es mayor a 9, devuelve la unidad del numero + 1
   *
   * @param {Number} numero
   * @returns {Number}
   */
  sumarDigitos(numero) {
    if (numero > 9) {
      return (numero % 10) + 1;
    } else {
      return numero;
    }
  }

  /** Valida stock antes de crear un alquiler
   *
   * @param {String} id_instancia
   */
  crearAlquilerDeInstancia(id_instancia) {
    let instancia = this.buscarInstanciaporID(id_instancia);
    if (!instancia) {
      return MENSAJE_INSTANCIA_INCORRECTA;
    }
    if (instancia.stockActual < 1) {
      return MENSAJE_INSTANCIA_SIN_STOCK;
    }
    instancia.stockActual--;
    let nuevoAlquiler = new Alquiler(this.usuarioActual.id, id_instancia);
    this.alquileres.push(nuevoAlquiler);
    this.usuarioActual.alquileres.push(nuevoAlquiler);
    return ALQUILER_EXITOSO;
  }

  /**Recibe tipo (puede ser c7, i7, r7)
   * @param {String} tipo
   * @returns Array de objetos TipoInstancia, filtrado por tipo
   */
  filtrarTiposDeInstanciasPorOptimizacion(tipo) {
    let resultado = [];
    for (i = 0; i < this.tiposDeInstanciasDisponibles.length; i++) {
      if (tipo === this.tiposDeInstanciasDisponibles[i].tipo) {
        resultado.push(this.tiposDeInstanciasDisponibles[i]);
      }
    }
    return resultado;
  }

  /**
   *
   * @returns Array de alquileres del usuario actual
   */
  alquileresDeUsuarioActual() {
    return this.usuarioActual.alquileres;
  }

  crearInstancia(costoEncendido, costoAlquiler, tamanio, tipo, stockInicial) {
    let tipoInstancia = new TipoInstancia(
      costoEncendido,
      costoAlquiler,
      tamanio,
      tipo,
      stockInicial
    );
    this.tiposDeInstanciasDisponibles.push(tipoInstancia);
  }

  obtenerInstanciasPorUsuario(idUsuario) {
    const instanciasAlquiladas = [];

    for (let i = 0; i < this.alquileres.length; i++) {
      const alquiler = this.alquileres[i];
      if (alquiler.idUsuario === idUsuario) {
        const instancia = this.buscarInstanciaporID(alquiler.idInstancia);
        if (instancia) {
          instanciasAlquiladas.push(instancia);
        }
      }
    }
    return instanciasAlquiladas;
  }

  obtenerEstadoAlquiler(idInstancia) {
    const alquiler = this.buscarAlquilerPorIDInstancia(idInstancia);

    if (alquiler) {
      return alquiler.encendido ? INSTANCIA_ENCENDIDA : INSTANCIA_APAGADA;
    } else {
      return MENSAJE_INSTANCIA_INCORRECTA;
    }
  }

  /**
   * 
   * @param {String} id_instancia 
   * @param {Number} nuevoStock 
   * @returns mensaje que puede ser de error si no logra modificar el stock; mensaje de exito si logra modificar 
   */
  modificarStock(id_instancia, nuevoStock) {
    let instancia = this.buscarInstanciaporID(id_instancia);
    if (!instancia) return MENSAJE_OPCION_INSTANCIA_SELECCIONADA;
    if (isNaN(nuevoStock)) return MENSAJE_STOCK_INVALIDO;
    let cantidadAlquiladas = this.buscarCantidadMaquinasAlquiladasPorIdInstancia(id_instancia);
    if (cantidadAlquiladas > nuevoStock) return MENSAJE_STOCK_MENOR_AL_TOPE;
    instancia.stockActual = nuevoStock;
    return MENSAJE_STOCK_MODIFICADO_OK;
  }

  obtenerStockActual(id_instancia) {
    let instancia = this.buscarInstanciaporID(id_instancia);
    if(!instancia) return 0;
    return instancia.stockActual;
  }

  buscarCantidadMaquinasAlquiladasPorIdInstancia(id_instancia) {
    let cantidadAlquiladas = 0;

    for (i = 0; this.alquileres.length > i; i++) {
      if (this.alquileres[i].idInstancia == id_instancia) {
        cantidadAlquiladas++;
      }
    }
    return cantidadAlquiladas;
  }

  obtenerGananciaTotalPorTipoInstancia(id_instancia) {
    let alquileres = this.alquileres;
    let total = 0;
    for (i = 0; alquileres.length > i; i++) {
      if (alquileres[i].idInstancia === id_instancia) {
        total += this.obtenerGananciaPorAlquiler(alquileres[i]);
      }
    }
    return total;
  }

  obtenerGananciaPorAlquiler(alquiler) {
    let tipoInstancia = this.buscarInstanciaporID(alquiler.idInstancia);
        
    return (
      tipoInstancia.costoPorAlquiler +
      (alquiler.encendidos - 1) * tipoInstancia.costoPorEncendido
    );
  }

  obtenerGananciaTotal() {
    let montoTotal = 0;
    for (let i = 0; i < this.tiposDeInstanciasDisponibles.length; i++) {
        montoTotal += this.obtenerGananciaTotalPorTipoInstancia(this.tiposDeInstanciasDisponibles[i].id);
    }
    return montoTotal;
}

  calcularIniciosDeAlquiler(idInstancia) {
    let totalInicios = 0;

    for (let i = 0; i < this.alquileres.length; i++) {
      if (this.alquileres[i].idInstancia === idInstancia) {
        totalInicios += this.alquileres[i].encendidos;
      }
    }

    return totalInicios;
  }
  
  /**
   *
   * @param {Number} id
   * @returns un objeto de la clase Usuarios, si lo encuentra; null en otro caso
   */
  buscarInstanciaporID(id) {
    let encontrada = null;
    let i = 0;
    while (i < this.tiposDeInstanciasDisponibles.length && !encontrada) {
      if (this.tiposDeInstanciasDisponibles[i].id === id) {
        encontrada = this.tiposDeInstanciasDisponibles[i];
      }
      i++;
    }
    return encontrada;
  }

  buscarAlquilerPorIDInstancia(idInstancia)
  {
    let encontrada = null;
    let i = 0;
    while(i < this.alquileres.length && !encontrada)
    {
      encontrada = (this.alquileres[i].idInstancia === idInstancia) ? this.alquileres[i] : null;
      i++;
    }
    return encontrada;
  }

  cambiarEstadoDeAlquiler(alquiler)
  {
    if(alquiler.encendido)
    {
      alquiler.apagarMaquina();
    }
    else
    {
      alquiler.encenderMaquina();
    }
  }

  preCargarDatos() {
    this.optimizaciones.push(
      new Optimizacion(
        OPTIMIZADA_ALMACENAMIENTO,
        "Optimizada para almacenamiento"
      )
    );
    this.optimizaciones.push(
      new Optimizacion(OPTIMIZADA_COMPUTO, "Optimizada para computo")
    );
    this.optimizaciones.push(
      new Optimizacion(OPTIMIZADA_MEMORIA, "Optimizada para memoria")
    );
    //carga de instancias optimizadas para computo
    this.tiposDeInstanciasDisponibles.push(
      new TipoInstancia(10, 100, TAMANIO_CHICO, OPTIMIZADA_COMPUTO, 10, 10)
    );
    this.tiposDeInstanciasDisponibles.push(
      new TipoInstancia(10, 100, TAMANIO_MEDIO, OPTIMIZADA_COMPUTO, 10, 10)
    );
    this.tiposDeInstanciasDisponibles.push(
      new TipoInstancia(10, 100, TAMANIO_GRANDE, OPTIMIZADA_COMPUTO, 10, 10)
    );
    //carga de instancias optimizadas para memoria
    this.tiposDeInstanciasDisponibles.push(
      new TipoInstancia(10, 100, TAMANIO_CHICO, OPTIMIZADA_MEMORIA, 10, 10)
    );
    this.tiposDeInstanciasDisponibles.push(
      new TipoInstancia(10, 100, TAMANIO_MEDIO, OPTIMIZADA_MEMORIA, 10, 10)
    );
    this.tiposDeInstanciasDisponibles.push(
      new TipoInstancia(10, 100, TAMANIO_GRANDE, OPTIMIZADA_MEMORIA, 10, 10)
    );
    //carga de instancias optimizadas para almacenamiento
    this.tiposDeInstanciasDisponibles.push(
      new TipoInstancia(
        10,
        100,
        TAMANIO_MEDIO,
        OPTIMIZADA_ALMACENAMIENTO,
        10,
        10
      )
    );
    this.tiposDeInstanciasDisponibles.push(
      new TipoInstancia(
        10,
        100,
        TAMANIO_GRANDE,
        OPTIMIZADA_ALMACENAMIENTO,
        10,
        10
      )
    );

    //carga de usuario admin
    this.crearUsuario("Admin", "Admin", "admin", "admin");
    this.usuarios[0].estado = ESTADO_ACTIVO;
    this.usuarios[0].esAdmin = true;
    //carga de usuario comun
    this.crearUsuario("User", "User", "user", "user");
    this.usuarios[1].estado = ESTADO_ACTIVO;
  }
}

class Usuario {
  /**Un usuario es unico (ID) y puede alquilar instancias, por default no son admin
   *
   * @param {String} nombre
   * @param {String} apellido
   * @param {String} nombreUsuario
   * @param {String} contrasenia
   * @param {Number} tarjeta
   * @param {Number} cvc
   */
  constructor(nombre, apellido, nombreUsuario, contrasenia, tarjeta, cvc) {
    this.id = idUsuario++;
    this.nombre = nombre;
    this.apellido = apellido;
    this.nombreUsuario = nombreUsuario;
    this.contrasenia = contrasenia;
    this.tarjeta = tarjeta;
    this.cvc = cvc;
    this.esAdmin = false;
    this.alquileres = [];
    this.estado = ESTADO_PENDIENTE;
  }
}

class TipoInstancia {
  /**
   *
   * @param {Number} costoPorEncendido
   * @param {Number} costoPorAlquiler
   * @param {String} tamanio
   * @param {String} tipo
   * @param {Number} stockInicial
   */
  constructor(
    costoPorEncendido,
    costoPorAlquiler,
    tamanio,
    tipo,
    stockInicial
  ) {
    this.id = "INSTANCE_ID_" + idTipoInstancia++;
    this.costoPorEncendido = costoPorEncendido;
    this.costoPorAlquiler = costoPorAlquiler;
    this.tamanio = tamanio;
    this.tipo = tipo;
    this.stockInicial = stockInicial;
    this.stockActual = this.stockInicial;
  }
}

class Alquiler {
  /**
   *
   * @param {Number} idUsuario
   * @param {String} idInstancia
   */
  constructor(idUsuario, idInstancia) {
    this.idUsuario = idUsuario;
    this.idAlquiler = idAlquiler++;
    this.idInstancia = idInstancia;
    this.encendidos = 1;
    this.encendido = true;
  }

  encenderMaquina() {
    this.encendido = true;
    this.encendidos++;
  }

  apagarMaquina() {
    this.encendido = false;
  }
}

/**
 * Esta clase es bastante auxiliar, pero no quiero usar arrays asociativos
 * Los arrays de arrays fueron una buena idea, pero esto va a ser la posta
 */
class Optimizacion {
  constructor(prefijo, texto) {
    this.prefijo = prefijo;
    this.texto = texto;
  }
}
