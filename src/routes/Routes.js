const express = require('express');
const bodyParser = require('body-parser');
const oEnvironment = require('../constants/Environment.js');
const AuthMiddleware = require('../middleware/AuthMiddleware.js');

module.exports = function (oApp) {
  // Configurar body-parser sin límite de tamaño (eliminando la configuración de límite)
  oApp.use(bodyParser.json({ limit: '1000mb' }));
  oApp.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

  // Rutas de autenticación sin prefijo /admin
  oApp.use(oEnvironment.URL_API, require('./Users'));
  oApp.use(`${oEnvironment.URL_API}categories`, require('./Category'));
  oApp.use(`${oEnvironment.URL_API}product`, require('./Product'));
  oApp.use(`${oEnvironment.URL_API}favoritos`, require('./Favoritos'));


  // Rutas de administración con prefijo /admin y middleware de autenticación
  oApp.use(`${oEnvironment.URL_API}admin`, AuthMiddleware, require('./Users'));
};
