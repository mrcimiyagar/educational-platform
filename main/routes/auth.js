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

router.post('/register', jsonParser, async function (req, res) {
    let user = await sw.User.findOne({where: {username: req.body.username}})
    if (user !== null) {
        res.send({status: 'error', errorCode: 'e001', message: 'نام کاربری موجود است'})
        return
    }
    user = await sw.User.create({
        id: uuid() + '-' + Date.now(),
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    let home = await sw.Space.create({
        title: req.body.title,
        mainRoomId: null,
    });
    let spaceSecret = await sw.SpaceSecret.create({
      ownerId: user.id,
      spaceId: home.id,
    });
    let room = await sw.Room.create({
        title: req.body.title,
        spaceId: home.id,
    });
    home.mainRoomId = room.id;
    home.save();
    let RoomSecret = await sw.RoomSecret.create({
      ownerId: user.id,
      roomId: room.id,
    });
    let mem = await sw.Membership.create({
        userId: user.id,
        roomId: room.id,
        ...tools.adminPermissions,
    });
    let msg = await sw.Message.create({
        authorId: user.id,
        time: Date.now(),
        roomId: room.id,
        text: 'روم ساخته شد',
        fileId: null,
        messageType: 'text'
      });
    let account = await sw.Account.create({
        userId: user.id,
        pending: false,
        forgot: false,
        vCode: '',
        password: req.body.password,
        themeColor: tools.lightTheme,
        homeSpaceId: home.id,
        canAddRoom: true,
        canAddSurvey: false,
        canRemoveSurvey: false,
        canAddSurveyLabel: false,
        canRemoveSurveyLabel: false,
        canAddSurveyCat: false,
        canRemoveSurveyCat: false,
    });
    let session = await sw.Session.create({
        userId: user.id,
        token: tools.makeRandomCode(64)
    });
    res.send({status: 'success', user: user, account: account, session: session, home: home, room: room})
});

router.post('/login', jsonParser, async function (req, res) {
    let user = await sw.User.findOne({where: {username: req.body.username}});
    if (user === null) {
        res.send({status: 'error', errorCode: 'e001', message: 'نام کاربری موجود نیست'});
        return;
    }
    let account = await sw.Account.findOne({where: {
        userId: user.id,
        password: req.body.password
    }});
    if (account === null) {
        res.send({status: 'error', errorCode: 'e001', message: 'رمز عبور اشتباه است'});
        return;
    }
    let session = await sw.Session.findOne({where: {
        userId: user.id,
    }});
    let home = await sw.Space.findOne({where: {id: account.homeSpaceId}});
    let room = home === null ? undefined : await sw.Room.findOne({where: {id: home.mainRoomId}});
    res.send({status: 'success', user: user, account: account, session: session, space: home === null ? undefined : home, room: room});
});

router.post('/get_user', jsonParser, async function (req, res) {
    let user = await sw.User.findOne({where: {id: req.body.userId}})
    res.send({status: 'success', user: user})
});

router.post('/get_me', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
        res.send({status: 'success', user: user})
    })
});

router.post('/get_users', jsonParser, async function (req, res) {
    let users = await sw.User.findAll({raw: true});
    res.send({status: 'success', users: users});
});

module.exports = router;
