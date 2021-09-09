
let httpProxy = require('http-proxy')
let https = require('https')
let fs = require('fs')

var proxy = httpProxy.createProxyServer({changeOrigin: true, ws: true});

let serv = https.createServer({
  cert: fs.readFileSync('server.cert'),
  key: fs.readFileSync('server.key')
}, function(req, res) {
  if (req.headers.host === 'whiteboard1.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1000' }, e => {})
  }
  else if (req.headers.host === 'confvideo.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1010'}, e => {})
  }
  else if (req.headers.host === 'confaudio.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1011'}, e => {})
  }
  else if (req.headers.host === 'webinarscreen.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:4001'}, e => {})
  }
  else if (req.headers.host === 'webinarvideo.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:4002'}, e => {})
  }
  else if (req.headers.host === 'webinaraudio.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:4003'}, e => {})
  }
  else if (req.headers.host === 'taskmanager.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1003'}, e => {})
  }
  else if (req.headers.host === 'code.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://127.0.0.1:8080'}, e => {})
  }
  else if (req.headers.host === 'kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:2002' }, e => {})
  }
  else if (req.headers.host === 'notes.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:9001' }, e => {})
  }
  else if (req.headers.host === 'gitclient.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:3000' }, e => {})
  }
  else if (req.headers.host === 'authentication.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1004' }, e => {})
  }
  else if (req.headers.host === 'authentication2.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1005' }, e => {})
  }
  else if (req.headers.host === 'config.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8080' }, e => {})
  }
})

serv.on('upgrade', function (req, socket, head) {
  if (req.headers.host === 'kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1002' }, e => {})
  }
  else if (req.headers.host === 'code.kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:8080' }, e => {})
  }
  else if (req.headers.host === 'webinar.kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1001'}, e => {})
  }
  else if (req.headers.host === 'videoconference.kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1010'}, e => {})
  }
  else if (req.headers.host === 'whiteboard1.kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1000'}, e => {})
  }
});

serv.listen(443)

setInterval(() => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}, 2500);