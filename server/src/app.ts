var express = require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

server.listen(port, '0.0.0.0');

// import controllers that we need from here
import { lobby } from "./controller";
import { Lobby } from "./model"

// Establish a separate namespace for lobby socket
var lobbynsp = io.of("/lobby")
var l = new Lobby()
// Listens for a new client connecting to the server
lobbynsp.on("connection", function (socket){
	console.log('app new socket connection')
	// NOTE: each socket is an individual client. When a client connects, 
	// we set up a new controller *specifically* for that client.
	// Each controller instance listens for messages from its specific
	// client.
	lobby(socket, l, io)
});

// Get server IP for mac users
// console.log(require('os').networkInterfaces()['en0'][1]['address'])

// Get server IP for windows users
//console.log(require('os').networkInterfaces())
// require('dns').lookup(require('os').hostname(), function (err, add, fam) {
// 	console.log('addr: '+add);
//   })