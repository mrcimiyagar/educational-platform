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

let data = {
    lanes: [
      {
        id: 'lane1',
        title: 'Planned Tasks',
        label: '2/2',
        editLaneTitle: true,
        canAddLanes: true,
        editable: true,
        cards: [
          {id: '1', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: false},
          {id: '2', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}},
          {id: '3', title: 'Write Blog', description: 'Can AI make memes', label: '30 mins', draggable: false},
          {id: '4', title: 'Pay Rent', description: 'Transfer via NEFT', label: '5 mins', metadata: {sha: 'be312a1'}},
        ]
      }
    ]
  }

router.post('/add_lane', jsonParser, async function (req, res) {
    let result = {id: generateId(), title: req.body.title, label: '0/0', cards: [],
        editLaneTitle: true,
        canAddLanes: true,
        editable: true
    }
    data.lanes.push(result)
    res.send({status: 'success', lane: result})
});

router.post('/add_card', jsonParser, async function (req, res) {
    let result = {id: generateId(), title: req.body.title, description: '0/0', label: '5 mins', draggable: true}
    for (let i = 0; i < data.lanes.length; i++) {
        if (data.lanes[i].id === req.body.laneId) {
            data.lanes[i].cards.push(result)
            break
        }
    }
    res.send({status: 'success', card: result})
});

router.post('/get_board', jsonParser, async function (req, res) {
    res.send({status: 'success', board: data})
});

module.exports = router;
