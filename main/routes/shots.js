
const { rootPath, parentPath } = require('../tools');

const express = require('express');
const bodyParser = require('body-parser');
const { authenticateMember } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.get('/get_shot', jsonParser, async function (req, res) {
    res.sendFile(parentPath + '/webshot/shots/' + req.query.room_id + '.png');
});

module.exports = router;
