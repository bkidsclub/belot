$(function () {
    console.log("loaded");
    bigDiv = $("#cards");
    name = $("#name");
    content = $("#main");
    window.webSocket = window.webSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        content.html($('<p>', {text:"Sorry, your browser does not support WebSocket"}));
        name.hide();
        return;
    }

    var myname = false;
    var connection = new WebSocket('ws://webelot.herokuapp.com');

    connection.onopen = function () {
        name.removeAttribute('disabled');
    }
});