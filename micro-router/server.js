
let httpProxy = require('http-proxy')
let https = require('https')
let fs = require('fs')

var proxy = httpProxy.createProxyServer({changeOrigin: true, ws: true});

let serv = https.createServer({
  cert: fs.readFileSync('server.cert'),
  key: fs.readFileSync('server.key')
}, function(req, res) {
  if (req.headers.host === 'kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:2002' }, e => {})
  }
  else if (req.headers.host === 'backend.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:2001' }, e => {})
  }
})

serv.on('upgrade', function (req, socket, head) {
  if (req.headers.host === 'kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:2001' }, e => {})
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