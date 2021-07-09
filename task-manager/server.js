const express = require('express');
const app = express();
const http = require('http');
let server = http.createServer(app);

app.use(express.static('client-app/dist'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/client-app/dist/index.html');
});
        
server.listen(1003);

setInterval(() => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}, 2500);