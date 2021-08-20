const sw = require('../db/models')
const express = require('express')
const bodyParser = require('body-parser')
const {User} = require("../db/models")
const { authenticateMember } = require('../users')
const Op = require('sequelize').Op

const router = express.Router();
let jsonParser = bodyParser.json();

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

router.post('/search_users', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let results = []
        let searchTokens = req.body.query.split(' ')
        for (let i = 0; i < searchTokens.length; i++) {
            let searchToken = searchTokens[i]
            sw.User.findAll({
                include: [{ all: true }],
                where: {[Op.or]: [{firstName: {[Op.like]: '%' + searchToken + '%'}}, {lastName: {[Op.like]: '%' + searchToken + '%'}}]}
            }).then(async function (users) {
                results = results.concat(users).unique(); 
                res.send({status: 'success', users: results});
            });
        }
    });
});

router.post('/search_bots', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let results = []
        let searchTokens = req.body.query.split(' ')
        for (let i = 0; i < searchTokens.length; i++) {
            let searchToken = searchTokens[i]
            sw.Bot.findAll({
                include: [{ all: true }],
                where: {title: {[Op.like]: '%' + searchToken + '%'}}
            }).then(async function (bots) {
                results = results.concat(bots).unique(); 
                res.send({status: 'success', bots: results});
            });
        }
    });
});

router.post('/search_rooms', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let results = []
        let mems = await sw.Membership.findAll({raw: true, where: {userId: session.userId}})
        let searchTokens = req.body.query.split(' ')
        for (let i = 0; i < searchTokens.length; i++) {
            let searchToken = searchTokens[i]
            sw.Room.findAll({
                include: [{ all: true }],
                where: {id: mems.map(mem => mem.roomId), title: {[Op.like]: '%' + searchToken + '%'}}
            }).then(async function (rooms) {
                results = results.concat(rooms).unique(); 
                res.send({status: 'success', rooms: results});
            });
        }
    });
});

router.post('/search_files', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        //let results = []
        let mems = await sw.Membership.findAll({raw: true, where: {userId: session.userId}})
        let rooms = await sw.Room.findAll({raw: true, where: {id: mems.map(mem => mem.roomId)}})
        let files = await sw.File.findAll({raw: true, where: {roomId: rooms.map(room => room.id), fileType: req.body.fileType}})
        res.send({status: 'success', files: files});
        
        /*let searchTokens = req.body.query.split(' ')
        for (let i = 0; i < searchTokens.length; i++) {
            let searchToken = searchTokens[i]
            sw.Room.findAll({
                include: [{ all: true }],
                where: {id: mems.map(mem => mem.roomId), title: {[Op.like]: '%' + searchToken + '%'}}
            }).then(async function (rooms) {
                results = results.concat(rooms).unique(); 
                res.send({status: 'success', rooms: results});
            });
        }*/
    });
});

module.exports = router;
