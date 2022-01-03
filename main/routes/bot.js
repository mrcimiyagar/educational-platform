const sw = require('../db/models')
const express = require('express')
const bodyParser = require('body-parser')
const { authenticateMember } = require('../users')
const tools = require('../tools')
const { uuid } = require('uuidv4');

const router = express.Router()
let jsonParser = bodyParser.json()

router.post('/subscribe', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    if (
      (await sw.Subscription.findOne({
        where: { botId: req.body.botId, subscriberId: session.userId },
      })) !== null
    ) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'duplicate not allowed.',
      })
      return
    }
    let subscription = await sw.Subscription.create({
      botId: req.body.botId,
      subscriberId: session.userId,
    })
    res.send({ status: 'success', subscription })
  })
})

router.post('/unsubscribe', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let subscription = await sw.Subscription.findOne({
      where: { botId: req.body.botId, subscriberId: session.userId },
    })
    if (subscription === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'subscription does not exist.',
      })
      return
    }
    await subscription.destroy()
    res.send({ status: 'success' })
  })
})

router.post('/get_subscriptions', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let subscriptions = await sw.Subscription.findAll({
      raw: true,
      include: { all: true },
      where: { subscriberId: session.userId },
    })
    let widgets = await sw.Widget.findAll({
      raw: true,
      include: { all: true },
      where: { botId: subscriptions.map((s) => s.botId) },
    })
    res.send({
      status: 'success',
      subscriptions: subscriptions,
      widgets: widgets,
    })
  })
})

router.post('/subscribe_exists', jsonParser, async function (req, res) {

  let session = await sw.Session.findOne({where: {token: req.headers.token}});
  if (session === null) {
    res.send({
      status: 'error',
      errorCode: 'e0006',
      message: 'access denied.',
    });
    return;
  }
  
  let subscription = await sw.Subscription.findOne({where: {botId: req.body.botId, subscriberId: session.userId}});

  res.send({ status: 'success', exists: subscription !== null });
})

router.post('/set_wallpaper', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let roomSecret = await sw.RoomSecret.findOne({
      where: { roomId: membership.roomId },
    })
    if (roomSecret === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'room not found',
      })
      return
    }
    let wallpaperFile = await sw.File.findOne({
      where: { roomId: roomSecret.roomId, id: req.body.wallpaperId },
    })
    if (wallpaperFile === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'file not found',
      })
      return
    }
    roomSecret.wallpaper = req.body.wallpaperId
    await roomSecret.save()
    require('../server').pushTo(
      'room-' + membership.roomId,
      'room-wallpaper-modified',
      req.body.wallpaperId,
    )
    res.send({ status: 'success' })
  })
})

router.post('/get_bot_info', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, s, user, acc) => {
    let result = await sw.BotSecret.findOne({where: {botId: req.body.botId, creatorId: user.id}});
    if (result === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot does not exist.',
      })
      return;
    }
    res.send({ status: 'success', botSecret: result })
  })
})

router.post('/create_bot', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, s, user, acc) => {
    if (!acc.canAddBot) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    if ((await sw.Bot.findOne({where: {username: req.body.username}})) !== null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot already exists.',
      })
      return;
    }
    let bot = await sw.Bot.create({
      id: uuid() + '-' + Date.now(),
      title: req.body.title,
      description: req.body.description,
      username: req.body.username,
      avatarId: req.body.avatarId === undefined ? null : req.body.avatarId,
      categoryId:
        req.body.categoryId === undefined ? null : req.body.categoryId,
    })
    let botSecret = await sw.BotSecret.create({
      botId: bot.id,
      token: tools.makeRandomCode(64),
      creatorId: s.userId,
    })
    let session = await sw.Session.create({
      userId: bot.id,
      token: tools.makeRandomCode(64)
    })
    require('../server').pushTo('aseman-bot-store', 'bot-created', bot)
    res.send({ status: 'success', bot: bot, botSecret: botSecret, session: session })
  })
})

router.post('/delete_bot', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (acc.canModifyOwnBots) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let botSecret = await sw.BotSecret.findOne({
      where: { botId: req.body.botId, creatorId: session.userId },
    })
    if (botSecret === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let bot = await sw.Bot.findOne({ where: { id: botSecret.botId } })
    await botSecret.destroy()
    await bot.destroy()
    require('../server').pushTo('aseman-bot-store', 'bot-deleted', bot)
    res.send({ status: 'success' })
  })
})

router.post('/update_bot', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (acc.canModifyOwnBots) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let botSecret = await sw.BotSecret.findOne({
      where: { botId: req.body.botId, creatorId: session.userId },
    })
    if (botSecret === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let bot = await sw.Bot.findOne({ where: { id: botSecret.botId } })
    bot.title = req.body.title
    bot.description = req.body.description;
    bot.avatarId = req.body.avatarId
    await bot.save()
    require('../server').pushTo('aseman-bot-store', 'bot-updated', bot)
    res.send({ status: 'success' })
  })
})

router.post('/get_bots', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bots = await sw.Bot.findAll({
      raw: true,
      where: {
        categoryId: req.body.categoryId
      }
    })
    res.send({ status: 'success', bots: bots })
  })
})

router.post('/get_bot_by_id', jsonParser, async function (req, res) {
  let bot = await sw.Bot.findOne({
    where: {
      id: req.body.botId
    }
  })
  res.send({ status: 'success', bot: bot })
})

router.post('/create_comment', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    if (
      (await sw.Comment.findOne({
        where: { botId: req.body.botId, authorId: session.userId },
      })) !== null
    ) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'duplicate not allowed.',
      })
      return
    }
    let comment = await sw.Comment.create({
      botId: req.body.botId,
      authorId: session.userId,
      text: req.body.text,
      rating: req.body.rating,
    })
    require('../server').pushTo(
      'aseman-bot-page-' + bot.id,
      'comment-created',
      comment,
    )
    res.send({ status: 'success', comment })
  })
})

router.post('/delete_comment', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let comment = await sw.Comment.findOne({
      where: { botId: req.body.botId, authorId: session.userId },
    })
    if (comment === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'comment does not exist.',
      })
      return
    }
    await comment.destroy()
    require('../server').pushTo(
      'aseman-bot-page-' + bot.id,
      'comment-deleted',
      comment,
    )
    res.send({ status: 'success' })
  })
})

router.post('/update_comment', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let comment = await sw.Comment.findOne({
      where: { botId: req.body.botId, authorId: session.userId },
    })
    if (comment === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'comment does not exist.',
      })
      return
    }
    comment.text = req.body.text
    await comment.save()
    require('../server').pushTo(
      'aseman-bot-page' + bot.id,
      'comment-updated',
      comment,
    )
    res.send({ status: 'success' })
  })
})

router.post('/get_comments', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let comments = await sw.Comment.findAll({
      include: { all: true },
      raw: true,
      where: { botId: req.body.botId },
    })
    res.send({ status: 'success', comments: comments })
  })
})

router.post('/create_screenshot', jsonParser, async function (req, res) {
  let botId = req.query.botId
  let roomId = -1
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (!acc.canModifyOwnBots) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }

    let bot = await sw.Bot.findOne({ where: { id: botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }

    let form = new formidable.IncomingForm()
    form.parse(req, async function (err, fields, files) {
      if (!fs.existsSync('files')) {
        fs.mkdirSync('files')
      }
      let ext = ''
      let extIndex = files.file.name.lastIndexOf('.')
      if (extIndex > 0) {
        extIndex++
        if (extIndex < files.file.name.length) {
          ext = files.file.name.substring(extIndex)
        }
      }
      let preview = await sw.File.create({
        extension: 'png',
        uploaderId: session.userId,
        roomId: roomId,
        isPreview: true,
        isPresent: false,
      })
      let file = await sw.File.create({
        name: files.file.name,
        size: files.file.size,
        extension: ext,
        uploaderId: session.userId,
        roomId: roomId,
        previewFileId: preview.id,
        isPreview: false,
        isPresent: false,
      })
      let screenshot = await sw.Screenshot.create({
        fileId: preview.id,
        botId: bot.id,
      })
      let oldPath = files.file.path
      let newPath = rootPath + '/files/' + file.id
      fs.copyFileSync(oldPath, newPath)
      if (ext === 'pdf') {
        let previewFactoryPath = rootPath + '/temp/' + file.id + '.pdf'
        fs.copyFileSync(oldPath, previewFactoryPath)
      }

      if (
        ext === 'png' ||
        ext === 'jpg' ||
        ext === 'jpeg' ||
        ext === 'gif' ||
        ext === 'svg' ||
        ext === 'webp'
      ) {
        fs.copyFileSync(
          rootPath + '/files/' + file.id,
          rootPath + '/files/' + preview.id,
        )
        require('../server').pushTo(
          'aseman-bot-page' + bot.id,
          'screenshot-created',
          screenshot,
        )
        res.send({ status: 'success', screenshot: screenshot })
      } else {
        require('../server').pushTo(
          'aseman-bot-page' + bot.id,
          'screenshot-created',
          screenshot,
        )
        res.send({ status: 'success', screenshot: screenshot })
      }
    })
  })
})

router.post('/delete_screenshot', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let screenshot = await sw.Screenshot.findOne({
      where: { id: req.body.screenshotId },
    })
    if (screenshot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'screenshot does not exist.',
      })
      return
    }
    await screenshot.destroy()
    require('../server').pushTo(
      'aseman-bot-page-' + bot.id,
      'screenshot-deleted',
      screenshot,
    )
    res.send({ status: 'success' })
  })
})

router.post('/get_screenshots', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let screenshots = await sw.Screenshot.findAll({
      raw: true,
      where: { botId: req.body.botId },
    })
    res.send({ status: 'success', screenshots: screenshots })
  })
})

router.post('/create_widget', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let widget = await sw.Widget.create({
      botId: req.body.botId,
      title: req.body.title,
    })
    require('../server').pushTo(
      'aseman-bot-page-' + bot.id,
      'widget-created',
      widget,
    )
    res.send({ status: 'success', widget })
  })
})

router.post('/delete_widget', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let botSecret = await sw.BotSecret.findOne({ where: { botId: bot.id } })
    if (botSecret.creatorId !== session.userId) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let widget = await sw.Widget.findOne({ where: { botId: req.body.botId } })
    if (widget === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'widget does not exist.',
      })
      return
    }
    await widget.destroy()
    require('../server').pushTo(
      'aseman-bot-page-' + bot.id,
      'widget-deleted',
      widget,
    )
    res.send({ status: 'success' })
  })
})

router.post('/update_widget', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let botSecret = await sw.BotSecret.findOne({ where: { botId: bot.id } })
    if (botSecret.creatorId !== session.userId) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let widget = await sw.Widget.findOne({ where: { botId: req.body.botId } })
    if (widget === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'widget does not exist.',
      })
      return
    }
    widget.title = req.body.title
    await widget.save()
    require('../server').pushTo(
      'aseman-bot-page' + bot.id,
      'widget-updated',
      widget,
    )
    res.send({ status: 'success' })
  })
})

router.post('/get_widgets', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let widgets = await sw.Widget.findAll({
      raw: true,
      where: { botId: req.body.botId },
    })
    res.send({ status: 'success', widgets: widgets })
  })
})

router.post('/create_workership', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let subscription = await sw.Subscription.findOne({
      where: { subscriberId: session.userId, botId: req.body.botId },
    })
    if (subscription === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    if (membership === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let workership = await sw.Workership.create({
      botId: bot.id,
      roomId: membership.roomId
    })
    require('../server').pushTo(
      'room-' + membership.roomId,
      'workership-created',
      workership,
    )
    res.send({ status: 'success', workership: workership })
  })
})

router.post('/delete_workership', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let subscription = await sw.Subscription.findOne({
      where: { userId: session.userId, botId: req.body.botId },
    })
    if (subscription === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    if (membership === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let widget = await sw.Widget.findOne({
      where: { id: req.body.widgetId, botId: req.body.botId },
    })
    if (widget === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let workership = await sw.Workership.findOne({
      where: { roomId: membership.roomId, widgetId: widget.id },
    })
    await workership.destroy()
    require('../server').pushTo(
      'room-' + membership.roomId,
      'workership-deleted',
      workership,
    )
    res.send({ status: 'success' })
  })
})

router.post('/update_workership', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    let subscription = await sw.Subscription.findOne({
      where: { userId: session.userId, botId: req.body.botId },
    })
    if (subscription === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    if (membership === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let widget = await sw.Widget.findOne({
      where: { id: req.body.widgetId, botId: req.body.botId },
    })
    if (widget === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let workership = await sw.Workership.findOne({
      where: { roomId: membership.roomId, widgetId: widget.id },
    })
    workership.x = req.body.x
    workership.y = req.body.y
    workership.width = req.body.width
    workership.height = req.body.height
    await workership.save()
    require('../server').pushTo(
      'room-' + membership.roomId,
      'workership-updated',
      workership,
    )
    res.send({ status: 'success' })
  })
})

router.post('/get_workerships', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let bot = await sw.Bot.findOne({ where: { id: req.body.botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }
    if (membership === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let workerships = await sw.Workership.findAll({
      include: { all: true },
      raw: true,
      where: { roomId: membership.roomId },
    })
    let widgets = await sw.Widget.findAll({
      include: { all: true },
      raw: true,
      where: { id: workerships.map((ws) => ws.widgetId) },
    })
    res.send({ status: 'success', workerships: workerships, widgets: widgets })
  })
})

router.post('/workership_exists', jsonParser, async function (req, res) {

  let session = await sw.Session.findOne({where: {token: req.headers.token}});
  if (session === null) {
    res.send({
      status: 'error',
      errorCode: 'e0006',
      message: 'access denied.',
    });
    return;
  }

  let membership = await sw.Membership.findOne({where: {userId: session.userId, roomId: req.body.roomId}});
  if (membership === null) {
    res.send({
      status: 'error',
      errorCode: 'e0006',
      message: 'access denied.',
    });
    return;
  }
  
  let workership = await sw.Workership.findOne({where: {botId: req.body.botId, roomId: req.body.roomId}});

  res.send({ status: 'success', exists: workership !== null });
})

router.post('/get_bot_workerships', jsonParser, async function (req, res) {

  let session = await sw.Session.findOne({where: {token: req.headers.token}});
  if (session === null) {
    res.send({
      status: 'error',
      errorCode: 'e0006',
      message: 'access denied.',
    });
    return;
  }

  let workerships = await sw.Workership.findAll({
    include: { all: true },
    raw: true,
    where: { botId: session.userId }
  });

  res.send({ status: 'success', workerships: workerships });
})

router.post('/request_initial_gui', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (req.body.preview === true) {
      let widget = await sw.Widget.findOne({where: {id: req.body.widgetId}});
      if (widget === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'access denied.'
        });
        return;
      }
      require('../server').signlePushTo(widget.botId, 'request_initial_gui', {
        widgetId: widget.id,
        userId: user.id,
        preview: true
      });
      res.send({ status: 'success' });
    }
    else {
      let widget = await sw.Widget.findOne({where: {id: req.body.widgetId}});
      if (widget === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'access denied.'
        });
        return;
      }
      let bot = await sw.Bot.findOne({where: {id: widget.botId}});
      let workership = await sw.Workership.findOne({where: {roomId: req.body.roomId, botId: bot.id}});
      if (workership === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'access denied.'
        });
        return;
      }
      require('../server').signlePushTo(bot.id, 'request_initial_gui', {
        roomId: workership.roomId,
        widgetId: widget.id,
        userId: user.id,
        preview: false
      });
      res.send({ status: 'success' });
    }
  })
})

router.post('/gui', jsonParser, async function (req, res) {
  let session = await sw.Session.findOne({where: {token: req.headers.token}});
  if (session === null) {
    res.send({
      status: 'error',
      errorCode: 'e0005',
      message: 'access denied.',
    });
    return;
  }
  let bot = await sw.Bot.findOne({where: {id: session.userId}});
  if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      });
      return;
  }
  if (req.body.preview === true) {
      let widget = await sw.Widget.findOne({where: {botId: bot.id, id: req.body.widgetId}});
      if (widget === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'access denied.',
        });
        return;
      }
      require('../server').signlePushTo(req.body.userId, 'gui', {
        type: 'init',
        gui: req.body.gui,
        widgetId: widget.id,
      });
      res.send({ status: 'success' });
  }
  else {
      let workership = await sw.Workership.findOne({where: {botId: bot.id, roomId: req.body.roomId}});
      if (workership === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'access denied.',
        })
        return
      }
      if (widget === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'access denied.',
        })
        return
      }
      let targetUserId = req.body.userId
      if (
        targetUserId !== undefined &&
        (await sw.Membership.findOne({
          where: { roomId: workership.roomId, userId: targetUserId },
        })) === null
      ) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'access denied.',
        })
        return
      }
      let isPacketGlobal = req.body.globalGui
      let gui = req.body.gui
      if (isPacketGlobal) {
        require('../server').pushTo('room-' + workership.roomId, 'gui', {
          type: 'init',
          gui: gui,
          roomId: workership.roomId,
          widgetId: widget.id,
        })
      } else {
        require('../server').signlePushTo(targetUserId, 'gui', {
          type: 'init',
          gui: gui,
          roomId: workership.roomId,
          widgetId: widget.id,
        })
      }
      res.send({ status: 'success' })
  }
})

router.post('/create_ad', jsonParser, async function (req, res) {
  let roomId = -1
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (!acc.canModifyOwnBots) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }

    let bot = await sw.Bot.findOne({ where: { id: botId } })
    if (bot === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'bot not found.',
      })
      return
    }

    let form = new formidable.IncomingForm()
    form.parse(req, async function (err, fields, files) {
      if (!fs.existsSync('files')) {
        fs.mkdirSync('files')
      }
      let ext = ''
      let extIndex = files.file.name.lastIndexOf('.')
      if (extIndex > 0) {
        extIndex++
        if (extIndex < files.file.name.length) {
          ext = files.file.name.substring(extIndex)
        }
      }
      let preview = await sw.File.create({
        extension: 'png',
        uploaderId: session.userId,
        roomId: roomId,
        isPreview: true,
        isPresent: false,
      })
      let file = await sw.File.create({
        name: files.file.name,
        size: files.file.size,
        extension: ext,
        uploaderId: session.userId,
        roomId: roomId,
        previewFileId: preview.id,
        isPreview: false,
        isPresent: false,
      })
      let storeAd = await sw.StoreAd.create({
        fileId: preview.id,
      })
      let oldPath = files.file.path
      let newPath = rootPath + '/files/' + file.id
      fs.copyFileSync(oldPath, newPath)

      if (
        ext === 'png' ||
        ext === 'jpg' ||
        ext === 'jpeg' ||
        ext === 'gif' ||
        ext === 'webp' ||
        ext === 'svg'
      ) {
        fs.copyFileSync(
          rootPath + '/files/' + file.id,
          rootPath + '/files/' + preview.id,
        )
        require('../server').pushTo(
          'aseman-bot-store' + bot.id,
          'store-ad-created',
          storeAd,
        )
        res.send({ status: 'success', file: file })
      } else {
        require('../server').pushTo(
          'aseman-bot-store' + bot.id,
          'store-ad-created',
          storeAd,
        )
        res.send({ status: 'success', file: file })
      }
    })
  })
})

router.post('/delete_ad', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let ad = await sw.StoreAd.findOne({ where: { id: req.body.storeAdId } })
    if (ad === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'ad does not exist.',
      })
      return
    }
    await ad.destroy()
    require('../server').pushTo('aseman-bot-store', 'store-ad-deleted', ad)
    res.send({ status: 'success' })
  })
})

router.post('/get_ads', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let ads = await sw.StoreAd.findAll({ raw: true })
    res.send({ status: 'success', ads: ads })
  })
})

router.post('/create_category', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (!acc.canModifyStoreCategory) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let cat = await sw.StoreCategory.create({
      title: req.body.title,
    })
    require('../server').pushToExcept(
      'aseman-bot-store',
      'store-category-created',
      cat,
      user.id
    )
    res.send({ status: 'success', category: cat })
  })
})

router.post('/delete_category', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (!acc.canModifyStoreCategories) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let cat = await sw.StoreCategory.findOne({
      where: {
        id: req.body.categoryId,
      },
    })
    await cat.destroy()
    require('../server').pushTo(
      'aseman-bot-store',
      'store-category-deleted',
      cat,
    )
    res.send({ status: 'success' })
  })
})

router.post('/update_category', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (!acc.canModifyStoreCategories) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let cat = await sw.StoreCategory.findOne({
      where: {
        id: req.body.categoryId,
      },
    })
    cat.title = req.body.title
    await cat.save()
    require('../server').pushTo(
      'aseman-bot-store',
      'store-category-updated',
      cat,
    )
    res.send({ status: 'success' })
  })
})

router.post('/get_categories', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let cats = await sw.StoreCategory.findAll({ raw: true });
    let result = [];
    if (req.body.loadExtra) {
      for (let i = 0; i < cats.length; i++) {
        let cat = cats[i];
        let resultCat = {
          id: cat.id,
          title: cat.title
        }
        resultCat.bots = await sw.Bot.findAll({raw: true, where: {categoryId: cat.id}});
        resultCat.packages = await sw.StorePackage.findAll({raw: true, where: {categoryId: cat.id}});
        result.push(resultCat);
      }
    }
    else {
      result = cats;
    }
    res.send({ status: 'success', categories: result })
  })
})

router.post('/create_package', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (!acc.canModifyStorePackage) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let pack = await sw.StorePackage.create({
      title: req.body.title,
      coverUrl: req.body.coverUrl,
      categoryId: req.body.categoryId,
    })
    require('../server').pushTo(
      'aseman-bot-store',
      'store-package-created',
      pack,
    )
    res.send({ status: 'success', package: pack })
  })
})

router.post('/delete_package', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (!acc.canModifyStorePackages) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let pack = await sw.StorePackage.findOne({
      where: {
        id: req.body.packageId,
      },
    })
    await pack.destroy()
    require('../server').pushTo(
      'aseman-bot-store',
      'store-package-deleted',
      pack,
    )
    res.send({ status: 'success' })
  })
})

router.post('/update_package', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    if (!acc.canModifyStorePackages) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let pack = await sw.StorePackage.findOne({
      where: {
        id: req.body.packageId,
      },
    })
    pack.title = req.body.title
    pack.coverUrl = req.body.coverUrl
    pack.categoryId = req.body.categoryId
    await pack.save()
    require('../server').pushTo(
      'aseman-bot-store',
      'store-package-updated',
      pack,
    )
    res.send({ status: 'success' })
  })
})

router.post('/get_packages', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let packs = await sw.StorePackage.findAll({
      raw: true,
      where: { categoryId: req.body.categoryId },
    })
    res.send({ status: 'success', packages: packs })
  })
})

router.post('/get_my_bots', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user, acc) => {
    let myBotSecrets = await sw.BotSecret.findAll({
      raw: true,
      where: { creatorId: user.id },
    });
    let myBots = await sw.Bot.findAll({
      raw: true,
      where: {id: myBotSecrets.map(bs => bs.botId)}
    });
    let result = [];
    for (let i = 0; i < myBots.length; i++) {
      let bot = myBots[i];
      let b = {
        id: bot.id,
        title: bot.title,
        categoryId: bot.categoryId,
        avatarId: bot.avatarId,
        description: bot.description,
        username: bot.username
      }
      b.widgets = await sw.Widget.findAll({raw: true, where: {botId: b.id}});
      result.push(b);
    }
    res.send({ status: 'success', myBots: result })
  })
})

module.exports = router
