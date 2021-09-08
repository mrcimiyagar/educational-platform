const express = require('express');
const app = express();
const http = require('http');
let server = http.createServer(app);

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
        
server.listen(8085);