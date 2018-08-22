$(function () {
  var host = window.location.hostname
  //make connection
  var socket = io.connect('http://' + host + ':3000')

  //buttons and inputs
  var message = $("#message")
  var username = $("#username")
  var send_message = $("#send_message")
  var send_username = $("#send_username")
  var chatroom = $("#chatroom")
  var feedback = $("#feedback")
  var serverAddress = $('#server_address')
  var serverButton = $('#send_server')
  var chatRoomNative = document.getElementById('chatroom')
  serverAddress.val(host)

  const scrollToBottom = function () {
    chatRoomNative.scrollTop = chatRoomNative.scrollHeight
  }

  let initSocket = function () {
//Listen on new_message
    socket.on("new_message", (data) => {
      feedback.html('')
      chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
      const shouldScroll = chatRoomNative.scrollTop + chatRoomNative.clientHeight === chatRoomNative.scrollHeight
      if (!shouldScroll) {
        scrollToBottom()
      }
    })

    //Listen on new_message
    socket.on("changed_username", (data) => {
      chatroom.append("<p class='system'>" + data.old + " is now " + data.new + "</p>")
    })

    //Listen on new_message
    socket.on("connected_user", (data) => {
      chatroom.append("<p class='system'>" + data.username + " connected to the room" + "</p>")
    })
  }

  let newConnection = function () {
    socket.disconnect()
    socket = io.connect('http://' + serverAddress.val() + ':3000')
    initSocket()
    chatroom.append("<p class='system'>Server address changed to " + serverAddress.val() + "</p>")
  }

  //Send message to the server
  let sendMessage = function () {
    const messageTxt = message.val()
    if (messageTxt.startsWith('/')) {
      socket.emit('new_command', {message: messageTxt})
    } else {
      socket.emit('new_message', {message: messageTxt})
    }
    message.val('')
  }
//Init the socket data
  initSocket()

  serverAddress.keyup(function (event) {
    // Cancel the default action, if needed
    event.preventDefault()
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      newConnection()
    }
  })

  //Change the serverAddress
  serverButton.click(function () {
    newConnection()
  })

// Execute a function when the user releases a key on the keyboard
  message.keyup(function (event) {
    // Cancel the default action, if needed
    event.preventDefault()
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      sendMessage()
    }
  })

  // Execute a function when the user releases a key on the keyboard
  username.keyup(function (event) {
    // Cancel the default action, if needed
    event.preventDefault()
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      socket.emit('change_username', {username: username.val()})
    }
  })


//Emit message
  send_message.click(function () {
    sendMessage()
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


