const sw = require('../db/models');
const express = require('express');
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { authenticateMember } = require('../users');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/add_survey', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.Account.findOne({where: {userId: session.userId}}).then(async acc => {
            if (!acc.canAddSurvey) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            let {Survey} = require("../server");
            const survey = new Survey(req.body.survey);
            survey.creatorId = session.userId;
            await survey.save();
            await sw.MySurvey.create({
                userId: session.userId,
                surveyId: survey._id.toString(),
                answered: false
            });
            res.send({status: 'success', survey: survey});
        });
    });
});

router.post('/add_label', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.Account.findOne({where: {userId: session.userId}}).then(async acc => {
            if (!acc.canAddSurveyLabel) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            let label = await sw.SurveyLabel.create({
                name: req.body.name
            });
            res.send({status: 'success', label: label});
        })
    });
});

router.post('/get_labels', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.SurveyLabel.findAll().then(async labels => {
            res.send({status: 'success', labels: labels});
        })
    });
});

router.post('/remove_label', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.Account.findOne({where: {userId: session.userId}}).then(async acc => {
            if (!acc.canRemoveSurveyLabel) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            sw.SurveyLabel.findOne({where: {id: surveyLabelId}}).then(async label => {
                if (label === null) {
                    res.send({status: 'error', errorCode: 'e0005', message: 'label does not exist.'});
                    return;
                }
                await label.destroy();
                res.send({status: 'success'});
            });
        });
    });
});

router.post('/add_category', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.Account.findOne({where: {userId: session.userId}}).then(async acc => {
            if (!acc.canAddSurveyCat) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            let cat = await sw.SurveyCat.create({
                name: req.body.name
            });
            res.send({status: 'success', category: cat});
        })
    });
});

router.post('/get_categories', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.SurveyCat.findAll().then(async cats => {
            res.send({status: 'success', categories: cats});
        })
    });
});

router.post('/remove_category', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.Account.findOne({where: {userId: session.userId}}).then(async acc => {
            if (!acc.canRemoveSurveyCat) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            sw.SurveyCat.findOne({where: {id: surveyCatId}}).then(async cat => {
                if (cat === null) {
                    res.send({status: 'error', errorCode: 'e0005', message: 'category does not exist.'});
                    return;
                }
                await cat.destroy();
                res.send({status: 'success'});
            });
        })
    });
});

router.post('/remove_survey', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        let {Survey} = require('../server');
        await Survey.deleteOne({ _id: req.body.surveyId });
        res.send({status: 'success'});
    });
});

router.post('/assign_survey', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.Room.findOne({where: {id: req.body.roomId}}).then(room => {
            if (room.ownerId !== session.userId) {
                res.send({status: 'error', errorCode: 'e005'});
                return;
            }
            sw.Membership.findAll({where: {roomId: req.body.roomId}}).then(async ms => {
                ms.forEach(member => {
                    sw.Invite.create({
                        userId: member.userId,
                        roomId: req.body.roomId,
                        extra: req.body.extra,
                        title: req.body.title,
                        text: req.body.text,
                        inviteType: 'survey'
                    });
                });
                res.send({status: 'success'});
            });
        });
    });
});

router.post('/get_surveys', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.MySurvey.findAll({where: {userId: session.userId}}).then(async ss => {
            require('../server').Survey.find({'_id': { $in: ss.map(s => mongoose.Types.ObjectId(s.surveyId))}
            }, function(err, docs) {
                res.send({status: 'success', surveys: docs, states: ss});
            });
        });
    });
});

router.post('/answer_survey', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.Invite.findOne({where: {userId: session.userId, extra: req.body.survey.id}}).then(async invite => {
            if (invite === null) {
                sw.MySurvey.findOne({where: {userId: session.userId, surveyId: req.body.survey.id}}).then(async mySurvey => {
                    if (mySurvey === null) {
                        res.send({status: 'error', errorCode: 'e0005'});
                        return;
                    }
                    require('../server').Survey.findOne({_id: req.body.survey.id}, function (err, survey) {
                        res.send({status: 'success', survey: survey});
                    });
                });
            }
            else {
                await sw.MySurvey.create({
                    userId: session.userId,
                    surveyId: req.body.survey.id
                });
                require('../server').Survey.findOne({_id: req.body.survey.id}, function (err, survey) {
                    res.send({status: 'success', surveys: survey});
                });
            }
        });
    });
});

router.post('/complete_survey', jsonParser, async function (req, res) {
    sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
        if (session === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
            return;
        }
        sw.MySurvey.findOne({where: {userId: session.userId, surveyId: req.body.survey.id}}).then(async mySurvey => {
            if (mySurvey === null) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            if (mySurvey.answered === false) {
                let {Answer} = require("../server");
                const answer = new Answer(req.body.answer);
                answer.surveyId = mySurvey.surveyId;
                await answer.save();
                mySurvey.answered = true;
                await mySurvey.save();
                res.send({status: 'success', answer: answer});
            }
            else {
                res.send({status: 'error', errorCode: 'e0005', message: 'already answered.'});
            }
        });
    });
});

module.exports = router;
