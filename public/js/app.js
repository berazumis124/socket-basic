var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' wants to join ' + room);

// UPDATE H1 room tag

jQuery('.room-title').append(room);

socket.on('connect', function () {
    console.log('Connected to socket.IO!');
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});


socket.on('message', function(message) {
    console.log('New message:');
    console.log(message.text);
    var $message = jQuery('.messages');
    
    $message.append('<p><strong>'+ message.name +' ' + moment(message.timeStamp).local().format('HH:mm:ss')+'</strong></p><p>' +  message.text + '</p>')
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event){
    event.preventDefault();
    
    var $message = $form.find('input[name=message]');
    
    socket.emit('message', {
        name: name,
       text: $message.val(),
        timeStamp: moment().valueOf()
    });
    
    $message.val('');
    
});