const MongoClient = require('mongodb').MongoClient;

const Config = require('../config');

let instance = null;
class MongoService {
    constructor (config = Config.mongo) {
        if(instance) return instance;
        if(!config) throw new Error('Invalid mongodb connection config');

        this.connection = null;
        this.url = config.url;
        this.dbName = config.db;
        this._client = null;
        this.db = null;

        // Connect to the db
        this._connect();
        return instance = this;
    }

    _connect () {
        if(this.connection) return this.connection;
        return this.connection = MongoClient.connect(this.url)
            .then(client => {
                this._client = client;
                this.db = client.db(this.dbName);
                console.log(`Mongodb: ${this.url} database: ${this.dbName}`);
                return this.db;
            })
            .catch(error => console.error(error));
    }

    close () {
        return this.connection.close();
    }
}

module.exports = MongoService;