let idUsuario = 0;

class Sistema {
  constructor() {
    this.usuarios = [];
    this.usuarioActual = null;
    this.opcionesSelect = [
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
  }

  crearUsuario(nombre, apellido, nombreUsuario, contrasenia) {
    let usuario = new Usuario(nombre, apellido, nombreUsuario, contrasenia);
    this.usuarios.push(usuario);
    return true;
  }

  esNombreUsuarioValido(usuario) {
    if (this.existeNombreUsuario(usuario)) return false;
    if (usuario.length < 4 || usuario.length > 20 || Number(usuario)) {
      return false;
    }
    return true;
  }

  existeNombreUsuario(usuario) {
    let existe = false;
    let i = 0;
    while (i < this.usuarios.length && !existe) {
      existe = this.usuarios[i].nombreUsuario === usuario;
      i++;
    }
    return existe;
  }

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
      tieneMayuscula =
        contrasenia.charCodeAt(i) > 64 && contrasenia.charCodeAt(i) < 91
          ? true
          : tieneMayuscula;
      tieneMinuscula =
        contrasenia.charCodeAt(i) > 96 && contrasenia.charCodeAt(i) < 123
          ? true
          : tieneMinuscula;
      tieneNumero = Number(contrasenia.charAt(i)) ? true : tieneNumero;
      i++;
    }
    return tieneMayuscula && tieneMinuscula && tieneNumero;
  }

  contraseniasCoinciden(contrasenia, repetirContrasenia) {
    return contrasenia === repetirContrasenia;
  }

  esTarjetaDeCreditoValida(nroTarjeta, cvc) {
    
    if (!nroTarjeta.length || !cvc.length) {
      return false;
    }



    return true; 
  }
}

class Usuario {
  constructor(nombre, apellido, nombreUsuario, contrasenia) {
    this.id = idUsuario++;
    this.nombre = nombre;
    this.apellido = apellido;
    this.nombreUsuario = nombreUsuario;
    this.contrasenia = contrasenia;
    this.instancias = [];
  }
}