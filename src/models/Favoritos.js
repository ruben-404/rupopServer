const { ObjectId } = require('mongodb');
const Model = require('./Model');

class Favoritos extends Model {
    constructor() {
        super('favoritos');
    }

    async getByUserIdAndProductId(userId, productId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            
            // Buscar el favorito por usuario
            const favorite = await collection.findOne({ userId: new ObjectId(userId) });
    
            // Verificar si se encontró un favorito para el usuario
            if (!favorite) {
                return false; // Devolver false si no se encontró ningún favorito para el usuario
            }
    
            // Convertir productId a ObjectId para comparar correctamente
            const productIdObject = new ObjectId(productId);
    
            // Verificar si el producto está en la lista de favoritos
            const isFavorite = favorite.productos.some(product => product.equals(productIdObject));
    
            return isFavorite;
        } catch (error) {
            console.error('Error al buscar favorito por usuario y producto:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }
    
    
    

    // async deleteFavorite(productId) {
    //     try {
    //         const db = await this.connect();
    //         const collection = db.collection(this.collectionName);
    //         // Buscar el favorito por el ID del producto
    //         await collection.updateOne(
    //             { productos: new ObjectId(productId) },
    //             { $pull: { productos: new ObjectId(productId) } }
    //         );
    //         console.log('borrado')
    //     } catch (error) {
    //         console.error('Error al eliminar favorito:', error.message);
    //         throw error;
    //     } finally {
    //         await this.close();
    //     }
    // }
    // async deleteFavorite(productId) {
    //     try {
    //         const db = await this.connect();
    //         const collection = db.collection(this.collectionName);
    
    //         // Eliminar el registro que contiene únicamente el ID del producto de la lista de productos en los favoritos
    //         const result = await collection.deleteOne({ productos: new ObjectId(productId) });
    
    //         if (result.deletedCount === 0) {
    //             console.log(`El producto con ID ${productId} no se encontró en los favoritos.`);
    //         } else {
    //             console.log(`Producto con ID ${productId} eliminado de la lista de productos en los favoritos.`);
    //         }
    //     } catch (error) {
    //         console.error('Error al eliminar el producto de los favoritos:', error.message);
    //         throw error;
    //     } finally {
    //         await this.close();
    //     }
    // }

    async deleteFavorite(productId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
        
            // Eliminar el registro que contiene el ID del producto de la lista de productos en los favoritos
            const result = await collection.updateOne(
                { productos: new ObjectId(productId) },
                { $pull: { productos: new ObjectId(productId) } }
            );
        
            if (result.modifiedCount === 0) {
                console.log(`El producto con ID ${productId} no se encontró en los favoritos.`);
            } else {
                console.log(`Producto con ID ${productId} eliminado de la lista de productos en los favoritos.`);
            }
        } catch (error) {
            console.error('Error al eliminar el producto de los favoritos:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async addFavorite(userId, productId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            
            // Verificar si el producto ya existe en la lista de favoritos del usuario
            // const existingFavorite = await collection.findOne({
            //     userId: new ObjectId(userId),
            //     productos: new ObjectId(productId)
            // });
            // console.log('existening', existingFavorite)
            // // Si el producto ya existe, no es necesario agregarlo nuevamente
            // if (existingFavorite) {
            //     console.log('El producto ya está en la lista de favoritos del usuario.');
            //     return;
            // }
    
            // Si el producto no existe en la lista de favoritos, agregarlo
            await collection.updateOne(
                { userId: new ObjectId(userId) },
                { $addToSet: { productos: new ObjectId(productId) } },
                { upsert: true }
            );
        } catch (error) {
            console.error('Error al agregar favorito:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }
    

    async getFavoritesByUserId(userId) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.findOne({ userId: new ObjectId(userId) });
        } catch (error) {
            console.error('Error al obtener favoritos por usuario:', error.message);
            throw error;
        } finally {
            // await this.close();
        }
    }
}

module.exports = Favoritos;
