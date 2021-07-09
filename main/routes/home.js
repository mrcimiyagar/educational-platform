const sw = require('../db/models');
const express = require('express');
const tools = require('../tools');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const { authenticateMember } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.get('/home', jsonParser, async function (req, res) {
    sw.Membership.findAll({}).then(ms => {
        res.send({memberships: ms});
    })
});

module.exports = router;
