const models = require('./db/models')
const users = require('./users')
const { removeUser, getRoomUsers, getGuestUser, addUser } = require('./users')

let sockets = {}
let notifs = {}
let netState = {}

let disconnectWebsocket = (socket) => {
  netState[socket.user.id] = false
  let roomId = socket.roomId
  models.Room.findOne({ where: { id: roomId } }).then((room) => {
    removeUser(roomId, socket.user.id)
    if (room !== null) {
      models.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
        async (rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            removeUser(room.id, socket.user.id)
            room.users = getRoomUsers(room.id)
          }
          let mem = await models.Membership.findOne({
            where: { roomId: room.id, userId: socket.user.id },
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
let userToSocketMap = {};

module.exports = {
  userToSocketMap: userToSocketMap,
  metadata: that,
  sockets: sockets,
  notifs: notifs,
  setup: (server) => {
    const io = require('socket.io')(server, { cors: { origin: '*' } })
    io.on('connection', (soc) => {
      console.log('a user connected')
      soc.on('user-reconnected', () => {
        addUser(that.users[soc.id].roomId, that.users[soc.id].user);
        netState[soc.user.id] = true;
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
                    userToSocketMap[user.id] = soc;
                    that.users[soc.id] = {socket: soc, user: user};
                    netState[user.id] = true
                    sockets[user.id] = soc
                    soc.on('disconnect', ({}) => {
                      disconnectWebsocket(soc)
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
                  userToSocketMap[user.id] = soc;
                  that.users[soc.id] = {socket: soc, user: user};
                  netState[user.id] = true
                  sockets[user.id] = soc
                  soc.on('disconnect', ({}) => {
                    disconnectWebsocket(soc)
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
