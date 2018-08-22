const express = require('express')
const app = express()


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
  res.render('index')
})

//Listen on port 3000
server = app.listen(3000)


//socket.io instantiation
const io = require("socket.io")(server)


//listen on every connection
io.on('connection', (socket) => {
  console.log('New user connected')

  //default username
  socket.username = "Anonymous"

  io.sockets.emit('connected_user', {username: socket.username})

  //listen on change_username
  socket.on('change_username', (data) => {
    let username = socket.username
    socket.username = data.username
    io.sockets.emit('changed_username', {old: username, new: data.username})
  })

  //listen on new_message
  socket.on('new_message', (data) => {
    //broadcast the new message
    io.sockets.emit('new_message', {message: data.message, username: socket.username})
  })

  //listen on typing
  socket.on('typing', (data) => {
    io.sockets.emit('typing', {username: socket.username})
  })
})
