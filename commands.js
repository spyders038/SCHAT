const manageCommands = function (socket, command) {
  socket.emit('new_message',  {message: 'Command received ' + command.message, username: command.username})
}

module.exports = manageCommands