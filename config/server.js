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
        audioPlayer: 'https://audioplayer.kaspersoft.cloud',
        waveSurferBox: 'https://wavesurferbox.kaspersfot.cloud',
        whiteBoard: 'https://whiteboard.kaspersoft.cloud',
        sharedNotes: 'https://sharednotes.kaspersoft.cloud',
        videoConfVideo: 'http://localhost:1010', // 'https://confvideo.kaspersoft.cloud',
        videoConfAudio: 'http://localhost:1011', // 'https://confaudio.kaspersoft.cloud',
        videoConfScreen: 'http://localhost:1012', // 'https://confscreen.kaspersoft.cloud',
        mainWebsocket: 'wss://kaspersoft.cloud'
    })
});
        
server.listen(8080);
