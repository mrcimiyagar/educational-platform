const sw = require('../db/models');
const express = require('express');
const tools = require('../tools');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const { authenticateMember } = require('../users');
const { uuid } = require('uuidv4');
const fetch = require('node-fetch');
const users = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/register', jsonParser, async function (req, res) {
    let user = await sw.User.findOne({where: {username: req.body.username}})
    if (user !== null) {
        res.send({status: 'error', errorCode: 'e001', message: 'نام کاربری موجود است'})
        return
    }
    if (req.body.firstName === undefined || req.body.firstName === null || req.body.firstName === '') {
        res.send({status: 'error', errorCode: 'e002', message: 'نام نمی تواند خالی باشد.'})
        return
    }
    user = await sw.User.create({
        id: uuid() + '-' + Date.now(),
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    newCreatureId(user.id);
    let home = await sw.Space.create({
        title: 'خانه',
        mainRoomId: null,
    });
    let spaceSecret = await sw.SpaceSecret.create({
      ownerId: user.id,
      spaceId: home.id,
    });
    let room = await sw.Room.create({
        title: 'خانه',
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
        canAddBot: true,
        canModifyStorePackage: true,
        canModifyStoreCategory: true
    });
    let session = await sw.Session.create({
        userId: user.id,
        token: tools.makeRandomCode(64)
    });
    await fetch('http://185.81.96.105:1338/registeruser?username=' + user.username, {});
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

router.post('/login_bot', jsonParser, async function (req, res) {
    let bot = await sw.Bot.findOne({where: {id: req.body.botId}});
    if (bot === null) {
        res.send({status: 'error', errorCode: 'e001', message: 'بات موجود نیست'});
        return;
    }
    let botSecret = await sw.BotSecret.findOne({where: {
        botId: bot.id,
        token: req.body.token
    }});
    if (botSecret === null) {
        res.send({status: 'error', errorCode: 'e001', message: 'توکن اشتباه است'});
        return;
    }
    let session = await sw.Session.findOne({where: {
        userId: bot.id,
    }});
    res.send({status: 'success', bot: bot, botSecret: botSecret, session: session});
});

router.post('/get_user', jsonParser, async function (req, res) {
    let user = await sw.User.findOne({where: {id: req.body.userId}})
    res.send({status: 'success', user: user})
});

router.post('/edit_me', jsonParser, async function (req, res) {
    if (req.body.firstName === undefined || req.body.firstName === null || req.body.firstName === '') {
        res.send({status: 'error', errorCode: 'e006', message: 'first name can not be empty.'});
        return;
    }
    authenticateMember(req, res, async (membership, session, user) => {
        let u = await sw.User.findOne({where: {id: user.id}});
        if (u === null || u === undefined) {
            res.send({status: 'error', errorCode: 'e005', message: 'access denied.'});
            return;
        }
        u.firstName = req.body.firstName;
        u.lastName = req.body.lastName;
        await u.save();
        if (users[u.id] !== undefined) {
            users[u.id].firstName = req.body.firstName;
            users[u.id].lastName = req.body.lastName;
        }
        res.send({status: 'success'});
    })
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
