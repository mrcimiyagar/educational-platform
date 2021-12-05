const sw = require('../db/models');
const express = require('express');
const { Op } = require('sequelize')
const bodyParser = require('body-parser');
const { authenticateMember } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/update_view', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            if ((req.body.view === 'whiteboard' && membership.canUseWhiteboard) ||
                (req.body.view === 'videos' && membership.canActInVideo) ||
                (req.body.view === 'presentation' && membership.canPresent)) {
                    require("../server").pushTo('room_' + membership.roomId, 'view-updated', req.body.view);
            }
    });
});

module.exports = router;
