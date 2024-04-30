// const ConnectionDB = require("./ConnectionDB");

// /**
//  * Instancia de conexion a la base de datos, se maneja como Singleton para hacer posible el manejo
//  *  de transacciones sobre la base de datos por diferentes modelos.
//  */
// const oConnectionDB = (new ConnectionDB()).getInstance();

// /**
//  * Modelo principal el cual extenderan los demas modelos y contendra funciónes en comun.
//  */
// var Model = class Model {

//   constructor(sTable, sDeleteSentence = '', sAllColumns = '*', sMinimalColumns = sAllColumns) {
//     this.sTable = sTable;
//     this.sDeleteSentence = sDeleteSentence;
//     this.sAllColumns = sAllColumns;
//     this.sMinimalColumns = sMinimalColumns;
//     this.oConnection = oConnectionDB;
//   }
//   /**
//    * Función común para todos los modelos, retorna el contador de registros actuales activos.
//    * 
//    * @param {function} fCallBack Función que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
//    * 
//    * @author Leandro Curbelo
//    */
//   getCount = (fCallBack) => {
//     oConnectionDB.query(`SELECT COUNT(id) AS count FROM ${this.sTable} WHERE 1 ${this.sDeleteSentence}`, (oError, oResult) => {
//       if (oError)
//         return fCallBack(oError, true);
//       fCallBack(oResult[0]);
//     });
//   }
//   /**
//    * Función común para todos los modelos, retorna todos los registros de la tabla.
//    * 
//    * @param {function} fCallBack Función que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
//    * 
//    * @author Leandro Curbelo
//    */
//   getAll = (fCallBack) => {
//     oConnectionDB.query(`SELECT ${this.sMinimalColumns} FROM ${this.sTable} WHERE 1 ${this.sDeleteSentence} ORDER BY name`, (oError, oResult) => {
//       if (oError)
//         return fCallBack(oError, true);
//       fCallBack(oResult);
//     });
//   }
//   /**
//    * Función común para todos los modelos, busca un registro por el identificador primario de la tabla.
//    * 
//    * @param {number} nId Identificador primario del registro
//    * @param {function} fCallBack Función que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
//    * 
//    * @author Leandro Curbelo
//    */
//   find = (nId, fCallBack) => {
//     oConnectionDB.query(`SELECT ${this.sMinimalColumns} FROM ${this.sTable} WHERE id = ${oConnectionDB.escape(nId)} ${this.sDeleteSentence}`, (oError, oResult) => {
//       if (oError)
//         return fCallBack(oError, true);
//       fCallBack(oResult[0]);
//     });
//   }
//   /**
//    * Función que realiza el borrado logico de un registro con el identificador nId
//    * 
//    * @param {number} nId Identificador primario del registro
//    * @param {Date} dNow Fecha del momento en que el registro se elimina
//    * @param {function} fCallBack Función que sera llamada como callback, debe recibir un oResult y un bIsError (oResult, bIsError = false)
//    * 
//    * @author Leandro Curbelo
//    */
//   remove = (nId, dNow, fCallBack) => {
//     oConnectionDB.query(`UPDATE ${this.sTable} SET deleted_at = ${oConnectionDB.escape(dNow)} WHERE id = ${oConnectionDB.escape(nId)}`, (oError, oResult) => {
//       if (oError)
//         return fCallBack(oError, true);
//       fCallBack(oResult[0]);
//     });
//   }
//   /**
//    * Función que elimina un registro fisicamente.
//    * 
//    * @param {number} nId Identificador primario del registro
//    * 
//    * @author Leandro Curbelo
//    */
//   delete = (nId) => {
//     oConnectionDB.query(`DELETE FROM ${this.sTable} WHERE id = ${oConnectionDB.escape(nId)}`, (oError, oResult) => { });
//   }
//   /**
//    * Función global para todos los modelos, esta función permite la edicion de un registro
//    *
//    * @param {object} oModel Datos que se deben actualizar en el modelo
//    * 
//    * @author Leandro Curbelo
//    */
//   update = async (oModel, fCallBack) => {
//     try {
//       let sSql = `UPDATE ${this.sTable} SET ${oConnectionDB.escape(oModel)} WHERE id = ${oConnectionDB.escape(oModel.id)}`;
//       oConnectionDB.query(sSql, (oError, oResult) => {
//         if (oError)
//           return fCallBack(oError.message, true);
//         fCallBack();
//       });
//     } catch (oError) {
//       fCallBack(oError.message, true);
//     }
//   }
//   /**
//    * Función que comienza una transaccion en la base de datos
//    * 
//    * @author Leandro Curbelo
//    */
//   beginTransaction = () => {
//     oConnectionDB.beginTransaction();
//   }
//   /**
//    * Función que realiza el commit de una transaccion
//    * 
//    * @author Leandro Curbelo
//    */
//   commitTransaction = () => {
//     oConnectionDB.commit();
//   }
//   /**
//    * Función que realiza el rollback de una transaccion
//    * 
//    * @author Leandro Curbelo
//    */
//   rollbackTransaction = () => {
//     oConnectionDB.rollback()
//   }
// }

// module.exports = Model;

// model.js
const ConnectionDB = require("./ConnectionDB");

class Model {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.connection = new ConnectionDB();
    }

    async connect() {
        return await this.connection.connect();
    }

    async close() {
        if (this.connection.client) {
            await this.connection.client.close();
        }
    }

    async getCount() {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.countDocuments();
        } catch (error) {
            console.error('Error al obtener el conteo de registros:', error.message);
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
            console.error('Error al obtener todos los registros:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async find(id) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.findOne({ _id: id });
        } catch (error) {
            console.error('Error al buscar registro por ID:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async remove(id) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.updateOne({ _id: id }, { $set: { deleted_at: new Date() } });
        } catch (error) {
            console.error('Error al eliminar registro:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async delete(id) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.deleteOne({ _id: id });
        } catch (error) {
            console.error('Error al eliminar registro:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async update(id, data) {
        try {
            const db = await this.connect();
            const collection = db.collection(this.collectionName);
            return await collection.updateOne({ _id: id }, { $set: data });
        } catch (error) {
            console.error('Error al actualizar registro:', error.message);
            throw error;
        } finally {
            await this.close();
        }
    }

    async beginTransaction() {
        await this.connection.beginTransaction();
    }

    async commitTransaction() {
        await this.connection.commitTransaction();
    }

    async rollbackTransaction() {
        await this.connection.rollbackTransaction();
    }
}

module.exports = Model;
