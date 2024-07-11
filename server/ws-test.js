// import { w3cwebsocket as W3CWebSocket } from 'websocket';
const W3CWebSocket = require('websocket').w3cwebsocket;
const socket = new W3CWebSocket('ws://localhost:5000');

socket.onerror = function (event) {
    console.error("WebSocket error observed:", event);
};

socket.onopen = function () {
    console.log("[open] Connection established");
    socket.send("Hello, server");
};