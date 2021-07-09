
const serverScreen = require('./server_screen.js')
const serverVideo = require('./server_video.js')
const serverAudio = require('./server_audio.js')

const express = require("express")
const app = express()

const port = 4000

const http = require("http")
const server = http.createServer(app)

app.use(express.static(__dirname + "/public"))

server.listen(port)