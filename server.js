var websocketserver = require('websocket').server;
var http = require('http');
var fs = require('fs');
var gameFile = require('./game.js');


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

let g = new gameFile(score);

wsServer.on('request', function(request) {
    console.log("got request from " + request.origin);
    if (clients.length > 4) {
        request.close();
    }
    var index = clients.push(connection)-1;
    var username = false;
    var connection = request.accept(null, request.origin);

    connection.on('message', function (message) {
        console.log(`recieved message from ${request.origin} saying ${message.utf8Data}`);
        message = JSON.parse(message.utf8Data);


        if (message.userName != undefined) {
            username = message.userName;
            console.log(username);
        } else {
            if (message.request === "cards") {
                g.gameRequested("cards")
                connection.send(JSON.stringify(g.giveOutCardsTo1Player()));
                console.log(g.deck);
            }
            else if (message.request === 'score') {
                g.gameRequested("score")
                var scoreboard = new game.score(score);
                scoreboard.score(message);
                connection.send()
            }
            else if (message.request == "scoreCalc") {
                g.gameRequested("calculation of score");
                var scoreT1 = g.suitScores(message.Team1Cards, message.GameSuit);
                var scoreT2 = g.suitScores(message.Team2Cards, message.GameSuit);

                score.team1 += scoreT1;
                score.team2 += scoreT2;

                connection.send(JSON.stringify(score));

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