const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Qs = require('query-string')
const { generateMessage } = require('./.utils/messages.js')
const { addUser, removeUser, getUser, getUsersInRoom } = require("./.utils/users.js")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

/* ------------------- Add event listener : counter ------------------- */
    /*
let count = 0
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // send an event
    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        io.emit('countUpdated', count)
    })
})
    */
/* ------------------- End event listener : counter ------------------- */

/* ------------------- Add event listener : Welcome ! ------------------- */

io.on('connection', (socket) => {
    console.log('New Websocket connection.')

/*
    socket.emit('message', generateMessage('Welcome!')) // send an event (server -> all clients): origin is the server
    socket.broadcast.emit('message', generateMessage('A new user has joined')) // all clients receives this except the emitting client
*/
    // join room

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room})

        if (error) {
            console.log(error)
            return callback(error)
        }

        socket.join(user.room)
        // console.log(user.username, 'has joined room', '"', room, '"')
        socket.emit('message', generateMessage('Welcome, ' + username + "!")) // server to this client only
        socket.broadcast.to(user.room).emit('message', generateMessage(username + ' has joined')) // this client to all other clients
        callback() // no error
    })

    socket.on('send', (message, callback) => {
        const thisClient = getUser(socket.id)
        io.to(thisClient.room).emit('message', generateMessage(message))
        callback('delivered!') // without this (event acknowledgement), callback function don't work
    })

    // send to all clients except emitting one when disconnection
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user)
            io.to(user.room).emit('message', generateMessage(user.username + ' disconnected.'))
    })

})
/* ------------------- End event listener : Welcome ! ------------------- */

/* ------------------- Add event listener : Support user messages ------------------- */
/* ------------------- End event listener : Support user messages ------------------- */

app.get('/', (req, res) => {
    res.send('Chat App')
})

server.listen(port, () => {
    console.log('Server is up on port ', port)
})


/* -------------------------- Commands -------------------------- */
// npm run start