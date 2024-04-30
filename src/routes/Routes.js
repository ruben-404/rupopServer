const express = require('express');
const oEnvironment = require('../constants/Environment.js');
const AuthMiddleware = require('../middleware/AuthMiddleware.js');

module.exports = function (oApp) {
  // Rutas de autenticación sin prefijo /admin
  oApp.use(oEnvironment.URL_API, require('./Users'));

  
  oApp.use(`${oEnvironment.URL_API}categories`, require('./Category'));



  // Rutas de administración con prefijo /admin y middleware de autenticación
  oApp.use(`${oEnvironment.URL_API}admin`, AuthMiddleware, require('./Users'));

};
