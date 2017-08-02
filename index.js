class User {
    construct(id, sid) {
        this.id = id;
        this.sid = [sid];
        this.connections = 1;

        return this;
    }

    addConnection(sid) {
        this.connections += 1;
        return this.sid.push(sid);
    }

    removeConnection(sid) {
        let index = this.sid.findIndex(sidParam => sidParam == sid);
        return this.sid.splice(index, 1);
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
            onlineUsers[index].addConnection(data.sid);
            msg = 'Added new connection';
        } else {
            let user = new User(data.id, data.sid);
            onlineUsers.push(user);
            // console.log(onlineUsers);
            msg = `Registered new online User with id ${data.id}`;
        }
        console.log('sendingSuccess');
        console.log(data.sid);
        console.log(socket.rooms);
        io.sockets.to(data.sid).emit('successfulRegistration', {
            message: msg,
            users: onlineUsers,
        });
    });

    socket.on('closePage', (data) => {
        let index = onlineUsers.findIndex(obj => obj.id == data.id);
        if (onlineUsers[index] && onlineUsers[index].connections > 1) {
            onlineUsers[index].removeConnection(data.sid);
        }
        console.log(onlineUsers);
    });

});
