const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL and parse via QS liblary
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Init connect
const socket = io();

// Send chat room and username after handshake
socket.emit('joinRoom', { username, room });

// Listening for users and room
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// Listening for message from server
socket.on('message', (message) => outputMessage(message));

// Handle submit form
chatForm.addEventListener('submit', (e) => {
  // Blokowanie przeładowania
  e.preventDefault();
  // Get message text
  const msg = e.target.elements.msg.value;
  // Emit message to server
  socket.emit('chatMessage', msg);
});

// Output message to DOM
function outputMessage({ username, time, text }) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class='meta'>${username} <span>${time}</span></p class='text'>${text}<p></p>`;
  document.querySelector('.chat-messages').appendChild(div);
  // Clear Form
  chatForm.elements.msg.value = '';
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function outputRoomName(room) {
  roomName.innerText = room;
}
// Add users to DOM
function outputRoomUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
