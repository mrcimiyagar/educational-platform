const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
let server = http.createServer(app)

app.use(cors())

app.get('*', (req, res) => {
    res.send({
        mainBackend: 'https://backend.kaspersoft.cloud',
        mainFrontend: 'https://kaspersoft.cloud',
        audioPlayer: 'http://185.81.96.105:8085',
        waveSurferBox: 'http://185.81.96.105:8084',
        whiteBoard: 'http://185.81.96.105:8081',
        sharedNotes: 'http://185.81.96.105:8082',
        videoConfVideo: 'http://185.81.96.105:1010',
        videoConfAudio: 'http://185.81.96.105:1011',
        videoConfScreen: 'http://185.81.96.105:1012',
        mainWebsocket: 'wss://kaspersoft.cloud'
    })
});
        
server.listen(8080);
