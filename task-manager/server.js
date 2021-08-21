const express = require('express');
const app = express();
const http = require('http');
let server = http.createServer(app);

app.use(express.static('client-app/dist'));

let data = 

app.post('/add_list', (req, res) => {

})

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client-app/dist/index.html');
});
        
server.listen(1003);