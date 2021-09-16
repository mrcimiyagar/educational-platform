const sw = require('../db/models')
const express = require('express')
const bodyParser = require('body-parser')
const { User } = require('../db/models')
const { authenticateMember } = require('../users')
const { sockets } = require('../socket')
const Sequelize = require('sequelize');

const router = express.Router()
let jsonParser = bodyParser.json()

router.post('/get_participent', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let roomMembers = await sw.Membership.findAll({
      raw: true,
      where: { roomId: membership.roomId },
    })
    if (roomMembers.length !== 2) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'not a p2p chat.',
      })
      return
    }
    let participent =
      roomMembers[0].userId === membership.userId
        ? await sw.User.findOne({ where: { userId: roomMembers[1].userId } })
        : await sw.User.findOne({ where: { userId: roomMembers[0].userId } })

    res.send({ status: 'success', participent: participent })
  })
})

router.post('/get_chats', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    sw.Membership.findAll({ where: { userId: session.userId } }).then(
      async function (memberships) {
        sw.Room.findAll({
          raw: true,
          where: { id: memberships.map((m) => m.roomId) },
        }).then(async function (rooms) {
          for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            if (room.chatType === 'p2p') {
              let members = await sw.Membership.findAll({
                raw: true,
                where: { roomId: room.id },
              })
              room.participent =
                members[0].userId === session.userId
                  ? await sw.User.findOne({ where: { id: members[1].userId } })
                  : await sw.User.findOne({ where: { id: members[0].userId } })
            } else if (room.chatType === 'group') {
              room.group = { title: room.title, avatarId: room.avatarId }
            } else if (room.chatType === 'channel') {
              room.channel = { title: room.title, avatarId: room.avatarId }
            } else if (room.chatType === 'bot') {
            }
            let entries = await sw.Message.findAll({
              raw: true,
              where: { roomId: room.id },
              limit: 1,
              order: [['createdAt', 'DESC']],
            })
            if (entries.length === 1) {
              room.lastMessage = entries[0]
            }
            let roomMessagesCount = await sw.Message.count({
              where: { roomId: room.id, authorId: {[Sequelize.Op.not]: session.userId} }
            }); 
            let roomReadCount = await sw.MessageSeen.count({
              where: { roomId: room.id, userId: session.userId},
              distinct: true,
              col: 'messageId',
            });
            room.unread = roomMessagesCount - roomReadCount;
          }
          res.send({ status: 'success', rooms: rooms })
        })
      },
    )
  })
})

router.post('/create_message', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canAddMessage) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }

    if (
      (req.body.text === undefined ||
        req.body.text === '' ||
        req.body.text === null) &&
      (req.body.fileId === undefined ||
        req.body.fileId === '' ||
        req.body.fileId === null ||
        req.body.fileId === 0)
    ) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'text can not be empty.',
      })
      return
    }

    let msg = await sw.Message.create({
      authorId: user.id,
      time: Date.now(),
      roomId: membership.roomId,
      text: req.body.text,
      fileId: req.body.fileId === undefined ? null : req.body.fileId,
      messageType: req.body.messageType,
    })
    let msgCopy = {
      id: msg.id,
      authorId: user.id,
      time: Date.now(),
      roomId: membership.roomId,
      text: req.body.text,
      fileId: req.body.fileId === undefined ? null : req.body.fileId,
      messageType: req.body.messageType,
      User: user,
    }
    let members = await sw.Membership.findAll({
      raw: true,
      where: { roomId: membership.roomId },
    })
    members.forEach((member) => {
      if (sockets[member.userId] !== undefined)
        sockets[member.userId].emit('message-added', { msgCopy })
    })
    res.send({ status: 'success', message: msgCopy })
  })
})

router.post('/delete_message', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canRemoveOwnMessage) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
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
          status: 'error',
          errorCode: 'e0005',
          message: 'access denied.',
        })
      }
      await msg.destroy()
      require('../server').pushTo(
        'room_' + membership.roomId,
        'message-removed',
        msg,
      )
      res.send({ status: 'success' })
    })
  })
})

router.post('/get_messages', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let messages = await sw.Message.findAll({
      raw: true,
      limit: 10,
      include: [{ all: true }],
      where: { roomId: membership.roomId },
      order: [ [ 'createdAt', 'DESC' ]]
    }); 
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i]
      if (session.userId !== message.authorId) {
        if (
          (await sw.MessageSeen.findOne({
            where: { messageId: message.id, userId: session.userId },
          })) === null
        ) {
          await sw.MessageSeen.create({
            userId: session.userId,
            messageId: message.id,
            roomId: message.roomId
          })
        }
      }
      message.seen = await sw.MessageSeen.count({
        where: { messageId: message.id },
        distinct: true,
        col: 'userId',
      })
    }
    messages = messages.reverse();
    let members = await sw.Membership.findAll({
      raw: true,
      where: { roomId: membership.roomId },
    })
    members.forEach((member) => {
      if (sockets[member.userId] !== undefined)
        sockets[member.userId].emit('message-seen', { messages })
    })
    res.send({ status: 'success', messages: messages })
  })
})

router.post('/update_message', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canEditOwnMessage) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    sw.Message.findOne({
      where: { id: req.body.messageId, roomId: membership.roomId },
    }).then(async function (msg) {
      if (msg === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'message does not exist.',
        })
        return
      }
      msg.text = req.body.text
      msg.fileId = req.body.fileId
      await msg.save()
      io.to('room_' + membership.roomId).emit('edit_message', msg)
      res.send({ status: 'success' })
    })
  })
})

module.exports = router
