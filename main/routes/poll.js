const sw = require("../db/models");
const express = require("express");
const AsyncLock = require("async-lock");
const lock = new AsyncLock();
const bodyParser = require("body-parser");
const { authenticateMember } = require("../users");

const router = express.Router();
let jsonParser = bodyParser.json();

router.post("/add_poll", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canAddPoll) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let mw = await sw.ModuleWorker.findOne({
      where: { id: req.body.moduleWorkerId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let poll = await sw.Poll.create({
      creatorId: session.userId,
      moduleWorkerId: req.body.moduleWorkerId,
      roomId: membership.roomId,
      question: req.body.question,
      name: req.body.name,
      details: req.body.details,
      category: req.body.category,
      tags: req.body.tags,
    });
    let options = [];
    for (const caption of req.body.options) {
      let option = await sw.Option.create({
        pollId: poll.id,
        caption: caption,
      });
      options.push(option);
    }
    require("../server").pushTo("room_" + membership.roomId, "poll-added", {
      poll,
      options,
    });
    res.send({ status: "success", poll: poll });
  });
});

router.post("/remove_poll", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canRemovePoll) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let mw = await sw.ModuleWorker.findOne({
      where: { id: req.body.moduleWorkerId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.Poll.findOne({
      where: { id: req.body.pollId, roomId: membership.roomId },
    }).then(async function (poll) {
      if (poll === null) {
        res.send({
          status: "error",
          errorCode: "e0005",
          message: "access denied.",
        });
      }
      await sw.Option.delete({ where: { pollId: poll.id } });
      await poll.destroy();
      require("../server").pushTo(
        "room_" + membership.roomId,
        "poll-removed",
        poll
      );
      res.send({ status: "success" });
    });
  });
});

router.post("/get_polls", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let mw = await sw.ModuleWorker.findOne({
      where: { id: req.body.moduleWorkerId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.Poll.findAll({
      where: {
        roomId: membership.roomId,
        moduleWorkerId: req.body.moduleWorkerId,
      },
      offset: req.body.offset,
      limit: req.body.limit,
    }).then(async function (polls) {
      let superOptions = {};
      let done = 0;
      if (polls.length > 0) {
        polls.forEach(async (poll) => {
          let done2 = 0;
          superOptions[poll.id] = {};
          superOptions[poll.id]["myVote"] = await sw.Vote.findOne({
            where: { pollId: poll.id, voterId: session.userId },
          });
          sw.Option.findAll({ raw: true, where: { pollId: poll.id } }).then(
            (options) => {
              superOptions[poll.id]["options"] = options;
              if (options.length > 0) {
                options.forEach(async (option) => {
                  option.votes = await sw.Vote.count({
                    where: { optionId: option.id },
                  });
                  done2++;
                  if (done2 >= options.length) {
                    done++;
                    if (done >= polls.length) {
                      res.send({
                        status: "success",
                        polls: polls,
                        options: superOptions,
                      });
                    }
                  }
                });
              } else {
                done++;
                if (done >= polls.length) {
                  res.send({
                    status: "success",
                    polls: polls,
                    options: superOptions,
                  });
                }
              }
            }
          );
        });
      } else {
        res.send({ status: "success", polls: polls, options: superOptions });
      }
    });
  });
});

router.post("/vote", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let mw = await sw.ModuleWorker.findOne({
      where: { id: req.body.moduleWorkerId, roomId: membership.roomId },
    });
    if (mw === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    sw.Poll.findOne({
      where: {
        id: req.body.pollId,
        roomId: membership.roomId,
        moduleWorkerId: req.body.moduleWorkerId,
      },
    }).then(async function (poll) {
      if (poll === null) {
        res.send({
          status: "error",
          errorCode: "e0005",
          message: "poll does not exist.",
        });
        return;
      }
      sw.Option.findOne({
        where: { id: req.body.optionId, pollId: poll.id },
      }).then(async function (option) {
        if (option === null) {
          res.send({
            status: "error",
            errorCode: "e0005",
            message: "option does not exist.",
          });
          return;
        }
        sw.Vote.findOne({
          where: {
            optionId: req.body.optionId,
            voterId: session.userId,
          },
        }).then(async function (vote) {
          if (vote !== null) {
            res.send({
              status: "error",
              errorCode: "e0005",
              message: "already voted.",
            });
            return;
          }
          vote = await sw.Vote.create({
            pollId: poll.id,
            optionId: option.id,
            voterId: session.userId,
          });

          let done2 = 0;
          let superOptions = {};
          sw.Option.findAll({ raw: true, where: { pollId: poll.id } }).then(
            (options) => {
              superOptions["options"] = options;
              if (options.length > 0) {
                options.forEach(async (option) => {
                  option.votes = await sw.Vote.count({
                    where: { optionId: option.id },
                  });
                  done2++;
                  if (done2 === options.length) {
                    require("../server").pushTo(
                      "room_" + room.id,
                      "vote-added",
                      { poll: poll, options: superOptions }
                    );
                    res.send({ status: "success", vote: vote });
                  }
                });
              } else {
                require("../server").pushTo("room_" + room.id, "vote-added", {
                  poll: poll,
                  options: superOptions,
                });
                res.send({ status: "success", vote: vote });
              }
            }
          );
        });
      });
    });
  });
});

module.exports = router;
