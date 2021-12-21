const sw = require('../db/models');
const express = require('express');
const tools = require('../tools');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const { authenticateMember } = require('../users');
const { uuid } = require('uuidv4');
const fetch = require('node-fetch');

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

router.post('/verify_recaptcha', jsonParser, async function (req, res) {
    fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${'6Lc1P7odAAAAAE4vJN6tbYWiyibGe0v-PMwu3i8v'}&response=${req.body.recaptchaToken}`,
      })
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.success === true) {
            res.send({status: 'success'});
        }
        else {
            res.send({status: 'error'});
        }
      });
});





module.exports = router;
