const sw = require("../db/models");
const express = require("express");
const AsyncLock = require("async-lock");
const lock = new AsyncLock();
const bodyParser = require("body-parser");
const { authenticateMember } = require("../users");

const router = express.Router();
let jsonParser = bodyParser.json();

router.post("/add_project", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.create({
      roomId: membership.roomId,
      title: req.body.title,
      description: req.body.description,
    });
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-project-added",
      { taskProject }
    );
    res.send({ status: "success", taskProject: taskProject });
  });
});

router.post("/add_board", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.create({
      taskProjectId: taskProject.id,
      title: req.body.title,
      description: req.body.description,
    });
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-board-added",
      { taskBoard }
    );
    res.send({ status: "success", taskBoard: taskBoard });
  });
});

router.post("/add_list", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { taskProjectId: taskProject.id },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskList = await sw.TaskList.create({
      taskBoardId: taskBoard.id,
      title: req.body.title,
    });
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-list-added",
      { taskList }
    );
    res.send({ status: "success", taskList: taskList });
  });
});

router.post("/add_card", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskList = await sw.TaskList.findOne({
      where: { id: req.body.taskListId },
    });
    if (taskList === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { id: taskList.taskBoardId },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (taskBoard.taskProjectId !== taskProject.id) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskCard = await sw.TaskCard.create({
      taskListId: taskList.id,
      title: req.body.title,
      content: req.body.content,
    });
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-card-added",
      { taskCard }
    );
    res.send({ status: "success", taskCard: taskCard });
  });
});

router.post("/edit_card", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskCard = await sw.TaskCard.findOne({
      where: { id: req.body.taskCardId },
    });
    if (taskCard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskList = await sw.TaskList.findOne({
      where: { id: taskCard.taskListId },
    });
    if (taskList === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { id: taskList.taskBoardId },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (taskBoard.taskProjectId !== taskProject.id) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    taskCard.title = req.body.title;
    taskCard.content = req.body.content;
    await taskCard.save();
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-card-updated",
      { taskCard }
    );
    res.send({ status: "success" });
  });
});

router.post("/move_card", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskCard = await sw.TaskCard.findOne({
      where: { id: req.body.taskCardId },
    });
    if (taskCard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskList = await sw.TaskList.findOne({
      where: { id: taskCard.taskListId },
    });
    if (taskList === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { id: taskList.taskBoardId },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (taskBoard.taskProjectId !== taskProject.id) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let newTaskList = await sw.TaskList.findOne({
      where: { id: req.body.newTaskListId },
    });
    if (newTaskList === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (newTaskList.taskBoardId === taskBoard.id) {
      taskCard.taskListId = newTaskList.id;
      await taskCard.save();
    }
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-card-moved",
      { taskCard }
    );
    res.send({ status: "success" });
  });
});

router.post("/delete_card", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskCard = await sw.TaskCard.findOne({
      where: { id: req.body.taskCardId },
    });
    if (taskCard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskList = await sw.TaskList.findOne({
      where: { id: taskCard.taskListId },
    });
    if (taskList === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { id: taskList.taskBoardId },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (taskBoard.taskProjectId !== taskProject.id) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    await taskCard.destroy();
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-card-deleted",
      { taskCard }
    );
    res.send({ status: "success" });
  });
});

router.post("/edit_list", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskList = await sw.TaskList.findOne({
      where: { id: req.body.taskListId },
    });
    if (taskList === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { id: taskList.taskBoardId },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (taskBoard.taskProjectId !== taskProject.id) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    taskList.title = req.body.title;
    await taskList.save();
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-list-updated",
      { taskList }
    );
    res.send({ status: "success" });
  });
});

router.post("/delete_list", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskList = await sw.TaskList.findOne({
      where: { id: req.body.taskListId },
    });
    if (taskList === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { id: taskList.taskBoardId },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (taskBoard.taskProjectId !== taskProject.id) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    await sw.TaskCard.destroy({ where: { taskListId: taskList.id } });
    await taskList.destroy();
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-list-deleted",
      { taskList }
    );
    res.send({ status: "success" });
  });
});

router.post("/edit_board", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { id: req.body.taskBoardId },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (taskBoard.taskProjectId !== taskProject.id) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    taskBoard.title = req.body.title;
    taskBoard.description = req.body.description;
    await taskBoard.save();
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-board-updated",
      { taskBoard }
    );
    res.send({ status: "success" });
  });
});

router.post("/delete_board", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    let taskBoard = await sw.TaskBoard.findOne({
      where: { id: req.body.taskBoardId },
    });
    if (taskBoard === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    if (taskBoard.taskProjectId !== taskProject.id) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    await sw.TaskList.findAll({ where: { taskBoardId: taskBoard.id } }).forEach(
      (taskList) => {
        await sw.TaskCard.destroy({ where: { taskListId: taskList.id } });
        await taskList.destroy();
      }
    );
    await taskBoard.destroy();
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-board-deleted",
      { taskBoard }
    );
    res.send({ status: "success" });
  });
});

router.post("/edit_project", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    taskProject.title = req.body.title;
    taskProject.description = req.body.description;
    await taskProject.save();
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-project-updated",
      { taskProject }
    );
    res.send({ status: "success" });
  });
});

router.post("/delete_project", jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let taskProject = await sw.TaskProject.findOne({
      where: { roomId: membership.roomId, id: req.body.taskProjectId },
    });
    if (taskProject === null) {
      res.send({
        status: "error",
        errorCode: "e0005",
        message: "access denied.",
      });
      return;
    }
    await sw.TaskBoard.findAll({
      where: { taskProjectId: taskProject.id },
    }).forEach((taskBoard) => {
      await sw.TaskList.findAll({
        where: { taskBoardId: taskBoard.id },
      }).forEach((taskList) => {
        await sw.TaskCard.destroy({ where: { taskListId: taskList.id } });
        await taskList.destroy();
      });
      await taskBoard.destroy();
    });
    await taskProject.destroy();
    require("../server").pushTo(
      "room_" + membership.roomId,
      "task-project-deleted",
      { taskProject }
    );
    res.send({ status: "success" });
  });
});

module.exports = router;
