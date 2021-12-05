const models = require('./db/models')
const users = require('./users')
const { removeUser, getRoomUsers, getGuestUser, addUser } = require('./users')

let sockets = {}
let notifs = {}
let netState = {}

let disconnectWebsocket = (socket) => {
  netState[metadata[socket.id].user.id] = false
  let roomId = metadata[socket.id].roomId
  models.Room.findOne({ where: { id: roomId } }).then((room) => {
    removeUser(roomId, metadata[socket.id].user.id)
    if (room !== null) {
      models.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
        async (rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            removeUser(room.id, metadata[socket.id].user.id)
            room.users = getRoomUsers(room.id)
          }
          let mem = await models.Membership.findOne({
            where: { roomId: room.id, userId: metadata[socket.id].user.id },
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
  setup: (server) => {
    const io = require('socket.io')(server, { cors: { origin: '*' } })
    io.on('connection', (soc) => {
      console.log('a user connected')
      soc.on('user-reconnected', () => {
        var util = require('util');
        console.log(util.inspect(metadata));
        console.log(soc.id);
        addUser(metadata[soc.id].roomId, metadata[soc.id].user);
        netState[metadata[soc.id].user.id] = true;
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
                    metadata[soc.id] = {socket: soc, user: user};
                    netState[user.id] = true
                    sockets[user.id] = soc
                    soc.on('disconnect', ({}) => {
                      disconnectWebsocket(soc)
                    })
                    soc.emit('auth-success', {})
                    let nots = notifs[user.id]
                    if (nots !== undefined) {
                      notifs[user.id] = []
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
                  metadata[soc.id] = {socket: soc, user: user};
                  netState[user.id] = true
                  sockets[user.id] = soc
                  soc.on('disconnect', ({}) => {
                    disconnectWebsocket(soc)
                  })
                  soc.emit('auth-success', {})
                  let nots = notifs[user.id]
                  if (nots !== undefined) {
                    notifs[user.id] = []
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
