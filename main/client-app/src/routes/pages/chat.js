import { Fab } from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowDownward } from "@material-ui/icons";
import DescriptionIcon from "@material-ui/icons/Description";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import SendIcon from "@material-ui/icons/Send";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import React, { useEffect } from "react";
import Viewer from "react-viewer";
import { useFilePicker } from "use-file-picker";
import {
  cacheMessage,
  fetchMessagesOfRoom,
  inTheGame,
  isInMessenger,
  isOnline,
  markFileAsUploaded,
  markFileAsUploading,
  popPage,
  registerDialogOpen,
  setDialogOpen,
  setInTheGame,
  uploadingFiles,
} from "../../App";
import ChatAppBar from "../../components/ChatAppBar";
import { colors, me, setToken, themeMode, token } from "../../util/settings";
import {
  ConnectToIo,
  leaveRoom,
  registerEvent,
  serverRoot,
  socket,
  unregisterEvent,
  useForceUpdate,
} from "../../util/Utils";
import SpaceWallpaperLight from "../../images/chat-wallpaper-light.jpg";
import SpaceWallpaperDark from "../../images/chat-wallpaper-dark.png";
import { setLastMessage, updateChat } from "../../components/HomeMain";
import $ from "jquery";
import MessageItem from "../../components/MessageItem";
import store, { changeConferenceMode } from "../../redux/main";
import "./chat.css";
import CustomImageBox from "../../components/CustomImageBox";
import Profile from "./profile";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

let messagesArr = [];
export let resetMessages = () => {
  messagesDict = {};
};

let uplaodedFileId = 0;

export let addMessageToList = () => {};
export let replaceMessageInTheList = () => {};

let membership = undefined;
export let setMembership = () => {};

let goingToRoom = false;
let lastLoadCount = 25;
let messagesDict = {};
let scrollReady3 = false;

let roomPersistanceDoctor;

export default function Chat(props) {
  let useStylesInput = makeStyles((theme) => ({
    InputBaseStyle: {
      "&::placeholder": {
        color: colors.text,
        textAlign: "center",
      },
    },
  }));

  let useStyles = makeStyles((theme) => ({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      position: "fixed",
      bottom: 0,
      zIndex: 1000,
      backgroundColor: colors.field,
      direction: "rtl",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      fontFamily: "mainFont",
      color: colors.text,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

  document.documentElement.style.overflowY = "hidden";

  let forceUpdate = useForceUpdate();
  let [messages, setMessages] = React.useState([]);
  let [photoViewerVisible, setPhotoViewerVisible] = React.useState(false);
  let [currentPhotoSrc, setCurrentPhotoSrc] = React.useState("");
  let [user, setUser] = React.useState(undefined);
  let [room, setRoom] = React.useState(undefined);
  const [open, setOpen] = React.useState(true);
  const [showEmojiPad, setShowEmojiPad] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  let [pickingFile, setPickingFile] = React.useState(false);
  [membership, setMembership] = React.useState({});

  let setupRoom = () => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.room_id,
      }),
      redirect: "follow",
    };
    let getRoomPromise = fetch(serverRoot + "/room/get_room", requestOptions);
    getRoomPromise
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setRoom(result.room);
        setToken(localStorage.getItem("token"));
        if (isOnline) ConnectToIo(token, () => {});
        unregisterEvent("view-updated");
        registerEvent("view-updated", (v) => {});
        window.scrollTo(0, 0);
        store.dispatch(changeConferenceMode(true));
      })
      .catch((error) => console.log("error", error));

    let requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.room_id,
      }),
      redirect: "follow",
    };
    let enterRoomPromise = fetch(
      serverRoot + "/room/enter_room",
      requestOptions2
    );
    enterRoomPromise
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        setMembership(result.membership);
        forceUpdate();
      })
      .catch((error) => console.log("error", error));
  };

  socket.io.removeAllListeners("reconnect");
  socket.io.on("reconnect", () => {
    setupRoom();
  });

  useEffect(() => {
    scrollReady3 = false;
    lastLoadCount = 25;
    messagesArr = [];
    messagesDict = {};
    setupRoom();

    console.log("planting destructor...");

    return () => {
      if (goingToRoom) {
        goingToRoom = false;
      } else {
        leaveRoom(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (roomPersistanceDoctor !== undefined)
      clearInterval(roomPersistanceDoctor);
    let doRoomDoctor = () => {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          roomId: props.room_id,
        }),
        redirect: "follow",
      };
      fetch(serverRoot + "/room/am_i_in_room", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result));
          if (result.result === false) {
            let requestOptions2 = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
              body: JSON.stringify({
                roomId: props.room_id,
              }),
              redirect: "follow",
            };
            fetch(serverRoot + "/room/enter_room", requestOptions2)
              .then((response) => response.json())
              .then((result) => {
                console.log(JSON.stringify(result));
                if (result.membership !== undefined) {
                  setMembership(result.membership);
                  forceUpdate();
                }
              })
              .catch((error) => console.log("error", error));
          }
        })
        .catch((error) => console.log("error", error));
    };

    roomPersistanceDoctor = setInterval(() => {
      doRoomDoctor();
    }, 3500);

    console.log("planting destructor...");

    return () => {
      clearInterval(roomPersistanceDoctor);
    };
  }, []);

  registerDialogOpen(setOpen);
  const handleClose = () => {
    goingToRoom = false;
    setInTheGame(false);
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        props.onClose();
      }, 250);
    }, 500);
  };
  let classes = useStyles();
  let classesInput = useStylesInput();
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "DataURL",
  });
  let [scrollTrigger, setScrollTrigger] = React.useState(false);
  let [scrollAnywayrTrigger, setScrollAnywayrTrigger] = React.useState(false);
  let [showScrollDown, setShowScrollDown] = React.useState(false);

  let callback = () => {
    let scroller = document.getElementById("chatScroller");
    if (scroller === null) {
      setTimeout(() => {
        callback();
      }, 500);
    } else {
      scroller.scrollTo(0, scroller.scrollHeight);
    }
  };

  let scrollToBottom = () => {
    callback();
  };

  let callback2 = () => {
    let isAtEnd = false;
    let scroller = document.getElementById("chatScroller");
    if (scroller !== null) {
      if (
        scroller.scrollTop + $("#chatScroller").innerHeight() >=
        scroller.scrollHeight - 300
      ) {
        isAtEnd = true;
      }
      if (isAtEnd) {
        scrollToBottom();
      }
    } else {
      setTimeout(() => {
        callback2();
      }, 500);
    }
  };

  useEffect(() => {
    callback2();
  }, [scrollTrigger]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollAnywayrTrigger]);
  replaceMessageInTheList = (msg) => {
    if (msg.roomId === props.room_id) {
      let messageSeen = document.getElementById("message-seen-" + msg.id);
      let messageNotSeen = document.getElementById(
        "message-not-seen-" + msg.id
      );
      if (messageSeen !== null && messageNotSeen !== null) {
        if (msg.seen > 0) {
          messageSeen.style.display = "block";
          messageNotSeen.style.display = "none";
        } else {
          messageSeen.style.display = "none";
          messageNotSeen.style.display = "block";
        }
        forceUpdate();
      }
    }
  };
  addMessageToList = (msg) => {
    try {
      if (msg.roomId === props.room_id) {
        let isAtEnd = false;
        let scroller = document.getElementById("chatScroller");
        if (
          scroller.scrollTop + $("#chatScroller").innerHeight() >=
          scroller.scrollHeight
        ) {
          isAtEnd = true;
        }
        let lastMsg = (
          <MessageItem
            index={1}
            key={"message-" + msg.id}
            message={msg}
            setPhotoViewerVisible={setPhotoViewerVisible}
            setCurrentPhotoSrc={setCurrentPhotoSrc}
          />
        );
        messagesArr.push(lastMsg);
        setScrollTrigger(!scrollTrigger);
        forceUpdate();
        let requestOptions3 = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            roomId: props.room_id,
            offset: 0,
          }),
          redirect: "follow",
        };
        fetch(serverRoot + "/chat/get_messages", requestOptions3)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
          })
          .catch((error) => console.log("error", error));
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  let attachScrollListener = (scroller) => {
    scroller.onscroll = () => {
      if ($("#chatScroller").scrollTop() === 0) {
        if (!scrollReady3) return;
        if (lastLoadCount < 25) return;
        let requestOptions3 = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            roomId: props.room_id,
            offset: messagesArr.length,
          }),
          redirect: "follow",
        };
        fetch(serverRoot + "/chat/get_messages", requestOptions3)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            let topMessageBeforeUpdate =
              messagesArr.length > 0 ? messagesArr[0].key : 0;
            if (result.messages !== undefined) {
              lastLoadCount = result.messages.length;
              let index = 0;
              result.messages.reverse();
              result.messages.forEach((message) => {
                if (messagesDict[message.id] === undefined) {
                  messagesDict[message.id] = true;
                  cacheMessage(message);
                  messagesArr.unshift(
                    <MessageItem
                      index={index}
                      key={"message-" + message.id}
                      message={message}
                      setPhotoViewerVisible={setPhotoViewerVisible}
                      setCurrentPhotoSrc={setCurrentPhotoSrc}
                    />
                  );
                  index++;
                }
              });

              forceUpdate();

              setTimeout(() => {
                let topMessage = document.getElementById(
                  topMessageBeforeUpdate
                );
                if (topMessage !== null) {
                  topMessage.scrollIntoView();
                  scroller.scrollTop =
                    scroller.scrollTop - topMessage.offsetHeight;
                }
              });

              let requestOptions3 = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: token,
                },
                body: JSON.stringify({
                  roomId: props.room_id,
                }),
                redirect: "follow",
              };
              fetch(serverRoot + "/chat/get_chat", requestOptions3)
                .then((response) => response.json())
                .then((result) => {
                  updateChat(result.room);
                });
            }
          })
          .catch((error) => console.log("error", error));
      }
      if (
        scroller.scrollTop + $("#chatScroller").innerHeight() >=
        scroller.scrollHeight
      ) {
        setShowScrollDown(false);
      } else {
        setShowScrollDown(true);
      }
    };
  };

  let checkScroller = () => {
    let scroller = document.getElementById("chatScroller");
    if (scroller !== null) {
      attachScrollListener(scroller);
    } else {
      setTimeout(() => {
        checkScroller();
      }, 250);
    }
  };

  useEffect(() => {
    checkScroller();
  }, []);

  let checkChatTextForPaste = () => {
    if (document.getElementById("chatText") !== null) {
      var textAreaField = document.getElementById("chatText");
      textAreaField.onpaste = function (e) {
        let pasteContainer = document.getElementById("pasteRedirect");
        if (e.clipboardData.files.length > 0 && window.confirm("ارسال عکس ?")) {
          pasteContainer.focus();
          setTimeout(() => {
            if (
              pasteContainer.children !== undefined &&
              pasteContainer.children !== null &&
              pasteContainer.children.length > 0
            ) {
              if (pasteContainer.children[0].tagName === "IMG") {
                fetch(pasteContainer.children[0].src)
                  .then((response) => response.blob())
                  .then(function (file) {
                    pasteContainer.innerHTML = "";
                    let dataUrl = { name: "uploading_image.png" };
                    let msg = {
                      time: Date.now(),
                      authorId: me.id,
                      roomId: props.room_id,
                      text: document.getElementById("chatText").value,
                      messageType:
                        dataUrl.name.endsWith(".svg") ||
                        dataUrl.name.endsWith(".png") ||
                        dataUrl.name.endsWith(".jpg") ||
                        dataUrl.name.endsWith(".jpeg") ||
                        dataUrl.name.endsWith(".gif")
                          ? "photo"
                          : dataUrl.name.endsWith(".wav") ||
                            dataUrl.name.endsWith(".mp3") ||
                            dataUrl.name.endsWith(".mpeg") ||
                            dataUrl.name.endsWith(".aac")
                          ? "audio"
                          : dataUrl.name.endsWith(".webm") ||
                            dataUrl.name.endsWith(".mkv") ||
                            dataUrl.name.endsWith(".flv") ||
                            dataUrl.name.endsWith(".3gp") ||
                            dataUrl.name.endsWith(".mp4")
                          ? "video"
                          : undefined,
                      fileUrl: URL.createObjectURL(file),
                      author: me,
                    };
                    const id = markFileAsUploading(props.room_id, {
                      message: msg,
                      file: file,
                      dataUrl: dataUrl,
                    });
                    addMessageToList(msg);
                    setLastMessage(msg);
                    let data = new FormData();
                    data.append("file", file);
                    let request = new XMLHttpRequest();
                    request.open(
                      "POST",
                      serverRoot +
                        `/file/upload_file?token=${token}&roomId=${
                          props.room_id
                        }&extension=${
                          dataUrl.name.lastIndexOf(".") + 1 >= 0
                            ? dataUrl.name.substr(
                                dataUrl.name.lastIndexOf(".") + 1
                              )
                            : ""
                        }&isPresent=false`
                    );
                    let f = {
                      progress: 0,
                      name: file.name,
                      size: file.size,
                      local: true,
                    };
                    request.upload.addEventListener("progress", function (e) {
                      let percent_completed = (e.loaded * 100) / e.total;
                      f.progress = percent_completed;
                      if (percent_completed === 100) {
                        f.local = false;
                      }
                      forceUpdate();
                    });
                    request.onreadystatechange = function () {
                      if (request.readyState === XMLHttpRequest.DONE) {
                        markFileAsUploaded(props.room_id, id);
                        let requestOptions = {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            token: token,
                          },
                          body: JSON.stringify({
                            roomId: props.room_id,
                            messageType:
                              dataUrl.name.endsWith(".svg") ||
                              dataUrl.name.endsWith(".png") ||
                              dataUrl.name.endsWith(".jpg") ||
                              dataUrl.name.endsWith(".jpeg") ||
                              dataUrl.name.endsWith(".gif")
                                ? "photo"
                                : dataUrl.name.endsWith(".wav") ||
                                  dataUrl.name.endsWith(".mp3") ||
                                  dataUrl.name.endsWith(".mpeg") ||
                                  dataUrl.name.endsWith(".aac")
                                ? "audio"
                                : dataUrl.name.endsWith(".webm") ||
                                  dataUrl.name.endsWith(".mkv") ||
                                  dataUrl.name.endsWith(".flv") ||
                                  dataUrl.name.endsWith(".3gp") ||
                                  dataUrl.name.endsWith(".mp4")
                                ? "video"
                                : undefined,
                            fileId: JSON.parse(request.responseText).file.id,
                          }),
                          redirect: "follow",
                        };
                        fetch(
                          serverRoot + "/chat/create_message",
                          requestOptions
                        )
                          .then((response) => response.json())
                          .then((result) => {
                            console.log(JSON.stringify(result));
                            if (result.message !== undefined) {
                              cacheMessage(result.message);
                              for (let i = 0; i < messagesArr.length; i++) {
                                if (
                                  messagesArr[i].key ===
                                  "message-" + msg.id
                                ) {
                                  messagesArr.splice(i, 1);
                                }
                              }
                              addMessageToList(result.message);
                              setLastMessage(result.message);
                              forceUpdate();
                            }
                          })
                          .catch((error) => console.log("error", error));
                        document.getElementById("chatText").value = "";
                      }
                    };
                    if (FileReader) {
                      let fr = new FileReader();

                      fr.onload = function () {
                        f.src = fr.result;
                      };
                      fr.readAsDataURL(file);
                    }
                    request.send(data);
                  });
              }
            }
          }, 0);
        }
      };
    } else {
      setTimeout(() => {
        checkChatTextForPaste();
      }, 500);
    }
  };

  useEffect(() => {
    checkChatTextForPaste();
  }, [props.room_id]);

  useEffect(() => {
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.room_id,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/chat/get_participent", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.participent !== undefined) {
          setUser(result.participent);
        } else {
          setUser(undefined);
        }
      })
      .catch((error) => console.log("error", error));
    let requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        roomId: props.room_id,
      }),
      redirect: "follow",
    };
    fetch(serverRoot + "/room/get_room", requestOptions2)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.room !== undefined) {
          setRoom(result.room);
          forceUpdate();
        }
      })
      .catch((error) => console.log("error", error));
    fetchMessagesOfRoom(props.room_id).then((data) => {
      /*let index = 0
        data.forEach((message) => {
          messagesArr.push(
            <MessageItem
              index={index}
              key={'message-' + message.id}
              message={message}
              setPhotoViewerVisible={setPhotoViewerVisible}
              setCurrentPhotoSrc={setCurrentPhotoSrc}
            />,
          )
          index++
        })
            
        forceUpdate();*/

      scrollToBottom();

      setTimeout(() => {
        let requestOptions3 = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            roomId: props.room_id,
            offset: 0,
          }),
          redirect: "follow",
        };
        fetch(serverRoot + "/chat/get_messages", requestOptions3)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            if (result.messages !== undefined) {
              let lastId = 0;
              messagesArr = [];
              let index = 0;
              result.messages.forEach((message) => {
                if (messagesDict[message.id] === undefined) {
                  messagesDict[message.id] = true;
                  cacheMessage(message);
                  messagesArr.push(
                    <MessageItem
                      index={index}
                      key={"message-" + message.id}
                      message={message}
                      setPhotoViewerVisible={setPhotoViewerVisible}
                      setCurrentPhotoSrc={setCurrentPhotoSrc}
                    />
                  );
                  lastId = "message-" + message.id;
                  index++;
                }
              });
              if (uploadingFiles[props.room_id] !== undefined) {
                Object.values(uploadingFiles[props.room_id]).forEach((file) => {
                  messagesArr.push(
                    <MessageItem
                      key={"message-" + file.message.id}
                      message={file.message}
                      setPhotoViewerVisible={setPhotoViewerVisible}
                      setCurrentPhotoSrc={setCurrentPhotoSrc}
                    />
                  );
                  lastId = "message-" + file.message.id;
                });
              }

              forceUpdate();

              let c = () => {
                if (document.getElementById(lastId) !== null) {
                  setTimeout(() => {
                    scrollToBottom();
                  });
                } else {
                  setTimeout(() => {
                    c();
                  }, 250);
                }
              };

              c();

              let requestOptions3 = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: token,
                },
                body: JSON.stringify({
                  roomId: props.room_id,
                }),
                redirect: "follow",
              };
              fetch(serverRoot + "/chat/get_chat", requestOptions3)
                .then((response) => response.json())
                .then((result) => {
                  updateChat(result.room);
                });

              scrollReady3 = true;
            }
          })
          .catch((error) => console.log("error", error));
      });
    });
    setTimeout(() => {
      setInTheGame(true);
    }, 1000);
  }, [props.user_id, props.room_id]);

  useEffect(() => {
    if (!loading && pickingFile) {
      setPickingFile(false);
      let dataUrl = filesContent[0];
      fetch(dataUrl.content)
        .then((res) => res.blob())
        .then((file) => {
          let msg = {
            time: Date.now(),
            authorId: me.id,
            roomId: props.room_id,
            text: document.getElementById("chatText").value,
            messageType:
              dataUrl.name.endsWith(".svg") ||
              dataUrl.name.endsWith(".png") ||
              dataUrl.name.endsWith(".jpg") ||
              dataUrl.name.endsWith(".jpeg") ||
              dataUrl.name.endsWith(".gif")
                ? "photo"
                : dataUrl.name.endsWith(".wav") ||
                  dataUrl.name.endsWith(".mp3") ||
                  dataUrl.name.endsWith(".mpeg") ||
                  dataUrl.name.endsWith(".aac")
                ? "audio"
                : dataUrl.name.endsWith(".webm") ||
                  dataUrl.name.endsWith(".mkv") ||
                  dataUrl.name.endsWith(".flv") ||
                  dataUrl.name.endsWith(".3gp") ||
                  dataUrl.name.endsWith(".mp4")
                ? "video"
                : undefined,
            fileUrl: URL.createObjectURL(file),
            author: me,
          };
          const id = markFileAsUploading(props.room_id, {
            message: msg,
            file: file,
            dataUrl: dataUrl,
          });
          addMessageToList(msg);
          setLastMessage(msg);
          let data = new FormData();
          data.append("file", file);
          let request = new XMLHttpRequest();
          request.open(
            "POST",
            serverRoot +
              `/file/upload_file?token=${token}&roomId=${
                props.room_id
              }&extension=${
                dataUrl.name.lastIndexOf(".") + 1 >= 0
                  ? dataUrl.name.substr(dataUrl.name.lastIndexOf(".") + 1)
                  : ""
              }&isPresent=false`
          );
          let f = {
            progress: 0,
            name: file.name,
            size: file.size,
            local: true,
          };
          request.upload.addEventListener("progress", function (e) {
            let percent_completed = (e.loaded * 100) / e.total;
            f.progress = percent_completed;
            if (percent_completed === 100) {
              f.local = false;
            }
            forceUpdate();
          });
          request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
              markFileAsUploaded(props.room_id, id);
              let requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: token,
                },
                body: JSON.stringify({
                  roomId: props.room_id,
                  messageType:
                    dataUrl.name.endsWith(".svg") ||
                    dataUrl.name.endsWith(".png") ||
                    dataUrl.name.endsWith(".jpg") ||
                    dataUrl.name.endsWith(".jpeg") ||
                    dataUrl.name.endsWith(".gif")
                      ? "photo"
                      : dataUrl.name.endsWith(".wav") ||
                        dataUrl.name.endsWith(".mp3") ||
                        dataUrl.name.endsWith(".mpeg") ||
                        dataUrl.name.endsWith(".aac")
                      ? "audio"
                      : dataUrl.name.endsWith(".webm") ||
                        dataUrl.name.endsWith(".mkv") ||
                        dataUrl.name.endsWith(".flv") ||
                        dataUrl.name.endsWith(".3gp") ||
                        dataUrl.name.endsWith(".mp4")
                      ? "video"
                      : undefined,
                  fileId: JSON.parse(request.responseText).file.id,
                }),
                redirect: "follow",
              };
              fetch(serverRoot + "/chat/create_message", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(JSON.stringify(result));
                  if (result.message !== undefined) {
                    cacheMessage(result.message);
                    for (let i = 0; i < messagesArr.length; i++) {
                      if (messagesArr[i].key === "message-" + msg.id) {
                        messagesArr.splice(i, 1);
                      }
                    }
                    addMessageToList(result.message);
                    setLastMessage(result.message);
                    forceUpdate();
                  }
                })
                .catch((error) => console.log("error", error));
              document.getElementById("chatText").value = "";
            }
          };
          if (FileReader) {
            let fr = new FileReader();

            fr.onload = function () {
              f.src = fr.result;
            };
            fr.readAsDataURL(file);
          }
          request.send(data);
        });
    }
  }, [loading]);

  useEffect(() => {
    var placeholder = null,
      small = null;
    let tryToAttachImg = () => {
      placeholder = document.querySelector(".placeholder");
      if (placeholder !== null) {
        small = placeholder.querySelector(".img-small");
      } else {
        small = null;
      }
      if (placeholder === null || small === null) {
        setTimeout(() => {
          tryToAttachImg();
        }, 500);
      } else {
        var img = new Image();
        img.src = small.src;
        img.onload = function () {
          small.classList.add("loaded");
        };
        var imgLarge = new Image();
        imgLarge.src = placeholder.dataset.large;
        imgLarge.onload = function () {
          imgLarge.classList.add("loaded");
        };
        placeholder.appendChild(imgLarge);
      }
    };
    tryToAttachImg();
  }, []);

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      style={{ zIndex: 2501 }}
    >
      <div
        contenteditable="true"
        id="pasteRedirect"
        style={{ position: "fixed", top: -256, opacity: 0 }}
      ></div>
      <CustomImageBox
        src={themeMode === 'light' ? SpaceWallpaperLight : SpaceWallpaperDark}
        borderRadius={isInMessenger() ? "0 0 0 24px" : 0}
        style={{ position: "fixed" }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Viewer
          zIndex={99999}
          style={{ position: "fixed", left: 0, top: 0 }}
          visible={photoViewerVisible}
          onClose={() => {
            setPhotoViewerVisible(false);
          }}
          images={[{ src: currentPhotoSrc, alt: "" }]}
        />

        <ChatAppBar
          handleClose={handleClose}
          user={user}
          room={room}
          handleCallClicked={() => {
            goingToRoom = true;
          }}
          onUserAvatarClicked={() => setShowProfile(true)}
        />
        <div
          style={{
            position: "fixed",
            bottom: (showEmojiPad ? 400 : 0) + "px",
            width: "100%",
            height: 56,
            zIndex: 1000,
            display:
              membership !== undefined &&
              membership !== null &&
              membership.canAddMessage === true
                ? "block"
                : "none",
          }}
        >
          <div
            className={classes.root}
            style={{
              height: 56,
              bottom: inTheGame ? (showEmojiPad ? 416 : 0) : -72,
              transition: "bottom .5s",
              backdropFilter: "blur(10px)",
            }}
          >
            <IconButton
              className={classes.iconButton}
              onClick={() => {
                setPickingFile(true);
                openFileSelector();
              }}
            >
              <DescriptionIcon style={{ fill: colors.icon }} />
            </IconButton>
            <IconButton
              className={classes.iconButton}
              onClick={() => {
                if (showEmojiPad) {
                  setShowEmojiPad(!showEmojiPad);
                  window.onpopstate = function (event) {
                    if (setDialogOpen !== null) {
                      setDialogOpen(false);
                    }
                    setTimeout(popPage, 250);
                  };
                } else {
                  setShowEmojiPad(!showEmojiPad);
                  window.onpopstate = function (event) {
                    setShowEmojiPad(false);
                    window.onpopstate = function (event) {
                      if (setDialogOpen !== null) {
                        setDialogOpen(false);
                      }
                      setTimeout(popPage, 250);
                    };
                  };
                }
              }}
            >
              <EmojiEmotionsIcon style={{ fill: colors.icon }} />
            </IconButton>
            <InputBase
              multiline
              id={"chatText"}
              className={classes.input}
              placeholder="پیام خود را بنویسید"
              onChange={() => {
                socket.emit("chat-typing");
              }}
              classes={{
                input: classes.InputBaseStyle,
              }}
            />
            <IconButton
              id={"sendBtn"}
              className={classes.iconButton}
              style={{ transform: "rotate(180deg)" }}
              onClick={() => {
                let text = document.getElementById("chatText").value;
                text = text.replace(/\r?\n|\r/g, "");
                text = text.trim();
                if (text !== "") {
                  let msg = {
                    id: "message-" + Date.now(),
                    time: Date.now(),
                    authorId: me.id,
                    roomId: props.room_id,
                    text: document.getElementById("chatText").value,
                    messageType: "text",
                    author: me,
                  };
                  addMessageToList(msg);
                  setLastMessage(msg);
                  let requestOptions = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      token: token,
                    },
                    body: JSON.stringify({
                      roomId: props.room_id,
                      text: document.getElementById("chatText").value,
                      messageType: "text",
                    }),
                    redirect: "follow",
                  };
                  fetch(serverRoot + "/chat/create_message", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                      console.log(JSON.stringify(result));
                      if (result.message !== undefined) {
                        cacheMessage(result.message);
                        let msgEl = document.getElementById(
                          "message-" + msg.id
                        );
                        let msgSeenEl = document.getElementById(
                          "message-seen-" + msg.id
                        );
                        let msgNotSeenEl = document.getElementById(
                          "message-not-seen-" + msg.id
                        );
                        msgEl.id = "message-" + result.message.id;
                        msgSeenEl.id = "message-seen-" + result.message.id;
                        msgNotSeenEl.id =
                          "message-not-seen-" + result.message.id;
                        msg.id = result.message.id;
                        forceUpdate();
                      }
                    })
                    .catch((error) => console.log("error", error));
                  document.getElementById("chatText").value = "";
                }
              }}
            >
              <SendIcon style={{ fill: colors.icon }} />
            </IconButton>
            <br />
          </div>
          {showEmojiPad ? (
            <Picker
              set={"apple"}
              style={{
                width: "100%",
                height: 416,
                marginTop: 40,
              }}
              onSelect={(currentEmoji) => {
                document.getElementById("chatText").value +=
                  currentEmoji.native;
              }}
            />
          ) : null}
        </div>
        <div
          style={{
            width: "100%",
            height: showEmojiPad ? "calc(100% - 416px)" : "100%",
          }}
        >
          <div
            style={{ width: "100%", height: "100%", overflow: "auto" }}
            id={"chatScroller"}
          >
            <div style={{ height: 32 }} />
            <div id={"messagesContainer"}>{messagesArr}</div>
            <div style={{ width: "100%", height: 160 }} />
          </div>
          <Fab
            color={"secondary"}
            style={{
              display: showScrollDown ? "block" : "none",
              position: "fixed",
              left: 24,
              bottom: 72 + 16,
            }}
            onClick={() => {
              scrollToBottom();
            }}
          >
            <ArrowDownward />
          </Fab>
        </div>
        {(showProfile && user !== undefined) ? <Profile onClose={() => setShowProfile(false)} user_id={user.id}/> : null}
      </div>
    </Dialog>
  );
}
