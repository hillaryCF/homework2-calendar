const ObjectId = require('mongodb').ObjectId;

const Response = require('../core/response');
const Utils = require('../core/utils');
const Controller = require('../core/controller');

class CarsController extends Controller {
    constructor() {
        super('cars');
    }

    getAll (req, res, route) {
        this.find({}, route.query)
            .then(cars => Response.Send(res, cars))
            .catch(error => Response.ApplicationError(res, error));
    }

    getOne (req, res, route) {
        let id = route.params.id;
        this.findOne(id)
            .then(car => Response.Send(res, car))
            .catch(error => Response.ApplicationError(res, error));
    }

    postOne (req, res, route) {
        let car = Utils.sanitize(route.data, ['name', 'color', 'year', 'description']) || {};

        let error = this._validCar(car);
        if(error) return Response.BadRequest(res, error);

        this.insertOne(car)
            .then(newCart => Response.Send(res, newCart))
            .catch(error => Response.ApplicationError(res, error));
    }

    _validCar (car = {}) {
        if(Utils.isEmpty(car) || !car.name || !car.color || !car.year)
            return new Error(`Car name, color and year are required.`);
        if(isNaN(+car.year))
            return new Error(`Car year must be a number.`);
        return null;
    }

    putOne (req, res, route) {
        let id = route.params.id || null;

        if(!Utils.isId(id))
            Response.BadRequest(res, new Error(`Invalid id`));

        let car = Utils.sanitize(route.data, ['name', 'color', 'year', 'description']) || {};
        if(Utils.isEmpty(car))
            return Response.BadRequest(new Error(`Invalid car`));

        this.updateOne(id, car)
            .then(updatedCar => Response.Send(res, updatedCar))
            .catch(error => Response.ApplicationError(res, error));
    }

    deleteOne (req, res, route) {
        let id = route.params.id || null;

        if(!Utils.isId(id))
            Response.BadRequest(res, new Error(`Invalid id`));

        this.removeOne(id)
            .then(result => Response.Send(res, result))
            .catch(error => Response.ApplicationError(res, error));
    }
}

module.exports = CarsController;