const socket = io('http://localhost:5000');

socket.on('connect', function() {
    console.log('connected');
    socket.emit('registerUser', {
        id: 1,
        sid: socket.id,
    });
});

socket.on('successfulRegistration', function(data) {
    console.log(data);
});

window.onbeforeunload = function() {
    socket.emit('closePage', {
        id: 1,
        sid: socket.id,
    });
};
