const sw = require('../db/models');
const express = require('express');
const tools = require('../tools');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const { sockets } = require('../socket');
const { authenticateMember } = require('../users');
const { uuid } = require('uuidv4');

const router = express.Router();
let jsonParser = bodyParser.json();

let idCounter = 0
let generateId = () => {
    idCounter++
    return idCounter
}

let data = {}

router.post('/add_lane', jsonParser, async function (req, res) {
    let result = {
        id: generateId(), 
        title: req.body.title, 
        label: '0/0', 
        cards: [],
        editLaneTitle: true,
        canAddLanes: true,
        editable: true
    }
    data[req.body.roomId].content.lanes.push(result)
    res.send({status: 'success', lane: result})
});

router.post('/add_card', jsonParser, async function (req, res) {
    let result = {id: generateId(), title: req.body.title, description: '0/0', label: '5 mins', draggable: true}
    for (let i = 0; i < data[req.body.roomId].content.lanes.length; i++) {
        if (data[req.body.roomId].content.lanes[i].id === req.body.laneId) {
            data[req.body.roomId].content.lanes[i].cards.push(result)
            break
        }
    }
    res.send({status: 'success', card: result})
});

router.post('/get_board', jsonParser, async function (req, res) {
    if (data[req.body.roomId] === undefined) {
        data[req.body.roomId] = {
            roomId: req.body.roomId,
            content: {
                lanes: [
                    {
                        id: 1,
                        title: 'لیست کار ها',
                        label: '0/1',
                        editLaneTitle: true,
                        canAddLanes: true,
                        editable: true,
                        cards: [
                            {id: 1, title: 'نمونه ی کارت', description: 'این یک کارت نمونه است.', label: 'نمونه', draggable: true},
                        ]
                    }
                ]
            }
        }
    }
    res.send({status: 'success', board: data[req.body.roomId].content})
});

module.exports = router;
