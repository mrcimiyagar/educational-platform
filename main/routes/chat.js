const sw = require("../db/models");
const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("../db/models");
const {
  authenticateMember,
  usersSubscriptions,
  getRoomUsers,
  usersBook,
} = require("../users");
const Sequelize = require("sequelize");
const webpush = require("web-push");
const users = require("../users");

const router = express.Router();
let jsonParser = bodyParser.json();

router.post("/get_participent", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let roomMembers = await sw.Membership.findAll({
      raw: true,
      where: { roomId: membership.roomId },
    });
    let room = await sw.Room.findOne({ where: { id: req.body.roomId } });
    if (roomMembers.length !== 2 || room.chatType !== "p2p") {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "not a p2p chat.",
      });
      return;
    }
    let participent =
      roomMembers[0].userId === membership.userId
        ? await sw.User.findOne({ where: { id: roomMembers[1].userId } })
        : await sw.User.findOne({ where: { id: roomMembers[0].userId } });

    res.send({ status: "success", participent: participent });
  });
});

router.post("/get_chat", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership !== null && membership !== undefined) {
      let room = await sw.Room.findOne({
        raw: true,
        where: { id: membership.roomId },
      });
      if (room.chatType === "p2p") {
        let members = await sw.Membership.findAll({
          raw: true,
          where: { roomId: room.id },
        });
        room.participent =
          members[0].userId === session.userId
            ? await sw.User.findOne({ where: { id: members[1].userId } })
            : await sw.User.findOne({ where: { id: members[0].userId } });
      } else if (room.chatType === "group") {
        room.group = { title: room.title, avatarId: room.avatarId };
      } else if (room.chatType === "channel") {
        room.channel = { title: room.title, avatarId: room.avatarId };
      } else if (room.chatType === "bot") {
      }
      let entries = await sw.Message.findAll({
        raw: true,
        where: { roomId: room.id },
        limit: 100,
        order: [["createdAt", "DESC"]],
      });
      if (entries.length > 0) {
        room.lastMessage = entries[0];
        room.lastMessage.seen = await sw.MessageSeen.count({
          where: { messageId: room.lastMessage.id },
          distinct: true,
          col: "userId",
        });
        let roomMessagesCount = await sw.Message.count({
          where: {
            id: { [Sequelize.Op.gt]: entries[entries.length - 1].id },
            roomId: room.id,
            authorId: { [Sequelize.Op.not]: session.userId },
          },
        });
        let roomReadCount = await sw.MessageSeen.count({
          where: {
            roomId: room.id,
            userId: session.userId,
            messageId: { [Sequelize.Op.gt]: entries[entries.length - 1].id },
          },
          distinct: true,
          col: "messageId",
        });
        room.unread = roomMessagesCount - roomReadCount;
      } else {
        room.lastMessage = { seen: 0 };
        room.unread = 0;
      }
      res.send({ status: "success", room: room });
    } else {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
    }
  });
});

router.post("/get_chats", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    sw.Membership.findAll({ where: { userId: session.userId } }).then(
      async function (memberships) {
        sw.Room.findAll({
          raw: true,
          where: { id: memberships.map((m) => m.roomId) },
        }).then(async function (rooms) {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i];
            if (room.chatType === "p2p") {
              let members = await sw.Membership.findAll({
                raw: true,
                where: { roomId: room.id },
              });
              room.participent =
                members[0].userId === session.userId
                  ? await sw.User.findOne({ where: { id: members[1].userId } })
                  : await sw.User.findOne({ where: { id: members[0].userId } });
            } else if (room.chatType === "group") {
              room.group = { title: room.title, avatarId: room.avatarId };
            } else if (room.chatType === "channel") {
              room.channel = { title: room.title, avatarId: room.avatarId };
            } else if (room.chatType === "bot") {
            }
            let entries = await sw.Message.findAll({
              raw: true,
              where: { roomId: room.id },
              limit: 100,
              order: [["createdAt", "DESC"]],
            });
            if (entries.length > 0) {
              room.lastMessage = entries[0];
              room.lastMessage.seen = await sw.MessageSeen.count({
                where: { messageId: room.lastMessage.id },
                distinct: true,
                col: "userId",
              });
              let roomMessagesCount = await sw.Message.count({
                where: {
                  id: { [Sequelize.Op.gt]: entries[entries.length - 1].id },
                  roomId: room.id,
                  authorId: { [Sequelize.Op.not]: session.userId },
                },
              });
              let roomReadCount = await sw.MessageSeen.count({
                where: {
                  roomId: room.id,
                  userId: session.userId,
                  messageId: {
                    [Sequelize.Op.gt]: entries[entries.length - 1].id,
                  },
                },
                distinct: true,
                col: "messageId",
              });
              room.unread = roomMessagesCount - roomReadCount;
            } else {
              room.lastMessage = { seen: 0 };
              room.unread = 0;
            }
          }
          res.send({ status: "success", rooms: rooms });
        });
      }
    );
  });
});

router.post("/create_message", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canAddMessage) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }

    if (
      (req.body.text === undefined ||
        req.body.text === "" ||
        req.body.text === null) &&
      (req.body.fileId === undefined ||
        req.body.fileId === "" ||
        req.body.fileId === null ||
        req.body.fileId === 0)
    ) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "text can not be empty.",
      });
      return;
    }

    let replyOnMessage = undefined;
    let forwardOnMessage = undefined;

    if (req.body.repliedTo !== undefined) {
      replyOnMessage = await sw.Message.findOne({
        where: { id: req.body.repliedTo, roomId: req.body.roomId },
      });
      if (replyOnMessage === null) {
        res.send({
          status: "error",
          errorCode: "e0005",
          message: "message to reply does not exist.",
        });
        return;
      }
      let aut = await sw.User.findOne({
        where: { id: replyOnMessage.authorId },
      });
      if (aut === null) {
        aut = await sw.Bot.findOne({ where: { id: replyOnMessage.authorId } });
      }
      replyOnMessage = {
        id: replyOnMessage.id,
        authorId: replyOnMessage.authorId,
        time: replyOnMessage.time,
        roomId: replyOnMessage.roomId,
        text: replyOnMessage.text,
        fileId: replyOnMessage.fileId,
        messageType: replyOnMessage.messageType,
        author: aut,
      };
    }
    if (req.body.forwardFrom !== undefined) {
      forwardOnMessage = await sw.Message.findOne({
        where: { id: req.body.forwardedFrom },
      });
      if (forwardOnMessage === null) {
        res.send({
          status: "error",
          errorCode: "e0005",
          message: "message to forward does not exist.",
        });
        return;
      } else {
        let membershipOfSameRoomMessage = await sw.Membership.findOne({
          where: { roomId: forwardOnMessage.roomId, userId: session.userId },
        });
        if (membershipOfSameRoomMessage === null) {
          res.send({
            status: "error",
            errorCode: "e0005",
            message: "message to forward does not exist.",
          });
          return;
        }
        let aut = await sw.User.findOne({
          where: { id: forwardOnMessage.authorId },
        });
        if (aut === null) {
          aut = await sw.Bot.findOne({
            where: { id: forwardOnMessage.authorId },
          });
        }
        forwardOnMessage = {
          id: forwardOnMessage.id,
          authorId: forwardOnMessage.authorId,
          time: forwardOnMessage.time,
          roomId: forwardOnMessage.roomId,
          text: forwardOnMessage.text,
          fileId: forwardOnMessage.fileId,
          messageType: forwardOnMessage.messageType,
          author: aut,
        };
      }
    }

    let msg = await sw.Message.create({
      authorId: user.id,
      time: Date.now(),
      roomId: membership.roomId,
      text: req.body.text,
      fileId: req.body.fileId === undefined ? null : req.body.fileId,
      messageType: req.body.messageType,
      repliedTo: req.body.repliedTo,
      forwardedFrom: req.body.forwardedFrom,
    });
    let msgCopy = {
      id: msg.id,
      authorId: user.id,
      time: Date.now(),
      roomId: membership.roomId,
      text: req.body.text,
      fileId: req.body.fileId === undefined ? null : req.body.fileId,
      messageType: req.body.messageType,
      author: user,
      repliedTo: replyOnMessage,
      forwardedFrom: forwardOnMessage,
    };
    let users = getRoomUsers(membership.roomId);
    let roomRaw = await sw.Room.findOne({ where: { id: membership.roomId } });
    users.forEach((u) => {
      if (u.id !== session.userId) {
        require("../server").signlePushTo(u.id, "message-added", { msgCopy });
      }
    });
    let workerIds = (
      await sw.Workership.findAll({ raw: true, where: { roomId: roomRaw.id } })
    ).map((w) => w.botId);
    workerIds.forEach((wId) => {
      require("../server").signlePushTo(wId, "message-added", {
        message: msgCopy,
      });
    });
    let mems = await sw.Membership.findAll({
      raw: true,
      where: { roomId: roomRaw.id },
    });
    let allUsers = await sw.User.findAll({
      raw: true,
      where: { id: mems.map((mem) => mem.userId) },
    });
    let usersDict = {};
    allUsers.forEach((u) => {
      usersDict[u.id] = true;
    });
    users.forEach((u) => {
      if (usersDict[u.id] !== true) {
        allUsers.push(u);
      }
    });
    const { pushNotification, pushTo } = require("../server");
    for (let i = 0; i < allUsers.length; i++) {
      let user = allUsers[i];
      if (user.id !== session.userId) {
        await pushNotification(
          user.id,
          user.firstName +
            ": " +
            (msgCopy.messageType === "text"
              ? msgCopy.text
              : msgCopy.messageType === "photo"
              ? "عکس 📷"
              : msgCopy.messageType === "audio"
              ? "صدا 🔊"
              : msgCopy.messageType === "video"
              ? "ویدئو 🎥"
              : msgCopy.messageType === "document"
              ? "سند 📄"
              : "نامشخص"),
          "https://society.kasperian.cloud/app?room_id=" +
            msgCopy.roomId +
            "&selected_nav=2",
          {}
        );
        require("../server").signlePushTo(user.id, "chat-list-updated", {
          room: roomRaw,
        });
      }
    }
    res.send({ status: "success", message: msgCopy });
  });
});

router.post("/create_bot_message", jsonParser, async function (req, res) {
  if (
    (req.body.text === undefined ||
      req.body.text === "" ||
      req.body.text === null) &&
    (req.body.fileId === undefined ||
      req.body.fileId === "" ||
      req.body.fileId === null ||
      req.body.fileId === 0)
  ) {
    res.send({
      status: "error",
      errorCode: "e0005",
      message: "text can not be empty.",
    });
    return;
  }

  let session = await sw.Session.findOne({
    where: { token: req.headers.token },
  });
  if (session === null) {
    res.send({
      status: "error",
      errorCode: "e0006",
      message: "access denied.",
    });
    return;
  }

  let workership = await sw.Workership.findOne({
    where: { botId: session.userId, roomId: req.body.roomId },
  });
  if (workership === null) {
    res.send({
      status: "error",
      errorCode: "e0007",
      message: "access denied.",
    });
    return;
  }

  let bot = await sw.Bot.findOne({ where: { id: workership.botId } });

  let replyOnMessage = undefined;
  let forwardOnMessage = undefined;

  if (req.body.repliedTo !== undefined) {
    replyOnMessage = await sw.Message.findOne({
      where: { id: req.body.repliedTo, roomId: req.body.roomId },
    });
    if (replyOnMessage === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "message to reply does not exist.",
      });
      return;
    }
    let aut = await sw.User.findOne({
      where: { id: replyOnMessage.authorId },
    });
    if (aut === null) {
      aut = await sw.Bot.findOne({ where: { id: replyOnMessage.authorId } });
    }
    replyOnMessage = {
      id: replyOnMessage.id,
      authorId: replyOnMessage.authorId,
      time: replyOnMessage.time,
      roomId: replyOnMessage.roomId,
      text: replyOnMessage.text,
      fileId: replyOnMessage.fileId,
      messageType: replyOnMessage.messageType,
      author: aut,
    };
  }
  if (req.body.forwardFrom !== undefined) {
    forwardOnMessage = await sw.Message.findOne({
      where: { id: req.body.forwardFrom },
    });
    if (forwardOnMessage === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "message to forward does not exist.",
      });
      return;
    } else {
      let membershipOfSameRoomMessage = await sw.Membership.findOne({
        where: { roomId: forwardOnMessage.roomId, userId: session.userId },
      });
      if (membershipOfSameRoomMessage === null) {
        res.send({
          status: "error",
          errorCode: "e0005",
          message: "message to forward does not exist.",
        });
        return;
      }
      let aut = await sw.User.findOne({
        where: { id: forwardOnMessage.authorId },
      });
      if (aut === null) {
        aut = await sw.Bot.findOne({
          where: { id: forwardOnMessage.authorId },
        });
      }
      forwardOnMessage = {
        id: forwardOnMessage.id,
        authorId: forwardOnMessage.authorId,
        time: forwardOnMessage.time,
        roomId: forwardOnMessage.roomId,
        text: forwardOnMessage.text,
        fileId: forwardOnMessage.fileId,
        messageType: forwardOnMessage.messageType,
        author: aut,
      };
    }
  }

  let msg = await sw.Message.create({
    authorId: bot.id,
    time: Date.now(),
    roomId: workership.roomId,
    text: req.body.text,
    fileId: req.body.fileId === undefined ? null : req.body.fileId,
    messageType: req.body.messageType,
    repliedTo: req.body.repliedTo,
    forwardedFrom: req.body.forwardedFrom,
  });
  let msgCopy = {
    id: msg.id,
    authorId: msg.authorId,
    time: msg.time,
    roomId: msg.roomId,
    text: msg.text,
    fileId: msg.fileId,
    messageType: msg.messageType,
    author: bot,
    repliedTo: replyOnMessage,
    forwardedFrom: forwardOnMessage,
  };
  let users = getRoomUsers(workership.roomId);
  let roomRaw = await sw.Room.findOne({ where: { id: workership.roomId } });
  users.forEach((user) => {
    require("../server").signlePushTo(user.id, "message-added", { msgCopy });
  });
  let mems = await sw.Membership.findAll({
    raw: true,
    where: { roomId: roomRaw.id },
  });
  let allUsers = await sw.User.findAll({
    raw: true,
    where: { id: mems.map((mem) => mem.userId) },
  });
  let usersDict = {};
  allUsers.forEach((u) => {
    usersDict[u.id] = true;
  });
  users.forEach((u) => {
    if (usersDict[u.id] !== true) {
      allUsers.push(u);
    }
  });
  const { pushNotification } = require("../server");
  for (let i = 0; i < allUsers.length; i++) {
    let user = allUsers[i];
    await pushNotification(
      user.id,
      user.firstName +
        ": " +
        (msgCopy.messageType === "text"
          ? msgCopy.text
          : msgCopy.messageType === "photo"
          ? "عکس 📷"
          : msgCopy.messageType === "audio"
          ? "صدا 🔊"
          : msgCopy.messageType === "video"
          ? "ویدئو 🎥"
          : msgCopy.messageType === "document"
          ? "سند 📄"
          : "نامشخص"),
      "https://society.kasperian.cloud/app?room_id=" +
        msgCopy.roomId +
        "&selected_nav=2",
      {}
    );
    require("../server").signlePushTo(user.id, "chat-list-updated", {
      room: roomRaw,
    });
  }
  res.send({ status: "success", message: msgCopy });
});

router.post("/delete_message", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canRemoveOwnMessage) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.Message.findOne({
      where: {
        id: req.body.messageId,
        roomId: membership.roomId,
        authorId: session.userId,
      },
    }).then(async function (msg) {
      if (msg === null) {
        res.send({
          status: "error",
          errorCode: "e0005",
          message: "access denied.",
        });
      }
      await msg.destroy();
      require("../server").pushTo(
        "room_" + membership.roomId,
        "message-removed",
        msg
      );
      res.send({ status: "success" });
    });
  });
});

router.post("/get_messages", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership === undefined) {
      res.send({ status: "error", errorCode: "e0005" });
      return;
    }
    let messages = await sw.Message.findAll({
      raw: true,
      limit: 100,
      where: { roomId: membership.roomId },
      order: [["createdAt", "DESC"]],
    });
    messages = messages.reverse();
    let allRecentSeens = await sw.MessageSeen.findAll({
      raw: true,
      where: {
        messageId: messages.map((m) => m.id),
        roomId: membership.roomId,
        userId: session.userId,
      },
    });
    let dict = {};
    allRecentSeens.forEach((recentSeen) => {
      dict[recentSeen.messageId] = true;
    });
    let breakPoint = 0;
    let found = false;
    for (let i = 0; i < messages.length; i++) {
      if (
        dict[messages[i].id] !== true &&
        messages[i].authorId !== session.userId
      ) {
        breakPoint = i;
        found = true;
        break;
      }
    }
    if (!found) {
      breakPoint = messages.length - 1;
    }

    breakPoint = Math.min(
      breakPoint,
      messages.length > 10 ? messages.length - 10 : 0
    );
    let result = [];
    for (let i = breakPoint; i < messages.length; i++) {
      let message = messages[i];
      if (session.userId !== message.authorId) {
        if (
          (await sw.MessageSeen.findOne({
            where: { messageId: message.id, userId: session.userId },
          })) === null
        ) {
          await sw.MessageSeen.create({
            userId: session.userId,
            messageId: message.id,
            roomId: message.roomId,
          });
        }
      }
      message.seen = await sw.MessageSeen.count({
        where: { messageId: message.id },
        distinct: true,
        col: "userId",
      });
      result.push(message);
    }
    messages = result;
    let members = await sw.Membership.findAll({
      raw: true,
      where: { roomId: membership.roomId },
    });
    let us = getRoomUsers(membership.roomId);
    us.forEach((u) => {
      require("../server").signlePushTo(u.id, "message-seen", { messages });
    });
    let fetchedMessages = await sw.Message.findAll({
      raw: true,
      limit: 25,
      offset: req.body.offset,
      include: [{ all: true }],
      where: { roomId: membership.roomId },
      order: [["createdAt", "DESC"]],
    });
    fetchedMessages.reverse();
    let copies = [];
    for (let i = 0; i < fetchedMessages.length; i++) {
      let msg = fetchedMessages[i];
      let author =
        usersBook[msg.authorId] === undefined ? null : usersBook[msg.authorId];
      let forwom =
        msg.forwardedFrom !== undefined
          ? await sw.Message.findOne({
              where: { id: msg.forwardedFrom },
            })
          : null;
      if (forwom !== null) {
        let aut = await sw.User.findOne({
          where: { id: forwom.authorId },
        });
        if (aut === null) {
          aut = await sw.Bot.findOne({
            where: { id: forwom.authorId },
          });
        }
        forwom = {
          id: forwom.id,
          authorId: forwom.authorId,
          time: forwom.time,
          roomId: forwom.roomId,
          text: forwom.text,
          fileId: forwom.fileId,
          messageType: forwom.messageType,
          author: aut,
        };
      }
      let repom =
        msg.repliedTo !== undefined
          ? await sw.Message.findOne({
              where: { id: msg.repliedTo },
            })
          : null;
      if (repom !== null) {
        let aut = await sw.User.findOne({
          where: { id: repom.authorId },
        });
        if (aut === null) {
          aut = await sw.Bot.findOne({
            where: { id: repom.authorId },
          });
        }
        repom = {
          id: repom.id,
          authorId: repom.authorId,
          time: repom.time,
          roomId: repom.roomId,
          text: repom.text,
          fileId: repom.fileId,
          messageType: repom.messageType,
          author: aut,
        };
      }
      let msgCopy = {
        id: msg.id,
        authorId: msg.authorId,
        roomId: msg.roomId,
        author: author,
        Room: msg.Room,
        messageType: msg.messageType,
        fileId: msg.fileId,
        text: msg.text,
        time: msg.time,
        repliedTo: repom,
        forwardedFrom: forwom,
      };
      msgCopy.seen = await sw.MessageSeen.count({
        where: { messageId: msgCopy.id },
        distinct: true,
        col: "userId",
      });
      copies.push(msgCopy);
    }
    res.send({ status: "success", messages: copies });
  });
});

router.post("/update_message", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    sw.Message.findOne({
      where: {
        id: req.body.messageId,
        roomId: membership.roomId,
        authorId: user.id,
      },
    }).then(async function (msg) {
      if (msg === null) {
        res.send({
          status: "error",
          errorCode: "e0005",
          message: "message does not exist.",
        });
        return;
      }
      msg.text = req.body.text;
      await msg.save();
      let users = getRoomUsers(membership.roomId);
      users.forEach((u) => {
        if (u.id !== session.userId) {
          require("../server").signlePushTo(u.id, "edit_message", { msg });
        }
      });
      let workerIds = (
        await sw.Workership.findAll({
          raw: true,
          where: { roomId: membership.roomId },
        })
      ).map((w) => w.botId);
      workerIds.forEach((wId) => {
        require("../server").signlePushTo(wId, "edit_message", {
          message: msg,
        });
      });
      res.send({ status: "success" });
    });
  });
});

module.exports = router;
