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
        waveSurferBox: 'https://wavesurferbox.kaspersoft.cloud',
        whiteBoard: 'https://whiteboard.kaspersoft.cloud',
        sharedNotes: 'https://sharednotes.kaspersoft.cloud',
        videoConfVideo: 'http://localhost:1010',
        videoConfAudio: 'https://confaudio.kaspersoft.cloud',
        videoConfScreen: 'http://localhost:1012',
        mainWebsocket: 'wss://kaspersoft.cloud'
    })
});
        
server.listen(8080);
