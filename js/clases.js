let idUsuario = 0;

class Sistema {
  constructor() {
    this.usuarios = [];
  }

  crearUsuario(nombre, apellido, nombreUsuario, contrasenia)
  { 
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
    while(i < contrasenia.length && (!tieneMayuscula || !tieneMinuscula || !tieneNumero)) {
      tieneMayuscula = contrasenia.charCodeAt(i) > 64 && contrasenia.charCodeAt(i) < 91 ? true : tieneMayuscula;
      tieneMinuscula = contrasenia.charCodeAt(i) > 96 && contrasenia.charCodeAt(i) < 123 ? true : tieneMinuscula;
      tieneNumero = Number(contrasenia.charAt(i)) ? true : tieneNumero;
      i++;
    }
    return tieneMayuscula && tieneMinuscula && tieneNumero;
  }

  contraseniasCoinciden(contrasenia, repetirContrasenia)
  {
    return contrasenia === repetirContrasenia;
  }

  esTarjetaDeCreditoValida(nroTarjeta, cvc)
  {
    if(!nroTarjeta.length || !cvc.length)
    {
      return false;
    }
    return true;  //TODO
  }
}


class Usuario {
  constructor(nombre, apellido, nombreUsuario, contrasenia) {
    this.id = idUsuario++;
    this.nombre = nombre;
    this.apellido = apellido;
    this.nombreUsuario = nombreUsuario;
    this.contrasenia = contrasenia;
    this.instancias = [];
  }
}

