const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
// Utils
const formatMessage = require('./utils/messages');
const { joinUser, getUser, userLeave, getRoomUsers } = require('./utils/users');

// Init express server
const app = express();
// Init http server - require for socket
const server = http.createServer(app);
// Init socket
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat bot';

// Run when client connet
io.on('connection', (socket) => {
  console.log('New WebSocket Connections');
  socket.on('joinRoom', ({ username, room }) => {
    const user = joinUser(socket.id, username, room);
    // Join Room
    socket.join(user.room);
    // Emit once for single NEW user who joined into room
    socket.emit(
      'message',
      formatMessage(botName, `Welcome to Chat ${user.username}!`)
    );
    // Emit for all expect emiiting socket
    socket.broadcast
      .to(room)
      .emit(
        'message',
        formatMessage(botName, `A ${user.username} has joined to the chat`)
      );
    // Emit for all Info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen on chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    // Emit for all
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );
      console.log(`${user.username} disconnected`);
      // Emit for all Info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`App listen on port ${PORT}`));
