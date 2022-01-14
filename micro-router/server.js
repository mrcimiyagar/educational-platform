
let httpProxy = require('http-proxy')
let https = require('https')
let fs = require('fs')

var proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true,
  ssl: {
    key: fs.readFileSync('server.key', 'utf8'),
    cert: fs.readFileSync('server.cert', 'utf8')
  },
  secure: true
});

let serv = https.createServer({
  cert: fs.readFileSync('server.cert'),
  key: fs.readFileSync('server.key')
}, function(req, res) {

  if (req.headers.host === 'societybackend.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:2001' }, e => {})
  }
  else if (req.headers.host === 'confclient.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1013' }, e => {})
  }
  else if (req.headers.host === 'taskboardbackend.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1337' }, e => {})
  }
  else if (req.headers.host === 'taskboard.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:3000' }, e => {})
  }
  else if (req.headers.host === 'confvideo.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1010' }, e => {})
  }
  else if (req.headers.host === 'confaudio.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1011' }, e => {})
  }
  else if (req.headers.host === 'confscreen.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1012' }, e => {})
  }
  else if (req.headers.host === 'audioplayer.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8085' }, e => {})
  }
  else if (req.headers.host === 'wavesurferbox.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8084' }, e => {})
  }
  else if (req.headers.host === 'conf.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8082' }, e => {})
  }
  else if (req.headers.host === 'whiteboard.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8081' }, e => {})
  }
  else if (req.headers.host === 'sharednotes.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:9001' }, e => {})
  }
  else if (req.headers.host === 'config.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8080' }, e => {})
  }
  else if (req.headers.host === 'coder.society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:10000' }, e => {})
  }
})

serv.on('upgrade', function (req, socket, head) {
  if (req.headers.host === 'kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:2001' }, e => {})
  }
  else if (req.headers.host === 'whiteboard.society.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:8081' }, e => {})
  }
  else if (req.headers.host === 'webinar.society.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1001'}, e => {})
  }
  else if (req.headers.host === 'videoconference.society.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1010'}, e => {})
  }
  else if (req.headers.host === 'taskboardbackend.society.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1337'}, e => {})
  }
  else if (req.headers.host === 'coder.society.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:10000'}, e => {})
  }
});

serv.listen(443);
