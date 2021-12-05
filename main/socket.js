const models = require('./db/models')
const users = require('./users')
const { removeUser, getRoomUsers, getGuestUser, addUser } = require('./users')

let sockets = {}
let notifs = {}
let netState = {}

let disconnectWebsocket = (socket) => {
  netState[userId] = false
  let roomId = sockets[userId].roomId
  sockets[userId] = undefined
  models.Room.findOne({ where: { id: roomId } }).then((room) => {
    removeUser(roomId, userId)
    if (room !== null) {
      models.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
        async (rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            removeUser(room.id, userId)
            room.users = getRoomUsers(room.id)
          }
          let mem = await models.Membership.findOne({
            where: { roomId: room.id, userId: userId },
          })
          require('./server').pushTo(
            'room_' + roomId,
            'user-exited',
            { rooms: rooms, users: getRoomUsers(roomId) },
          )
        },
      )
    }
  })
}

let that = {
  users: {},
}

module.exports = {
  sockets: sockets,
  notifs: notifs,
  setup: (server) => {
    const io = require('socket.io')(server, { cors: { origin: '*' } })
    io.on('connection', (soc) => {
      console.log('a user connected')
      soc.on('user-reconnected', () => {
        let user = users[soc.roomId][soc.userId];
        addUser(soc.roomId, user);
        netState[soc.userId] = true;
        sockets[soc.userId] = soc;
        that.users[soc.id] = soc;
        let nots = notifs[soc.userId];
        if (nots !== undefined) {
          notifs[soc.userId] = [];
          nots.forEach((notObj) => {
            soc.emit(notObj.key, notObj.data);
          });
        }
      });
      soc.on('chat-typing', () => {
        if (soc.room !== null && soc.room !== undefined) {
          if (soc.userId in soc.room.typing) {
            clearTimeout(soc.room.typing[soc.userId].timeout)
          }
          soc.room.typing[soc.userId] = {
            timeout: setTimeout(() => {
              delete soc.room.typing[soc.userId]
              let typingList = []
              for (let t in soc.room.typing) {
                typingList.push(users[soc.roomId][soc.room.typing[t].socket.userId])
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
                    netState[user.id] = true
                    soc.user = user
                    soc.emit('hello', {user: soc.user});
                    soc.userId = user.id
                    sockets[user.id] = soc
                    that.users[soc.id] = soc
                    soc.on('disconnect', ({}) => {
                      disconnectWebsocket(soc.userId)
                    })
                    soc.emit('auth-success', {})
                    let nots = notifs[soc.userId]
                    if (nots !== undefined) {
                      notifs[soc.user | Id] = []
                      nots.forEach((notObj) => {
                        soc.emit(notObj.key, notObj.data)
                      })
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
                  netState[user.id] = true
                  soc.user = user
                  soc.emit('hello', {user: soc.user});
                  soc.userId = user.id
                  sockets[user.id] = soc
                  that.users[soc.id] = soc
                  soc.on('disconnect', ({}) => {
                    disconnectWebsocket(soc.userId)
                  })
                  soc.emit('auth-success', {})
                  let nots = notifs[soc.userId]
                  if (nots !== undefined) {
                    notifs[soc.user | Id] = []
                    nots.forEach((notObj) => {
                      soc.emit(notObj.key, notObj.data)
                    })
                  }
                }
              }
            },
          )
        } catch (ex) {
          console.error(ex)
        }
      })
    })
    return io
  },
}
