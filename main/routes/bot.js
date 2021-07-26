const sw = require('../db/models');
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require("../db/models");
const { authenticateMember } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/add_bot', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
        
    })
})

module.exports = router
