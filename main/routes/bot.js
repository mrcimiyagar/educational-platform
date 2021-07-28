const sw = require('../db/models');
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require("../db/models");
const { authenticateMember } = require('../users');
const tools = require('../tools');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/subscribe', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let bot = await sw.Bot.findOne({where: {id: req.body.botId}})
        if (bot === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'bot not found.'})
            return
        }
        if ((await sw.Subscription.findOne({where: {botId: req.body.botId, subscriberId: session.userId}})) !== null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'duplicate not allowed.'})
            return
        }
        let subscription = await sw.Subscription.create({
            botId: req.body.botId,
            subscriberId: session.userId
        })
        res.send({status: 'success', subscription})
    })
})

router.post('/unsubscribe', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let bot = await sw.Bot.findOne({where: {id: req.body.botId}})
        if (bot === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'bot not found.'})
            return
        }
        let subscription = await sw.Subscription.findOne({where: {botId: req.body.botId, subscriberId: session.userId}})
        if (subscription === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'subscription does not exist.'})
            return
        }
        await subscription.destroy()
        res.send({status: 'success'})
    })
})

router.post('/set_wallpaper', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let roomSecret = await sw.RoomSecret.findOne({where: {roomId: membership.roomId}})
        if (roomSecret === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'room not found'})
            return
        }
        let wallpaperFile = await sw.File.findOne({where: {roomId: roomSecret.roomId, id: req.body.wallpaperId}})
        if (wallpaperFile === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'file not found'})
            return
        }
        roomSecret.wallpaper = req.body.wallpaperId
        roomSecret.save()
        require('../server').pushTo('room-' + membership.roomId, 'room-wallpaper-modified', req.body.wallpaperId)
        res.send({status: 'success'})
    })
})

router.post('/create_bot', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        if (acc.canModifyOwnBots) {
            res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'})
            return
        }
        let bot = await sw.Bot.create({
            title: req.body.title,
            username: req.body.username
        })
        let botSecret = await sw.BotSecret.create({
            botId: bot.id,
            token: tools.makeRandomCode(64),
            creatorId: session.userId
        })
        require('../server').pushTo('aseman-bot-store', 'bot-created', bot)
        res.send({status: 'success', bot: bot, botSecret: botSecret})
    })
})

router.post('/delete_bot', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        if (acc.canModifyOwnBots) {
            res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'})
            return
        }
        let botSecret = await sw.BotSecret.findOne({where: {botId: req.body.botId, creatorId: session.userId}})
        if (botSecret === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'})
            return
        }
        let bot = await sw.Bot.findOne({where: {id: botSecret.botId}})
        await botSecret.destroy()
        await bot.destroy()
        require('../server').pushTo('aseman-bot-store', 'bot-deleted', bot)
        res.send({status: 'success'})
    })
})

router.post('/update_bot', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        if (acc.canModifyOwnBots) {
            res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'})
            return
        }
        let botSecret = await sw.BotSecret.findOne({where: {botId: req.body.botId, creatorId: session.userId}})
        if (botSecret === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'})
            return
        }
        let bot = await sw.Bot.findOne({where: {id: botSecret.botId}})
        bot.title = req.body.title
        await bot.save()
        require('../server').pushTo('aseman-bot-store', 'bot-updated', bot)
        res.send({status: 'success'})
    })
})

router.post('/get_bots', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let bots = await sw.Bot.findAll({raw: true})
        res.send({status: 'success', bots: bots})
    })
})

router.post('/create_comment', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let bot = await sw.Bot.findOne({where: {id: req.body.botId}})
        if ((await sw.Comment.findOne({where: {botId: req.body.botId, authorId: session.userId}})) !== null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'duplicate not allowed.'})
            return
        }
        let comment = await sw.Comment.create({
            botId: req.body.botId,
            authorId: session.userId,
            text: req.body.text,
            rating: req.body.rating
        })
        require('../server').pushTo('aseman-bot-comments-' + bot.id, 'comment-created', comment)
        res.send({status: 'success', comment})
    })
})

router.post('/delete_comment', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let bot = await sw.Bot.findOne({where: {id: req.body.botId}})
        let comment = await sw.Comment.findOne({where: {botId: req.body.botId, authorId: session.userId}})
        if (comment === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'comment does not exist.'})
            return
        }
        await comment.destroy()
        require('../server').pushTo('aseman-bot-comments-' + bot.id, 'comment-deleted', comment)
        res.send({status: 'success'})
    })
})

router.post('/update_comment', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let bot = await sw.Bot.findOne({where: {id: req.body.botId}})
        let comment = await sw.Comment.findOne({where: {botId: req.body.botId, authorId: session.userId}})
        if (comment === null) {
            res.send({status: 'error', errorCode: 'e0005', message: 'comment does not exist.'})
            return
        }
        comment.text = req.body.text
        await comment.save()
        require('../server').pushTo('aseman-bot-comments-' + bot.id, 'comment-updated', comment)
        res.send({status: 'success'})
    })
})

router.post('/get_comments', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user, acc) => {
        let comments = await sw.Comment.findAll({raw: true})
        res.send({status: 'success', comments: comments})
    })
})

module.exports = router
