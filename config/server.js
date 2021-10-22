const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
let server = http.createServer(app)

app.use(cors())

app.get('*', (req, res) => {
    res.send({
        mainBackend: 'https://backend.kaspersoft.cloud',
        mainFrontend: 'http://localhost:2002',
        audioPlayer: 'https://audioplayer.kaspersoft.cloud',
        waveSurferBox: 'https://wavesurferbox.kaspersoft.cloud',
        whiteBoard: 'https://whiteboard.kaspersoft.cloud',
        sharedNotes: 'https://sharednotes.kaspersoft.cloud',
        videoConfVideo: 'https://confvideo.kaspersoft.cloud',
        videoConfAudio: 'https://confaudio.kaspersoft.cloud',
        videoConfScreen: 'https://confscreen.kaspersoft.cloud',
        taskBoard: 'http://taskboard.kaspersoft.cloud',
        mainWebsocket: 'wss://kaspersoft.cloud'
    });
});

server.listen(8080);
