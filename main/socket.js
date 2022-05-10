const models = require("./db/models");
const users = require("./users");
const { removeUser, getRoomUsers, getGuestUser, addUser } = require("./users");

let sockets = {};
let pauseds = {};
let notifs = {};
let netState = {};

let disconnectWebsocket = (user) => {
  if (metadata[user.id] === undefined) return;
  metadata[user.id].socket.forEach(conObj => {
    let roomId = conObj.roomId;
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
            models.Membership.findAll({
              raw: true,
              where: { roomId: roomId },
            }).then(async (memberships) => {
              models.User.findAll({
                raw: true,
                where: { id: memberships.map((mem) => mem.userId) },
              }).then(async (users) => {
                require("./server").pushTo("room_" + roomId, "user-exited", {
                  rooms: rooms,
                  pauseds: [],
                  users: getRoomUsers(roomId),
                  allUsers: users,
                });
              });
            });
          }
        );
      }
    });
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
      getRoomUsers(key).forEach((u) => {
        require("./server").signlePushTo(
          u.id,
          "chat-typing",
          Object.keys(roomTypings),
          true
        );
      });
    }
  }
}, 250);

let socketRooms = {};

module.exports = {
  socketRooms: socketRooms,
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
                    if (metadata[user.id] === undefined) {
                      metadata[user.id] = { socket: soc, user: user, timer: undefined };
                    }
                    netState[user.id] = true;
                    sockets[user.id] = soc;
                    soc.on("disconnect", ({}) => {
                      disconnectWebsocket(user);
                    });
                    metadata[user.id].timer = setTimeout(() => {
                      disconnectWebsocket(soc);
                    }, 6000);
                    soc.on("ping", () => {
                      if (socketRooms[user.id] === undefined) {
                        socketRooms[user.id] = [];
                      }
                      socketRooms[user.id].forEach(rId => {
                        soc.join("room_" + rId);
                        addUser(rId, user);
                      });
                      if (metadata[user.id].timer !== undefined) {
                        clearTimeout(metadata[user.id].timer);
                      }
                      metadata[user.id].timer = setTimeout(() => {
                        disconnectWebsocket(soc);
                      }, 3000);
                    });
                    typingEvent(user, soc);
                    soc.emit("auth-success", {});
                  }
                }
              } else {
                let user = await models.User.findOne({
                  where: { id: session.userId },
                });
                if (user !== null) {
                  userToSocketMap[user.id] = soc;
                  if (metadata[user.id] === undefined) {
                    metadata[user.id] = { socket: soc, user: user, timer: undefined };
                  }
                  netState[user.id] = true;
                  sockets[user.id] = soc;
                  soc.on("disconnect", ({}) => {
                    disconnectWebsocket(user);
                  });
                  metadata[user.id].timer = setTimeout(() => {
                    disconnectWebsocket(soc);
                  }, 6000);
                  soc.on("ping", () => {
                    if (socketRooms[user.id] === undefined) {
                      socketRooms[user.id] = [];
                    }
                    socketRooms[user.id].forEach(rId => {
                      soc.join("room_" + rId);
                      addUser(rId, user);
                    });
                    if (metadata[user.id].timer !== undefined) {
                      clearTimeout(metadata[user.id].timer);
                    }
                    metadata[user.id].timer = setTimeout(() => {
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
                let bot = await models.Bot.findOne({
                  where: { id: session.userId },
                });
                if (bot !== null) {
                  userToSocketMap[bot.id] = soc;
                  if (metadata[bot.id] === undefined) {
                    metadata[bot.id] = { socket: soc, user: bot, timer: undefined };
                  }
                  netState[bot.id] = true;
                  sockets[bot.id] = soc;
                  soc.on("disconnect", ({}) => {
                    disconnectWebsocket(bot);
                  });
                  metadata[bot.id].timer = setTimeout(() => {
                    disconnectWebsocket(soc);
                  }, 6000);
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
