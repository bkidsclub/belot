var websocketserver = require('websocket').server;
var http = require('http');
var fs = require('fs');
var game = require('./game.js');


process.title = "Belot";

var port = process.env.port || 8080;

var clients = [ ];

var score = {'team1':0,'team2':0}

var server = http.createServer(function (request, response) {
    console.log("Requested " + request.url)
    if (request.url == "/") {
        fs.readFile('./index.html', function (err,data) {
            response.writeHead(200, {"content-type": "text/html"});
            response.write(data);
            response.end();
        });
    } else if (request.url == "/index.js") {
        fs.readFile('./index.js', function (err, data) {
            response.writeHead(200, {"content-type": "text/js"});
            response.write(data);
            response.end();
        });
    } else if (request.url == "/style.css") {
        fs.readFile('./style.css', function (err,data) {
            response.writeHead(200, {"content-type": "text/css"});
            response.write(data);
            response.end();
        });
    }
});
server.listen(port, function() { console.log("server started on port " + port) });

var wsServer = new websocketserver({httpServer:server});


wsServer.on('request', function(request) {
    console.log("got request from " + request.origin);
    if (clients.length > 4) {
        request.close();
    }
    var index = clients.push(connection)-1;
    var username = false;
    var connection = request.accept(null, request.origin);

    connection.on('message', function (message) {
        console.log(`recieved message from ${request.origin} saying ${message.utf8Data}`)
        if (JSON.parse(message.utf8Data).userName != undefined) {
            username = JSON.parse(message.utf8Data).userName;
            console.log(username);
        } else {
            var g = new game.game(score);
            if (message.utf8Data === "cards") {
                g.gameRequested("cards")
                connection.send(g.giveOutCardsTo1Player());
            }
            else if (message.utf8Data === 'score') {
                g.gameRequested("score")
                var scoreboard = new game.score(score);
                scoreboard.score(JSON.parse(message));
                connection.send()
            }
            else if (JSON.parse(message.utf8Data).suit != undefined) {
                g.gameRequested("calculation of score");
                var obj = JSON.parse(message.utf8Data);
                scores.suitScores
            }
            else if (message.utf8Data === 'reset') {
                g.gameRequested("reset");
            }
        }
    });
    connection.on('close', function (connection) {
        if (username !== false) {
            console.log(connection.remoteAdress + " disconnected");
            clients.splice(index,1);
        }
    })
});