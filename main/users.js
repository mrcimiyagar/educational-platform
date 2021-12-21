
const sw = require('./db/models');
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

let users = {};
let guestAccs = {};
let guestAccsOutOfRoom = {};
let guestAccsByUserId = {};
let invites = {}
let usersSubscriptions = {}

module.exports = {
    usersSubscriptions: usersSubscriptions,
    users: users,
    guestAccsByUserId: guestAccsByUserId,
    guestAccs: guestAccs,
    moveMembership: (roomId, userId, toRoomId) => {
        let mem = sw.Membership.findOne({where: {roomId: roomId, userId: userId}})
        if (mem === null) {
            if (guestAccs[toRoomId] === undefined) {
                guestAccs[toRoomId] = {}
            }
            guestAccs[toRoomId][userId] = guestAccs[roomId][userId]
            delete guestAccs[roomId][userId]
        }
    },
    addMembership: (roomId, userId, toRoomId) => {
        if (guestAccs[toRoomId] === undefined) {
            guestAccs[toRoomId] = {}
        }
        guestAccs[toRoomId][userId] = guestAccs[roomId][userId]
    },
    getRoomUsers: (roomId) => {
        if (users[roomId] === undefined) {
            return [];
        }
        let arr = [];
        let dict = users[roomId];
        for (let key in dict) {
            if (dict[key] !== undefined) {
                arr.push( dict[key] );
            }
        }
        return arr;
    },
    removeUser: (roomId, userId) => {
        if (users[roomId] === undefined) {
            return
        }
        let user = users[roomId][userId];
        users[roomId][userId] = undefined;
        return user;
    },
    addUser: (roomId, user) => {
        if (user === undefined) return
        if (users[roomId] === undefined) {
            users[roomId] = {};
        }
        users[roomId][user.id] = user;
    },
    addGuestAcc: (guestAcc) => {
        if (guestAccs[guestAcc.roomId] === undefined) {
            guestAccs[guestAcc.roomId] = {};
        }
        guestAccs[guestAcc.roomId][guestAcc.id] = guestAcc;
        guestAccsOutOfRoom[guestAcc.token] = guestAcc;
        guestAccsByUserId[guestAcc.userId] = guestAcc;
    },
    authenticateMember: (req, res, callback) => {
        let token = req.headers.token;
        if (token === undefined) {
            token = req.query.token;
        }
        let roomId = req.body.roomId;
        if (roomId === undefined) {
            roomId = req.query.roomId;
        }
        sw.Session.findOne({where: {token: token}}).then(async function (session) {
            if (session === null || session === undefined) {
                if (token in guestAccsOutOfRoom) {
                    let a = guestAccsOutOfRoom[token];
                    if (a.roomId === roomId)
                        callback(a, {userId: a.userId}, a.user, a);
                    else if (a.subroomId === roomId) {
                        let temp = {...a}
                        temp.roomId = a.subroomId
                        callback(temp, {userId: temp.userId}, temp.user, a);
                    }
                    else {
                        callback(a, null, {userId: a.userId}, a);
                    }
                    return;
                }
                res.send({status: 'error', errorCode: 'e0007', message: 'session does not exist.'});
                return;
            }
            if (roomId === undefined) {
                sw.User.findOne({where: {id: session.userId}}).then(async function (user) {
                    sw.Account.findOne({where: {userId: session.userId}}).then(async function (acc) {
                        callback(undefined, session, user, acc);
                    });
                });
                return;
            }
            sw.Membership.findOne({where: {roomId: roomId, userId: session.userId}}).then(membership => {
                if (membership === null || membership === undefined) {
                    res.send({status: 'error', errorCode: 'e0007', message: 'membership does not exist.'});
                    return;
                }
                sw.User.findOne({where: {id: membership.userId}}).then(async function (user) {
                    sw.Account.findOne({where: {userId: session.userId}}).then(async function (acc) {
                        callback(membership, session, user, acc);
                    });
                });
            });
        });
    },
    authenticateMemberWithRoomId: (req, res, roomId, callback) => {
        let token = req.headers.token;
        if (token === undefined) {
            token = req.query.token;
        }
        sw.Session.findOne({where: {token: token}}).then(async function (session) {
            if (session === null || session === undefined) {
                if (token in guestAccsOutOfRoom) {
                    let a = guestAccsOutOfRoom[token];
                    if (a.roomId === roomId)
                        callback(a, {userId: a.userId}, a.user);
                    else if (a.subroomId === roomId) {
                        let temp = {...a}
                        temp.roomId = a.subroomId
                        callback(temp, {userId: temp.userId}, temp.user);
                    }
                    return;
                }
                res.send({status: 'error', errorCode: 'e0007', message: 'session does not exist.'});
                return;
            }
            if (roomId === undefined) {
                sw.User.findOne({where: {id: session.userId}}).then(async function (user) {
                    callback(undefined, session, user);
                });
                return;
            }
            sw.Membership.findOne({where: {roomId: roomId, userId: session.userId}}).then(membership => {
                if (membership === null || membership === undefined) {
                    res.send({status: 'error', errorCode: 'e0007', message: 'membership does not exist.'});
                    return;
                }
                sw.User.findOne({where: {id: membership.userId}}).then(async function (user) {
                    callback(membership, session, user);
                });
            });
        });
    },
    authenticateMemberWithoutResponse: (req, res, callback) => {
        let token = req.headers.token;
        if (token === undefined) {
            token = req.query.token;
        }
        let roomId = req.body.roomId;
        if (roomId === undefined) {
            roomId = req.query.roomId;
        }
        sw.Session.findOne({where: {token: token}}).then(async function (session) {
            if (session === null) {
                if (token in guestAccsOutOfRoom) {
                    let a = guestAccsOutOfRoom[token];
                    if (a.roomId === roomId)
                        callback(a, {userId: a.userId}, a.user);
                    else if (a.subroomId === roomId) {
                        let temp = {...a}
                        temp.roomId = a.subroomId
                        callback(temp, {userId: temp.userId}, temp.user);
                    }
                    return;
                }
                callback(null, null, temp.user);
                return;
            }
            if (roomId === undefined) {
                sw.User.findOne({where: {id: session.userId}}).then(async function (user) {
                    callback(undefined, session, user);
                    return;
                });
                return;
            }
            sw.Membership.findOne({where: {roomId: roomId, userId: session.userId}}).then(membership => {
                if (membership === null) {
                    callback(null, null, null);
                    return;
                }
                sw.User.findOne({where: {id: membership.userId}}).then(async function (user) {
                    callback(membership, session, user);
                });
            });
        });
    },
    getGuestUser: (token) => {
        if (token in guestAccsOutOfRoom) {
            return guestAccsOutOfRoom[token];
        }
        return null;
    },
    generateInvite: roomId => {
        let invite = {roomId: roomId, token: uuidv4()}
        invites[invite.token] = invite
        return invite.token
    },
    resolveInvite: token => {
        let invite = invites[token]
        if (invite === undefined) {
            return {valid: false}
        }
        else {
            let roomId = invite.roomId
            delete invites[token]
            return {valid: true, roomId: roomId}
        }
    }
};