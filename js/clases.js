let idUsuario = 0;

class Sistema {
  constructor() {
    this.usuarios = [];
  }

  crearUsuario(usuario) {
    this.usuarios.push(usuario);
  }

  RegistrarUsuario(nombre, apellido, usuario) {
    if (this.esNombreUsuarioValido(usuario)) return;

    let txtContraseniaRegistro = document.querySelector(
      "txtContraseniaRegistro"
    ).value;
    let txtContraseniaRepeticionRegistro = document.querySelector(
      "txtContraseniaRepeticionRegistro"
    ).value;
    let txtTarjetaCreditoNumero = Number(
      document.querySelector("txtTarjetaCreditoNumero").value
    );
    let txtTarjetaCreditoCVC = Number(
      document.querySelector("txtTarjetaCreditoCVC").value
    );
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
    while (i < this.usuarios.length && !existe) {
      existe = usuarios[i].nombreUsuario === nombre;
    }
    return existe;
  }

  esContraseniaValida(contrasenia, repetirContrasenia) {
    if (contrasenia.length < 5) return false;
    let tieneMayuscula = false
    let tieneMinuscula = false 
    let tieneNumero = false

    for(let i = 0; i < contrasenia.length; i++){
        tieneMayuscula = contrasenia.charCodeAt(i) > 91 && contrasenia.charCodeAt(i) < 123 ? true : tieneMayusculas;
        tieneMinuscula = contrasenia.charCodeAt(i) > 91 && contrasenia.charCodeAt(i) < 123;
        tieneNumero = !isNaN(contrasenia.)
    }

  }
}

