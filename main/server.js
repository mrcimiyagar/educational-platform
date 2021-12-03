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
const mongo = require("./db/mongo");
const cors = require('cors');
const sw = require('./db/models');
const bodyParser = require('body-parser');
const { authenticateMember, usersSubscriptions } = require('./users');
const expressStaticGzip = require('express-static-gzip');
const webpush = require('web-push');
const { dirname } = require('path');

let jsonParser = bodyParser.json();

app.use(cors());

webpush.setVapidDetails(
    "mailto:theprogrammermachine@gmail.com",
    'BNgD5u59pcsAJKNff5A8Wjw0sB-TKSmhfkXxLluZAB_ieQGTQdYDxG81EEsPMA_mzNN6GfWUS8XEMW6FOttCC8s',
    'ns9sb4bAIZxxVEpqtpFs5xMJ1wo5HyktIKt6k3QnoXI'
);
app.post("/subscribe", jsonParser, async (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;
    let session = await sw.Session.findOne({where: {token: req.headers.token}});
    let user = await sw.User.findOne({where: {id: session.userId}});
    usersSubscriptions[user.id] = subscription;  
    // Send 201 - resource created
    res.status(201).json({});
    // Create payload
    const payload = JSON.stringify({ title: "به ابر آسمان خوش آمدید." });
    // Pass object into sendNotification
    webpush
        .sendNotification(subscription, payload)
        .catch(err => console.error(err));
});

server.listen(2001);

let notifs = {};
let kasperio = socket.setup(server);

models.setup().then(() => {
    mongo.setup((s, a) => {

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
            res.sendFile(__dirname + '/client-app/build/index.html');
        });

        module.exports = {
            'kasperioInstance': kasperio,
            'notifs': notifs,
            'pushTo': (nodeId, key, data) => {
                let d = JSON.stringify(data);
                if (d.length > 50) d = d.substr(0, 50);
                console.log(`sending packet to ${nodeId} - ${key} - ${d}`);
                let node = kasperio.to(nodeId);
                if (node.node === null || node.node === undefined) {
                    if (node.type === 'user') {
                        if (notifs[nodeId] === undefined) {
                            notifs[nodeId] = [];
                        }
                        notifs[nodeId].push({key, data});
                    }
                    else if (node.type === 'room') {
                        node.node.members.forEach(m => {
                            if (notifs[m.userId] === undefined) {
                                notifs[m.userId] = [];
                            }
                            notifs[m.userId].push({key, data});
                        });
                    }
                    return;
                }
                node.emit(key, data);
            },
            'Survey': s,
            'Answer': a
        };

        setInterval(() => {
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        }, 2500);
    });
});