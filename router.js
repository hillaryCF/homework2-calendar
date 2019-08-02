const {Router} = require('./core/router');

const CarsController = require('./controllers/cars.controller');
const BrandsController = require('./controllers/brands.controller');
const cars = new CarsController();
const brands = new BrandsController();

const router = new Router([
    {
        path: '/api/v1/months',
        method: 'GET',
        callback: cars.getAll.bind(cars)
    },
    {
        path: '/api/v1/cars/:id',
        method: 'GET',
        callback: cars.getOne.bind(cars)
    },
    {
        path: '/api/v1/cars',
        method: 'POST',
        callback: cars.postOne.bind(cars)
    },
    {
        path: '/api/v1/cars/:id',
        method: 'PUT',
        callback: cars.putOne.bind(cars)
    },
    {
        path: '/api/v1/cars/:id',
        method: 'DELETE',
        callback: cars.deleteOne.bind(cars)
    },
    {
        path: '/api/v1/brands',
        method: 'GET',
        callback: brands.getAll.bind(brands)
    },
    {
        path: '/api/v1/brands',
        method: 'POST',
        callback: brands.createOne.bind(brands)
    },
]);

module.exports = router;



