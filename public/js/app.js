var socket = io();

socket.on('connect', function () {
    console.log('Connected to socket.IO!');
});

socket.on('message', function(message) {
    console.log('New message:');
    console.log(message.text);
    
    jQuery('.messages').append('<p>'+ moment(message.timeStamp).local().format('HH:mm:ss') + ' - ' + message.text +'</p>');
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event){
    event.preventDefault();
    
    var $message = $form.find('input[name=message]');
    
    socket.emit('message', {
       text: $message.val(),
        timeStamp: moment().valueOf()
    });
    
    $message.val('');
    
});