# Websockets Using Node.js

## Introduction

This is a simple hacked up ```node.js``` application that will act as client and server for websocket communication using the ```ws``` module (<https://github.com/websockets/ws>).

I also used the ```random-js``` module for just generating random range of integers.

All dependent modules have been checked in here as well for convenience.

I did this primarily to get myself familiarized with the websockets and node.js modules. It is not production worthy code.

## Here is a list of the required node modules

    ├── random-js@1.0.4
    └─┬ ws@0.7.2
      ├─┬ bufferutil@1.1.0
      │ ├── bindings@1.2.1
      │ └── nan@1.8.4
      ├── options@0.0.6
      ├── ultron@1.0.2
      └─┬ utf-8-validate@1.1.0
        ├── bindings@1.2.1
        └── nan@1.8.4
        
## Javascript Files

### worker.js

This the main driver with the following usage:

	usage: worker.js {count} {listening port} {connection port}

       set port to zero if you want to disable either server or client functionality.
       
For example, to run it so that it communicates itself you would,

	node worker.js 2 8111 8111
	
The above will send 2 requests to itself. Each request is essentially a JSON string that has an ```operation``` member. This member is keyed off by the server to understand which function to call on the server side and how the server will respond.

### util.js

This module contains utility functions that are used by ```worker.js```. The different types of operations are stored in the ```operations``` object.

There are only two types of operations in this example, *add* and *echo*.

The other routines are there to handle packaging of the payload and other minor forms of verification.

## Sample output

	node worker.js 2 8111 8111
	
    received: message sent on (Tue Aug 25 2015 10:37:27 GMT-0400 (EDT))
    
    {
        "data": {
            "operation": "add",
            "p1": 73,
            "p2": 61
        },
        "chksum": "583a1a317cc413f9df509d3d271696cef1d005eb",
        "date": "Tue Aug 25 2015 10:37:27 GMT-0400 (EDT)",
        "id": 0
    }
    received: message sent on (Tue Aug 25 2015 10:37:27 GMT-0400 (EDT))
    
    {
        "data": {
            "operation": "echo",
            "version": "3.1",
            "parameters": [
                {
                    "p1": "p1 value",
                    "p2": [
                        "p2 e1",
                        "p2 e2",
                        28
                    ]
                }
            ]
        },
        "chksum": "58110eb3280af5605d857eb198d2cdb323b6202d",
        "date": "Tue Aug 25 2015 10:37:27 GMT-0400 (EDT)",
        "id": 1
    }
    received: message sent on (Tue Aug 25 2015 10:37:27 GMT-0400 (EDT))
    
    {
        "data": {
            "params": "asked: 73 + 61",
            "answer": 134
        },
        "chksum": "47f17c825ee7e3d058f109424d18b004b35ddb45",
        "date": "Tue Aug 25 2015 10:37:27 GMT-0400 (EDT)",
        "id": 0
    }
    received: message sent on (Tue Aug 25 2015 10:37:27 GMT-0400 (EDT))
    
    {
        "data": {
            "operation": "echo",
            "version": "3.1",
            "parameters": [
                {
                    "p1": "p1 value",
                    "p2": [
                        "p2 e1",
                        "p2 e2",
                        28
                    ]
                }
            ]
        },
        "chksum": "58110eb3280af5605d857eb198d2cdb323b6202d",
        "date": "Tue Aug 25 2015 10:37:27 GMT-0400 (EDT)",
        "id": 1
    }
    total server time spent on fulfilling requests: 0.001 (secs)
                 average requests fulfillment time: 0.5 (msecs)
              total client round trip elapsed time: 0.022 (secs)
                    average client round trip time: 11 (msecs)
                                     total latency: 0.021 (secs)
                                   average latency: 10.5 (msecs)
    
    Total Elapsed Time: 0.081 (secs) for 2 requests.
    
## Different Machines

Run the server first using

	node worker.js 2 8111 0
	
and then on the client machine, run

	node worker.js 2 0 8111
	
### Sample Server Output

    received: message sent on (Tue Aug 25 2015 10:39:44 GMT-0400 (EDT))
    
    {
        "data": {
            "operation": "add",
            "p1": 18,
            "p2": 1
        },
        "chksum": "de2a63b2f436a4250f13af910297c8fd1a427be8",
        "date": "Tue Aug 25 2015 10:39:44 GMT-0400 (EDT)",
        "id": 0
    }
    received: message sent on (Tue Aug 25 2015 10:39:44 GMT-0400 (EDT))
    
    {
        "data": {
            "operation": "echo",
            "version": "3.1",
            "parameters": [
                {
                    "p1": "p1 value",
                    "p2": [
                        "p2 e1",
                        "p2 e2",
                        28
                    ]
                }
            ]
        },
        "chksum": "58110eb3280af5605d857eb198d2cdb323b6202d",
        "date": "Tue Aug 25 2015 10:39:44 GMT-0400 (EDT)",
        "id": 1
    }
    total server time spent on fulfilling requests: 0.002 (secs)
                 average requests fulfillment time: 1 (msecs)
              total client round trip elapsed time: 0 (secs)
                    average client round trip time: 0 (msecs)
                                     total latency: -0.002 (secs)
                                   average latency: -1 (msecs)
    
    Total Elapsed Time: 58.357 (secs) for 2 requests.

The client and latency times should be ignored on the server output.
    
### Sample Client Output

    received: message sent on (Tue Aug 25 2015 10:39:44 GMT-0400 (EDT))
    
    {
        "data": {
            "params": "asked: 18 + 1",
            "answer": 19
        },
        "chksum": "c6b058f9493e467457cf29f0ee6cee05a8fc7ae7",
        "date": "Tue Aug 25 2015 10:39:44 GMT-0400 (EDT)",
        "id": 0
    }
    received: message sent on (Tue Aug 25 2015 10:39:44 GMT-0400 (EDT))
    
    {
        "data": {
            "operation": "echo",
            "version": "3.1",
            "parameters": [
                {
                    "p1": "p1 value",
                    "p2": [
                        "p2 e1",
                        "p2 e2",
                        28
                    ]
                }
            ]
        },
        "chksum": "58110eb3280af5605d857eb198d2cdb323b6202d",
        "date": "Tue Aug 25 2015 10:39:44 GMT-0400 (EDT)",
        "id": 1
    }
    total server time spent on fulfilling requests: 0 (secs)
                 average requests fulfillment time: 0 (msecs)
              total client round trip elapsed time: 0.039 (secs)
                    average client round trip time: 19.5 (msecs)
                                     total latency: 0.039 (secs)
                                   average latency: 19.5 (msecs)
    
    Total Elapsed Time: 0.088 (secs) for 2 requests.
    
The server time and request fulfillment time should be ignored on the client.