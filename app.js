//depedencies
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//fake database
app.set('beat', {});

//handlers
var handlers = require('./handlers');

server.listen(8000);

handlers(app, express, io);












