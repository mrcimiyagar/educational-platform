const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const fs = require('fs');
let sslOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};
let server = http.createServer(app);
const models = require('./db/models');
const socket = require('./socket');
const present = require('./routes/present');
const auth = require('./routes/auth');
const room = require('./routes/room');
const file = require('./routes/file');
const poll = require('./routes/poll');
const chat = require('./routes/chat');
const video = require('./routes/video');
const survey = require('./routes/survey');
const shots = require('./routes/shots');
const home = require('./routes/home');
const view = require('./routes/view');
const bot = require('./routes/bot');
const search = require('./routes/search');
const notif = require('./routes/notifications');
const cors = require('cors');
const sw = require('./db/models');
const bodyParser = require('body-parser');
const { getRoomUsers, usersBook } = require('./users');
const expressStaticGzip = require('express-static-gzip');
const { sockets, notifs } = require('./socket');
const fetch = require('node-fetch');
const users = require('./users');
let {google} = require("googleapis");

let jsonParser = bodyParser.json();

app.use(cors());

let creatures = [];

let firebaseTokens = {};
let at = undefined;


const checkFirebaseAccessToken = () =>  {
// Load the service account key JSON file.
var serviceAccount = require("./serviceAccount.json");

// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database",
  "https://www.googleapis.com/auth/cloud-platform"
];

// Authenticate a JWT client with the service account.
var jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

// Use the JWT client to generate an access token.
jwtClient.authorize(function(error, tokens) {
  if (error) {
    console.log("Error making request to generate access token:", error);
  } else if (tokens.access_token === null) {
    console.log("Provided service account does not have permission to generate access tokens");
  } else {
    console.log(tokens.access_token);
    at = tokens.access_token;
  }
});
};
checkFirebaseAccessToken();
setInterval(checkFirebaseAccessToken, 30 * 60 * 1000);

app.post('/registerFirebaseToken', jsonParser, async (req, res) => {
    let session = await sw.Session.findOne({where: {token: req.headers.token}});
    firebaseTokens[session.userId] = req.body.firebaseToken;
    let result = await fetch(`https://fcm.googleapis.com//v1/projects/${'infinity-e17df'}/messages:send`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + at },
      body: JSON.stringify(
        {
            "message": {
              "token": req.body.firebaseToken,
              "notification": {
                "title": "Infinity",
                "body": "به ابر آسمان خوش آمدید."
              },
              data: { type: 'welcome'},
              "webpush": {
                "fcm_options": {
                  "link": 'https://society.kasperian.cloud'
                }
              }
            }
          }
      )
    });
    result = await result.json();

    res.send({status: 'success', result, firebaseTokens});
});
const pushNotification = async (userId, body, link, otherData) => {
    let result = await fetch(`https://fcm.googleapis.com//v1/projects/${'infinity-e17df'}/messages:send`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + at },
      body: JSON.stringify(
        {
            "message": {
              "token": firebaseTokens[userId],
              "notification": {
                "title": 'Infinity',
                "body": body
              },
              data: { link: link, ...otherData},
              "webpush": {
                "fcm_options": {
                  "link": link
                }
              }
            }
          }
      )
    });
    result = await result.json();
    console.log(result);
}
server.listen(2001);
socket.setup(server);

models.setup().then(() => {
    
    sw.User.findAll({raw: true}).then(us => {
        us.forEach(user => {
            usersBook[user.id] = user;
        });
        creatures = creatures.concat(us.map(u => u.id));
        sw.Bot.findAll({raw: true}).then(bs => {
            bs.forEach(bot => {
                usersBook[bot.id] = bot;
            });
            creatures = creatures.concat(bs.map(b => b.id));
        });
    });

    var myIceServers = [
        {"url":"stun:185.81.96.105:3478"},
        {
          "url":"turn:185.81.96.105:3478",
          "username":"guest",
          "credential":"somepassword"
        }
    ];

    app.use(function (req, res, next) {
        console.log('\u001b[' + 32 + 'm' + '..............................................................' + '\u001b[0m')
        console.log('\u001b[' + 32 + 'm' + req.method + ' ' + req.path + '\u001b[0m')
        console.log('\u001b[' + 32 + 'm' + '..............................................................' + '\u001b[0m')
        next()
    })

    app.use('/present', present);
    app.use('/auth', auth);
    app.use('/room', room);
    app.use('/file', file);
    app.use('/poll', poll);
    app.use('/chat', chat);
    app.use('/video', video);
    app.use('/survey', survey);
    app.use('/shots', shots);
    app.use('/home', home);
    app.use('/view', view);
    app.use('/bot', bot);
    app.use('/notifications', notif);
    app.use('/search', search);

    app.use('/fetch_rooms', (req, res) => {
        sw.Session.findAll({limit: 1}).then(async function (sessions) {
            if (req.headers.token === sessions[0].token) {
                sw.Room.findAll({}).then(rooms => {
                    res.send({status: 'success', rooms: rooms});
                });
            }
        });
    });

    app.post('/fetch_membership', jsonParser, async function (req, res) {
        sw.Session.findOne({where: {token: req.headers.token}}).then(async function (session) {
            if (session === null) {
                res.send({status: 'error', errorCode: 'e0005', message: 'session does not exist.'});
                return;
            }
            sw.Membership.findOne({where: {roomId: req.body.roomId, userId: session.userId}}).then(async membership => {
                console.log(req.headers.token + ' ' + req.body.roomId)
                if (membership === null) {
                    res.send({status: 'error', errorCode: 'e0005', message: 'membership does not exist.'});
                    return;
                }
                res.send({status: 'success', membership});
            });
        });
    });

    app.use(express.static('client-app/build'));

    const buildPath = path.join(__dirname, '..', 'build');
    app.use(
        '/',
        expressStaticGzip(buildPath, {
            enableBrotli: true,
            orderPreference: ['br', 'gz']
        })
    );

    app.get('*', (req, res) => {
        if (fs.existsSync(__dirname + '/client-app/build/index.html')) {
            res.sendFile(__dirname + '/client-app/build/index.html');
        }
        else {
            res.send({message: 'the web app is under maintenance...'});
        }
    });

    let updateClients = () => {
        creatures.forEach(id => {
            if (notifs[id] !== undefined && notifs[id].length > 0 && sockets[id] !== undefined) {
                sockets[id].emit('sync');
            }
        });
    };

    setInterval(updateClients, 1000);

    module.exports = {
        newCreatureId: (id) => {
            creatures.push(id);
        },
        'pushToExcept': async (nodeId, key, data, exceptionId) => {
            if (nodeId === 'aseman-bot-store') {
                let users = await sw.User.findAll({raw: true});
                let userIds = users.map(u => u.id);
                userIds.forEach(uid => {
                    if (uid === exceptionId) return;
                    let d = JSON.stringify(data);
                    if (d.length > 100) d = d.substr(0, 100);
                    if (notifs[uid] === undefined) notifs[uid] = [];
                    notifs[uid].push({key, data});
                });
            }
            else {
                let roomId = Number(nodeId.substr('room_'.length));
                let users = getRoomUsers(roomId);
                users.forEach(user => {
                    if (user.id === exceptionId) return;
                    if (notifs[user.id] === undefined) notifs[user.id] = [];
                    notifs[user.id].push({key, data});
                });
                let workerships = await sw.Workership.findAll({raw: true, where: {roomId: roomId}});
                workerships.forEach(w => {
                    if (w.botId === exceptionId) return;
                    if (notifs[w.botId] === undefined) notifs[w.botId] = [];
                    notifs[w.botId].push({key, data});
                });
            }
        },
        'pushTo': async (nodeId, key, data) => {
            if (nodeId === 'aseman-bot-store') {
                let users = await sw.User.findAll({raw: true});
                let userIds = users.map(u => u.id);
                userIds.forEach(uid => {
                    let d = JSON.stringify(data);
                    if (d.length > 100) d = d.substr(0, 100);
                    if (notifs[uid] === undefined) notifs[uid] = [];
                    notifs[uid].push({key, data});
                });
            }
            else {
                let roomId = Number(nodeId.substr('room_'.length));
                let users = getRoomUsers(roomId);
                users.forEach(user => {
                    if (notifs[user.id] === undefined) notifs[user.id] = [];
                    notifs[user.id].push({key, data});
                });
                let workerships = await sw.Workership.findAll({raw: true, where: {roomId: roomId}});
                workerships.forEach(w => {
                    if (notifs[w.botId] === undefined) notifs[w.botId] = [];
                    notifs[w.botId].push({key, data});
                });
            }
        },
        'signlePushTo': (userId, key, data, instantly) => {
            if (instantly === true) {
                if (sockets[userId] !== undefined) {
                    sockets[userId].emit(key, data);
                }
                return;
            }
            let d = JSON.stringify(data);
            if (d.length > 100) d = d.substr(0, 100);
            if (notifs[userId] === undefined) notifs[userId] = [];
            notifs[userId].push({key, data});
        },
        pushNotification: pushNotification
    };
});
