Array.prototype.remove = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}

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

    static allScores() {
        return {'7':0,'8':0,'9':14,'10':10,'jack':20,'queen':3,'king':4,'ace':11};
    }
    static noneScores() {
        return {'7':0,'8':0,'9':0,'10':10,'jack':2,'queen':3,'king':4,'ace':11};
    }

    suitScores(cards, gameSuit){
        for (var i in cards) {
            if (cards[i].suit === gameSuit) {
                return this.allScores.card;
            } else if (cards[i].suit !== gameSuit) {
                return this.noneScores.card;
            } else {
                console.error("GameSuit type " + cards[i].suit + " not found");
            }
        }
    }

    randint(min, max) {
        return Math.floor(Math.random()*(max-min)+min);
    }

    giveOutCardsTo1Player() {
        var hand = [ ]
        
        for(var i=0;i<8;i++) {
            let num = this.randint(0,this.deck.length)
            let fullName = this.deck[num];
            let cardVal = this.cardToVal[num % 8];
            let cardSuit = this.cardToSuit[Math.floor(num/4)];
            this.deck.remove(`${cardVal}${cardSuit}`);
            hand.push(JSON.stringify({"value": cardVal, "suit": cardSuit, "name": `${cardVal}_of_${cardSuit}`}));
        }
        return {"type": 'cards', "hand": hand};
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
    checkForGameEnd(score) {
        for (var i=0;i<2;i++) {
            if (score[`team${i}`] > 151) {
                this.gameReset()
            }
        }
    }
    gameReset() {
        console.log("Game Reset");
    }
}

module.exports = game;