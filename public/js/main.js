const chatForm = document.getElementById('chat-form');

// Init connect
const socket = io();

// Message from server
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
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class='meta'>Igor<span>10:00</span></p class='text'>${message}<p></p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
