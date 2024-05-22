const { DONE, CONFLICT, NOT_VALID, NOT_FOUND } = require('../constants/StatusCode');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Controller = require('../controllers/Controller');
const TokenGenerator = require('uuid-token-generator');
const { BASE16 } = require('uuid-token-generator');
const oTokenGenerator = new TokenGenerator(256, BASE16);
/**
 * Principal modelo a ser usado por el controlador
 */
const Model = new User();
/**
 * Controlador que controla los datos y la sesion del usuario.
 */
var UserController = class UserController extends Controller {

  constructor() {
    super();
  }

  /**
   * Función de login, se toman los datos del usuario, se comprueba que los mismos sean correctos y se genera una nueva api token.
   * 
   * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
   * @param {Response} oResponse Este objeto maneja el response de la solicitud
   * 
   * @author Leandro Curbelo
   */
  login = async (oRequest, oResponse) => {
    
    try {
      const { email, password } = oRequest.body;
    
      if (!email || !password) {
        return this.respond(oResponse, NOT_VALID, { message: 'Se necesitan credenciales válidas' });
      }
    
      const oUser = await Model.getByEmail(email);
    
      if (!oUser || !(await bcryptjs.compare(password, oUser.password))) {
        return this.respond(oResponse, NOT_FOUND, { message: 'Credenciales incorrectas' });
      }
    
      delete oUser.password;
    
      this.respond(oResponse, DONE, { message: 'Login correcto', data: oUser });
    } catch (error) {
      return this.handleError(oResponse, error);
    }
    
  }
  /**
   * Función de login, se toman los datos del usuario, se comprueba que los mismos sean correctos y se genera una nueva api token.
   * 
   * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
   * @param {Response} oResponse Este objeto maneja el response de la solicitud
   * 
   * @author Leandro Curbelo
   */
  logout = async (oRequest, oResponse) => {
    try {
      let sToken = oRequest.headers.authorization;
      if (!sToken)
        return this.respond(oResponse, NOT_VALID, { message: 'No autorizado' })
      this.findByToken(sToken, (oUser = null, bIsError = false) => {
        if (bIsError || !oUser)
          return this.respond(oResponse, DONE, { message: 'Autenticación no valida' });
        Model.updateToken(oUser.email, null, (sMessageError = null) => {
          this.respond(oResponse, DONE, { message: 'El usuario cerro sesión correctamente' });
        });
      });
    } catch (oException) {
      return this.handleError(oResponse, oException);
    }
  }
  /**
   * Función de logout, se obtiene el usuario y se eliminan las credenciales de acceso al sistema
   * 
   * @param {Request} oRequest Request de la peticion, aqui se reciben las credenciales del usuario
   * @param {Response} oResponse Este objeto maneja el response de la solicitud
   * 
   * @author Leandro Curbelo
   */
  checkToken = (oRequest, oResponse) => {
    try {
      if (!oRequest.oUser)
        return this.respond(oResponse, NOT_VALID, { message: 'Autenticación no valida' });
      this.findByToken(oRequest.oUser.remember_token, (oUser = null, bIsError = false) => {
        if (bIsError || oUser)
          return this.respond(oResponse, NOT_VALID, { message: 'Autenticación no valida', debug: oRequest.oUser });
        let sToken = oTokenGenerator.generate();
        Model.updateToken(oRequest.oUser.email, sToken, (sMessageError = null) => {
          if (!sMessageError)
            return this.respond(oResponse, CONFLICT, null, sMessageError);
          oUser.remember_token = sToken;
          delete oUser.password;
          return this.respond(oResponse, DONE, { message: 'Token actualizado', data: oUser });
        });
      });
    } catch (oException) {
      return this.handleError(oResponse, oException);
    }
  }


  createUser = async (oRequest, oResponse) => {
    try {
      const { name, lastname, email, password } = oRequest.body;
    
      if (!name || !lastname || !email || !password) {
        return this.respond(oResponse, NOT_VALID, { message: 'Todos los campos son obligatorios' });
      }
    
      const existingUser = await Model.getByEmail(email);
      if (existingUser) {
        return this.respond(oResponse, CONFLICT, { message: 'El usuario ya existe' });
      }
    
      const hashedPassword = await bcryptjs.hash(password, 10);
    
      const newUser = {
        name,
        lastname,
        email,
        password: hashedPassword,
        remember_token: null,
        isAdmin: false
      };
    
      await Model.create(newUser);
    
      delete newUser.password;
      this.respond(oResponse, DONE, { message: 'Usuario creado correctamente', data: newUser });
    } catch (error) {
      return this.handleError(oResponse, error);
    }
    
  }

  editUser = async (oRequest, oResponse) => {
    try {
      const { userId } = oRequest.params;
      const { name, lastname, email, password } = oRequest.body;
  
      // Verifica que al menos uno de los campos esté presente
      if (!name && !lastname && !email && !password) {
        return this.respond(oResponse, NOT_VALID, { message: 'Se debe proporcionar al menos un campo para actualizar' });
      }
  
      // Busca el usuario por su ID
      const existingUser = await Model.getById(userId);
      if (!existingUser) {
        return this.respond(oResponse, NOT_FOUND, { message: 'Usuario no encontrado' });
      }
  
      // Hashea la nueva contraseña si se proporcionó
      const hashedPassword = password ? await bcryptjs.hash(password, 10) : existingUser.password;
  
      // Actualiza solo los campos proporcionados manteniendo los demás sin cambios
      const updatedUser = {
        name: name || existingUser.name,
        lastname: lastname || existingUser.lastname,
        email: email || existingUser.email,
        password: hashedPassword,
        remember_token: existingUser.remember_token // Mantienes el token sin cambios
      };
  
      await Model.update(userId, updatedUser);
  
      delete updatedUser.password;
      this.respond(oResponse, DONE, { message: 'Usuario actualizado correctamente', data: updatedUser });
    } catch (error) {
      console.log(error);
    }
}



  
  
  

  /**
   * Función encargada de buscar mediante el modelo al usuario en base a su token
   * 
   * @author Leandro Curbelo
   */
  findByToken = (sToken, fCallBack) => {
    Model.getByToken(sToken, fCallBack);
  }
}




/*
    ! COMENTARIO DE AYUDA - Fragmento de codigo que genera clave
    bcryptjs.genSalt(10, (err, salt)  => {
        bcryptjs.hash('123', salt, (err, hash) =>  {
            this.respond(oResponse, DONE, hash);
            
        });
    });
    return;
 */

  
module.exports = UserController;