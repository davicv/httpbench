"use strict"

const express = require('express');
const getRandomData = require('./randomdata');

const SERVER_PORT = 5000;

const app = express();

app.get('/', (req, res) => {
    const num = req.query.num ? parseInt(req.query.num) : 100;
    res.json({
        server: 'Express',
        list: getRandomData(num || 0)
    });
}).listen(SERVER_PORT);

console.log (`Express test server started, url: http://localhost:${SERVER_PORT}/`);
