const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const oRouter = express.Router();

// Crear una instancia del controlador
const Controller = new CategoryController();

// Definir las rutas
oRouter.post('/create', (oRequest, oResponse) => {
  Controller.createCategory(oRequest, oResponse);
});

oRouter.put('/update/:categoryId', (oRequest, oResponse) => {
  Controller.updateCategory(oRequest, oResponse);
});

oRouter.delete('/delete/:categoryId', (oRequest, oResponse) => {
  Controller.deleteCategory(oRequest, oResponse);
});

oRouter.get('/all', (oRequest, oResponse) => {
  Controller.getAllCategories(oRequest, oResponse);
});

oRouter.get('/:categoryId', (oRequest, oResponse) => {
  Controller.getCategoryById(oRequest, oResponse);
});

module.exports = oRouter;
