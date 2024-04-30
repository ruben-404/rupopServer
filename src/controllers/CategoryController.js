const { DONE, CONFLICT, NOT_VALID, NOT_FOUND } = require('../constants/StatusCode');
const Category = require('../models/Category');
const Controller = require('./Controller');

const Model = new Category();

class CategoryController extends Controller {
    constructor() {
        super();
    }

    handleError(res, error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    // Crear una nueva categoría
    createCategory = async (req, res) => {
        try {
            const { title, description } = req.body;

            // Verificar que los campos requeridos estén presentes
            if (!title) {
                return this.respond(res, NOT_VALID, { message: 'El título de la categoría es obligatorio' });
            }

            // Verificar si ya existe una categoría con el mismo título
            const existingCategory = await Model.getByTitle(title);
            if (existingCategory) {
                return this.respond(res, CONFLICT, { message: 'Ya existe una categoría con el mismo título' });
            }

            // Crear la nueva categoría
            const newCategory = await Model.create({ title, description });

            // Respuesta exitosa
            this.respond(res, DONE, { message: 'Categoría creada correctamente', data: newCategory });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    // Editar una categoría existente
    editCategory = async (req, res) => {
        try {
            const { categoryId } = req.params;
            const { title, description } = req.body;

            // Verificar si la categoría existe
            const existingCategory = await Model.getById(categoryId);
            if (!existingCategory) {
                return this.respond(res, NOT_FOUND, { message: 'La categoría no existe' });
            }

            // Actualizar la categoría con los nuevos datos
            await Model.update(categoryId, { title, description });

            // Respuesta exitosa
            this.respond(res, DONE, { message: 'Categoría actualizada correctamente' });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    // Eliminar una categoría existente
    deleteCategory = async (req, res) => {
        try {
            const { categoryId } = req.params;

            // Verificar si la categoría existe
            const existingCategory = await Model.getById(categoryId);
            if (!existingCategory) {
                return this.respond(res, NOT_FOUND, { message: 'La categoría no existe' });
            }

            // Eliminar la categoría
            await Model.delete(categoryId);

            // Respuesta exitosa
            this.respond(res, DONE, { message: 'Categoría eliminada correctamente' });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    // Obtener todas las categorías
    getAllCategories = async (req, res) => {
        try {
            // Obtener todas las categorías
            const categories = await Model.getAll();

            // Respuesta exitosa con la lista de categorías
            this.respond(res, DONE, { data: categories });
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    // Obtener una categoría por su ID
    getCategoryById = async (req, res) => {
        try {
            const { categoryId } = req.params;

            // Obtener la categoría por su ID
            const category = await Model.getById(categoryId);

            // Verificar si la categoría existe
            if (!category) {
                return this.respond(res, NOT_FOUND, { message: 'La categoría no existe' });
            }

            // Respuesta exitosa con la categoría
            this.respond(res, DONE, { data: category });
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}

module.exports = CategoryController;
