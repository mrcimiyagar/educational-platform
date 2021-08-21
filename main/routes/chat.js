const sw = require('../db/models');
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require("../db/models");
const { authenticateMember } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/get_chats', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
        sw.Membership.findAll({where: {userId: session.userId}}).then(async function (memberships) {
            sw.Room.findAll({raw: true, where: {id: memberships.map(m => m.roomId)}}).then(async function (rooms) {
                for (let i = 0; i < rooms.length; i++) {
                    let room = rooms[i]
                    if (room.chatType === 'p2p') {
                        let members = await sw.Membership.findAll({raw: true, where: {roomId: room.id}})
                        room.participent = members[0].userId === session.userId ? 
                            await sw.User.findOne({where: {id: members[1].userId}}) :
                            await sw.User.findOne({where: {id: members[0].userId}})
                    }
                    else if (room.chatType === 'group') {
                        room.group = {title: room.title, avatarId: room.avatarId}
                    }
                    else if (room.chatType === 'channel') {
                        room.channel = {title: room.title, avatarId: room.avatarId}
                    }
                    else if (room.chatType === 'bot') {
                        
                    }
                    let entries = await sw.Message.findAll({
                        raw: true,
                        where: {roomId: room.id},
                        limit: 1,
                        order: [ [ 'createdAt', 'DESC' ]]
                    })
                    if (entries.length === 1) {
                        room.lastMessage = entries[0]
                    }
                }
                res.send({status: 'success', rooms: rooms});
            });
        });
    });
});

router.post('/create_message', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            if (!membership.canAddMessage) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return
            }

            if ((req.body.text === undefined || req.body.text === '' || req.body.text === null) &&
                (req.body.fileId === undefined || req.body.fileId === '' || req.body.fileId === null || req.body.fileId === 0)) {
                res.send({status: 'error', errorCode: 'e0005', message: 'text can not be empty.'});
                return
            }

            let msg = await sw.Message.create({
                authorId: user.id,
                time: Date.now(),
                roomId: membership.roomId,
                text: req.body.text,
                fileId: req.body.fileId === undefined ? null : req.body.fileId,
                messageType: req.body.messageType
            });
            let msgCopy = {
                id: msg.id,
                authorId: user.id,
                time: Date.now(),
                roomId: membership.roomId,
                text: req.body.text,
                fileId: req.body.fileId === undefined ? null : req.body.fileId,
                messageType: req.body.messageType,
                User: user
            }
            require('../server').pushTo('room_' + membership.roomId, 'message-added', {msgCopy});
            res.send({status: 'success', message: msgCopy});
    });
});

router.post('/delete_message', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            if (!membership.canRemoveOwnMessage) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            sw.Message.findOne({where: {id: req.body.messageId, roomId: membership.roomId, authorId: session.userId}}).then(async function (msg) {
                if (msg === null) {
                    res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                }
                await msg.destroy();
                require("../server").pushTo('room_' + membership.roomId, 'message-removed', msg);
                res.send({status: 'success'});
            });
    });
});

router.post('/get_messages', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            sw.Message.findAll({ include: [{ all: true }], where: {roomId: membership.roomId}, offset: req.body.offset, limit: req.body.limit,
            order: [
                ['time', 'ASC'],
            ]}).then(async function (msgs) {
                res.send({status: 'success', messages: msgs});
            });
    });
});

router.post('/update_message', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            if (!membership.canEditOwnMessage) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            sw.Message.findOne({where: {id: req.body.messageId, roomId: membership.roomId}}).then(async function (msg) {
                if (msg === null) {
                    res.send({status: 'error', errorCode: 'e0005', message: 'message does not exist.'});
                    return;
                }
                msg.text = req.body.text;
                msg.fileId = req.body.fileId;
                await msg.save();
                io.to('room_' + membership.roomId).emit('edit_message', msg);
                res.send({status: 'success'});
            });
    });
});

module.exports = router;
