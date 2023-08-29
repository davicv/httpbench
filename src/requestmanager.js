"use strict"

const worker = require('node:worker_threads')
const StatCollector = require('./statcollector')

const STATS_SYNC_TIMEOUT = 500;
const STOP_THREADS_TIMEOUT = 5000;

class RequestManager {
    static DEF_THREADS = 5;
    static DEF_CONCURRENT_CONNECTIONS = RequestManager.DEF_THREADS * RequestManager.DEF_THREADS;
    static DEF_DURATION = 10;

    constructor(url, {
            threadCount,
            concurrentConnections,
            disableKeepAlive = false
        }
    ) {
        this.url = url;
        this.showSummary = false;
        this.threadList = [];
        this.disableKeepAlive = (disableKeepAlive == true);

        this.setConnections(threadCount, concurrentConnections)
        this.stats = StatCollector(this.numThreads);
    }

    setConnections(workerCount, concurrentConnections) {
        workerCount = parseInt(workerCount);
        concurrentConnections = concurrentConnections = parseInt(concurrentConnections);

        if (!workerCount || workerCount < 1)
            workerCount = RequestManager.DEF_THREADS;

        if (!concurrentConnections || concurrentConnections < 1)
            concurrentConnections = RequestManager.DEF_CONCURRENT_CONNECTIONS;
        
        this.numThreads = concurrentConnections < workerCount ? concurrentConnections : workerCount;
        this.connections = concurrentConnections;
        this.connectionsPerThread = Math.ceil(concurrentConnections / this.numThreads);
    }

    setStatInterval(ms) {
        this.statsInterval = setInterval(() => {
            this.showSummary = true;
            this.requestStats();
        }, ms);
    }

    stopStatInterval() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
            this.showSummary = false;
            this.statsInterval = null;
        }
    }

    async requestStats() {
        if (!this.stats.pending()) {
            this.stats.start();
            this.sendForThreads({ action: 'getStats' });

            if (this.showSummary) {
                await this.stats.sync(STATS_SYNC_TIMEOUT);
                this.stats.showSummary();
            }
        }
    }

    sendForThreads(data) {
        this.threadList.forEach(thread => {
            thread.postMessage(data);
        });
    }

    createThread() {
        const requestWorker = new worker.Worker(`${__dirname}/requestworker.js`);
        requestWorker.on("message", (data) => {
            if (data.action === 'stats') {
                this.addStats(data);
            }
        });
        return requestWorker;
    }

    addStats(data) {
        this.stats.addStat(data.requests);
    }

    start() {
        if (this.threadList.length)
            return;

        for (let i = 0 ; i < this.numThreads ; i++) {
            const requestWorker = this.createThread();
            this.threadList.push(requestWorker);
        }

        this.sendForThreads({
            'action': 'start',
            'url': this.url,
            'concurrent': this.connectionsPerThread,
            'disableKeepAlive': this.disableKeepAlive
        });
    }

    setRequestsTimeout(secs) {
        secs = parseFloat(secs);
        if (!secs || secs <= 0)
            secs = RequestManager.DEF_DURATION;

        setTimeout(() => {
            this.stop();
        }, (secs * 1000) | 0);
    }

    async stop() {
        this.stopStatInterval();
        await this.stopThreads();

        console.log ("\nStopping threads..");
        await this.stats.sync(STOP_THREADS_TIMEOUT);
        this.stats.showReport();

        this.threadList = [];
    }

    async stopThreads() {
        await this.requestStats();
        this.sendForThreads({ action: 'stop' });
    }
}

module.exports = RequestManager;
