const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage } = require('./.utils/messages.js')

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
    // send an event (server -> all clients): origin is the server
    socket.emit('message', generateMessage('Welcome!'))
    // all clients receives this except the emitting client
    socket.broadcast.emit('message', generateMessage('A new user has joined'))

    // join room
/*
    socket.on('join', ({ username, room }) => {
        socket.join(room)
    })
*/
    // send an event (server -> all clients) when receiving event (client -> server)
    // : origin is from one client
    socket.on('send', (message, callback) => {
        io.emit('message', generateMessage(message))
        callback('delivered!') // without this (event acknowledgement), callback function don't work
    })

    // send to all clients except emitting one when disconnection
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user disconnected.'))
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