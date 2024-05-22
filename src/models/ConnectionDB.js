// connection.js
const { MongoClient } = require('mongodb');
const env = require('../constants/Environment');

class ConnectionDB {
    constructor() {
        this.uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
        this.client = null;
    }

    async connect() {
        try {
            this.client = await MongoClient.connect(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Conexión a la base de datos establecida correctamente");
            return this.client.db(env.DB_NAME);
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error.message);
            throw error;
        }
    }
}

module.exports = ConnectionDB;
