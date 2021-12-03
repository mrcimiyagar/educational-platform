const models = require('./db/models')
const {
  removeUser,
  getRoomUsers,
  addUser,
  getGuestUser,
  guestAccsByUserId,
} = require('./users')
const WebSocket = require('ws')
const { uuid } = require('uuidv4')
const { Op } = require('sequelize')
const users = require('./users')
const { notifs } = require('./server')

let sockets = {}

class Room {
  constructor(eventsRef, id) {
    this.eventsRef = eventsRef
    this.id = id
    this.members = []
    this.typing = {}
  }
  emit(event, args) {
    let packet = JSON.stringify({ event: event, body: args })
    this.members.forEach((socket) => {
      if (socket.ws.readyState === WebSocket.OPEN) {
        socket.ws.send(packet)
      }
    })
  }
}

class Socket {
  constructor(roomsRef, eventsRef, ws) {
    this.id = uuid()
    this.roomsRef = roomsRef
    this.eventsRef = eventsRef
    this.events = {}
    this.ws = ws
  }
  join(roomId) {
    if (roomId in this.roomsRef) {
      let joint = false
      for (let i = 0; i < this.roomsRef[roomId].members.length; i++) {
        if (this.roomsRef[roomId].members[i].id === this.id) {
          joint = true
          break
        }
      }
      if (!joint) {
        this.roomsRef[roomId].members.push(this)
        this.room = this.roomsRef[roomId]
      }
    } else {
      let room = new Room(this.eventsRef, roomId)
      room.members.push(this)
      this.roomsRef[roomId] = room
      this.room = room
    }
    this.roomId = roomId
  }
  leave() {
    if (this.roomId !== undefined && this.roomId > 0) {
      for (let i = 0; i < this.room.members.length; i++) {
        if (this.room.members[i].id === this.id) {
          this.room.members.splice(i, 1)
          break
        }
      }
      if (this.room.members === 0) {
        delete this.roomsRef[this.roomId]
      }
      this.roomId = 0
      this.room = null
    }
  }
  off(event) {
    if (event in this.events) {
      delete this.events[event]
    }
  }
  on(event, func) {
    if (event in this.events) {
      delete this.events[event]
    }
    this.events[event] = func
  }
  emit(event, args) {
    let packet = JSON.stringify({ event: event, body: args })
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(packet)
    }
  }
}

function noop() {}

function heartbeat() {
  this.isAlive = true
}

let disconnectWebsocket = (session, user) => {
  let roomId = sockets[user.id].roomId
  models.Room.findOne({ where: { id: roomId } }).then((room) => {
    removeUser(roomId, user.id)
    if (room !== null) {
      models.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
        async (rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            removeUser(room.id, user.id)
            delete kasperioInstance.users[session === null ? user.id : session.userId];
            room.users = getRoomUsers(room.id)
          }
          let mem = await models.Membership.findOne({
            where: { roomId: room.id, userId: session === null ? user.id : session.userId },
          })
          require('./server').pushTo(
            'room_' + sockets[user.id].roomId,
            'user-exited',
            { rooms: rooms, users: getRoomUsers(roomId) },
          )
        },
      )
    }
  })
}

class Kasperio {
  constructor(server) {
    this.events = {}
    this.rooms = {}
    this.users = {}
    const wss = new WebSocket.Server({ server })
    const interval = setInterval(function ping() {
      wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate()
        ws.isAlive = false
        ws.ping(noop)
      })
    }, 5000)
    wss.on('close', function close() {
      clearInterval(interval)
    })
    wss.on('connection', (ws) => {
      ws.isAlive = true
      ws.on('pong', heartbeat)
      try {
        let soc = new Socket(this.rooms, this.events, ws)
        console.log('new client connected.')
        soc.on('chat-typing', () => {
          if (soc.room !== null && soc.room !== undefined) {
            if (soc.user.id in soc.room.typing) {
              clearTimeout(soc.room.typing[soc.user.id].timeout)
            }
            soc.room.typing[soc.user.id] = {
              timeout: setTimeout(() => {
                delete soc.room.typing[soc.user.id]
                let typingList = []
                for (let t in soc.room.typing) {
                  typingList.push(soc.room.typing[t].socket.user)
                }
                require('./server').pushTo(
                  'room_' + soc.roomId,
                  'chat-typing',
                  typingList,
                )
              }, 2000),
              socket: soc,
            }
            let typingList = []
            for (let t in soc.room.typing) {
              typingList.push(soc.room.typing[t].socket.user)
            }
            require('./server').pushTo(
              'room_' + soc.roomId,
              'chat-typing',
              typingList,
            )
          }
        })
        this.users[soc.id] = soc
        let that = this
        soc.on('auth', ({ token }) => {
          console.log('authenticating client...')
          try {
            models.Session.findOne({ where: { token: token } }).then(
              async function (session) {
                if (session == null) {
                  let acc = getGuestUser(token)
                  if (acc !== null) {
                    let user = acc.user
                    if (user !== null) {
                      if (
                        sockets[user.id] !== undefined &&
                        sockets[user.id] !== null
                      ) {
                        sockets[user.id].ws = soc.ws
                        sockets[user.id].id = soc.id
                        soc = sockets[user.id]
                        that.users[soc.id] = soc
                      } else {
                        soc.user = user
                        sockets[user.id] = soc
                      }
                      ws.on('close', ({}) => {
                        disconnectWebsocket(session, user)
                      })
                      soc.emit('auth-success', {})
                      let nots = notifs[user.id];
                      notifs[user.id] = [];
                      nots.forEach(notObj => {
                        soc.emit(notObj.key, notObj.data);
                      });
                    }
                  }
                } else {
                  session.socketId = soc.id
                  await session.save()
                  let user = await models.User.findOne({
                    where: { id: session.userId },
                  })
                  if (user !== null) {
                    if (
                      sockets[user.id] !== undefined &&
                      sockets[user.id] !== null
                    ) {
                      sockets[user.id].ws = soc.ws
                      sockets[user.id].id = soc.id
                      soc = sockets[user.id]
                      that.users[soc.id] = soc
                    } else {
                      soc.user = user
                      sockets[user.id] = soc
                    }
                    ws.on('close', ({}) => {
                      disconnectWebsocket(session, user)
                    })
                    soc.emit('auth-success', {})
                    let nots = notifs[user.id];
                    notifs[user.id] = [];
                    nots.forEach(notObj => {
                      soc.emit(notObj.key, notObj.data);
                    });
                  }
                }
              },
            )
          } catch (ex) {
            console.error(ex)
          }
        })
        ws.on('message', (data) => {
          console.log(data.substr(0, 20))
          try {
            let packet = JSON.parse(data)
            if (packet.event in soc.events) {
              soc.events[packet.event](packet.body)
            }
          } catch (ex) {
            console.error(ex)
          }
        })
      } catch (ex) {
        console.error(ex)
      }
    })
  }
  off(event) {
    if (event in this.events) {
      delete this.events[event]
    }
  }
  on(event, func) {
    if (event in this.events) {
      delete this.events[event]
    }
    this.events[event] = func
  }
  to(nodeId) {
    if (nodeId in this.users) {
      return {type: 'user', node: this.users[nodeId]};
    }
    return {type: 'room', node: this.rooms[nodeId]};
  }
}

module.exports = {
  setup: (server) => {
    return new Kasperio(server)
  },
  sockets: sockets,
}
