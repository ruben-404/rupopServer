const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const FavoritosController = require('../controllers/FavoritosController');

// Instanciar el controlador de productos
const favoritosController = new FavoritosController();

// Configurar body-parser sin límite de tamaño (eliminar la configuración de límite)
router.use(bodyParser.json({ limit: '1000mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

// Rutas de productos
router.post('/add', favoritosController.addFavorite);
router.get('/user/:userId', favoritosController.getFavoritesByUserId);
router.get('/products/:userId', favoritosController.getProductosByIds);


module.exports = router;
