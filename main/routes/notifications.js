const sw = require('../db/models');
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require("../db/models");
const { authenticateMember } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/get_notifications', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        sw.Notification.findAll({
            include: [{ all: true }],
            where: {ownerId: session.userId}
        }).then(async function (notifs) {
            res.send({status: 'success', notifications: notifs});
        });
    });
});

module.exports = router;
