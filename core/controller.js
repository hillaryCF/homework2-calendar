const ObjectId = require('mongodb').ObjectId;

const MongoService = require('./mongo.service');
const Utils = require('./utils');

/**
 * Controller class for the CRUD operations
 */
class Controller {
    constructor(collection = null, mongo = new MongoService()) {
        if(!(mongo instanceof MongoService))
            throw new Error(`Invalid controller mongo instance`);

        if(!collection)
            throw new Error(`Invalid controller collection`);

        this.db = null;
        this.collection = null;

        mongo.connection
            .then(db => {
                this.db = db;
                this.collection = db.collection(collection);
            });
    }

    async find (query = {}, options = {}) {
        options = this._getOptions(options);
        let cursor = this.collection.find(query);

        if(options.project) cursor.project(options.project)
        if(options.skip) cursor.skip(options.skip);
        if(options.limit) cursor.limit(options.limit);
        if(options.filter) cursor.filter(options.filter);
        if(options.sort) cursor.sort(options.sort);

        return cursor.toArray();
    }

    async findOne (query) {
        if(Utils.isEmpty(query))
            return Promise.reject(new Error(`Empty query or id`));
        if(Utils.isId(query)) query = {_id: ObjectId(query)};

        return this.collection.findOne(query);
    }

    async insertOne (data) {
        if(Utils.isEmpty(data)) throw new Error(`Empty data`);

        return this.collection.insertOne(data)
            .then(results => results.ops.length ===1 ? results.ops[0] : results.ops);
    }

    async update (query, update, options = null) {
        if(Utils.isEmpty(query)) throw new Error(`Empty query`);
        if(Utils.isEmpty(update)) throw new Error(`Empty update`);

        return this.collection.update(query, update, options);
    }

    async updateOne (query, update, options = null) {
        if(Utils.isEmpty(query)) throw new Error(`Empty query`);
        if(Utils.isEmpty(update)) throw new Error(`Empty update`);
        if(Utils.isId(query)) query = {_id: ObjectId(query)};

        return this.collection.updateOne(query, {$set: update}, options);
    }

    async remove (query) {
        if(Utils.isEmpty(query)) throw new Error(`Empty query`);

        return this.collection.remove(query);
    }

    async removeOne (query) {
        if(Utils.isEmpty(query)) throw new Error(`Empty query`);
        if(Utils.isId(query)) query = {_id: ObjectId(query)};

        return this.collection.removeOne(query);
    }

    /**
     * Compose the query options
     * @param query
     * @private
     */
    _getOptions(query = {}) {
        let options = {};

        if(query.sort) {
            options.sort = [[query.sort, 1]];
            if(query.sortOrder && query.sortOrder === 'asc')
                options.sort[0][1] = -1;
        }
        if(query.pageItems && !isNaN(+query.pageItems) && +query.pageItems > 0){
            options.limit = Math.ceil(Math.abs(query.pageItems));
        }
        if(query.page && !isNaN(+query.page) && +query.page > 0){
            let page = Math.ceil(Math.abs(query.page));
            if(page === 1) {
                options.limit = options.limit ? options.limit : 10;
            } else {
                options.skip = (page * options.limit)-1;
            }
        }
        if(query.search) options.filter = {name: {$regex: query.search, $options: "gi"}};

        if(this.keys) options.project = this.keys
            .reduce((t, k) => Object.assign(t, {[`${k}`]: 1}), {});

        return options;
    }
}

module.exports = Controller;