const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
let server = http.createServer(app)

app.use(cors())

app.get('*', (req, res) => {
    res.send({
        mainBackend: 'http://localhost:2001',
        mainFrontend: 'http://localhost:2002',
        audioPlayer: 'http://localhost:8085',
        waveSurferBox: 'http://localhost:8084',
        whiteBoard: 'http://localhost:8081',
        sharedNotes: 'http://localhost:8082',
        videoConfVideo: 'http://localhost:1010',
        videoConfAudio: 'http://localhost:1011',
        videoConfScreen: 'http://localhost:1012',
        mainWebsocket: 'ws://localhost:2001'
    })
});
        
server.listen(8080);
