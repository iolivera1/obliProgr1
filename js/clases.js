let idUsuario = 0;
let idInstancia = 0;
class Sistema 
{

  constructor() 
  {
    this.usuarios = [];
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
  crearUsuario(nombre, apellido, nombreUsuario, contrasenia) 
  {
    let usuario = new Usuario(nombre, apellido, nombreUsuario, contrasenia);
    this.usuarios.push(usuario);
  }

  /**Valida usuario y contrasenia, asigna al usuario actual si logra loguearlo
   * 
   * @param {String} nombreUsuario 
   * @param {String} contrasenia 
   * @returns true si el login es exitoso, false en otro caso
   */
  login(nombreUsuario, contrasenia)
  {
    if(!nombreUsuario || !contrasenia) return false;
    let usuario = this.encontrarUsuario(nombreUsuario);
    if(!usuario) return false;
    if(usuario.contrasenia !== contrasenia) return false;
    this.usuarioActual = usuario;
    return true;
  }

  /**
   * Simplemente libera el usuario actual para ser coherente con lo que se vusaliza en pantalla
   */
  logout()
  {
    this.usuarioActual = null;
  }

  /**Un nombre de usuario es valido si tiene al menos 4 caracteres y no mas de 20 
   * 
   * @param {String} nombreUsuario 
   * @returns true si el usuario es valido, false en otro caso
   */
  esNombreUsuarioValido(nombreUsuario) 
  {
    if (nombreUsuario.length < 4 || nombreUsuario.length > 20 || Number(nombreUsuario)) 
    {
      return false;
    }
    return true;
  }

  existeNombreDeUsuario(nombreUsuario)
  {
    return (this.encontrarUsuario(nombreUsuario) !== null);
  }

  /**Busca un usuario por su nombre de usuario
   * 
   * @param {String} nombreUsuario 
   * @returns {Usuario} un objeto de la clase Usuarios, si lo encuentra en usuarios[]; null en otro caso 
   */
  encontrarUsuario(nombreUsuario) 
  {
    let usuario = null;
    let i = 0;
    while (i < this.usuarios.length && !usuario) 
    {
      usuario = this.usuarios[i].nombreUsuario === nombreUsuario ? this.usuarios[i] : null;
      i++;
    }
    return usuario;
  }

  /** validacion de contrasenia ingresada en el registro de usuario
   *
   * @param {String} contrasenia 
   * @returns true si la contrasenia ingresada es valida para asociar a un usuario, false en otro caso 
   */
  esContraseniaValida(contrasenia) 
  {
    if (contrasenia.length < 5) return false;
    let tieneMayuscula = false;
    let tieneMinuscula = false;
    let tieneNumero = false;
    let i = 0;
    while (i < contrasenia.length && (!tieneMayuscula || !tieneMinuscula || !tieneNumero)) 
    {
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

  /** Validacion de contrasenia 
   * 
   * @param {String} contrasenia 
   * @param {String} contraseniaRepeticion 
   */
  contraseniasCoinciden(contrasenia, contraseniaRepeticion) 
  {
    return contrasenia === contraseniaRepeticion;
  }

  /** Valida tarjeta de credito usando el algoritmo de Luhn;
   *  no funciona todavia jeje
   * @param {string} nroTarjeta 
   * @param {Number} cvc 
   * @returns true si la tarjeta ingresada es valida, false en otro caso
   */
  esTarjetaDeCreditoValida(nroTarjeta, cvc) 
  {
    const LARGO_TARJETA = 16;
    if (nroTarjeta.length !== LARGO_TARJETA || cvc.length !== 3 ) return false;
    let tarjetaConDuplicado = this.tarjetaConDuplicado(nroTarjeta);
    let resultado = 0;
    for(let i = 0; i < LARGO_TARJETA; i++)
    {
      resultado += this.sumarMayoresQueNueve(tarjetaConDuplicado[i]);
    }

    return (resultado*9 % 10) === nroTarjeta % 10;
  }

  tarjetaConDuplicado(nroTarjeta)
  {
    let resultado = [];
    for(let i = nroTarjeta.length - 2; i >= 0; i--)
    {
      let numero = Number(nroTarjeta.charAt(i));
      resultado.push((numero % 2 === 0) ? numero*2 : numero);
    }
    return resultado;
  }

  sumarMayoresQueNueve(numero)
  {
    if(numero > 9)
    {
      return 1 + numero % 10;
    }
    return numero;
  }

  preCargarDatos()
  {
    this.usuarios.push(new Usuario("Martino", "Oliveri", "admin", "admin", true));
    this.usuarios[0].esAdmin = true;
  }
}

class Usuario 
{
  constructor(nombre, apellido, nombreUsuario, contrasenia) 
  {
    this.id = idUsuario++;
    this.nombre = nombre;
    this.apellido = apellido;
    this.nombreUsuario = nombreUsuario;
    this.contrasenia = contrasenia;
    this.instancias = [];
    this.esAdmin = false;
  }
}

class Instancia
{
  constructor()
  {
    this.id = idInstancia++;
    this.encendida = true;
    
  }
}