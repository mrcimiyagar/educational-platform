const express = require('express');
const app = express();
const http = require('http');
let server = http.createServer(app);
const cors = require('cors');

app.use(cors());
server.listen(2002);

app.use(express.static('client-app/build'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client-app/build/index.html');
});
