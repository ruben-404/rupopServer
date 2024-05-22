const { ObjectId } = require('mongodb');
const Model = require('./Model');


class Product extends Model {
    constructor() {
        super('products');
    }

    async create(newProduct) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            
            // Insertar el nuevo producto en la base de datos
            const result = await collection.insertOne(newProduct);
    
            // Obtener el ID del documento insertado
            const insertedId = result.insertedId;
    
            // Buscar el documento recién insertado por su ID
            const insertedProduct = await collection.findOne({ _id: insertedId });
    
            return insertedProduct;
        } catch (error) {
            console.error('Error al crear nuevo producto:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }
    

    async update(productId, updatedProductData) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            await collection.updateOne({ _id: new ObjectId(productId) }, { $set: updatedProductData });
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async delete(productId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            await collection.deleteOne({ _id: new ObjectId(productId) });
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async getAll(query, startIndex, pageSize) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
    
            const products = await collection.find(query).skip(startIndex).limit(pageSize).toArray();
    
            return products;
        } catch (error) {
            console.error('Error al obtener los productos:', error.message);
            throw error;
        }

    }

    // async getAllProducts2() {
    //     try {
    //         const db = await this.connect();
    //         const collection = db.collection(this.collectionName);
    
    //         // Obtener todos los productos sin filtros ni paginación
    //         const products = await collection.find({}).toArray();
    
    //         return products;
    //     } catch (error) {
    //         console.error('Error al obtener todos los productos:', error.message);
    //         throw error;
    //     }
    // }

    async getAllProducts2(query) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
    
            const products = await collection.find(query).toArray();
    
            return products;
        } catch (error) {
            console.error('Error al obtener los productos:', error.message);
            throw error;
        }

    }
    
    
    
    

    async getById(productId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.findOne({ _id: new ObjectId(productId) });
        } catch (error) {
            console.error('Error al buscar producto por ID:', error.message);
            throw error;
        } finally {
            // await this.close();
        }
    }

    // async getById2(productId) {
    //     try {
    //         const db = await this.connect();
    //         const collection = db.collection(this.collectionName);
    //         return await collection.findOne({ _id: new ObjectId(productId) });
    //     } catch (error) {
    //         console.error('Error al buscar producto por ID:', error.message);
    //         throw error;
    //     } finally {
    //         // await this.close();
    //     }
    // }


    async getProductosByUserId(userId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            // Buscar todos los productos asociados con el userId proporcionado
            return await collection.find({ userId }).toArray();
        } catch (error) {
            console.error('Error al obtener productos por userId:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async count() {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            const count = await collection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting products:', error.message);
            throw error;
        }
    }
    

    
}

module.exports = Product;
