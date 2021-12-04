const models = require('./db/models')
const {
  removeUser,
  getRoomUsers,
  getGuestUser,
} = require('./users')

let sockets = {};
let notifs = {};
let netState = {};

let disconnectWebsocket = (session, user) => {
  netState[session === null ? user.id : session.userId] = false;
  let roomId = sockets[user.id].roomId
  models.Room.findOne({ where: { id: roomId } }).then((room) => {
    removeUser(roomId, user.id)
    if (room !== null) {
      models.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
        async (rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            removeUser(room.id, user.id)
            //delete sockets[user.id];
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
  notifs: notifs,
  setup: (server) => {
    const io = require("socket.io")(server, {
      cors: {
        origin: '*',
      }
    });
    io.on('connection', (soc) => {
      var emit = soc.emit;
  soc.emit = function() {
    if (soc.user !== null && soc.user !== undefined) {
      if (netState[soc.user.id] === true) {
        emit.apply(soc, arguments);   
      }
      else {
        if (notifs[soc.user.id] === undefined) {
          notifs[soc.user.id] = [];
        }
        notifs[soc.user.id].push()
      }
    }
  };
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
                    netState[user.id] = true;
                    soc.user = user
                    sockets[user.id] = soc
                    that.users[soc.id] = soc
                    soc.on('disconnect', ({}) => {
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
                  netState[user.id] = true;
                  soc.user = user
                  sockets[user.id] = soc
                  that.users[soc.id] = soc

                  soc.on('disconnect', ({}) => {
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
      soc.on('message', (data) => {
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
