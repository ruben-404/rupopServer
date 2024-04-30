// user.js
const { ObjectId } = require('mongodb');

const Model = require('./Model');

class User extends Model {
    constructor() {
        super('users');
    }

    async getByEmail(email) {
      try {
          const db = await this.connect();
          const collection = db.collection(this.collectionName);
          const user = await collection.findOne({ email });
          // console.log(user); // Imprimir el resultado
          return user;
      } catch (error) {
          console.error('Error al buscar usuario por email:', error.message);
          throw error;
      } finally {
          await this.close();
      }
  }
  

    async getByToken(token) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.findOne({ remember_token: token });
        } catch (error) {
            console.error('Error al buscar usuario por token:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async updateToken(email, token) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            await collection.updateOne({ email }, { $set: { remember_token: token } });
        } catch (error) {
            console.error('Error al actualizar token del usuario:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async create(newUser) {
      try {
          const db = await this.connect();
          const collection = db.collection(this.collectionName);
          await collection.insertOne(newUser);
      } catch (error) {
          console.error('Error al crear nuevo usuario:', error.message);
          throw error;
      } finally {
          await this.close();
      }
  }

  async getById(userId) {
    try {
        const db = await this.connect();
        const collection = db.collection(this.collectionName);
        const user =  await collection.findOne({ _id: new ObjectId(userId) });
        return user;
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error.message);
        throw error;
    } finally {
        await this.close();
    }
    }

    async update(userId, updatedUserData) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            await collection.updateOne({ _id: new ObjectId(userId) }, { $set: updatedUserData });
        } catch (error) {
            console.error('Error al actualizar usuario:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }
}

module.exports = User;
