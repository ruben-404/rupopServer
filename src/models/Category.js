const { ObjectId } = require('mongodb');
const Model = require('./Model');

class Category extends Model {
    constructor() {
        super('categories');
    }

    async getByTitle(title) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.findOne({ title });
        } catch (error) {
            console.error('Error al buscar categoría por título:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    
    async create(newCategory) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            
            // Insertar la nueva categoría en la base de datos
            const result = await collection.insertOne(newCategory);
    
            // Obtener el ID del documento insertado
            const insertedId = result.insertedId;
    
            // Buscar el documento recién insertado por su ID
            const insertedCategory = await collection.findOne({ _id: insertedId });
    
            return insertedCategory;
        } catch (error) {
            console.error('Error al crear nueva categoría:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }
    

    async update(categoryId, updatedCategoryData) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            await collection.updateOne({ _id: new ObjectId(categoryId) }, { $set: updatedCategoryData });
        } catch (error) {
            console.error('Error al actualizar categoría:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async delete(categoryId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            await collection.deleteOne({ _id: new ObjectId(categoryId) });
        } catch (error) {
            console.error('Error al eliminar categoría:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async getAll() {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.find().toArray();
        } catch (error) {
            console.error('Error al obtener todas las categorías:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async getById(categoryId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.findOne({ _id: new ObjectId(categoryId) });
        } catch (error) {
            console.error('Error al buscar categoría por ID:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async addImage(categoryId, imageUrl) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            await collection.updateOne({ _id: new ObjectId(categoryId) }, { $set: { image: imageUrl } });
        } catch (error) {
            console.error('Error al agregar imagen a la categoría:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }
}

module.exports = Category;
