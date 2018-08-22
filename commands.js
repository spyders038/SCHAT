const manageCommands = function (bcast, socket, command) {

  if(command.message === '/bold') {
    socket.username = '<b>' + command.username + '</b>'
    bcast.emit('changed_username', {old: command.username, new: socket.username})
  }
  bcast.emit('new_message',  {message: 'Command received ' + command.message, username: socket.username})
}

module.exports = manageCommands