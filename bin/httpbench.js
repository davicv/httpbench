#!/usr/bin/env node

"use strict"

const colors = require('colors')
const RequestManager = require('../src/requestmanager');
const Params = require('../src/cli/params')

async function main() {
    const param = Params.getParams();
    if (!param.url || param.url.trim() === '') {
        Params.printHelp();
        return;
    }

    const manager = new RequestManager(param.url, {
        threadCount: param.maxWorkers,
        concurrentConnections: param.concurrentConnections,
        disableKeepAlive: param.disableKeepAlive
    });

    const pad = 25;
    console.log (colors.white.bold('\nTesting maximum number of requests per second'));
    console.log (('URL:').padStart(pad), colors.yellow.bold(manager.url));
    console.log (('Threads:').padStart(pad), manager.numThreads);
    console.log (('Concurrent Connections:').padStart(pad), manager.connections);
    console.log (('Concurrent Per Thread:').padStart(pad), manager.connectionsPerThread);
    console.log (('KeepAlive:').padStart(pad), !param.disableKeepAlive);

    const secs = (param?.seconds > 0) ? param.seconds : RequestManager.DEF_DURATION;
    console.log (('Duration:').padStart(pad), secs, 'seconds');

    manager.setStatInterval(1000);
    manager.setRequestsTimeout(secs);
    manager.start();
}
main();
