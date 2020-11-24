const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connet
io.on('connection', (socket) => {
  console.log('New WebSocket Connections');
  // Emit once for single NEW user who connect
  socket.emit('message', 'Welcome to Chat!');
  // Emit for all expect emiiting socket
  socket.broadcast.emit('message', 'A user has joined to the chat');
  // Runs when client disconnects
  socket.on('disconnect', () => {
    // Emit for all
    io.emit('message', 'A user has left the chat');
    console.log('User disconnected');
  });
  // Listen on chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`App listen on port ${PORT}`));
