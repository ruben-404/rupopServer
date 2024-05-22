const { DONE, CONFLICT, NOT_VALID, NOT_FOUND } = require('../constants/StatusCode');
const Favoritos = require('../models/Favoritos');
const Producto = require('../models/Producto')
const Controller = require('./Controller');

const FavoritosModel = new Favoritos();
const ProductoModel = new Producto();
class FavoritosController extends Controller {
    constructor() {
        super();
    }

    handleError(res, error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    addFavorite = async (req, res) => {
        try {
            const { userId, productId } = req.body;
    
            // Verificar si el usuario ya tiene el producto en favoritos
            const existingFavorite = await FavoritosModel.getByUserIdAndProductId(userId, productId);
            console.log(existingFavorite)
            if (existingFavorite) {
                // Eliminar el producto de la lista de favoritos si ya existe
                await FavoritosModel.deleteFavorite(productId);
                return this.respond(res, DONE, { message: 'Producto borrado de favoritos correctamente' });
            }
    
            // Crear el favorito
            await FavoritosModel.addFavorite(userId, productId);
    
            // Respuesta exitosa
            this.respond(res, DONE, { message: 'Producto añadido a favoritos correctamente' });
        } catch (error) {
            return this.handleError(res, error);
        }
    }
    

    // Obtener productos favoritos de un usuario
    getFavoritesByUserId = async (req, res) => {
        try {
            const { userId } = req.params;

            // Obtener los productos favoritos del usuario
            const favorites = await FavoritosModel.getFavoritesByUserId(userId);

            // Respuesta exitosa con los productos favoritos
            this.respond(res, DONE, { data: favorites });
        } catch (error) {
            return this.handleError(res, error);
        }
    }


    getProductosByIds = async (req, res) => {
        try {
            const { userId } = req.params;

            // Obtener los productos favoritos del usuario
            const favorites = await FavoritosModel.getFavoritesByUserId(userId);

            // Obtener los IDs de los productos favoritos
            const productIds = favorites.productos;

            // Obtener la lista completa de productos a partir de los IDs
            const productos = await Promise.all(productIds.map(async (productId) => {
                return await ProductoModel.getById(productId);
            }));

            // Respuesta exitosa con la lista completa de productos
            console.log(productos.length)
            this.respond(res, DONE, { data: productos });
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}

module.exports = FavoritosController;
