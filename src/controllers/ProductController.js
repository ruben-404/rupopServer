const { DONE, CONFLICT, NOT_VALID, NOT_FOUND } = require('../constants/StatusCode');
const Product = require('../models/Producto');
const Controller = require('./Controller');
const Category = require('../models/Category');

const Model = new Product();
const CategoryModel = new Category();

class ProductController extends Controller {
    constructor() {
        super();
    }

    handleError(res, error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    // Crear un nuevo producto
    createProduct = async (req, res) => {
        try {
            const { name, description, price: priceString, category, images, userId, estado } = req.body;

            const state = "en venta";


            // Verificar que los campos requeridos estén presentes
            if (!name || !priceString || !category || !userId || !estado) {
                return this.respond(res, NOT_VALID, { message: 'Nombre, precio, categoría, userId y estado son obligatorios' });
            }
            // Verificar si la categoría proporcionada existe en la colección de categorías
            const existingCategory = await CategoryModel.getByTitle(category);
            if (!existingCategory) {
                return this.respond(res, NOT_VALID, { message: 'La categoría proporcionada no es válida' });
            }
            const price = parseInt(priceString);
            // Crear el nuevo producto
            const newProduct = await Model.create({ name, description, price, category, images, userId, estado, state });

            // Respuesta exitosa
            this.respond(res, DONE, { message: 'Producto creado correctamente', data: newProduct });
        } catch (error) {
            return this.handleError(res, error);
        }
    }
    

    // Editar un producto existente
    editProduct = async (req, res) => {
        try {
            const { productId } = req.params;
            const updatedProductData = req.body;
    
            // Verificar si el producto existe
            const existingProduct = await Model.getById(productId);
            if (!existingProduct) {
                return this.respond(res, NOT_FOUND, { message: 'El producto no existe' });
            }
    
            // Verificar si el usuario tiene permiso para editar el producto
            if (existingProduct.userId !== updatedProductData.userId) {
                return this.respond(res, CONFLICT, { message: 'El usuario no tiene permiso para editar este producto' });
            }
    
            // Excluir el campo _id de los datos de actualización
            const { _id, ...updatedDataWithoutId } = updatedProductData;
    
            // Actualizar el producto con los nuevos datos
            await Model.update(productId, updatedDataWithoutId);
    
            // Respuesta exitosa
            this.respond(res, DONE, { message: 'Producto actualizado correctamente' });
        } catch (error) {
            return this.handleError(res, error);
        }
    }
    
    


    // Eliminar un producto existente
    deleteProduct = async (req, res) => {
        try {
            const { productId } = req.params;
            const { userId } = req.body;

            // Verificar si el producto existe
            const existingProduct = await Model.getById(productId);
            if (!existingProduct) {
                return this.respond(res, NOT_FOUND, { message: 'El producto no existe' });
            }

            // Verificar si el usuario tiene permiso para eliminar el producto
            if (existingProduct.userId !== userId) {
                return this.respond(res, CONFLICT, { message: 'El usuario no tiene permiso para eliminar este producto' });
            }

            // Eliminar el producto
            await Model.delete(productId);

            // Respuesta exitosa
            this.respond(res, DONE, { message: 'Producto eliminado correctamente' });
        } catch (error) {
            return this.handleError(res, error);
        }
    }


    // Obtener todos los productos
    async getAllProducts(req, res) {
        try {
            let query = {};
    
            // Parámetros de la URL
            const { currentPage, pageSize, category, searchText, selectedPrice, selectedCondition } = req.params;
            // Verificar y agregar filtros válidos a la consulta
            if (category && category !== 'all') {
                query.category = category;
            }
    
            if (searchText && searchText !== 'all') {
                const searchRegex = new RegExp(searchText, 'i');
                query.$or = [{ name: searchRegex }, { description: searchRegex }];
            }
            if (selectedPrice && selectedPrice !== 'all') {
                const priceRange = selectedPrice.split('-');
                if (priceRange.length === 2) {
                    query.price = { $gte: parseInt(priceRange[0]), $lte: parseInt(priceRange[1]) };
                } else {
                    query.price = { $gte: parseInt(priceRange[0]) };
                }
            }
            if (selectedCondition !== 'all') {
                console.log(selectedCondition)

                query.estado = selectedCondition;
            }
            
    
            // Calcular el índice de inicio y fin para la paginación
            const startIndex = (currentPage - 1) * pageSize;
    
            // Obtener los productos que coinciden con los filtros y la paginación
            const products = await Model.getAll(query, startIndex, parseInt(pageSize));
    
            // Responder con los productos obtenidos
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
    
    
    
    

    // Obtener un producto por su ID
    getProductById = async (req, res) => {
        try {
            const { productId } = req.params;

            // Obtener el producto por su ID
            const product = await Model.getById(productId);

            // Verificar si el producto existe
            if (!product) {
                return this.respond(res, NOT_FOUND, { message: 'El producto no existe' });
            }

            // Respuesta exitosa con el producto
            this.respond(res, DONE, { data: product });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    getProductosByUser = async (req, res) => {
        try {
            const { userId } = req.body;
            // Obtener todos los productos asociados al usuario
            const products = await Model.getProductosByUserId(userId);

            console.log(products)
            // Respuesta exitosa con la lista de productos
            this.respond(res, DONE, { data: products });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getProductCount(req, res) {
        console.log('mas')
        try {
            // Obtener el recuento total de productos
            const count = await Model.count();
            console.log(count)

            // Responder con el recuento total de productos
            res.status(200).json(count);
        } catch (error) {
            console.error('Error fetching product count:', error);
            res.status(500).json({ error: 'Failed to fetch product count' });
        }
    }

    // getAllProducts2 = async (req, res) => {
    //     try {
    //         // Obtener todos los productos de la base de datos
    //         const products = await Model.getAllProducts2({});
    
    //         // Responder con los productos obtenidos
    //         res.status(200).json(products);
    //     } catch (error) {
    //         console.error('Error fetching all products:');
    //     }
    // }

    async getAllProducts2(req, res) {
        try {
            let query = {};
    
            // Parámetros de la URL
            const { category, searchText, selectedPrice, selectedCondition } = req.params;
            // Verificar y agregar filtros válidos a la consulta
            if (category && category !== 'all') {
                query.category = category;
            }
    
            if (searchText && searchText !== 'all') {
                const searchRegex = new RegExp(searchText, 'i');
                query.$or = [{ name: searchRegex }, { description: searchRegex }];
            }
            if (selectedPrice && selectedPrice !== 'all') {
                const priceRange = selectedPrice.split('-');
                if (priceRange.length === 2) {
                    query.price = { $gte: parseInt(priceRange[0]), $lte: parseInt(priceRange[1]) };
                } else {
                    query.price = { $gte: parseInt(priceRange[0]) };
                }
            }
            if (selectedCondition !== 'all') {
                console.log(selectedCondition)

                query.estado = selectedCondition;
            }
            
    
            // Calcular el índice de inicio y fin para la paginación
    
            // Obtener los productos que coinciden con los filtros y la paginación
            const products = await Model.getAllProducts2(query);
    
            // Responder con los productos obtenidos
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
    
}

module.exports = ProductController;
