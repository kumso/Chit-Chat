// Node Server which will handle socket io connection
const io = require('socket.io')(8000)

const users = {};

// listen to connection
io.on('connection', socket => {
    // If any new user joins. let other users connected to the server know!
    socket.on('new-user-joined', name => {
        // console.log('New User Joined', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });

    // If someone send a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name : users[socket.id]});
    });

    // If someone leaves the chat, let others know!
    // automatically fired when user left
    socket.on('disconnect', ()=> {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})