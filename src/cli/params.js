const RequestManager = require('../../src/requestmanager');
const arg = require('arg');

// [ { option, type, propName }]
const PARAM_LIST = [
    { option: '--threads', type: Number, propName: 'maxWorkers'},
    { option: '--connections', type: Number, propName: 'concurrentConnections'},
    { option: '--seconds', type: Number, propName: 'seconds'},
    { option: '--disable-keepalive', type: Boolean, propName: 'disableKeepAlive'},
    { option: '-t', type: Number, propName: 'maxWorkers'},
    { option: '-c', type: Number, propName: 'concurrentConnections'},
    { option: '-s', type: Number, propName: 'seconds'},
    { option: '--url', type: String, propName: 'url'}
];

function getParams(optionValues, default_conf = {}) {
    const argValues = getArgs(optionValues, PARAM_LIST);

    const url = getFirstUrl(argValues['_'] || []);
    const conf = arg2conf(argValues, PARAM_LIST);

    if (url || argValues['_']?.[0])
        conf.url = url || argValues['_'][0];
    
    return { ...default_conf, ...conf };
}

/**
 * @param {[Object]} paramList 
 */
function getArgs(optionValues, paramList) {
    const argList = {}

    paramList.forEach(item => {
        argList[item.option] = item.type;
    });

    const argValues = arg(argList, {
        permissive: false,
        argv: optionValues
    });

    return argValues;
}

/**
 * 
 * @param {Array} argValues 
 * @param {Array} paramList 
 * @returns 
 */
function arg2conf(argValues, paramList) {
    const conf = {};
    paramList.forEach((param) => {
        if (argValues[param.option])
            conf[param.propName] = argValues[param.option];
    });
    return conf;
}

/**
 * Return first "valid" URL
 * @param {[String]} list 
 * @returns {string|undefined}
 */
function getFirstUrl(list) {
    return list.find(str => {
        try {
            new URL(str);
            return true;
        } catch(err) {
            return false;
        }
    });
}

function printHelp() {
    console.log (`${process.argv[0]} ${process.argv[1]}`);
    console.log (`\nUsage: node ${process.argv[1]} URL`);
    console.log (`   Or: node ${process.argv[1]} [OPTION] URL`);
    console.log ('\nList of arguments');
    console.log (`  -t, --threads NUM      number of threads (def: ${RequestManager.DEF_THREADS})`);
    console.log (`  -c, --connections NUM  number of concurrent connections (def: ${RequestManager.DEF_CONCURRENT_CONNECTIONS})`);
    console.log (`  -s, --seconds NUM      duration of requests (def: ${RequestManager.DEF_DURATION}s)`);
    console.log (`  --disable-keepalive    disable keepalive (def: false)\n`);
}

module.exports = {
    getParams,
    getArgs,
    getFirstUrl,
    printHelp
}
