const models = require("./db/models");
const users = require("./users");
const { removeUser, getRoomUsers, getGuestUser, addUser } = require("./users");

let sockets = {};
let pauseds = {};
let notifs = {};
let netState = {};

let disconnectWebsocket = (user) => {
  if (metadata[user.id] === undefined) return;
  let roomId = metadata[user.id].roomId;
  if (pauseds[roomId] === undefined) pauseds[roomId] = {};
  netState[user.id] = false;
  models.Room.findOne({ where: { id: roomId } }).then((room) => {
    removeUser(roomId, user.id);
    if (room !== null) {
      models.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
        async (rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i];
            removeUser(room.id, user.id);
            room.users = getRoomUsers(room.id);
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
              require("./server").pushTo("room_" + roomId, "user-exited", {
                rooms: rooms,
                pauseds: Object.values(pauseds[roomId]).map((v) => v.user),
                users: getRoomUsers(roomId),
                allUsers: users,
              });
            });
          });
        }
      );
    }
  });
};

let metadata = {};
let userToSocketMap = {};
let typing = {};

let checkTypingUndefinedStructures = (user) => {
  if (metadata[user.id] === undefined) {
    metadata[user.id] = {};
  }
  if (metadata[user.id].roomId === undefined) {
    metadata[user.id].roomId = 0;
  }
  if (typing[metadata[user.id].roomId] === undefined) {
    typing[metadata[user.id].roomId] = {};
  }
};

let typingEvent = (user, soc) => {
  soc.on("chat-typing", () => {
    checkTypingUndefinedStructures(user);
    if (typing[metadata[user.id].roomId][user.id] !== undefined) {
      clearTimeout(typing[metadata[user.id].roomId][user.id]);
      delete typing[metadata[user.id].roomId][user.id];
    }
    typing[metadata[user.id].roomId][user.id] = setTimeout(() => {
      checkTypingUndefinedStructures(user);
      delete typing[metadata[user.id].roomId][user.id];
    }, 1000);
  });
};

setInterval(() => {
  for (let key in typing) {
    if (typing[key] !== undefined && typing[key] !== null) {
      let roomTypings = typing[key];
      getRoomUsers(key).forEach(u => {
        let typingUsersForIndividual = {};
        for (let userId in roomTypings) {
          if (userId !== u.id) {
            typingUsersForIndividual[userId] = true;
          }
        }
        require("./server").signlePushTo(
          u.id,
          "chat-typing",
          Object.keys(typingUsersForIndividual),
          true
        );
      });      
    }
  }
}, 250);

module.exports = {
  pauseds: pauseds,
  userToSocketMap: userToSocketMap,
  metadata: metadata,
  sockets: sockets,
  notifs: notifs,
  netState: netState,
  setup: (server) => {
    const io = require("socket.io")(server, {
      cors: { origin: "*" },
      secure: true,
    });
    io.on("connection", (soc) => {
      console.log("a user/bot connected");
      soc.on("auth", ({ token }) => {
        console.log("authenticating client...");
        try {
          models.Session.findOne({ where: { token: token } }).then(
            async function (session) {
              if (session === null) {
                let acc = getGuestUser(token);
                if (acc !== null) {
                  let user = acc.user;
                  if (user !== null) {
                    userToSocketMap[user.id] = soc;
                    metadata[user.id] = { socket: soc, user: user };
                    netState[user.id] = true;
                    sockets[user.id] = soc;
                    soc.on("disconnect", ({}) => {
                      disconnectWebsocket(user);
                    });
                    metadata[user.id].timer = setTimeout(() => {
                      if (pauseds[metadata[user.id].roomId] === undefined)
                        pauseds[metadata[user.id].roomId] = {};
                      pauseds[metadata[user.id].roomId][user.id] = {
                        soc,
                        user,
                      };
                      disconnectWebsocket(soc);
                    }, 6000);
                    soc.on("ping", () => {
                      if (pauseds[metadata[user.id].roomId] === undefined)
                        pauseds[metadata[user.id].roomId] = {};
                      if (metadata[user.id].roomId !== undefined) {
                        soc.join("room_" + metadata[user.id].roomId);
                        addUser(metadata[user.id].roomId, user);
                        delete pauseds[metadata[user.id].roomId][user.id];
                      }
                      if (metadata[user.id].timer !== undefined) {
                        clearTimeout(metadata[user.id].timer);
                      }
                      metadata[user.id].timer = setTimeout(() => {
                        if (pauseds[metadata[user.id].roomId] === undefined)
                          pauseds[metadata[user.id].roomId] = {};
                        pauseds[metadata[user.id].roomId][user.id] = {
                          soc,
                          user,
                        };
                        disconnectWebsocket(soc);
                      }, 3000);
                    });
                    typingEvent(user, soc);
                    soc.emit("auth-success", {});
                  }
                }
              } else {
                session.socketId = soc.id;
                await session.save();
                let user = await models.User.findOne({
                  where: { id: session.userId },
                });
                if (user !== null) {
                  userToSocketMap[user.id] = soc;
                  metadata[user.id] = { socket: soc, user: user };
                  netState[user.id] = true;
                  sockets[user.id] = soc;
                  soc.on("disconnect", ({}) => {
                    disconnectWebsocket(user);
                  });
                  metadata[user.id].timer = setTimeout(() => {
                    if (pauseds[metadata[user.id].roomId] === undefined)
                      pauseds[metadata[user.id].roomId] = {};
                    pauseds[metadata[user.id].roomId][user.id] = { soc, user };
                    disconnectWebsocket(soc);
                  }, 6000);
                  soc.on("ping", () => {
                    if (pauseds[metadata[user.id].roomId] === undefined)
                      pauseds[metadata[user.id].roomId] = {};
                    if (metadata[user.id].roomId !== undefined) {
                      soc.join("room_" + metadata[user.id].roomId);
                      addUser(metadata[user.id].roomId, user);
                    }
                    if (metadata[user.id].timer !== undefined) {
                      clearTimeout(metadata[user.id].timer);
                    }
                    metadata[user.id].timer = setTimeout(() => {
                      if (pauseds[metadata[user.id].roomId] === undefined)
                        pauseds[metadata[user.id].roomId] = {};
                      pauseds[metadata[user.id].roomId][user.id] = {
                        soc,
                        user,
                      };
                      disconnectWebsocket(soc);
                    }, 3000);
                  });
                  typingEvent(user, soc);
                  soc.emit("auth-success", {});
                }
              }
            }
          );
        } catch (ex) {
          console.error(ex);
        }
      });
      soc.on("auth-bot", ({ token }) => {
        console.log("authenticating client...");
        try {
          models.Session.findOne({ where: { token: token } }).then(
            async function (session) {
              if (session !== null) {
                session.socketId = soc.id;
                await session.save();
                let bot = await models.Bot.findOne({
                  where: { id: session.userId },
                });
                if (bot !== null) {
                  userToSocketMap[bot.id] = soc;
                  metadata[bot.id] = { socket: soc, user: bot };
                  netState[bot.id] = true;
                  sockets[bot.id] = soc;
                  soc.on("disconnect", ({}) => {
                    disconnectWebsocket(bot);
                  });
                  soc.on("ping", () => {
                    if (metadata[bot.id].timer !== undefined) {
                      clearTimeout(metadata[bot.id].timer);
                    }
                    metadata[bot.id].timer = setTimeout(() => {
                      disconnectWebsocket(soc);
                    }, 3000);
                  });
                  soc.emit("auth-success", {});
                }
              }
            }
          );
        } catch (ex) {
          console.error(ex);
        }
      });
    });
    return io;
  },
};
