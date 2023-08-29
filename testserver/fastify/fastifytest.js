"use strict"

const fastify = require('fastify');
const getRandomData = require('./randomdata');

const SERVER_PORT = 5000;

const app = fastify({
    keepAliveTimeout: 5000
});

app.get('/', (req) => {
    const num = req.query.num ? parseInt(req.query.num) : 100;
    return {
        server: 'Fastify',
        list: getRandomData(num || 0)
    }
});

app.listen({ port: SERVER_PORT });

console.log (`Fastify test server started, url: http://localhost:${SERVER_PORT}/`);
