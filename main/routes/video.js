const sw = require('../db/models');
const express = require('express');
const { Op } = require('sequelize')
const bodyParser = require('body-parser');
const { authenticateMember, guestAccsByUserId, guestAccs } = require('../users');
const { pushNotification } = require('../server');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/notify_calling', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        if (membership === null || membership === undefined) {
            res.send({status: 'error', errorCode: 'e005', messsage: 'access denied.'});
            return;
        }
        let mw = await sw.ModuleWorker.findOne({where: {id: req.body.moduleWorkerId, roomId: membership.roomId}});
        if (mw === null) {
            res.send({status: 'error', errorCode: 'e005', messsage: 'access denied.'});
            return;
        }
        let members = await sw.Membership.findAll({raw: true, where: {roomId: membership.roomId}});
        let room = await sw.Room.findOne({where: {id: membership.roomId}});
        let roomTitle = room.title;
        let spaceTitle = 'چت خصوصی';
        if (room.spaceId !== undefined && room.spaceId !== null) {
            let space = await sw.Space.findOne({where: {id: room.spaceId}});
            spaceTitle = space.title;
        }
        members.forEach(async member => {
            if (member.userId !== session.userId) {
                await pushNotification(member.userId, `کاربر ${user.firstName + ' ' + user.lastName} وارد تماس در ${spaceTitle + ' -> ' + roomTitle} شده است`, 'https://society.kasperian.cloud/app?room_id=' + membership.roomId + '&selected_nav=14&module_worker_id=' + req.body.moduleWorkerId);
            }
        });
        res.send({status: 'success'});
    });
});

router.post('/get_actors', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
        sw.Membership.findAll({where: {canActInVideo: true, userId: { [Op.ne]: 'admin' }, roomId: req.body.roomId}}).then(async function (memberships) {
            sw.User.findAll({where: {id: memberships.map(m => m.userId)}}).then(async function (users) {
                let dict = guestAccs[Number(req.body.roomId)];
                let arr = [];
                for (var key in dict) {
                    if (dict.hasOwnProperty(key) && dict[key].canActInVideo === true) {
                        arr.push(dict[key].user);
                    }
                }
                res.send({status: 'success', users: [...arr, ...users]});
            });
        });
    });
});

router.post('/edit_', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
        sw.Membership.findAll({where: {canActInVideo: true, userId: { [Op.ne]: 'admin' }, roomId: req.body.roomId}}).then(async function (memberships) {
            sw.User.findAll({where: {id: memberships.map(m => m.userId)}}).then(async function (users) {
                let dict = guestAccs[Number(req.body.roomId)];
                let arr = [];
                for (var key in dict) {
                    if (dict.hasOwnProperty(key) && dict[key].canActInVideo === true) {
                        arr.push(dict[key].user);
                    }
                }
                res.send({status: 'success', users: [...arr, ...users]});
            });
        });
    });
});

router.post('/get_actors_internal', jsonParser, async function (req, res) {
    sw.Membership.findAll({where: {canActInVideo: true, userId: { [Op.ne]: 'admin' }, roomId: req.body.roomId}}).then(async function (memberships) {
        sw.User.findAll({where: {id: memberships.map(m => m.userId)}}).then(async function (users) {
            res.send({status: 'success', users: users});
        });
    });
});

module.exports = router;
