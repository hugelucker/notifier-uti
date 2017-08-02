function addConnection(index, sid) {
    onlineUsers[index].sids.push(sid);
    onlineUsers[index].connections++;
}

function removeConnection(index, sid) {
    let sidIndex = onlineUsers[index].sids.indexOf(sid);
    if (sidIndex != -1) {
        onlineUsers[index].sids.splice(sidIndex, sid);
        onlineUsers[index].connections--;
    }
}

const express = require('express');
const app = express();
const http = require('http').Server(app).listen(5000);
const io = require('socket.io')(http);

let onlineUsers = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', function(socket) {

    socket.on('sendNotification', function() {

    });

    socket.on('registerUser', (data) => {
        let index = onlineUsers.findIndex(obj => obj.id == data.id),
            msg = '';
        if (index != -1) {
            addConnection(index, data.sid);
            msg = 'Added new connection';
        } else {
            onlineUsers.push({
                id: data.id,
                sids: [data.sid],
                connections: 1,
            });
            // console.log(onlineUsers);
            msg = `Registered new online User with id ${data.id}`;
        }
        io.sockets.to(data.sid).emit('successfulRegistration', {
            message: msg,
            users: onlineUsers,
        });
    });

    socket.on('closePage', (data) => {
        let index = onlineUsers.findIndex(obj => obj.id == data.id);
        if (onlineUsers[index] && onlineUsers[index].connections > 1) {
            removeConnection(index, data.sid);
        } else {
            onlineUsers.splice(index, 1);
        }
    });

});
