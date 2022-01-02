const models = require('./db/models')
const users = require('./users')
const { removeUser, getRoomUsers, getGuestUser, addUser } = require('./users')

let sockets = {}
let pauseds = {}
let notifs = {}
let netState = {}

let disconnectWebsocket = (user) => {
  if (metadata[user.id] === undefined) return;
  let roomId = metadata[user.id].roomId
  if (pauseds[roomId] === undefined) pauseds[roomId] = {};
  netState[user.id] = false;
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
              if (pauseds[roomId] === undefined) pauseds[roomId] = {};
              require('./server').pushTo('room_' + roomId, 'user-exited', {
                rooms: rooms,
                pauseds: Object.values(pauseds[roomId]).map(v => v.user),
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
  pauseds: pauseds,
  userToSocketMap: userToSocketMap,
  metadata: metadata,
  sockets: sockets,
  notifs: notifs,
  netState: netState,
  setup: (server) => {
    const io = require('socket.io')(server, { cors: { origin: '*' }, secure: true })
    io.on('connection', (soc) => {
      console.log('a user/bot connected')
      soc.on('auth', ({ token }) => {
        console.log('authenticating client...')
        try {
          models.Session.findOne({ where: { token: token } }).then(
            async function (session) {
              if (session === null) {
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
                      if (pauseds[metadata[user.id].roomId] === undefined) pauseds[metadata[user.id].roomId] = {};
                      pauseds[metadata[user.id].roomId][user.id] = {soc, user};
                      disconnectWebsocket(soc);
                    }, 6000);
                    soc.on('ping', () => {
                      if (pauseds[metadata[user.id].roomId] === undefined) pauseds[metadata[user.id].roomId] = {};
                      if (metadata[user.id].roomId !== undefined) {
                        soc.join('room_' + metadata[user.id].roomId);
                        addUser(metadata[user.id].roomId, user);
                        delete pauseds[metadata[user.id].roomId][user.id];
                      }
                      if (metadata[user.id].timer !== undefined) {
                        clearTimeout(metadata[user.id].timer);
                      }
                      metadata[user.id].timer = setTimeout(() => {
                        if (pauseds[metadata[user.id].roomId] === undefined) pauseds[metadata[user.id].roomId] = {};
                        pauseds[metadata[user.id].roomId][user.id] = {soc, user};
                        disconnectWebsocket(soc);
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
                  raw: true,
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
                    if (pauseds[metadata[user.id].roomId] === undefined) pauseds[metadata[user.id].roomId] = {};
                    pauseds[metadata[user.id].roomId][user.id] = {soc, user};
                    disconnectWebsocket(soc);
                  }, 6000);
                  soc.on('ping', () => {
                    if (pauseds[metadata[user.id].roomId] === undefined) pauseds[metadata[user.id].roomId] = {};
                    if (metadata[user.id].roomId !== undefined) {
                      soc.join('room_' + metadata[user.id].roomId);
                      addUser(metadata[user.id].roomId, user);
                    }
                    if (metadata[user.id].timer !== undefined) {
                      clearTimeout(metadata[user.id].timer);
                    }
                    metadata[user.id].timer = setTimeout(() => {
                      if (pauseds[metadata[user.id].roomId] === undefined) pauseds[metadata[user.id].roomId] = {};
                      pauseds[metadata[user.id].roomId][user.id] = {soc, user};
                      disconnectWebsocket(soc);
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
      soc.on('auth-bot', ({ token }) => {
        console.log('authenticating client...')
        try {
          models.Session.findOne({ where: { token: token } }).then(
            async function (session) {
              if (session !== null) {
                session.socketId = soc.id
                await session.save()
                let bot = await models.Bot.findOne({
                  where: { id: session.userId },
                })
                if (bot !== null) {
                  userToSocketMap[bot.id] = soc
                  metadata[bot.id] = { socket: soc, user: bot }
                  netState[bot.id] = true
                  sockets[bot.id] = soc
                  soc.on('disconnect', ({}) => {
                    disconnectWebsocket(bot)
                  });
                  soc.on('ping', () => {
                    if (metadata[bot.id].timer !== undefined) {
                      clearTimeout(metadata[bot.id].timer);
                    }
                    metadata[user.id].timer = setTimeout(() => {
                      disconnectWebsocket(soc);
                    }, 3000);
                  });
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