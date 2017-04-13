var PORT = process.env.PORT || 4998;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket){
    console.log('user connected via socket.io!');

    socket.on('message', function(message) {
        console.log('Message received: ' + message.timeStamp + ' - ' + message.text);
        io.emit('message', message);
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