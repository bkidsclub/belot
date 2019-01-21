$(function () {
    bigDiv = $("#cards");
    name = $("#name");
    content = $("#main");
    window.webSocket = window.webSocket || window.MozWebSocket;

    if (!window.webSocket) {
        content.html($('<p>', {text:"Sorry, your browser does not support WebSocket"}));
        input.hide();
        return;
    }

    var myname = false;
    var connection = new WebSocket('ws://127.0.0.1:8080');

    connection.onopen = function () {
        name.removeAttribute('disabled');
    }

    name.

});