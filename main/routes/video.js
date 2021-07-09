
const sockets = require("../socket").sockets;

const sw = require('../db/models');
const express = require('express');
const { Op } = require('sequelize')
const bodyParser = require('body-parser');
const { authenticateMember, guestAccsByUserId, guestAccs } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

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
