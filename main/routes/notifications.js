const sw = require('../db/models');
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require("../db/models");
const { authenticateMember } = require('../users');
const { notifs } = require('../socket');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/sync', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let notifsCount = notifs[user.id] === undefined ? 0 : notifs[user.id].length;
        let nots = notifs[user.id].slice(0, notifsCount);
        res.send({status: 'success', notifications: nots});
    });
});

router.post('/sync-bot', jsonParser, async function (req, res) {
    let session = await sw.Session.findOne({where: {token: req.headers.token}});
    let notifsCount = notifs[session.userId] === undefined ? 0 : notifs[session.userId].length;
    let nots = notifs[session.userId].slice(0, notifsCount);
    res.send({status: 'success', notifications: nots});
});

router.post('/recycle', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        if (notifs[user.id] === undefined) {
            res.send({status: 'success'});
            return;
        }
        notifs[user.id].splice(0, req.body.notifsCount);
        res.send({status: 'success'});
    });
});

router.post('/recycle-bot', jsonParser, async function (req, res) {
    let session = await sw.Session.findOne({where: {token: req.headers.token}});
    if (notifs[session.userId] === undefined) {
        res.send({status: 'success'});
        return;
    }
    notifs[session.userId].splice(0, req.body.notifsCount);
    res.send({status: 'success'});
});

module.exports = router;
