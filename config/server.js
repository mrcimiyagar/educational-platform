const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
let server = http.createServer(app)

app.use(cors())

app.get('*', (req, res) => {
    res.send({
        mainBackend: 'https://backend.kasperian.cloud',
        mainFrontend: 'https://society.kasperian.cloud',
        confClient: 'https://conf.society.kasperian.cloud',
        audioPlayer: 'https://audioplayer.society.kasperian.cloud',
        waveSurferBox: 'https://wavesurferbox.society.kasperian.cloud',
        whiteBoard: 'https://whiteboard.society.kasperian.cloud',
        sharedNotes: 'https://sharednotes.society.kasperian.cloud',
        videoConfVideo: 'https://confvideo.society.kasperian.cloud',
        videoConfAudio: 'https://confaudio.society.kasperian.cloud',
        videoConfScreen: 'https://confscreen.society.kasperian.cloud',
        taskBoard: 'https://taskboard.society.kasperian.cloud',
        codeServer: 'https://coder.society.kasperian.cloud',
        mainWebsocket: 'wss://society.kasperian.cloud'
    });
});

server.listen(8080);
