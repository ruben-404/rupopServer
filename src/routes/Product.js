const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const ProductController = require('../controllers/ProductController');

// Instanciar el controlador de productos
const productController = new ProductController();

// Configurar body-parser sin límite de tamaño (eliminar la configuración de límite)
router.use(bodyParser.json({ limit: '1000mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

// Rutas de productos
router.get('/:searchText/:category/:selectedPrice/:selectedCondition', productController.getAllProducts2);
// router.get('/:currentPage/:pageSize/:category/:searchText/:selectedPrice/:selectedCondition', productController.getAllProducts);
router.get('/max', productController.getProductCount);
router.get('/:productId', productController.getProductById);
router.post('/create', productController.createProduct);
router.post('/edit/:productId', productController.editProduct);
router.delete('/:productId', productController.deleteProduct);
router.post('/user', productController.getProductosByUser);

module.exports = router;
