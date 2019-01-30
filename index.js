var username;

var hand = [];

$(function () {
    console.log("loaded");
    bigDiv = $("#cards");
    var name = $("#name");
    content = $("#main");
    var button = $("#startGame");
    var inputWrapper = $("#inputWrapper");
    var handImgs = $("#listOfCards")

    window.webSocket = window.webSocket || window.MozWebSocket;
    button.css({'visibility':'hidden'});

    if (!window.WebSocket) {
        content.html($('<p>', {text:"Sorry, your browser does not support WebSocket"}));
        name.hide();
        return;
    }

    var myname = false;
    var connection = new WebSocket('ws://localhost:8080');

    connection.onopen = function () {
        name.removeAttr('disabled');
    }
    connection.onmessage = function (message) {
        message = JSON.parse(message.data)
        if (message.type == "cards") {
            hand = message.hand;
            handImgs.css({'visibility':'visible'})
            for (var i in hand) {
                handImgs.append(`<img src="./assets/${JSON.parse(hand[i]).name}.png" class="rotate">`);
            }
        }
    }
    name.keydown(function(e) {
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {return};
            username = msg;
            connection.send(JSON.stringify(JSON.parse(`{"userName": "${msg}"}`)));
            $(this).val('');
            inputWrapper.css({'visibility': 'hidden'});
            button.css({'visibility':'visible'});
        }
    });
    button.click(function() {
        console.log("start game clicked");
        connection.send(JSON.stringify({'request': 'cards'}));
    });
});