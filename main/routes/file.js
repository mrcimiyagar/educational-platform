const sw = require("../db/models");
const express = require("express");
const tools = require("../tools");
const Sequelize = require("sequelize");
const formidable = require("formidable");
const fs = require("fs");
const bodyParser = require("body-parser");
const { rootPath, parentPath } = require("../tools");
const path = require("path");
const { exec } = require("child_process");
const { authenticateMember } = require("../users");
const { fromPath } = require("pdf2pic");
const genThumbnail = require("simple-thumbnail");
const jsmediatags = require("jsmediatags");

const router = express.Router();
let jsonParser = bodyParser.json();

function getFilesizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

router.post("/upload_file", jsonParser, async function (req, res) {
  let ext = req.query.extension;
  let isPresent = req.query.isPresent === "true" ? true : false;
  authenticateMember(req, res, async (membership, session, user) => {
    require("../server").pushTo("room_" + membership.roomId, "uploading", {});
    if (!membership.canUploadFile) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let mwId = req.query.moduleWorkerId;
    if (mwId === undefined) {
      let r = await sw.Room.findOne({ where: { id: membership.roomId } });
      mwId = r.fileStorageId;
    }
    let mw = await sw.ModuleWorker.findOne({
      where: { id: mwId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      if (!fs.existsSync("files")) {
        fs.mkdirSync("files", { recursive: true });
      }
      let preview = await sw.File.create({
        extension: "png",
        uploaderId: session.userId,
        moduleWorkerId: mw.id,
        isPreview: true,
        isPresent: isPresent,
        fileType: "photo",
      });
      let file = await sw.File.create({
        extension: ext,
        uploaderId: session.userId,
        moduleWorkerId: mw.id,
        previewFileId: preview.id,
        isPreview: false,
        isPresent: isPresent,
        fileType:
          ext === "png" ||
          ext === "jpg" ||
          ext === "jpeg" ||
          ext === "gif" ||
          ext === "svg" ||
          ext === "webp"
            ? "photo"
            : ext === "wav" || ext === "mpeg" || ext === "mp3" || ext === "aac"
            ? "audio"
            : ext === "webm" ||
              ext === "mkv" ||
              ext === "flv" ||
              ext === "3gp" ||
              ext === "mp4"
            ? "video"
            : "document",
      });
      let oldPath = files.file.path;
      let newPath = rootPath + "/files/" + file.id;
      fs.copyFileSync(oldPath, newPath);

      require("../server").pushTo(
        "room_" + membership.roomId,
        "uploading_done",
        {}
      );

      if (ext === "pdf") {
        let previewFactoryPath = rootPath + "/temp/" + file.id + ".pdf";
        fs.copyFileSync(oldPath, previewFactoryPath);
      }

      if (ext === "pdf") {
        const options = {
          density: 100,
          saveFilename: file.id,
          savePath: "./pdfPages",
          format: "png",
          width: 600,
          height: 850,
        };
        const convert = fromPath(
          rootPath + "/temp/" + file.id + ".pdf",
          options
        );
        convert(1, true).then((output) => {
          console.log("converted successfully.");

          fs.writeFile(
            rootPath + "/files/" + preview.id,
            output.base64,
            "base64",
            function (err) {
              console.log(err);
            }
          );

          require("../server").pushTo(
            "room_" + membership.roomId,
            "file-added",
            file
          );
          res.send({ status: "success", file: file });
        });
      } else if (
        ext === "webm" ||
        ext === "mkv" ||
        ext === "flv" ||
        ext === "3gp"
      ) {
        genThumbnail(
          "files/" + file.id,
          "files/" + preview.id + ".jpg",
          "375x256"
        )
          .then(() => {
            console.log("done!");
            require("../server").pushTo(
              "room_" + membership.roomId,
              "file-added",
              file
            );
            res.send({ status: "success", file: file });
          })
          .catch((err) => console.error(err));
      } else if (
        ext === "png" ||
        ext === "jpg" ||
        ext === "jpeg" ||
        ext === "gif" ||
        ext === "svg" ||
        ext === "webp"
      ) {
        fs.copyFileSync(
          rootPath + "/files/" + file.id,
          rootPath + "/files/" + preview.id
        );
        require("../server").pushTo(
          "room_" + membership.roomId,
          "file-added",
          file
        );
        res.send({ status: "success", file: file });
      } else if (
        ext === "wav" ||
        ext === "mp3" ||
        ext === "mpeg" ||
        ext === "aac"
      ) {
        fs.copyFileSync(
          rootPath + "/files/" + file.id,
          rootPath + "/temp/" + file.id + "." + ext
        );
        let calculatingGraph = () => {
          exec(
            `audiowaveform -i ${rootPath + "/temp/" + file.id + "." + ext} -o ${
              rootPath + "/files/" + preview.id + ".json"
            } -b 8 -z 256`,
            (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
              }
              console.log(`stdout: ${stdout}`);

              jsmediatags.read(rootPath + "/temp/" + file.id + "." + ext, {
                onSuccess: async function (tag) {
                  console.log(tag);
                  let picture = tag.tags.picture;
                  if (picture) {
                    let data = picture.data;
                    fs.writeFileSync(
                      rootPath + "/files/" + preview.id,
                      Buffer.from(data)
                    );
                    require("../server").pushTo(
                      "room_" + membership.roomId,
                      "file-added",
                      file
                    );
                  }
                  res.send({ status: "success", file: file });
                },
                onError: function (error) {
                  console.log(":(", error.type, error.info);
                },
              });
            }
          );
        };
        if (ext === "aac") {
          exec(
            `ffmpeg -i ${
              rootPath + "/temp/" + file.id + "." + ext
            } -vn -ar 44100 -ac 2 -b:a 192k ${
              rootPath + "/temp/" + file.id + "." + "mp3"
            }`,
            (error, stdout, stderr) => {
              ext = "mp3";
              calculatingGraph();
            }
          );
        } else {
          calculatingGraph();
        }
      } else {
        require("../server").pushTo(
          "room_" + membership.roomId,
          "file-added",
          file
        );
        res.send({ status: "success", file: file });
      }
    });
  });
});

router.post("/download_audio_preview", jsonParser, async function (req, res) {
  if (req.body.fileId === undefined) {
    res.sendStatus(404);
    return;
  }
  authenticateMember(req, res, async (membership, session, user) => {
    let mwId = req.body.moduleWorkerId;
    if (mwId === undefined) {
      let r = await sw.Room.findOne({ where: { id: membership.roomId } });
      mwId = r.fileStorageId;
    }
    let mw = await sw.ModuleWorker.findOne({
      where: { id: mwId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.File.findOne({
      where: { moduleWorkerId: mw.id, id: req.body.fileId },
    }).then(async (file) => {
      res.sendFile(rootPath + "/files/" + file.previewFileId + ".json");
    });
  });
});

router.get("/download_file_thumbnail", jsonParser, async function (req, res) {
  if (req.query.fileId === undefined) {
    res.sendStatus(404);
    return;
  }
  authenticateMember(req, res, async (membership, session, user) => {
    let mwId = req.query.moduleWorkerId;
    if (mwId === undefined) {
      let r = await sw.Room.findOne({ where: { id: membership.roomId } });
      mwId = r.fileStorageId;
    }
    let mw = await sw.ModuleWorker.findOne({
      where: { id: mwId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.File.findOne({
      where: { moduleWorkerId: mw.id, id: req.query.fileId },
    }).then(async (file) => {
      if (fs.existsSync(rootPath + "/files/" + file.previewFileId)) {
        res.sendFile(rootPath + "/files/" + file.previewFileId);
      } else if (fs.existsSync(rootPath + "/files/" + file.previewFileId + ".jpg")) {
        res.sendFile(rootPath + "/files/" + file.previewFileId + ".jpg");
      } else {
        if (file.fileType === 'photo') {
          res.sendFile(rootPath + "/files/photo.png");
        } else if (file.fileType === 'audio') {
          res.sendFile(rootPath + "/files/audio.png");
        } else if (file.fileType === 'video') {
          res.sendFile(rootPath + "/files/video.png");
        } else {
          res.sendFile(rootPath + "/files/document.png");
        }
      }
    });
  });
});

router.get("/download_file", jsonParser, async function (req, res) {
  if (req.query.fileId === undefined) {
    res.sendStatus(404);
    return;
  }
  authenticateMember(req, res, async (membership, session, user) => {
    let mwId = req.query.moduleWorkerId;
    if (mwId === undefined) {
      let r = await sw.Room.findOne({ where: { id: membership.roomId } });
      mwId = r.fileStorageId;
    }
    let mw = await sw.ModuleWorker.findOne({
      where: { id: mwId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.File.findOne({
      where: { moduleWorkerId: mw.id, id: req.query.fileId },
    }).then(async (file) => {
      if (file === null) {
        res.sendStatus(404);
        return;
      }
      if (fs.existsSync(rootPath + "/files/" + file.id)) {
        res.sendFile(rootPath + "/files/" + file.id);
      } else {
        res.sendFile(rootPath + "/files/" + file.id + ".jpg");
      }
    });
  });
});

router.get("/download_user_avatar", jsonParser, async function (req, res) {
  sw.User.findOne({ where: { id: req.query.userId } }).then(async (user) => {
    if (user.avatarId === undefined || user.avatarId === null) {
      let randomAvatarId = -1 * (Math.floor(Math.random() * 10) + 1);
      user.avatarId = randomAvatarId;
      await user.save();
      user = await sw.User.findOne({ where: { id: req.query.userId } });
    }
    if (user.avatarId < 0) {
      res.sendFile(rootPath + `/files/user-avatars/${user.avatarId * -1}.png`);
      return;
    }
    sw.File.findOne({ where: { id: user.avatarId } }).then(async (file) => {
      if (file === null) {
        res.sendStatus(404);
        return;
      }
      if (fs.existsSync(rootPath + "/files/" + file.id)) {
        res.sendFile(rootPath + "/files/" + file.id);
      } else {
        res.sendFile(rootPath + "/files/" + file.id + ".jpg");
      }
    });
  });
});

router.get("/download_widget_thumbnail", jsonParser, async function (req, res) {
  let widget = await sw.Widget.findOne({ where: { id: req.query.widgetId } });
  if (widget.thumbnailId === undefined || widget.thumbnailId === null) {
    widget.thumbnailId = -1;
    await widget.save();
    widget = await sw.Widget.findOne({ where: { id: req.query.widgetId } });
  }
  if (widget.thumbnailId < 0) {
    res.sendFile(rootPath + `/files/widget.png`);
    return;
  }
  sw.File.findOne({ where: { id: widget.thumbnailId } }).then(async (file) => {
    if (file === null) {
      res.sendStatus(404);
      return;
    }
    if (fs.existsSync(rootPath + "/files/" + file.id)) {
      res.sendFile(rootPath + "/files/" + file.id);
    } else {
      res.sendFile(rootPath + "/files/" + file.id + ".jpg");
    }
  });
});

router.get("/download_bot_avatar", jsonParser, async function (req, res) {
  let bot = await sw.Bot.findOne({ where: { id: req.query.botId } });
  if (bot.avatarId === undefined || bot.avatarId === null) {
    let randomAvatarId = -1 * (Math.floor(Math.random() * 10) + 1);
    bot.avatarId = randomAvatarId;
    await bot.save();
    bot = await sw.Bot.findOne({ where: { id: req.query.botId } });
  }
  if (bot.avatarId < 0) {
    res.sendFile(rootPath + `/files/bot-avatars/${bot.avatarId * -1}.jpeg`);
    return;
  }
  sw.File.findOne({ where: { id: bot.avatarId } }).then(async (file) => {
    if (file === null) {
      res.sendStatus(404);
      return;
    }
    if (fs.existsSync(rootPath + "/files/" + file.id)) {
      res.sendFile(rootPath + "/files/" + file.id);
    } else {
      res.sendFile(rootPath + "/files/" + file.id + ".jpg");
    }
  });
});

router.get("/download_space_avatar", jsonParser, async function (req, res) {
  sw.Space.findOne({ where: { id: req.query.spaceId } }).then(async (space) => {
    if (space.avatarId === undefined) {
      res.sendStatus(404);
      return;
    }
    sw.File.findOne({ where: { id: space.avatarId } }).then(async (file) => {
      if (file === null) {
        res.sendStatus(404);
        return;
      }
      if (fs.existsSync(rootPath + "/files/" + file.id)) {
        res.sendFile(rootPath + "/files/" + file.id);
      } else {
        res.sendFile(rootPath + "/files/" + file.id + ".jpg");
      }
    });
  });
});

router.get("/download_room_avatar", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership === null) {
      res.sendStatus(404);
      return;
    }
    sw.Room.findOne({ where: { id: req.query.roomId } }).then(async (room) => {
      if (room.avatarId === undefined || room.avatarId === null) {
        let randomAvatarId = -1 * (Math.floor(Math.random() * 13) + 1);
        room.avatarId = randomAvatarId;
        await room.save();
        room = await sw.Room.findOne({ where: { id: req.query.roomId } });
      }
      if (room.avatarId < 0) {
        if (fs.existsSync(rootPath + `/files/room-avatars/` + (-1 * room.avatarId) + '.gif')) {
          res.sendFile(rootPath + `/files/room-avatars/` + (-1 * room.avatarId)+ '.gif');
        }
        else if (fs.existsSync(rootPath + `/files/room-avatars/` + (-1 * room.avatarId) + '.webp')) {
          res.sendFile(rootPath + `/files/room-avatars/` + (-1 * room.avatarId) + '.webp');
        }
        else {
          res.sendFile(rootPath + `/files/room-avatars/` + (-1 * room.avatarId));
        }
        return;
      }
      sw.File.findOne({ where: { id: room.avatarId } }).then(async (file) => {
        if (file === null) {
          res.sendStatus(404);
          return;
        }
        if (fs.existsSync(rootPath + "/files/" + file.id)) {
          res.sendFile(rootPath + "/files/" + file.id);
        } else {
          res.sendFile(rootPath + "/files/" + file.id + ".jpg");
        }
      });
    });
  });
});

router.post("/remove_file", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canRemoveFile) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let mwId = req.body.moduleWorkerId;
    if (mwId === undefined) {
      let r = await sw.Room.findOne({ where: { id: membership.roomId } });
      mwId = r.fileStorageId;
    }
    let mw = await sw.ModuleWorker.findOne({
      where: { id: mwId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.File.findOne({
      where: { moduleWorkerId: mw.id, id: req.body.fileId },
    }).then(async function (file) {
      if (file === null) {
        res.send({
          status: "error",
          errorCode: "e0005",
          message: "file does not exist.",
        });
      }
      await file.destroy();
      require("../server")
        .pushTo("room_" + membership.roomId)
        .emit("file-removed", file);
      res.send({ status: "success" });
    });
  });
});

router.post("/get_files", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let mwId = req.body.moduleWorkerId;
    if (mwId === undefined) {
      let r = await sw.Room.findOne({ where: { id: membership.roomId } });
      mwId = r.fileStorageId;
    }
    let mw = await sw.ModuleWorker.findOne({
      where: { id: mwId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.File.findAll({
      raw: true,
      where: {
        moduleWorkerId: mw.id,
        isPreview: false,
        isPresent: req.body.isPresent === true ? true : false,
      },
    }).then(async function (files) {
      res.send({ status: "success", files: files });
    });
  });
});

module.exports = router;
