"use strict"

const colors = require('colors')

function StatCollector(concurrentConnection) {
    let concurrent = concurrentConnection;
    let count = concurrentConnection;
    let requestCount = 0;
    let errorCount = 0;
    let latencySum = 0;
    let startTime = Date.now();
    let resolveWaitStatsCallback = null;
    let requestStats = {};

    function start() {
        count = 0;
        requestCount = 0;
        errorCount = 0;
        latencySum = 0;
    }

    function pending() {
        return count < concurrent;
    }

    function sync(timeout) {
        return new Promise(resolve => {
            let timeoutId = setTimeout(() => {
                resolve(false);
            }, timeout);

            resolveWaitStatsCallback = (value) => {
                clearTimeout(timeoutId);
                resolve(value);
            }
        });
    }

    function resolveWaitStats(value) {
        if (resolveWaitStatsCallback) {
            resolveWaitStatsCallback(value);
            resolveWaitStatsCallback = null;
        }
    }

    /**
     * 
     * @param {Object} requests
     * @param {Number} requests.count
     * @param {Number} requests.success
     * @param {Number} requests.error
     * @param {Number} requests.avgSuccessfullLatency
     */
    function addStat(requests) {
        count++;
        requestCount += requests.count;
        errorCount += requests.error;
        latencySum += requests.avgSuccessfullLatency;

        if (count == concurrent) {
            calcStats();
            resolveWaitStats(true);
        }
    }

    function getStats() {
        return requestStats;
    }

    function calcStats() {
        const errorPerc = requestCount > 0 ? errorCount / requestCount : 0;
        const errorRate = (errorPerc * 100).toFixed(1);
        const duration = (Date.now() - startTime) / 1000.0;
        const success = requestCount - errorCount;
        const requestPerSec = duration ? (success / duration) | 0 : 0;

        requestStats = {
            count: requestCount,
            success,
            errorCount,
            errorPerc,
            errorRate,
            duration,
            requestPerSec,
            latency: (latencySum / concurrent).toFixed(3)
        };
    }

    function showSummary() {
        const stats = getStats();

        console.log (colors.bold.yellow('\nSuccessful requests per second: ') + colors.bold.green(stats.requestPerSec));
        console.log (`  Avg. Latency: ${stats.latency} ms (successful requests)`);
        console.log (`  Error Rate: ${colors.red.bold(stats.errorRate)}%`);
        console.log (
            `  Duration: ${stats.duration}s`,
            ', requests:', numberFormatUnit(stats.success),
            ', error:', numberFormatUnit(stats.errorCount)
        );
    }

    function showReport() {
        const stats = getStats();

        console.log (colors.bold.yellow('\nSuccessful requests'));
        console.log ('  Req/Sec:', stats.requestPerSec);
        console.log (`  Avg. Latency: ${stats.latency} ms (successful requests)`);

        console.log (colors.bold.yellow('\nRequests'));
        console.log ('  Total:', numberFormatUnit(stats.count));
        console.log ('  Successful:', numberFormatUnit(stats.success));
        console.log ('  Error:', numberFormatUnit(stats.errorCount));
        console.log (`  Error Rate: ${colors.red.bold(stats.errorRate)}%`);
        console.log (`  Duration: ${stats.duration}s`);
    }

    function numberFormatUnit(num, unitList = ['', 'k', 'm']) {
        let unitIdx = 0;
        while (num > 1000 && unitIdx < unitList.length) {
            unitIdx++;
            num /= 1000.0;
        }

        if (unitIdx)
            num = num.toFixed(3);

        return num + unitList[unitIdx]
    }

    // initial statistical values
    calcStats();

    return {
        start,
        pending,
        sync,
        addStat,
        showSummary,
        showReport,
        numberFormatUnit
    }
}

module.exports = StatCollector;