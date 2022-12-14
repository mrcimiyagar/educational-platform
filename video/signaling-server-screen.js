/**************/
/*** CONFIG ***/
/**************/
var PORT = 1012;


/*************/
/*** SETUP ***/
/*************/
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser')
var main = express()

var server = http.createServer(main)
var io  = require('socket.io')(server, {
    cors: { origin: "*" },
    secure: true,
});
//io.set('log level', 2);

server.listen(PORT, null, function() {
    console.log("Listening on port " + PORT);
});
//main.use(express.bodyParser());

// main.get('/index.html', function(req, res){ res.sendfile('newclient.html'); });
// main.get('/client.html', function(req, res){ res.sendfile('newclient.html'); });



/*************************/
/*** INTERESTING STUFF ***/
/*************************/
var channels = {};
var sockets = {};
var users = {}
var permissions = {}
let view = {};


/**
 * Users will connect to the signaling server, after which they'll issue a "join"
 * to join a particular channel. The signaling server keeps track of all sockets
 * who are in a channel, and on join will send out 'addPeer' events to each pair
 * of users in a channel. When clients receive the 'addPeer' even they'll begin
 * setting up an RTCPeerConnection with one another. During this process they'll
 * need to relay ICECandidate information to one another, as well as SessionDescription
 * information. After all of that happens, they'll finally be able to complete
 * the peer connection and will be streaming audio/video between eachother.
 */
io.on('connection', function (socket) {
    socket.channels = {};
    sockets[socket.id] = socket;

    console.log("["+ socket.id + "] connection accepted");
    socket.on('disconnect', function () {
        for (var channel in socket.channels) {
            part(channel);
        }
        console.log("["+ socket.id + "] disconnected");
        delete sockets[socket.id];
    });

    socket.on('showMe', () => {
        if (view[socket.roomId] === undefined) view[socket.roomId] = {};
        view[socket.roomId][socket.userId] = true;
        for (id in channels[socket.roomId]) {
            channels[socket.roomId][id].emit('showUser', {'peer_id': socket.id, 'userId': socket.userId});
        }
    });

    socket.on('hideMe', () => {
        if (view[socket.roomId] === undefined) view[socket.roomId] = {};
        view[socket.roomId][socket.userId] = false;
        for (id in channels[socket.roomId]) {
            channels[socket.roomId][id].emit('hideUser', {'peer_id': socket.id, 'userId': socket.userId});
        }
    });

    socket.on('join', function (config) {
        console.log("["+ socket.id + "] join ", config);
        var channel = config.channel;
        var userdata = config.userdata;

        socket.userId = config.userId
        socket.roomId = channel

        if (channel in socket.channels) {
            console.log("["+ socket.id + "] ERROR: already joined ", channel);
            return;
        }

        if (!(channel in channels)) {
            channels[channel] = {};
        }

        for (id in channels[channel]) {
            channels[channel][id].emit('addPeer', {'peer_id': socket.id, 'userId': socket.userId, 'should_create_offer': false});
            socket.emit('addPeer', {'peer_id': id, 'userId': sockets[id].userId, 'should_create_offer': true});
            if (view[channel] === undefined) view[channel] = {};
            if (view[channel][sockets[id].userId] === true) socket.emit('showUser', {'peer_id': socket.id, 'userId': sockets[id].userId});
        }

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;

        socket.emit('joined');
    });

    function part(channel) {
        console.log("["+ socket.id + "] part ");

        if (!(channel in socket.channels)) {
            console.log("["+ socket.id + "] ERROR: not in ", channel);
            return;
        }

        delete socket.channels[channel];
        delete channels[channel][socket.id];

        for (id in channels[channel]) {
            channels[channel][id].emit('removePeer', {'peer_id': socket.id, 'userId': socket.userId});
            socket.emit('removePeer', {'peer_id': id, 'userId': sockets[id] !== undefined ? sockets[id].userId : undefined});
        }
    }
    socket.on('part', part);

    socket.on('relayICECandidate', function(config) {
        var peer_id = config.peer_id;
        var ice_candidate = config.ice_candidate;
        console.log("["+ socket.id + "] relaying ICE candidate to [" + peer_id + "] ", ice_candidate);

        if (peer_id in sockets) {
            sockets[peer_id].emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
        }
    });

    socket.on('relaySessionDescription', function(config) {
        var peer_id = config.peer_id;
        var session_description = config.session_description;
        console.log("["+ socket.id + "] relaying session description to [" + peer_id + "] ", session_description);

        if (peer_id in sockets) {
            sockets[peer_id].emit('sessionDescription', {'peer_id': socket.id, 'session_description': session_description});
        }
    });

    socket.on('show', () => {
        socket.broadcast.emit('show_peer', socket.id)
    })

    socket.on('hide', () => {
        socket.broadcast.emit('hide_peer', socket.id)
    })

    socket.on('askAppearence', peer_id => {
        socket.to(peer_id).emit('askAppearence', socket.id)
    })

    socket.on('answerAppearence', peer_id => {
        socket.to(peer_id).emit('answerAppearence', socket.id)
    })

    socket.on('disableUser', userId => {
        if (users[userId] !== undefined)
            socket.broadcast.emit('disableUser', users[userId].id)
    })

    socket.on('enableUser', userId => {
        if (users[userId] !== undefined)
            socket.broadcast.emit('enableUser', users[userId].id)
    })

    socket.on('switchPermission', ({userId, permission}) => {
        permissions[userId] = permission
        socket.broadcast.emit('takePermissions', permissions)
        socket.emit('takePermissions', permissions)
    })

    socket.on('getPermissions', () => {
        socket.emit('takePermissions', permissions)
    })

    socket.emit('takePermissions', permissions)
});