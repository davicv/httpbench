"use strict"

const worker = require('node:worker_threads');
const axios = require('axios')
const http = require('http');
const https = require('https');

const DEFAULT_AXIOS_CONF = {
    timeout: 5000
}

function workerInit() {
    createWorker().init();
}
workerInit();


function createWorker() {
    let run = false;
    let count = 0;
    let errorCount = 0;
    let successfulElapsedTime = 0;
    let keepAlive = true;

    function init() {
        worker.parentPort.on('message', (data) => {
            switch(data.action) {
                case 'getStats':
                    sendStats();
                    break;

                case 'start':
                    run = true;
                    keepAlive = !data.disableKeepAlive;
                    for (let i = 0 ; i < data.concurrent ; i++) {
                        startRequests(data.url, keepAlive);
                    }
                    break;
            
                case 'stop':
                    run = false;
                    process.exit(0);
            }
        });
    }

    function sendStats() {
        const successfulRequest = count - errorCount;
        const latency = successfulRequest > 0 ? successfulElapsedTime / successfulRequest : 0;

        worker.parentPort.postMessage({
            action: 'stats',
            requests: {
                count,
                success: successfulRequest,
                error: errorCount,
                avgSuccessfullLatency: latency
            }
        });
    }

    async function startRequests(requestUrl, keepAlive = true) {
        let first = true;
        let baseUrl = appendRandomParam(requestUrl);
        let axiosConf = updateAxiosConf(requestUrl, DEFAULT_AXIOS_CONF);
        let url, startTime;

        while(run) {
            url = baseUrl + Math.random();
            startTime = Date.now();
            await axios.get(url, axiosConf).then(res => {
                successfulElapsedTime += (Date.now() - startTime);

                // if any redirection occurred, use the destination url
                if (first && res.request?.res?.responseUrl) {
                    baseUrl = appendRandomParam(res.request.res.responseUrl);
                    axiosConf = updateAxiosConf(baseUrl, DEFAULT_AXIOS_CONF, keepAlive);
                    first = false;
                }

            }).catch(() => {
                errorCount++;
            });
            count++;
        }

        destroyAxiosConf();
    }

    function appendRandomParam(baseUrl) {
        const url = new URL(baseUrl);
        url.searchParams.delete('randv');
        url.searchParams.append('randv', '');
        return url.toString();
    }

    function updateAxiosConf(url, config, _keepAlive) {
        const { httpAgent, httpsAgent, ...conf} = config;
        let keepAlive = (_keepAlive == true);

        if (url.trim().toLowerCase().startsWith('https')) {
            conf.httpsAgent = httpsAgent || new https.Agent({ keepAlive });
        } else {
            conf.httpAgent = httpAgent || new http.Agent({ keepAlive });
        }

        return conf;
    }

    function destroyAxiosConf(conf) {
        if (conf?.httpsAgent?.destroy)
            conf?.httpsAgent?.destroy();

        if (conf?.httpAgent?.destroy)
            conf?.httpsAgent?.destroy();
    }

    return {
        init,
        sendStats,
        startRequests,
        appendRandomParam,
        updateAxiosConf
    }
}
