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

router.post('/setup_profile', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.User.findOne({where: {id: session.userId}}).then(async function (user) {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.save();
            if (sockets[user.id] !== undefined)
                require('../server').pushTo('room_' + sockets[user.id].roomId, 'profile_updated', user);
            res.send({status: 'success', me: user});
        });
    });
});

router.post('/forgot_password', jsonParser, async function (req, res) {
    sw.Account.findOne({where: {phone: req.body.phone}}).then(async function (uacc) {
        if (uacc === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'phone is not registered.'});
            return;
        }
        let vCode = tools.makeRandomCode(8);
        uacc.forgot = true;
        uacc.vCode = vCode;
        uacc.save();
        tools.sendMail(uacc.phone, 'forgot password', 'your verification code is ' + vCode);
        res.send({status: 'success', message: "we've sent recovery verification code to your phone."});
    });
});

router.post('/fetch_config', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
        if (membership !== undefined && membership.isGuest === true) {
            res.send({status: 'success', config: membership});
        }
        else {
            sw.Account.findOne({where: {userId: session.userId}}).then(async function (uacc) {
                if (uacc === null) {
                    res.send({status: 'error', errorCode: 'e0005', message: 'phone is not registered.'});
                    return;
                }
                res.send({status: 'success', config: uacc});
            });
        }
    });
});

router.post('/setup_config', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(session => {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0006'});
            return;
        }
        sw.Account.findOne({where: {userId: session.userId}}).then(async function (uacc) {
            uacc.themeColor = req.body.themeColor;
            uacc.save();
            res.send({status: 'success', config: uacc});
        });
    });
});

router.post('/reset_password', jsonParser, async function (req, res) {
    sw.Account.findOne({where: {phone: req.body.phone}}).then(function (uacc) {
        if (uacc === null) {
            res.send({status: 'error', errorCode: 'e0006', message: 'phone is not registered.'});
            return;
        }
        if (uacc.forgot === true && uacc.vCode === req.body.vCode) {
            uacc.forgot = false;
            uacc.vCode = '';
            uacc.save();
            sw.User.findOne({where: {id: uacc.userId}}).then(function (user) {
                user.password = req.body.password;
                user.save();
                res.send({status: 'success', user: user, message: 'your password changed successfully.'});
            });
        }
        else {
            res.send({status: 'error', errorCode: 'e0007', message: 'wrong verification code'});
        }
    });
});

router.post('/verify', jsonParser, async function (req, res) {
    sw.Account.findOne({where: {email: req.body.email}}).then(async function (uacc) {
        if (uacc === null) {
            res.send({status: 'error', errorCode: 'e0003', message: 'email is not registered.'});
            return;
        }
        if (req.body.vCode === uacc.vCode) {
            uacc.pending = false;
            uacc.vCode = '';
            uacc.save();
            sw.User.findOne({where: {id: uacc.userId}}).then(async function (user) {
                let result = await sw.Session.create({
                    userId: user.id,
                    token: tools.makeRandomCode(64)
                });
                res.send({status: 'success', session: result, user: user, message: 'you verified your account successfully.'});
            });
        }
        else {
            res.send({status: 'error', errorCode: 'e0004', message: 'verification code is wrong.'});
        }
    });
});

router.post('/register', jsonParser, async function(req, res) {
    sw.Account.findOne({ where: {phone: req.body.email}}).then(async function (acc) {
        if (acc === null) {
                    let result2 = await sw.User.create({
                        id: uuid() + '-' + Date.now(),
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName
                    });
                    let result = await sw.Account.create({
                        userId: result2.id,
                        phone: req.body.phone,
                        email: req.body.email,
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
                    let sess = await sw.Session.create({
                        userId: result2.id,
                        token: tools.makeRandomCode(64)
                    });
                    res.send({status: 'success', session: sess, account: result, user: result2, message: 'you registered your account successfully.'});
        }
    });
});

router.post('/login', jsonParser, async function(req, res) {
    sw.User.findOne({where: {username: req.body.username}}).then(function(user) {
        if (user === null) {
            res.send({status: 'error', errorCode: 'e0055', message: 'username not found'});
            return;
        }
        sw.Account.findOne({where: {userId: user.id, password: req.body.password}}).then(function(uacc) {
            if (uacc === null) {
                res.send({status: 'error', errorCode: 'e0055', message: 'username not found or password wrong.'});
                return;
            }
            sw.Session.findOne({where: {userId: user.id}}).then(function (session) {
                res.send({status: 'success', user: user, session: session, message: 'logged in successfully.'});
            });
        });
    });
});

router.post('/get_me', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
        if (membership !== undefined && membership.isGuest === true) {
            res.send({status: 'success', user: user});
        }
        else {
            sw.User.findOne({where: {id: session.userId}}).then(async function (user) {
                res.send({status: 'success', user: user, message: 'user fetched successfully.'});
            });
        }
    });
});

module.exports = router;
