let idUsuario = 0;

class Sistema {
  constructor() {
    this.usuarios = [];
  }

  crearUsuario(nombre, apellido, usuario, contrasenia, repeticionContrasenia)
  {
    if(!this.esNombreUsuarioValido(usuario)) return false;
    if(!this.esContraseniaValida(contrasenia, repeticionContrasenia)) return false;
  }
  
  esNombreUsuarioValido(usuario) {
    if (this.existeNombreUsuario(usuario)) return false;
    if (nombre.length < 4 || nombre.length > 20 || Number(usuario)) {
      return false;
    }
    return true;
  }

  existeNombreUsuario(nombre) {
    let existe = false;
    let i = 0;
    while (i < this.usuarios.length && !existe) {
      existe = usuarios[i].nombreUsuario === nombre;
      i++;
    }
    return existe;
  }

  esContraseniaValida(contrasenia, repetirContrasenia) {
    if (contrasenia.length < 5) return false;
    let tieneMayuscula = false;
    let tieneMinuscula = false;
    let tieneNumero = false;
    let i = 0;
    while(i < contrasenia.length && (!tieneMayuscula || !tieneMinuscula || !tieneNumero)) {
      tieneMayuscula = contrasenia.charCodeAt(i) > 64 && contrasenia.charCodeAt(i) < 91 ? true : tieneMayuscula;
      tieneMinuscula = contrasenia.charCodeAt(i) > 96 && contrasenia.charCodeAt(i) < 123 ? true : tieneMinuscula;
      tieneNumero = Number(contrasenia.charAt[i]) ? true : tieneNumero;
      i++;
    }
    return tieneMayuscula && tieneMinuscula && tieneNumero;
  }
}


class Usuario {
  constructor(nombre, apellido, nombreUsuario, contrasenia) {
    this.id = idUsuario++;
    this.nombre = nombre;
    this.apellido = apellido;
    this.nombreUsuario = nombreUsuario;
    this.contrasenia = contrasenia;
  }
}

