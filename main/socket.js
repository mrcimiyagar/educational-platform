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
          });
          models.Membership.findAll({
            raw: true,
            where: { roomId: roomId },
          }).then(async (memberships) => {
            models.User.findAll({
              raw: true,
              where: { id: memberships.map((mem) => mem.userId) },
            }).then(async (users) => {
              require('./server').pushTo('room_' + roomId, 'user-exited', {
                rooms: rooms,
                users: getRoomUsers(roomId),
                allUsers: users,
              })
            })
          })
        },
      )
    }
  })
}

let metadata = {}
let userToSocketMap = {}
let typing = {};

let typingEvent = (user, soc) => {
  soc.on('chat-typing', () => {
    if (typing[metadata[user.id].roomId] === undefined) {
      typing[metadata[user.id].roomId] = {users: {}};
    }
    if (typing[metadata[user.id].roomId].users === undefined) {
      typing[metadata[user.id].roomId].users = {};
    }
      if (user.id in typing[metadata[user.id].roomId]) {
        clearTimeout(typing[metadata[user.id].roomId].users[user.id].timeout)
      }
      typing[metadata[user.id].roomId].users[user.id] = {
        timeout: setTimeout(() => {
          delete typing[metadata[user.id].roomId].users[user.id]
          let typingList = []
          for (let uid in typing[metadata[user.id].roomId].users) {
            typingList.push(users[uid]);
          }
          require('./server').pushTo(
            'room_' + metadata[user.id].roomId,
            'chat-typing',
            typingList,
          )
        }, 2000),
        socket: soc,
        user: user
      };
      let typingList = [];
      for (let uid in typing[metadata[user.id].roomId].users) {
        typingList.push(users[uid]);
      }
      require('./server').pushTo(
        'room_' + metadata[user.id].roomId,
        'chat-typing',
        typingList,
      )
  });
};

module.exports = {
  userToSocketMap: userToSocketMap,
  metadata: metadata,
  sockets: sockets,
  notifs: notifs,
  netState: netState,
  setup: (server) => {
    const io = require('socket.io')(server, { cors: { origin: '*' } })
    io.on('connection', (soc) => {
      console.log('a user connected')
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
                    userToSocketMap[user.id] = soc
                    metadata[user.id] = { socket: soc, user: user }
                    netState[user.id] = true
                    sockets[user.id] = soc
                    soc.on('disconnect', ({}) => {
                      disconnectWebsocket(user)
                    });
                    metadata[user.id].timer = setTimeout(() => {
                      disconnectWebsocket(user);
                      soc.disconnect();
                    }, 6000);
                    soc.on('ping', () => {
                      if (metadata[user.id].timer !== undefined) {
                        clearTimeout(metadata[user.id].timer);
                      }
                      metadata[user.id].timer = setTimeout(() => {
                        disconnectWebsocket(user);
                        soc.disconnect();
                      }, 3000);
                    });
                    typingEvent(user, soc);
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
                  userToSocketMap[user.id] = soc
                  metadata[user.id] = { socket: soc, user: user }
                  netState[user.id] = true
                  sockets[user.id] = soc
                  soc.on('disconnect', ({}) => {
                    disconnectWebsocket(user)
                  });
                  metadata[user.id].timer = setTimeout(() => {
                    disconnectWebsocket(user);
                    soc.disconnect();
                  }, 6000);
                  soc.on('ping', () => {
                    if (metadata[user.id].timer !== undefined) {
                      clearTimeout(metadata[user.id].timer);
                    }
                    metadata[user.id].timer = setTimeout(() => {
                      disconnectWebsocket(user);
                      soc.disconnect();
                    }, 3000);
                  });
                  typingEvent(user, soc);
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
