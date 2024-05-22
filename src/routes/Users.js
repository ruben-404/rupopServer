const express = require('express');
const UserController = require('../controllers/UserController');
const oRouter = express.Router();

// Crear una instancia del controlador
const Controller = new UserController();

// Definir las rutas
oRouter.post('/login', (oRequest, oResponse) => {
  Controller.login(oRequest, oResponse);
});

oRouter.post('/edit/:userId', (oRequest, oResponse) => {
  Controller.editUser(oRequest, oResponse);
});

oRouter.get('/logout', (oRequest, oResponse) => {
  Controller.logout(oRequest, oResponse);
});

oRouter.get('/token', (oRequest, oResponse) => {
  Controller.checkToken(oRequest, oResponse);
});

// Corregir la referencia al controlador en esta ruta
oRouter.post('/create', (oRequest, oResponse) => {
  Controller.createUser(oRequest, oResponse);
});

module.exports = oRouter;
