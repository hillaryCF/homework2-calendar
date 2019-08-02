
const Controller = require('../core/controller');
const Utils = require('../core/utils');
const Response = require('../core/response');

class BrandsController extends Controller {
    constructor () {
        super('brands');
    }

    async getAll (req, res, route) {
        this.find()
            .then(brands => Response.Send(res, brands))
            .catch(error => Response.ApplicationError(res, error));
    }

    async createOne (req, res, route) {
        let brand = Utils.sanitize(route.data, ['name', 'description']);

        let error = await this.validBrand(brand);
        if(error) return Response.BadRequest(res, error);

        this.insertOne(brand)
            .then(newBrand => Response.Send(res, newBrand))
            .catch(error => Response.ApplicationError(res, error));
    }

    async validBrand(brand) {
        if(Utils.isEmpty(brand)) return new Error(`Invalid brand`);
        if(!brand.name) return new Error(`Invalid brand name`);

        // validates the name is unique
        let found = await this.findOne({name: brand.name});
        if(found) return new Error(`Brand name already exist`);
        return null;
    }
}

module.exports = BrandsController;