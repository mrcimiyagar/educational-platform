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
const message = require('./routes/message');
const video = require('./routes/video');
const survey = require('./routes/survey');
const shots = require('./routes/shots');
const home = require('./routes/home');
const view = require('./routes/view');
const mongo = require("./db/mongo");
const cors = require('cors');
const sw = require('./db/models');
const bodyParser = require('body-parser');
const { authenticateMember } = require('./users');
const expressStaticGzip = require('express-static-gzip');

let jsonParser = bodyParser.json();

server.listen(1002);

let kasperio = socket.setup(server);

models.setup().then(() => {
    mongo.setup((s, a) => {

        app.use(cors());

        var myIceServers = [
            {"url":"stun:185.81.96.230:3478"},
            {
              "url":"turn:185.81.96.230:3478",
              "username":"guest",
              "credential":"somepassword"
            }
        ];

        app.use('/present', present);
        app.use('/auth', auth);
        app.use('/room', room);
        app.use('/file', file);
        app.use('/poll', poll);
        app.use('/message', message);
        app.use('/video', video);
        app.use('/survey', survey);
        app.use('/shots', shots);
        app.use('/home', home);
        app.use('/view', view);

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
            'pushTo': (nodeId, key, data) => {
                let d = JSON.stringify(data);
                if (d.length > 50) d = d.substr(0, 50);
                console.log(`sending packet to ${nodeId} - ${key} - ${d}`);
                let node = kasperio.to(nodeId);
                if (node === null || node === undefined) return;
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