$(function () {
  //make connection
  var socket = io.connect('http://localhost:3000')

  //buttons and inputs
  var message = $("#message")
  var username = $("#username")
  var send_message = $("#send_message")
  var send_username = $("#send_username")
  var chatroom = $("#chatroom")
  var feedback = $("#feedback")

  //Emit message
  send_message.click(function () {
    socket.emit('new_message', {message: message.val()})
  })


// Execute a function when the user releases a key on the keyboard
  message.keyup(function(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      socket.emit('new_message', {message: message.val()})
    }
  });

  // Execute a function when the user releases a key on the keyboard
  username.keyup(function(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      socket.emit('change_username', {username: username.val()})
    }
  });

  //Listen on new_message
  socket.on("new_message", (data) => {
    feedback.html('')
    message.val('')
    chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
  })

  //Listen on new_message
  socket.on("changed_username", (data) => {
    chatroom.append("<p class='system'>" + data.old + " is now " + data.new + "</p>")
  })

  //Listen on new_message
  socket.on("connected_user", (data) => {
    chatroom.append("<p class='system'>" + data.username + " connected to the room" + "</p>")
  })

  //Emit a username
  send_username.click(function () {
    socket.emit('change_username', {username: username.val()})
  })

  //Emit typing
  message.bind("keypress", () => {
    socket.emit('typing')
  })

  //Listen on typing
  socket.on('typing', (data) => {
    feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
  })
})


