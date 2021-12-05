const models = require('./db/models')
const {
  removeUser,
  getRoomUsers,
  getGuestUser,
  addUser,
} = require('./users')

let sockets = {};
let notifs = {};
let netState = {};
let tempDisconnected = {};

let disconnectWebsocket = (userId) => {
  netState[userId] = false;
  let roomId = sockets[userId].roomId
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
            'room_' + sockets[userId].roomId,
            'user-exited',
            { rooms: rooms, users: getRoomUsers(roomId) },
          )
          tempDisconnected[userId] = sockets[userId];
          sockets[userId] = undefined;
        },
      )
    }
  })
}

let that = {
  users: {}
}

module.exports = {
  sockets: sockets,
  notifs: notifs,
  setup: (server) => {
    const io = require("socket.io")(server, { cors: { origin: '*' } });
    io.on('connection', (soc) => {
      console.log('a user connected');
      soc.on('user-reconnected', () => {
        let s = tempDisconnected[soc.user.id];
        addUser(s.roomId, soc.user);
        netState[soc.user.id] = true;
        sockets[soc.user.id] = s;
        that.users[soc.id] = soc
        let nots = notifs[soc.user.id];
        if (nots !== undefined) {
          notifs[soc.user.id] = [];
          nots.forEach(notObj => {
            soc.emit(notObj.key, notObj.data);
          });
        }
      });
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
                    netState[user.id] = true;
                    soc.user = user
                    sockets[user.id] = soc
                    that.users[soc.id] = soc
                    soc.on('disconnect', ({}) => {
                      disconnectWebsocket(user.id)
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
                  netState[user.id] = true;
                  soc.user = user
                  sockets[user.id] = soc
                  that.users[soc.id] = soc

                  soc.on('disconnect', ({}) => {
                    disconnectWebsocket(user.id)
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
    });
    return io;
  },
}
