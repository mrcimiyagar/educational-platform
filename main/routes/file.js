const sw = require('../db/models');
const express = require('express');
const tools = require('../tools');
const Sequelize = require('sequelize');
const formidable = require('formidable');
const fs = require('fs');
const bodyParser = require('body-parser');
const { rootPath, parentPath } = require('../tools');
const path = require('path');
const { exec } = require('child_process');
const { authenticateMember } = require('../users');
const { fromPath } = require('pdf2pic');

const router = express.Router();
let jsonParser = bodyParser.json();

router.post('/upload_file', jsonParser, async function (req, res) {
    let token = req.query.token;
    let roomId = Number(req.query.roomId);
    authenticateMember(req, res, async (membership, session, user) => {
            
            if (!membership.canUploadFile) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            let form = new formidable.IncomingForm();
                form.parse(req, async function (err, fields, files) {
                    if (!fs.existsSync('files')) {
                        fs.mkdirSync('files');
                    }
                    let ext = '';
                    let extIndex = files.file.name.lastIndexOf('.');
                    if (extIndex > 0) {
                        extIndex++;
                        if (extIndex < files.file.name.length) {
                            ext = files.file.name.substring(extIndex);
                        }
                    }
                    let preview = await sw.File.create({
                        extension: 'png',
                        uploaderId: session.userId,
                        roomId: roomId,
                        isPreview: true,
                        isPresent: false
                    });
                    let file = await sw.File.create({
                        name: files.file.name,
                        size: files.file.size,
                        extension: ext,
                        uploaderId: session.userId,
                        roomId: roomId,
                        previewFileId: preview.id,
                        isPreview: false,
                        isPresent: false
                    });
                    let oldPath = files.file.path;
                    let newPath = rootPath + '/files/' + file.id;
                    fs.copyFileSync(oldPath, newPath);
                    if (ext === 'pdf') {
                        let previewFactoryPath = rootPath + '/temp/' + file.id + '.pdf';
                        fs.copyFileSync(oldPath, previewFactoryPath);
                    }

                    if (ext === 'pdf') {

                        const options = {
                            density: 100,
                            saveFilename: file.id,
                            savePath: "./pdfPages",
                            format: "png",
                            width: 600,
                            height: 850
                        };
                        const convert = fromPath(rootPath + '/temp/' + file.id + '.pdf', options);
                        convert(1, true).then((output) => {
                            console.log('converted successfully.');

                            fs.writeFile(rootPath + '/files/' + preview.id, output.base64, 'base64', function(err) {
                                console.log(err);
                            });
                            
                            require("../server").pushTo('room_' + membership.roomId, 'file-added', file);
                            res.send({status: 'success', file: file});
                        });
                    }
                    else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'svg') {
                        fs.copyFileSync(rootPath + '/files/' + file.id, rootPath + '/files/' + preview.id);
                        require("../server").pushTo('room_' + membership.roomId, 'file-added', file);
                        res.send({status: 'success', file: file});
                    }
                    else {
                        require("../server").pushTo('room_' + membership.roomId, 'file-added', file);
                        res.send({status: 'success', file: file});
                    }
                });
    });
});

router.get('/download_file', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            sw.File.findOne({where: {roomId: membership.roomId, id: req.query.fileId}}).then(async file => {
                res.sendFile(rootPath + '/files/' + file.id)
            })
    })
})

router.get('/download_user_avatar', jsonParser, async function (req, res) {
    sw.User.findOne({where: {id: req.query.userId}}).then(async user => {
        sw.File.findOne({where: {id: user.avatarId}}).then(async file => {
            res.sendFile(rootPath + '/files/' + file.id);
        })
    })
})

router.get('/download_bot_avatar', jsonParser, async function (req, res) {
    sw.Bot.findOne({where: {id: req.query.botId}}).then(async bot => {
        sw.File.findOne({where: {id: bot.avatarId}}).then(async file => {
            res.sendFile(rootPath + '/files/' + file.id);
        })
    })
})

router.get('/download_space_avatar', jsonParser, async function (req, res) {
    sw.Space.findOne({where: {id: req.query.spaceId}}).then(async space => {
        sw.File.findOne({where: {id: space.avatarId}}).then(async file => {
            res.sendFile(rootPath + '/files/' + file.id);
        })
    })
})

router.get('/download_room_avatar', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
        if (membership === null) {
            res.sendStatus(404);
            return
        }
        sw.Room.findOne({where: {id: req.query.roomId}}).then(async room => {
            sw.File.findOne({where: {id: room.avatarId}}).then(async file => {
                res.sendFile(rootPath + '/files/' + file.id);
            })
        })
    })
})

router.post('/remove_file', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            if (!membership.canRemoveFile) {
                res.send({status: 'error', errorCode: 'e0005', message: 'access denied.'});
                return;
            }
            sw.File.findOne({where: {roomId: membership.roomId, id: req.body.fileId}}).then(async function (file) {
                if (file === null) {
                    res.send({status: 'error', errorCode: 'e0005', message: 'file does not exist.'});
                }
                await file.destroy();
                require("../server").pushTo('room_' + membership.roomId).emit('file-removed', file);
                res.send({status: 'success'});
            });
    });
});

router.post('/get_files', jsonParser, async function (req, res) {
    authenticateMember(req, res, async (membership, session, user) => {
            
            sw.File.findAll({where: {roomId: membership.roomId, isPreview: false, isPresent: false}}).then(async function (files) {
                res.send({status: 'success', files: files});
            });
    });
});

module.exports = router;
