var totalServerElapsedTime = 0.0;
var totalClientElapsedTime = 0.0;
var random = require('random-js')();

var payloadCount = 0;
var payloadMap = {};

var getHash = function(obj) {
    var str = JSON.stringify(obj);
    var crypto = require('crypto'),
        shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
};

var validAndLog = function(message, timeCalc) {
    var obj = null;
    if (message && !message.binary) {
        obj = JSON.parse(message);
        if (obj.chksum === getHash(obj.data)) {
            console.log("received: message sent on (" + obj.date + ")\n");
            console.log(JSON.stringify(obj, null, 4));
        }
        if (timeCalc && obj && (typeof obj.id === 'number') && !isNaN(obj.id)) {
            var stTime = payloadMap[obj.id];
            if (stTime) {
                totalClientElapsedTime += (Date.now() - payloadMap[obj.id]);
                delete payloadMap[obj.id];
            }
        }
        if (!obj.data.operation) {
            obj = null;
        }
    }
    return obj;
};

var createPayload = function(data) {
    var payload = {
        "data": data
    };

    payload.chksum = getHash(payload.data);
    payload.date = (new Date()).toString();
    payload.id = payloadCount;
    payloadCount++;

    return payload;
};

var createPayloadStr = function(obj) {
    return JSON.stringify(createPayload(obj));
};

var operations = {

    "echo": function(ws, message, obj) {
        ws.send(message);
    },

    "add": function(ws, message, pobj) {
    	var obj = pobj.data;
        if (obj.p1 && obj.p2) {
            var data = {
                "params": "asked: " + obj.p1.toString() + " + " + obj.p2.toString(),
                "answer": obj.p1 + obj.p2
            };
            var respObj = createPayload(data);
            respObj.id = pobj.id;
            ws.send(JSON.stringify(respObj));
        }
    }
};

var sendRequest = function(ws, messages) {
    var messageObj = messages[random.integer(0, messages.length - 1)];
    var payloadObj = createPayload(messageObj);
    payloadMap[payloadObj.id] = Date.now();
    ws.send(JSON.stringify(payloadObj));
};

var execOperation = function(ws, message, obj) {
    if (obj) {
        var op = operations[obj.data.operation];
        if (op) {
            var start = Date.now();
            op(ws, message, obj);
            totalServerElapsedTime += (Date.now() - start);
        }
    }
};

var displayTimes = function(count) {
    process.stderr.write("total server time spent on fulfilling requests: " + totalServerElapsedTime / 1000.0 + " (secs)\n");
    process.stderr.write("             average requests fulfillment time: " + totalServerElapsedTime / count + " (msecs)\n");
    process.stderr.write("          total client round trip elapsed time: " + totalClientElapsedTime / 1000.0 + " (secs)\n");
    process.stderr.write("                average client round trip time: " + totalClientElapsedTime / count + " (msecs)\n");
    process.stderr.write("                                 total latency: " + ((totalClientElapsedTime - totalServerElapsedTime) / 1000.0) + " (secs)\n");
    process.stderr.write("                               average latency: " + ((totalClientElapsedTime - totalServerElapsedTime) / count) + " (msecs)\n");

};

module.exports = {
    getHash: getHash,
    validAndLog: validAndLog,
    createPayload: createPayload,
    createPayloadStr: createPayloadStr,
    execOperation: execOperation,
    sendRequest: sendRequest,
    displayTimes: displayTimes,
    operations: operations
};