#!/usr/bin/env node

process.argv.splice(0, 1);

var displayUsageAndExit = function() {
    process.stderr.write('usage: worker.js {count} {listening port} {connection port}\n');
    process.stderr.write('       set port to zero if you want to disable either server or client functionality.\n');
    process.exit(1);
};

if (process.argv.length < 4) {
    displayUsageAndExit();
}

var curCount = 0;
var respCount = 0;
var maxCount = parseInt(process.argv[1]);
var listeningPort = parseInt(process.argv[2]);
var connectionPort = parseInt(process.argv[3]);

var startTime = Date.now();

var displayTimesAndExit = function() {
    util.displayTimes(curCount);
    process.stderr.write("\nTotal Elapsed Time: " + ((Date.now() - startTime) / 1000.0).toString() + " (secs) for " + maxCount + " requests.\n");
    process.exit(0);
};

if (isNaN(listeningPort) || isNaN(connectionPort) || isNaN(maxCount) || maxCount <= 0) {
    displayUsageAndExit();
}

var util = require('./util');
var WebSocket = require('ws');

//------------------- Server Code --------------------------------------

if (listeningPort > 0) {

    var WebSocketServer = WebSocket.Server,
        wss = new WebSocketServer({
            host: "localhost",
            port: listeningPort
        });

    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
            var obj = util.validAndLog(message);
            util.execOperation(ws, message, obj);

            if (connectionPort === 0) {
                curCount++;
                if (curCount >= maxCount) {
                	setTimeout(displayTimesAndExit, 5000);
                }
            }
        });
    });
}

//------------------- Client Code --------------------------------------

if (connectionPort > 0) {
    var ws = new WebSocket('ws://localhost:' + connectionPort.toString());

    var random = require('random-js')();

    ws.on('open', function open() {
        setInterval(function() {
            if (curCount < maxCount) {
                util.sendRequest(ws, [{
                    "operation": "echo",
                    "version": "3.1",
                    "parameters": [{
                        "p1": "p1 value",
                        "p2": ["p2 e1", "p2 e2", 28.0]
                    }]
                }, {
                    "operation": "add",
                    "p1": random.integer(1, 100),
                    "p2": random.integer(1, 100)
                }]);
                curCount++;
            }
        }, 1);
    });

    ws.on('message', function(data, flags) {
        util.validAndLog(data, true);
        respCount++;

        if (respCount >= maxCount) {
            displayTimesAndExit();
        }

    });
}