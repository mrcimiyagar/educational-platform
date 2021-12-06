const models = require('./db/models')
const users = require('./users')
const { removeUser, getRoomUsers, getGuestUser, addUser } = require('./users')

let sockets = {}
let notifs = {}
let netState = {}

let disconnectWebsocket = (user) => {
  netState[user.id] = false
  let roomId = metadata[user.id].roomId
  models.Room.findOne({ where: { id: roomId } }).then((room) => {
    removeUser(roomId, user.id)
    if (room !== null) {
      models.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
        async (rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            removeUser(room.id, user.id)
            room.users = getRoomUsers(room.id)
          }
          let mem = await models.Membership.findOne({
            where: { roomId: room.id, userId: user.id },
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

let metadata = {};
let userToSocketMap = {};

module.exports = {
  userToSocketMap: userToSocketMap,
  metadata: metadata,
  sockets: sockets,
  notifs: notifs,
  netState: netState,
  setup: (server) => {
    const io = require('socket.io')(server, { cors: { origin: '*' } })
    io.on('connection', (soc) => {
      console.log('a user connected');
      /*soc.on('chat-typing', () => {
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
      })*/
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
                    metadata[user.id] = {socket: soc, user: user};
                    netState[user.id] = true
                    sockets[user.id] = soc
                    soc.on('disconnect', ({}) => {
                      disconnectWebsocket(user)
                    })
                    let nots = notifs[user.id];
                    if (nots !== undefined) {
                      nots.forEach(notObj => {
                        soc.emit(notObj.key, notObj.data);
                      });
                    }
                    soc.emit('auth-success', {})
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
                  metadata[user.id] = {socket: soc, user: user};
                  netState[user.id] = true
                  sockets[user.id] = soc
                  soc.on('disconnect', ({}) => {
                    disconnectWebsocket(user)
                  })
                  let nots = notifs[user.id];
                  if (nots !== undefined) {
                    nots.forEach(notObj => {
                      soc.emit(notObj.key, notObj.data);
                    });
                  }
                  soc.emit('auth-success', {})
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
