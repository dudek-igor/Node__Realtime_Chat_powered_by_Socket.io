// Dumb DB

const users = [];

// Join user to chat ans save to "Db"
function joinUser(id, username, room) {
  const user = {
    id,
    username: username.charAt(0).toUpperCase() + username.slice(1),
    room,
  };
  users.push(user);
  return user;
}

// Get current user
function getUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  joinUser,
  getUser,
  userLeave,
  getRoomUsers,
};
