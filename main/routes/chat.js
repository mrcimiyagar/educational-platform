const sw = require('../db/models');
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require("../db/models");
const { authenticateMember } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/create_message', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            if (!membership.canAddMessage) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            console.log(JSON.stringify(membership));
            console.log(JSON.stringify(session));
            console.log(JSON.stringify(user));

            let msg = await sw.Message.create({
                authorId: user.id,
                time: Date.now(),
                roomId: membership.roomId,
                text: req.body.text,
                fileId: req.body.fileId
            });
            sw.User.findOne({where: {id: session.userId}}).then(async function (user) {
                require('../server').pushTo('room_' + membership.roomId, 'message-added', {msg, user});
            });
            res.send({status: 'success', message: msg});
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
