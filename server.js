var websocketserver = require('websocket').server;
var http = require('http');
var fs = require('fs');

process.title = "Belot";

var port = 8080;

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

class game {
    constructor(scoreObj){
        this.deck = ['7clubs','8clubs','9clubs','10clubs','jackclubs','queenclubs','kingclubs','aceclubs','7diamonds'
        ,'8diamonds','9diamonds','10diamonds','jackdiamonds','queendiamonds','kingdiamonds','acediamonds','7hearts',
        '8hearts','9hearts','10hearts','jackhearts','queenhearts','kinghearts','acehearts','7spades','8spades','9spades',
        '10spades','jackspades','queenspades','kingspades','acespades'];

        this.cardToVal = {1:'7',2:'8',3:'9',4:'10',5:'jack',6:'queen',7:'king',8:'ace'};
        
        this.cardToSuit = {1:'clubs',2:'spades',3:'hearts',4:'diamonds'};
        this.score = scoreObj;
    }
    static statDeck() {
        return ['7clubs','8clubs','9clubs','10clubs','jackclubs','queenclubs','kingclubs','aceclubs','7diamonds'
        ,'8diamonds','9diamonds','10diamonds','jackdiamonds','queendiamonds','kingdiamonds','acediamonds','7hearts',
        '8hearts','9hearts','10hearts','jackhearts','queenhearts','kinghearts','acehearts','7spades','8spades','9spades',
        '10spades','jackspades','queenspades','kingspades','acespades'];
    }
    randint(min, max) {
        return Math.floor(Math.random()*(max-min)+min);
    }

    giveOutCardsTo1Player() {
        var hand = [ ]
        for(i=0;i<8;i++) {
            let cardVal = cardToVal[this.randint(1,9)];
            let cardSuit = cardToSuit[this.randint(1,5)];
            deck.remove(`${cardVal}${cardSuit}`);
            hand.push(`${cardVal}_of_${cardSuit}`);
        }
        return hand;
    }
    giveOutBigArray() {
        var retVal = [[],[],[],[]];
        for (i=0;i<4;i++) {
            retval[i].push(this.giveOutCardsTo1Player());
        }
        return retVal;
    }
    gameRequested(request) {
        console.log("Game requested " + request);
    }
}

class scores extends game {
    constructor (scoreObj){
        super(scoreObj);
        this.score = scoreObj;
    }
    static allScores() {
        return {'7':0,'8':0,'9':14,'10':10,'jack':20,'queen':3,'king':4,'ace':11};
    }
    static noneScores() {
        return {'7':0,'8':0,'9':0,'10':10,'jack':2,'queen':3,'king':4,'ace':11};
    }

    suitScores(card, suit, gameSuit){
        if (suit === gameSuit) {
            return this.allScores.card;
        } else {
            return this.noneScores.card;
        }
    }
}


wsServer.on('request', function(request) {
    console.log("got request from " + request.origin);
    if (clients.length > 4) {
        request.close();
    }
    var index = clients.push(connection)-1;
    var username = false;
    var connection = request.accept(null, request.origin());

    connection.on('message', function (message) {
        if (JSON.parse(message.utf8data).userName != undefined) {
            username = JSON.parse(message.utf8data).userName;
        } else {
            var g = new game(score);
            if (message.utf8data === "cards") {
                g.gameRequested("cards")
                connection.send(g.giveOutCardsTo1Player());
            }
            else if (message.utf8data === 'score') {
                g.gameRequested("score")
                var scoreboard = new score(score);
                scoreboard.score(JSON.parse(message.utf8data));
                connection.send()
            }
            else if (JSON.parse(message.utf8data).suit != undefined) {
                g.gameRequested("calculation of score");
                var obj = JSON.parse(message.utf8data);
                scores.suitScores
            }
            else if (message.utf8data === 'reset') {
                g.gameRequested("reset");

            }
        }
    });
    connection.on('close', function (connection) {
        if (userName !== false) {
            console.log(connection.remoteAdress + " disconnected");
            clients.splice(index,1);
        }
    })
});