const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
let server = http.createServer(app)

app.use(cors())

app.get('*', (req, res) => {
    res.send({
          mainBackend: 'https://society.kasperian.cloud',
          mainFrontend: 'https://society.kasperian.cloud',
          confClient: 'https://conf.kasperian.cloud',
          audioPlayer: 'https://audioplayer.kasperian.cloud',
          waveSurferBox: 'https://wavesurferbox.kasperian.cloud',
          whiteBoard: 'https://whiteboard.kasperian.cloud',
          sharedNotes: 'https://sharednotes.kasperian.cloud',
          videoConfVideo: 'https://confvideo.kasperian.cloud',
          videoConfAudio: 'https://confaudio.kasperian.cloud',
          videoConfScreen: 'https://confscreen.kasperian.cloud',
          taskBoard: 'https://taskboard.kasperian.cloud',
          codeServer: 'https://coder.kasperian.cloud',
          mainWebsocket: 'wss://society.kasperian.cloud'
    });
});

server.listen(8080);
