var PORT = process.env.PORT || 4998;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided socket

function sendCurrentUsers (socket) {
    var info = clientInfo[socket.id];
    var users = [];
    
    if (typeof info === 'undefined') {
        return;
    }
    
    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];
        
        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });
    
    socket.emit('message', {
        name: 'Chatroom',
        text: 'Current users: '+ users.join(', '),
        timeStamp: moment().valueOf()
    })
}

io.on('connection', function (socket){
    console.log('user connected via socket.io!');
    
    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];
        if (typeof clientInfo[socket.id] !== 'undefined'){
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
               name: 'Chatroom',
                text: userData.name + ' has left!',
                timeStamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });
    
    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined',
            timeStamp: moment().valueOf()
        });
    });

    socket.on('message', function(message) {
        console.log('Message received: ' + message.timeStamp + ' - ' + message.text);
        
        if (message.text === '@currentUsers'){
            sendCurrentUsers(socket);
        } else {
            io.to(clientInfo[socket.id].room).emit('message', message);    
        }        
    });
    
    socket.emit('message',{
        name: 'Chatroom',
        text: 'Welcome to a socket app'
        //timeStamp: moment().valueOf()
    });
});

http.listen(PORT, function () {
    console.log('Server started');
});