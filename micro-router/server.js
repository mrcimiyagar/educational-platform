
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

  if (req.headers.host === 'society.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:2001' }, e => {})
  }
  else if (req.headers.host === 'confclient.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1013' }, e => {})
  }
  else if (req.headers.host === 'taskboardbackend.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1337' }, e => {})
  }
  else if (req.headers.host === 'taskboard.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:3000' }, e => {})
  }
  else if (req.headers.host === 'confvideo.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1010' }, e => {})
  }
  else if (req.headers.host === 'confaudio.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1011' }, e => {})
  }
  else if (req.headers.host === 'confscreen.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1012' }, e => {})
  }
  else if (req.headers.host === 'audioplayer.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8085' }, e => {})
  }
  else if (req.headers.host === 'wavesurferbox.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8084' }, e => {})
  }
  else if (req.headers.host === 'conf.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8082' }, e => {})
  }
  else if (req.headers.host === 'whiteboard.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8081' }, e => {})
  }
  else if (req.headers.host === 'sharednotes.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:9001' }, e => {})
  }
  else if (req.headers.host === 'config.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8080' }, e => {})
  }
  else if (req.headers.host === 'coder.kasperian.cloud') {
    proxy.web(req, res, { target: 'http://localhost:10000' }, e => {})
  }
})

serv.on('upgrade', function (req, socket, head) {
  if (req.headers.host === 'society.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:2001' }, e => {})
  }
  else if (req.headers.host === 'whiteboard.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:8081' }, e => {})
  }
  else if (req.headers.host === 'webinar.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1001'}, e => {})
  }
  else if (req.headers.host === 'confvideo.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1010'}, e => {})
  }
  else if (req.headers.host === 'confaudio.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1011'}, e => {})
  }
  else if (req.headers.host === 'confscreen.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1012'}, e => {})
  }
  else if (req.headers.host === 'taskboardbackend.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1337'}, e => {})
  }
  else if (req.headers.host === 'coder.kasperian.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:10000'}, e => {})
  }
});

serv.listen(443);
