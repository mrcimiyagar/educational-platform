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

let sockets = {};
let notifs = {};

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
            sockets[user.id].ws = undefined;
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

let that = {
  users: {}
}

module.exports = {
  setup: (server) => {
    const io = require("socket.io")(server, {
      cors: {
        origin: '*',
      }
    });
    io.on('connection', (soc) => {
      console.log('a user connected');
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
      that.users[soc.id] = soc
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
                    soc.user = user
                    sockets[user.id] = soc
                    that.users[soc.id] = soc
                    ws.on('close', ({}) => {
                      disconnectWebsocket(session, user)
                    })
                    soc.emit('auth-success', {})
                    let nots = notifs[soc.user.id];
                    if (nots !== undefined) {
                      notifs[soc.user.id] = [];
                      nots.forEach(notObj => {
                        soc.emit(notObj.key, notObj.data);
                      });
                    }
                  }
                }
              } else {
                session.socketId = soc.id
                await session.save()
                let user = await models.User.findOne({
                  where: { id: session.userId },
                })
                if (user !== null) {
                  soc.user = user
                  sockets[user.id] = soc
                  that.users[soc.id] = soc

                  ws.on('close', ({}) => {
                    disconnectWebsocket(session, user)
                  })
                  soc.emit('auth-success', {})
                  let nots = notifs[soc.user.id];
                  if (nots !== undefined) {
                    notifs[soc.user.id] = [];
                    nots.forEach(notObj => {
                      soc.emit(notObj.key, notObj.data);
                    });
                  }
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
    });
    return io;
  },
  sockets: sockets,
}
