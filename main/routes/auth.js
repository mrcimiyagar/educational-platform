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
    let account = await sw.Account.create({
        userId: user.id,
        pending: false,
        forgot: false,
        vCode: '',
        password: req.body.password,
        themeColor: tools.lightTheme,
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
    res.send({status: 'success', user: user, account: account, session: session})
});

router.post('/login', jsonParser, async function (req, res) {
    let user = await sw.User.findOne({where: {username: req.body.username}})
    if (user === null) {
        res.send({status: 'error', errorCode: 'e001', message: 'نام کاربری موجود نیست'})
        return
    }
    let account = await sw.Account.findOne({where: {
        userId: user.id,
        password: req.body.password
    }})
    if (account === null) {
        res.send({status: 'error', errorCode: 'e001', message: 'رمز عبور اشتباه است'})
        return
    }
    let session = await sw.Session.findOne({where: {
        userId: user.id,
    }})
    res.send({status: 'success', user: user, account: account, session: session})
});

module.exports = router;
