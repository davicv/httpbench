"use strict"

const Koa = require('koa');
const Router = require('koa-router');
const getRandomData = require('./randomdata');

const SERVER_PORT = 5000;

const app = new Koa();
const router = new Router();

router.get('/', (context) => {
    const num = context.query.num ? parseInt(context.query.num) : 100;
    context.body = {
        server: 'Koa',
        list: getRandomData(num || 0)
    }
});

app.use(router.routes());
app.listen({ port: SERVER_PORT }, () => {
    console.log (`Koa test server started, url: http://localhost:${SERVER_PORT}/`);
});
