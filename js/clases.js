const ESTADO_PENDIENTE = "pendiente";
const ESTADO_ACTIVO = "activo";
const ESTADO_BLOQUEADO = "bloqueado";
const OPTIMIZADA_COMPUTO = "c7";
const OPTIMIZADA_ALMACENAMIENTO = "i7";
const OPTIMIZADA_MEMORIA = "r7";
const TAMANIO_CHICO = "small";
const TAMANIO_MEDIO = "medium";
const TAMANIO_GRANDE = "large";

let idTipoInstancia = 0;
let idUsuario = 0;
let idAlquiler = 0;

class Sistema {
  constructor() {
    this.usuarios = [];
    this.usuarioActual = null;
    this.tiposDeInstancias = [];
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

  /**Valida usuario y contrasenia, asigna al usuario actual si logra loguearlo
   *
   * @param {String} nombreUsuario
   * @param {String} contrasenia
   * @returns true si el login es exitoso, false en otro caso
   */
  login(nombreUsuario, contrasenia) {
    if (!nombreUsuario || !contrasenia) return false;
    let usuario = this.encontrarUsuarioPorNombre(nombreUsuario);
    if (!usuario) return false;
    if (usuario.contrasenia !== contrasenia) return false;
    this.usuarioActual = usuario;
    return true;
  }

  /**
   * Simplemente libera el usuario actual para ser coherente con lo que se vusaliza en pantalla
   */
  logout() {
    this.usuarioActual = null;
  }

  /**Un nombre de usuario es valido si tiene al menos 4 caracteres y no mas de 20
   *
   * @param {String} nombreUsuario
   * @returns true si el usuario es valido, false en otro caso
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

  existeNombreDeUsuario(nombreUsuario) {
    return this.encontrarUsuarioPorNombre(nombreUsuario) !== null;
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

    for (
      let i = 0;
      i < contrasenia.length &&
      (!tieneMayuscula || !tieneMinuscula || !tieneNumero);
      i++
    ) {
      tieneMayuscula =
        this.esLetraMayuscula(contrasenia.charCodeAt(i)) || tieneMayuscula;
      tieneMinuscula =
        this.esLetraMinuscula(contrasenia.charCodeAt(i)) || tieneMinuscula;
      tieneNumero = this.esNumero(contrasenia.charAt(i)) || tieneNumero;
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
   * @returns true si la tarjeta ingresada es valida, false en otro caso
   */
  esTarjetaDeCreditoValida(nroTarjeta, cvc) {
    const LARGO_TARJETA = 16;
    if (nroTarjeta.length !== LARGO_TARJETA || cvc.length !== 3) return false;
    let tarjetaConDuplicado = this.tarjetaConDuplicado(nroTarjeta);
    let sumaDeDigitos = this.tarjetaConDigitosSumados(tarjetaConDuplicado);

    return (
      (sumaDeDigitos * 9) % 10 ===
      Number(nroTarjeta.charAt(nroTarjeta.length - 1))
    );
  }

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

  sumarDigitos(numero) {
    if (numero > 9) {
      return (numero % 10) + 1;
    } else {
      return numero;
    }
  }

  crearAlquilerDeInstancia() {}

  preCargarDatos() {
    this.precargarInstancias()
    this.crearUsuario("Admin", "Admin", "admin", "admin");
    this.usuarios[0].estado = ESTADO_ACTIVO;
    this.usuarios[0].esAdmin = true;
    this.crearUsuario("Ivan", "ivan", "ivan", "ivan");
    this.usuarios[1].estado = ESTADO_ACTIVO;
    this.usuarios[1].esAdmin = false;
  }

  //Recibe tipo (puede ser c7, i7, r7)
  filtrarTiposDeInstanciasPorOptimizacion(tipo) {
    let resultado = [];
    for (i = 0; i < this.tiposDeInstancias.length; i++) {
      if (tipo === this.tiposDeInstancias.tipo) {
        resultado.push(this.tiposDeInstancias[i]);
      }
    }
    return resultado;
  }

  /**
   *
   * @param {Number} id
   * @returns un objeto de la clase Usuarios, si lo encuentra; null en otro caso
   */
  buscarInstanciaporID(id) {
    let encontrada = null;
    let i = 0;
    while (i < this.tiposDeInstancia.length && !encontrada) {
      if (this.tiposDeInstancia[i].id === id) {
        encontrada = this.tiposDeInstancia[i];
      }
      i++;
    }
    return encontrada;
  }

  esUsuarioActivo(usuario) {
    return usuario.estado === ESTADO_ACTIVO;
  }

  precargarInstancias() {
    this.crearInstancia(2.50, 20.00, TAMANIO_CHICO, OPTIMIZADA_COMPUTO, 2);
    this.crearInstancia(3.50, 30.00, TAMANIO_MEDIO, OPTIMIZADA_COMPUTO, 2);
    this.crearInstancia(6.00, 50.00, TAMANIO_GRANDE, OPTIMIZADA_COMPUTO, 2);
    this.crearInstancia(4.00, 35.00, TAMANIO_CHICO, OPTIMIZADA_COMPUTO, 2);
    this.crearInstancia(6.50, 50.00, TAMANIO_MEDIO, OPTIMIZADA_COMPUTO, 2);
    this.crearInstancia(7.00, 60.00, TAMANIO_GRANDE, OPTIMIZADA_COMPUTO, 2);
    this.crearInstancia(3.50, 30.00, TAMANIO_MEDIO, OPTIMIZADA_COMPUTO, 2);
    this.crearInstancia(6.50, 50.00, TAMANIO_GRANDE, OPTIMIZADA_COMPUTO, 2);
    console.log(this.tiposDeInstancias, "instancias");

  }

  crearInstancia(costoEncendido, costoAlquiler, tamanio, tipo, stockInicial) {
    let tipoInstancia = new TipoInstancia(
      costoEncendido,
      costoAlquiler,
      tamanio,
      tipo,
      stockInicial
    );
    this.tiposDeInstancias.push(tipoInstancia);
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
    this.alquieres = [];
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
  }
}

class Alquiler {
  /**
   *
   * @param {TipoInstancia} TipoInstancia
   * @param {Number} idUsuario
   */
  constructor(idUsuario, instancia) {
    this.idUsuario = idUsuario;
    this.idAlquiler = idAlquiler++;
    this.instancia = instancia;
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
