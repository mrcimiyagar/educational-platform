const express = require('express')
const app = express()
const http = require('http')
const AsyncLock = require('async-lock');
const Y = require('yjs');
const Queue = require('bee-queue');
var lock = new AsyncLock();
const queue = new Queue('elements');
let server = http.createServer(app)

app.use(express.static('client-app/build'))

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client-app/build/index.html')
});
        
server.listen(1000)
const io = require('socket.io')(server)

let peers = {}

io.on('connect', (socket) => {
    console.log('a client is connected')

    let user_id = socket.handshake.query.user_id
    let room_id = socket.handshake.query.room_id

    socket.join(room_id)
    socket.roomId = room_id

    if (peers[room_id] === undefined) {
        peers[room_id] = {data: [], state: {}}
    }

    peers[socket.roomId][socket.id] = socket

    socket.on('user-entered', () => {
        socket.emit('init-board', {data: peers[room_id].data, state: peers[room_id].state})
    })

    socket.on('update-board', ({added, updated, state}) => {
        let newDataArr = peers[room_id].data
        if (added !== undefined) {
            added.forEach(el => {
                newDataArr.push(el)
            })
        }
        if (updated !== undefined) {
            updated.forEach(el => {
                for (let i = 0; i < newDataArr.length; i++) {
                    if (el.id === newDataArr[i].id) {
                        newDataArr[i] = el
                    }
                }
            });
        }
        peers[room_id].data = newDataArr
        peers[room_id].state = state
        socket.broadcast.to(room_id).emit('update-board', {added: added, updated: updated, state: peers[room_id].state})
    })
})