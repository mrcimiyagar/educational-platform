let Sequelize = require("sequelize");
let pgTools = require("pgtools");
const { uuid } = require("uuidv4");
const tools = require("../tools");

let sequelizeClient;
let Account;
let User;
let Session;
let Space;
let Room;
let RoomSecret;
let SpaceSecret;
let File;
let Membership;
let Message;
let Poll;
let Option;
let Vote;
let Invite;
let MySurvey;
let SurveyLabel;
let SurveyCat;
let Present;
let Bot;
let BotSecret;
let Comment;
let Widget;
let Workership;
let Subscription;
let Screenshot;
let StoreAd;
let StoreCategory;
let StorePackage;
let Notification;
let P2pExistance;
let MessageSeen;
let WidgetWorker;
let TaskProject;
let TaskBoard;
let TaskList;
let TaskCard;
let ModuleWorker;

const pgUsername = "postgres";
const pgPassword = "3g5h165tsK65j1s564L69ka5R168kk37sut5ls3Sk2t";
const dbName = "Society";
const dbName2 = "TaskBoard";
module.exports = {
  setup: async function () {
    const config = {
      user: pgUsername,
      password: pgPassword,
      port: 5432,
      host: "localhost",
    };
    /*try {
      await pgTools.dropdb(config, dbName);
    } catch (e) {console.log(e);}*/
    try {
      await pgTools.createdb(config, dbName);
    } catch (e) {console.log(e);}
    /*try {
      await pgTools.dropdb(config, dbName2);
    } catch (e) {console.log(e);}
    try {
      await pgTools.createdb(config, dbName2);
    } catch (e) {console.log(e);}*/
    prepareSequelizeInstance();
    await prepareUserModel();
    await prepareAccountModel();
    await prepareSessionModel();
    await prepareSpaceModel();
    await prepareRoomModel();
    await prepareFileModel();
    await prepareMembershipModel();
    await prepareMessageModel();
    await preparePollModel();
    await prepareOptionModel();
    await prepareVoteModel();
    await prepareInviteModel();
    await prepareMySurveyModel();
    await prepareSurveyLabelModel();
    await prepareSurveyCatModel();
    await preparePresentModel();
    await prepareSpaceSecretModel();
    await prepareRoomSecretModel();
    await prepareStoreCategoryModel();
    await prepareBotModel();
    await prepareBotSecretModel();
    await prepareCommentModel();
    await prepareWidgetModel();
    await prepareWorkershipModel();
    await prepareSubscriptionModel();
    await prepareScreenshotModel();
    await prepareStoreAdModel();
    await prepareStorePackageModel();
    await prepareNotificationModel();
    await prepareP2pExistanceModel();
    await prepareMessageSeenModel();
    await prepareWidgetWorker();
    await prepareModuleWorkerModel();

    let adminAcc = await Account.findOne({ where: { role: "admin" } });
    if (adminAcc === null) {
      let postPhotoPreview = await File.create({
        uploaderId: null,
        roomId: null,
        name: "postPhoto1",
        extension: "png",
        size: 100,
        previewFileId: null,
        isPreview: true,
      });
      let postPhoto = await File.create({
        uploaderId: null,
        roomId: null,
        name: "postPhoto1",
        extension: "png",
        size: 100,
        previewFileId: postPhotoPreview.id,
        isPreview: false,
      });
      let user = await User.create({
        id: "admin",
        username: "admin",
        firstName: "admin",
        lastName: "admin",
        avatarId: postPhoto.id,
      });
      let userAcc = await Account.create({
        userId: user.id,
        phone: "+98000000000",
        pending: false,
        forgot: false,
        vCode: "",
        role: "admin",
        password: "admin",
        themeColor: tools.lightTheme,
      });
      let session = await Session.create({
        userId: user.id,
        token: "admin",
      });

      let home = await Space.create({
        title: "??????????????",
        mainRoomId: null,
      });
      let spaceSecret = await SpaceSecret.create({
        ownerId: user.id,
        spaceId: home.id,
      });
      let room = await Room.create({
        title: "??????????????",
        spaceId: home.id,
        accessType: "public",
      });
      let roomDefaultModuleWorker = await ModuleWorker.create({type: 'filestorage', roomId: room.id, x: 32, y: 32});
      room.fileStorageId = roomDefaultModuleWorker.id;
      await room.save();
      home.mainRoomId = room.id;
      await home.save();
      let roomSecret = await RoomSecret.create({
        ownerId: user.id,
        roomId: room.id,
      });
      let mem = await Membership.create({
        userId: user.id,
        roomId: room.id,
        ...tools.adminPermissions,
      });
      let msg = await Message.create({
        authorId: user.id,
        time: Date.now(),
        roomId: room.id,
        text: "?????? ?????????? ????",
        fileId: null,
        messageType: "text",
      });
    }
  },
};

function prepareSequelizeInstance() {
  sequelizeClient = new Sequelize(dbName, pgUsername, pgPassword, {
    host: "localhost",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });
}

async function prepareMessageSeenModel() {
  MessageSeen = sequelizeClient.define(
    "MessageSeen",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
        unique: "MessageSeenUnique",
      },
      messageId: {
        type: Sequelize.BIGINT,
        unique: "MessageSeenUnique",
      },
      roomId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  MessageSeen.belongsTo(Message, { foreignKey: "messageId" });
  MessageSeen.belongsTo(Room, { foreignKey: "roomId" });
  await MessageSeen.sync();
  module.exports["MessageSeen"] = MessageSeen;
}

async function prepareP2pExistanceModel() {
  P2pExistance = sequelizeClient.define(
    "P2pExistance",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      code: Sequelize.STRING,
      roomId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  await P2pExistance.sync();
  module.exports["P2pExistance"] = P2pExistance;
}

async function prepareNotificationModel() {
  Notification = sequelizeClient.define(
    "Notification",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      data: Sequelize.STRING,
      ownerId: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  await Notification.sync();
  module.exports["Notification"] = Notification;
}

async function prepareStorePackageModel() {
  StorePackage = sequelizeClient.define(
    "StorePackage",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      title: Sequelize.STRING,
      coverUrl: Sequelize.STRING,
      categoryId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  await StorePackage.sync();
  module.exports["StorePackage"] = StorePackage;
}

async function prepareStoreCategoryModel() {
  StoreCategory = sequelizeClient.define(
    "StoreCategory",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      title: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  await StoreCategory.sync();
  module.exports["StoreCategory"] = StoreCategory;
}

async function prepareStoreAdModel() {
  StoreAd = sequelizeClient.define(
    "StoreAd",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      fileId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  StoreAd.belongsTo(File, { foreignKey: "fileId" });
  await StoreAd.sync();
  module.exports["StoreAd"] = StoreAd;
}

async function prepareScreenshotModel() {
  Screenshot = sequelizeClient.define(
    "Screenshot",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      botId: Sequelize.STRING,
      fileId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  Screenshot.belongsTo(Bot, { foreignKey: "botId" });
  Screenshot.belongsTo(File, { foreignKey: "fileId" });
  await Screenshot.sync();
  module.exports["Screenshot"] = Screenshot;
}

async function prepareSubscriptionModel() {
  Subscription = sequelizeClient.define(
    "Subscription",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      botId: {
        type: Sequelize.DataTypes.STRING,
        unique: "SubscriptionUnique",
      },
      subscriberId: {
        type: Sequelize.DataTypes.STRING,
        unique: "SubscriptionUnique",
      },
    },
    {
      freezeTableName: true,
    }
  );
  Subscription.belongsTo(Bot, { foreignKey: "botId" });
  Subscription.belongsTo(User, { foreignKey: "subscriberId" });
  await Subscription.sync();
  module.exports["Subscription"] = Subscription;
}

async function prepareBotModel() {
  Bot = sequelizeClient.define(
    "Bot",
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      creatureType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "bot",
      },
      username: Sequelize.STRING,
      title: Sequelize.STRING,
      description: Sequelize.STRING,
      avatarId: Sequelize.BIGINT,
      categoryId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
      paranoid: true
    }
  );
  Bot.belongsTo(StoreCategory, { foreignKey: "categoryId" });
  await Bot.sync();
  module.exports["Bot"] = Bot;
}

async function prepareBotSecretModel() {
  BotSecret = sequelizeClient.define(
    "BotSecret",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      botId: Sequelize.STRING,
      token: Sequelize.STRING,
      creatorId: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      paranoid: true
    }
  );
  BotSecret.belongsTo(Bot, { foreignKey: "botId" });
  BotSecret.belongsTo(User, { foreignKey: "creatorId" });
  await BotSecret.sync();
  module.exports["BotSecret"] = BotSecret;
}

async function prepareCommentModel() {
  Comment = sequelizeClient.define(
    "Comment",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      botId: {
        type: Sequelize.DataTypes.STRING,
        unique: "commentUnique",
      },
      authorId: {
        type: Sequelize.DataTypes.STRING,
        unique: "commentUnique",
      },
      text: Sequelize.STRING,
      rating: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
    }
  );
  Comment.belongsTo(Bot, { foreignKey: "botId" });
  Comment.belongsTo(User, { foreignKey: "authorId" });
  await Comment.sync();
  module.exports["Comment"] = Comment;
}

async function prepareWidgetModel() {
  Widget = sequelizeClient.define(
    "Widget",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      title: Sequelize.STRING,
      botId: Sequelize.STRING,
      thumbnailId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
      paranoid: true
    }
  );
  Widget.belongsTo(Bot, { foreignKey: "botId" });
  await Widget.sync();
  module.exports["Widget"] = Widget;
}

async function prepareWorkershipModel() {
  Workership = sequelizeClient.define(
    "Workership",
    {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      botId: Sequelize.STRING,
      roomId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  Workership.belongsTo(Bot, { foreignKey: "botId" });
  Workership.belongsTo(Room, { foreignKey: "roomId" });
  await Workership.sync();
  module.exports["Workership"] = Workership;
}

async function prepareUserModel() {
  User = sequelizeClient.define(
    "User",
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      creatureType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "user",
      },
      username: Sequelize.STRING,
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      avatarId: Sequelize.BIGINT,
      isGuest: Sequelize.BOOLEAN,
    },
    {
      freezeTableName: true,
    }
  );
  await User.sync();
  module.exports["User"] = User;
}

async function prepareAccountModel() {
  Account = sequelizeClient.define(
    "Account",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: Sequelize.STRING,
      phone: Sequelize.STRING,
      email: Sequelize.STRING,
      pending: Sequelize.BOOLEAN,
      forgot: Sequelize.BOOLEAN,
      vCode: Sequelize.STRING,
      role: Sequelize.STRING,
      password: Sequelize.STRING,
      homeSpaceId: Sequelize.BIGINT,
      themeColor: Sequelize.STRING,
      canAddRoom: Sequelize.BOOLEAN,
      canAddBot: Sequelize.BOOLEAN,
      canModifyStoreCategory: Sequelize.BOOLEAN,
      canModifyStorePackage: Sequelize.BOOLEAN,
    },
    {
      freezeTableName: true,
    }
  );
  Account.belongsTo(User, { foreignKey: "userId" });
  await Account.sync();
  module.exports["Account"] = Account;
}

async function prepareSessionModel() {
  Session = sequelizeClient.define(
    "Session",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: Sequelize.STRING,
      token: Sequelize.STRING,
      socketId: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  await Session.sync();
  module.exports["Session"] = Session;
}

async function prepareSpaceModel() {
  Space = sequelizeClient.define(
    "Space",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING,
      mainRoomId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  await Space.sync();
  module.exports["Space"] = Space;
}

async function prepareRoomModel() {
  Room = sequelizeClient.define(
    "Room",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING,
      spaceId: Sequelize.BIGINT,
      chatType: Sequelize.STRING,
      avatarId: Sequelize.BIGINT,
      accessType: Sequelize.STRING,
      hidden: Sequelize.BOOLEAN,
      fileStorageId: Sequelize.BIGINT,
      videochatId: Sequelize.BIGINT,
    },
    {
      paranoid: true,
      freezeTableName: true,
    }
  );
  Room.belongsTo(Space, { foreignKey: "spaceId", allowNull: true });
  await Room.sync();
  module.exports["Room"] = Room;
}

async function prepareFileModel() {
  File = sequelizeClient.define(
    "File",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      uploaderId: Sequelize.STRING,
      moduleWorkerId: Sequelize.BIGINT,
      name: Sequelize.STRING,
      extension: Sequelize.STRING,
      size: Sequelize.BIGINT,
      previewFileId: Sequelize.BIGINT,
      isPreview: Sequelize.BOOLEAN,
      isPresent: Sequelize.BOOLEAN,
      fileType: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  File.belongsTo(User, { foreignKey: { name: "uploaderId", allowNull: true } });
  await File.sync();
  module.exports["File"] = File;
}

async function prepareMembershipModel() {
  Membership = sequelizeClient.define(
    "Membership",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: Sequelize.STRING,
      roomId: Sequelize.BIGINT,
      subroomId: Sequelize.BIGINT,
      isGuest: Sequelize.BOOLEAN,
      canAssignPermission: Sequelize.BOOLEAN,
      canUploadFile: Sequelize.BOOLEAN,
      canRemoveFile: Sequelize.BOOLEAN,
      canAddSubRoom: Sequelize.BOOLEAN,
      canAddMessage: Sequelize.BOOLEAN,
      canRemoveMessage: Sequelize.BOOLEAN,
      canRemoveOwnMessage: Sequelize.BOOLEAN,
      canEditOwnMessage: Sequelize.BOOLEAN,
      canAddPoll: Sequelize.BOOLEAN,
      canRemovePoll: Sequelize.BOOLEAN,
      canInviteToRoom: Sequelize.BOOLEAN,
      canActInVideo: Sequelize.BOOLEAN,
      canPresent: Sequelize.BOOLEAN,
      canUseWhiteboard: Sequelize.BOOLEAN,
      canEditVideoSound: Sequelize.BOOLEAN,
    },
    {
      freezeTableName: true,
      paranoid: true
    }
  );
  Membership.belongsTo(User, { foreignKey: "userId" });
  Membership.belongsTo(Room, { foreignKey: "roomId" });
  await Membership.sync();
  module.exports["Membership"] = Membership;
}

async function prepareMessageModel() {
  Message = sequelizeClient.define(
    "Message",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      authorId: Sequelize.STRING,
      roomId: Sequelize.BIGINT,
      time: Sequelize.BIGINT,
      text: Sequelize.STRING,
      fileId: Sequelize.BIGINT,
      messageType: Sequelize.STRING,
      repliedTo: Sequelize.BIGINT,
      forwardedFrom: Sequelize.BIGINT
    },
    {
      freezeTableName: true,
      paranoid: true
    }
  );
  Message.belongsTo(Room, { foreignKey: "roomId" });
  await Message.sync();
  module.exports["Message"] = Message;
}

async function preparePollModel() {
  Poll = sequelizeClient.define(
    "Poll",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      creatorId: Sequelize.STRING,
      roomId: Sequelize.BIGINT,
      moduleWorkerId: Sequelize.BIGINT,
      question: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  Poll.belongsTo(User, { foreignKey: "creatorId" });
  Poll.belongsTo(Room, { foreignKey: "roomId" });
  await Poll.sync();
  module.exports["Poll"] = Poll;
}

async function prepareOptionModel() {
  Option = sequelizeClient.define(
    "Option",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      pollId: Sequelize.BIGINT,
      caption: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  Option.belongsTo(Poll, { foreignKey: "pollId" });
  await Option.sync();
  module.exports["Option"] = Option;
}

async function prepareVoteModel() {
  Vote = sequelizeClient.define(
    "Vote",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      pollId: Sequelize.BIGINT,
      voterId: Sequelize.STRING,
      optionId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  Vote.belongsTo(User, { foreignKey: "voterId" });
  Vote.belongsTo(Option, { foreignKey: "optionId" });
  await Vote.sync();
  module.exports["Vote"] = Vote;
}

async function prepareInviteModel() {
  Invite = sequelizeClient.define(
    "Invite",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: Sequelize.STRING,
      roomId: Sequelize.BIGINT,
      extra: Sequelize.STRING,
      title: Sequelize.STRING,
      text: Sequelize.STRING,
      inviteType: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  Invite.belongsTo(User, { foreignKey: "userId" });
  Invite.belongsTo(Room, { foreignKey: "roomId" });
  await Invite.sync();
  module.exports["Invite"] = Invite;
}

async function prepareMySurveyModel() {
  MySurvey = sequelizeClient.define(
    "MySurvey",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: Sequelize.STRING,
      surveyId: Sequelize.STRING,
      answered: Sequelize.BOOLEAN,
    },
    {
      freezeTableName: true,
    }
  );
  MySurvey.belongsTo(User, { foreignKey: "userId" });
  await MySurvey.sync();
  module.exports["MySurvey"] = MySurvey;
}

async function prepareSurveyLabelModel() {
  SurveyLabel = sequelizeClient.define(
    "SurveyLabel",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  await SurveyLabel.sync();
  module.exports["SurveyLabel"] = SurveyLabel;
}

async function prepareSurveyCatModel() {
  SurveyCat = sequelizeClient.define(
    "SurveyCat",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  await SurveyCat.sync();
  module.exports["SurveyCat"] = SurveyCat;
}

async function preparePresentModel() {
  Present = sequelizeClient.define(
    "Present",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      roomId: Sequelize.BIGINT,
      fileId: Sequelize.BIGINT,
      pageNumber: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
    }
  );
  Present.belongsTo(Room, { foreignKey: "roomId" });
  Present.belongsTo(File, { foreignKey: "fileId" });
  await Present.sync();
  module.exports["Present"] = Present;
}

async function prepareRoomSecretModel() {
  RoomSecret = sequelizeClient.define(
    "RoomSecret",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      wallpaper: Sequelize.STRING,
      ownerId: Sequelize.STRING,
      presentId: Sequelize.BIGINT,
      roomId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  RoomSecret.belongsTo(Room, { foreignKey: "roomId" });
  RoomSecret.belongsTo(Present, { foreignKey: "presentId" });
  await RoomSecret.sync();
  module.exports["RoomSecret"] = RoomSecret;
}

async function prepareSpaceSecretModel() {
  SpaceSecret = sequelizeClient.define(
    "SpaceSecret",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      ownerId: Sequelize.STRING,
      spaceId: Sequelize.BIGINT,
    },
    {
      freezeTableName: true,
    }
  );
  SpaceSecret.belongsTo(Space, { foreignKey: "spaceId" });
  await SpaceSecret.sync();
  module.exports["SpaceSecret"] = SpaceSecret;
}

async function prepareWidgetWorker() {
  WidgetWorker = sequelizeClient.define(
    "WidgetWorker",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      widgetId: Sequelize.BIGINT,
      roomId: Sequelize.BIGINT,
      bossId: Sequelize.STRING,
      x: Sequelize.INTEGER,
      y: Sequelize.INTEGER,
      width: Sequelize.INTEGER,
      height: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
    }
  );
  WidgetWorker.belongsTo(Widget, { foreignKey: "widgetId" });
  WidgetWorker.belongsTo(Room, { foreignKey: "roomId" });
  await WidgetWorker.sync();
  module.exports["WidgetWorker"] = WidgetWorker;
}

async function prepareTaskProject() {
  TaskProject = sequelizeClient.define(
    "TaskProject",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      roomId: Sequelize.BIGINT,
      title: Sequelize.STRING,
      description: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );
  TaskProject.belongsTo(Room, { foreignKey: "roomId" });
  await TaskProject.sync();
  module.exports["TaskProject"] = TaskProject;
}

async function prepareTaskBoard() {
  TaskBoard = sequelizeClient.define(
    "TaskBoard",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      taskProjectId: Sequelize.BIGINT,
      title: Sequelize.STRING,
      description: Sequelize.STRING
    },
    {
      freezeTableName: true,
    }
  );
  TaskBoard.belongsTo(TaskProject, { foreignKey: "taskProjectId" });
  await TaskBoard.sync();
  module.exports["TaskBoard"] = TaskBoard;
}

async function prepareTaskList() {
  TaskList = sequelizeClient.define(
    "TaskList",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      taskBoardId: Sequelize.BIGINT,
      title: Sequelize.STRING
    },
    {
      freezeTableName: true,
    }
  );
  TaskList.belongsTo(TaskBoard, { foreignKey: "taskBoardId" });
  await TaskList.sync();
  module.exports["TaskList"] = TaskList;
}

async function prepareTaskCard() {
  TaskCard = sequelizeClient.define(
    "TaskCard",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      taskListId: Sequelize.BIGINT,
      title: Sequelize.STRING,
      content: Sequelize.STRING
    },
    {
      freezeTableName: true,
    }
  );
  TaskCard.belongsTo(TaskList, { foreignKey: "taskListId" });
  await TaskCard.sync();
  module.exports["TaskCard"] = TaskCard;
}

async function prepareModuleWorkerModel() {
  ModuleWorker = sequelizeClient.define(
    "ModuleWorker",
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      type: Sequelize.STRING,
      roomId: Sequelize.BIGINT,
      x: Sequelize.INTEGER,
      y: Sequelize.INTEGER
    },
    {
      freezeTableName: true,
    }
  );
  ModuleWorker.belongsTo(Room, { foreignKey: "roomId" });
  await ModuleWorker.sync();
  module.exports["ModuleWorker"] = ModuleWorker;
}
