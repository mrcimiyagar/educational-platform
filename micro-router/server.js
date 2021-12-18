
let httpProxy = require('http-proxy')
let https = require('https')
let fs = require('fs')

var proxy = httpProxy.createProxyServer({changeOrigin: true, ws: true});

let serv = https.createServer({
  cert: fs.readFileSync('server.cert'),
  key: fs.readFileSync('server.key')
}, function(req, res) {
  if (req.headers.host === 'kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:2001' }, e => {})
  }
  else if (req.headers.host === 'code.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8100' }, e => {})
  }
  else if (req.headers.host === 'confclient.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1013' }, e => {})
  }
  else if (req.headers.host === 'taskboardbackend.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1337' }, e => {})
  }
  else if (req.headers.host === 'taskboard.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:3000' }, e => {})
  }
  else if (req.headers.host === 'backend.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:2001' }, e => {})
  }
  else if (req.headers.host === 'confvideo.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1010' }, e => {})
  }
  else if (req.headers.host === 'confaudio.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1011' }, e => {})
  }
  else if (req.headers.host === 'confscreen.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:1012' }, e => {})
  }
  else if (req.headers.host === 'audioplayer.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8085' }, e => {})
  }
  else if (req.headers.host === 'wavesurferbox.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8084' }, e => {})
  }
  else if (req.headers.host === 'conf.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8082' }, e => {})
  }
  else if (req.headers.host === 'whiteboard.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8081' }, e => {})
  }
  else if (req.headers.host === 'sharednotes.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:9001' }, e => {})
  }
  else if (req.headers.host === 'config.kaspersoft.cloud') {
    proxy.web(req, res, { target: 'http://localhost:8080' }, e => {})
  }
})

serv.on('upgrade', function (req, socket, head) {
  if (req.headers.host === 'kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:2001' }, e => {})
  }
  else if (req.headers.host === 'whiteboard.kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:8081' }, e => {})
  }
  else if (req.headers.host === 'code.kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:8100' }, e => {})
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
  else if (req.headers.host === 'taskboardbackend.kaspersoft.cloud') {
    proxy.ws(req, socket, { target: 'ws://localhost:1337'}, e => {})
  }
});

var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

var getHostPortFromString = function (hostString, defaultPort) {
  var host = hostString;
  var port = defaultPort;

  var result = regex_hostport.exec(hostString);
  if (result != null) {
    host = result[1];
    if (result[2] != null) {
      port = result[3];
    }
  }

  return ( [host, port] );
};

serv.addListener('connect', function (req, socket, bodyhead) {
  var hostPort = getHostPortFromString(req.url, 443);
  var hostDomain = hostPort[0];
  var port = parseInt(hostPort[1]);
  console.log("Proxying HTTPS request for:", hostDomain, port);

  var proxySocket = new net.Socket();
  proxySocket.connect(port, hostDomain, function () {
      proxySocket.write(bodyhead);
      socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
    }
  );

  proxySocket.on('data', function (chunk) {
    socket.write(chunk);
  });

  proxySocket.on('end', function () {
    socket.end();
  });

  proxySocket.on('error', function () {
    socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
    socket.end();
  });

  socket.on('data', function (chunk) {
    proxySocket.write(chunk);
  });

  socket.on('end', function () {
    proxySocket.end();
  });

  socket.on('error', function () {
    proxySocket.end();
  });

});

serv.listen(443, '127.0.0.1', (req, socket, bodyhead) => {
  var hostPort = getHostPortFromString(req.url, 443);
  var hostDomain = hostPort[0];
  var port = parseInt(hostPort[1]);
  console.log("Proxying HTTPS request for:", hostDomain, port);

  var proxySocket = new net.Socket();
  proxySocket.connect(port, hostDomain, function () {
      proxySocket.write(bodyhead);
      socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
    }
  );

  proxySocket.on('data', function (chunk) {
    socket.write(chunk);
  });

  proxySocket.on('end', function () {
    socket.end();
  });

  proxySocket.on('error', function () {
    socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
    socket.end();
  });

  socket.on('data', function (chunk) {
    proxySocket.write(chunk);
  });

  socket.on('end', function () {
    proxySocket.end();
  });

  socket.on('error', function () {
    proxySocket.end();
  });

});

setInterval(() => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}, 2500);