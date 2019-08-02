const http = require('http');

const Config = require('./config');
const Response = require('./core/response');
const router = require('./router');

const port = process.env.PORT || Config.port;

const server = http.createServer((req, res) => {
    let route = router.find(req.url, req.method);
    if(route) return route.execute(req, res);
    Response.BadRequest(res, new Error('Route not found'));
});
server.listen(port, () => console.log(`Server localhost:${port}`));


