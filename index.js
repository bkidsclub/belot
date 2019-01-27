$(function () {
    console.log("loaded");
    bigDiv = $("#cards");
    var name = $("#name");
    content = $("#main");
    var button = $("#gameStart");
    var inputWrapper = $("#inputWrapper");
    window.webSocket = window.webSocket || window.MozWebSocket;
    var hand = [];
    var username = false;

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
        message = JSON.parse(message)
        if (message.type == "cards") {
            hand = message.hand;
            $scope.hand = hand;
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
        }
    });
    button.click(function() {
        connection.send('cards');
    });
});