import { css } from '@emotion/css'
import { Avatar, Fab, Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import { makeStyles } from '@material-ui/core/styles'
import {
  ArrowDownward,
  ArrowUpward,
  PlayArrowTwoTone,
} from '@material-ui/icons'
import DescriptionIcon from '@material-ui/icons/Description'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'
import SendIcon from '@material-ui/icons/Send'
import 'emoji-mart/css/emoji-mart.css';
import { Picker, store } from 'emoji-mart';
import React, { useEffect } from 'react'
import Viewer from 'react-viewer'
import { useFilePicker } from 'use-file-picker'
import {
  cacheMessage,
  currentRoomId,
  fetchMessagesOfRoom,
  gotoPage,
  histPage,
  isDesktop,
  isInMessenger,
  isInRoom,
  isOnline,
  isTablet,
  markFileAsUploaded,
  markFileAsUploading,
  popPage,
  routeTrigger,
  setCurrentRoomId,
  setDialogOpen,
  uploadingFiles,
} from '../../App'
import { colors, me, setToken, token } from '../../util/settings'
import { ConnectToIo, registerEvent, serverRoot, socket, unregisterEvent, useForceUpdate } from '../../util/Utils'
import ChatAppBar from '../ChatAppBar'
import ChatWallpaper from '../../images/chat-wallpaper.png'
import { setLastMessage, updateChat } from '../../components/HomeMain'
import $ from 'jquery';
import html2canvas from 'html2canvas';
import MessageItem from '../MessageItem';
import { updateMessageSeen } from '../AllChats'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: isDesktop()
      ? 'min(20%, 450px)'
      : isTablet()
      ? 'min(60%, 350px)'
      : '100%',
    position: 'fixed',
    left: isDesktop()
      ? isInRoom() || histPage === '/app/settings'
        ? 'calc(100% - 288px)'
        : 'calc(50% - 256px - 32px - 32px - 16px - 112px)'
      : 'calc(50% - 256px - 16px)',
    transform: 'translateX(-50%)',
    borderRadius: 16,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    direction: 'rtl',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}))

export let updateChatEmbedded = undefined

let messagesArr = []
export let resetMessages2 = () => {
  messagesDict = {};
}

export let addMessageToList2 = () => {}
export let replaceMessageInTheList2 = () => {}
let membership = undefined;
export let setMembership = () => {};

let lastLoadCount = 25;
let messagesDict = {};
let scrollReady = false;

export default function ChatEmbeddedInMessenger(props) {

  document.documentElement.style.overflowY = 'hidden';

  let forceUpdate = useForceUpdate();
  updateChatEmbedded = forceUpdate;
  let [photoViewerVisible, setPhotoViewerVisible] = React.useState(false);
  let [currentPhotoSrc, setCurrentPhotoSrc] = React.useState('');
  let [user, setUser] = React.useState(undefined);
  let [room, setRoom] = React.useState(undefined);
  const [showEmojiPad, setShowEmojiPad] = React.useState(false);
  let [pickingFile, setPickingFile] = React.useState(false);
  let classes = useStyles();
  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    readAs: 'DataURL',
  });
  let [scrollTrigger, setScrollTrigger] = React.useState(false);
  let [scrollAnywayrTrigger, setScrollAnywayrTrigger] = React.useState(false);
  let [showScrollDown, setShowScrollDown] = React.useState(false);
  ;[membership, setMembership] = React.useState({});

  let scrollToBottom = () => {
    let scroller = document.getElementById('scroller');
    scroller.scrollTo(0, scroller.scrollHeight);
  }

  useEffect(() => {
    socket.io.on('reconnect', () => {
      if (isInRoom() && isDesktop()) return;
      setupRoom();
    });
  }, []);

  useEffect(() => {
    let isAtEnd = false
    let scroller = document.getElementById('scroller')
    if (scroller.scrollTop + $('#scroller').innerHeight() >= (scroller.scrollHeight - 300)) {
      isAtEnd = true
    }
    if (isAtEnd) {
      scrollToBottom();
    }
  }, [scrollTrigger]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollAnywayrTrigger]);

  let setupRoom = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: 'follow',
    }
    let getRoomPromise = fetch(serverRoot + '/room/get_room', requestOptions)
    getRoomPromise
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        setRoom(result.room)
        setToken(localStorage.getItem('token'))
        if (isOnline) ConnectToIo(token, () => {})
        window.scrollTo(0, 0)
      })
      .catch((error) => console.log('error', error))

    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: 'follow',
    }
    let enterRoomPromise = fetch(
      serverRoot + '/room/enter_room',
      requestOptions2,
    )
    enterRoomPromise
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        setMembership(result.membership);
        forceUpdate()
      })
      .catch((error) => console.log('error', error))
  };

  useEffect(() => {
    setCurrentRoomId(props.roomId);
    scrollReady = false;
    messagesArr = [];
    messagesDict = {};
    setupRoom();
  }, [props.roomId]);

  useEffect(() => {
    let scroller = document.getElementById('scroller')
    scroller.onscroll = () => {
      if ($('#scroller').scrollTop() === 0) {
        if (!scrollReady) return;
        if (lastLoadCount < 25) return;
        let requestOptions3 = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            roomId: props.roomId,
            offset: messagesArr.length
          }),
          redirect: 'follow',
        }
        fetch(serverRoot + '/chat/get_messages', requestOptions3)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            let topMessageBeforeUpdate = messagesArr.length > 0 ? messagesArr[0].key : 0
            if (result.messages !== undefined) {
              lastLoadCount = result.messages.length;
              let index = 0

            if (currentRoomId === props.roomId) {
              result.messages.reverse();
              result.messages.forEach((message) => {
                if (messagesDict[message.id] === undefined) {
                  messagesDict[message.id] = true;
                  cacheMessage(message)
                  messagesArr.unshift(
                    <MessageItem
                      index={index}
                      key={'message-' + message.id}
                      message={message}
                      setPhotoViewerVisible={setPhotoViewerVisible}
                      setCurrentPhotoSrc={setCurrentPhotoSrc}
                    />,
                  )
                  index++;
                }
              })
            }

              forceUpdate();

              setTimeout(() => {
                let topMessage = document.getElementById(topMessageBeforeUpdate);
                if (topMessage !== null) {
                  topMessage.scrollIntoView();
                  scroller.scrollTop = scroller.scrollTop - topMessage.offsetHeight;
                }
              });
  
              let requestOptions3 = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  token: token,
                },
                body: JSON.stringify({
                  roomId: props.roomId,
                }),
                redirect: 'follow',
              }
              fetch(serverRoot + '/chat/get_chat', requestOptions3)
                .then((response) => response.json())
                .then((result) => {
                  updateChat(result.room)
                })
            }
          })
          .catch((error) => console.log('error', error))
      }
      if (
        scroller.scrollTop + $('#scroller').innerHeight() >=
        scroller.scrollHeight
      ) {
        setShowScrollDown(false)
      } else {
        setShowScrollDown(true)
      }
    }

    if (props.userId === undefined) setUser(undefined);
    else {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        userId: props.userId,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/auth/get_user', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.user !== undefined) {
          setUser(result.user)
        }
      })
      .catch((error) => console.log('error', error))
    }

    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/room/get_room', requestOptions2)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.room !== undefined) {
          setRoom(result.room)
        }
      })
      .catch((error) => console.log('error', error))
    
    setCurrentRoomId(props.roomId);

    fetchMessagesOfRoom(props.roomId).then(data => {
      /*data.forEach((message) => {
        messagesArr.push(
          <MessageItem
            key={'message-' + message.id}
            message={message}
            setPhotoViewerVisible={setPhotoViewerVisible}
            setCurrentPhotoSrc={setCurrentPhotoSrc}
          />,
        );
      });
            
      forceUpdate();*/
      
      scrollToBottom();

      let requestOptions3 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          roomId: props.roomId,
        }),
        redirect: 'follow',
      }
      fetch(serverRoot + '/chat/get_messages', requestOptions3)
        .then((response) => response.json())
        .then((result) => {
          console.log(JSON.stringify(result))
          if (result.messages !== undefined) {
            let lastId = 0;
            if (currentRoomId === props.roomId) {
              result.messages.forEach((message) => {
                if (messagesDict[message.id] === undefined) {
                  messagesDict[message.id] = true;
                  cacheMessage(message);
                  messagesArr.push(
                    <MessageItem
                      key={'message-' + message.id}
                      message={message}
                      setPhotoViewerVisible={setPhotoViewerVisible}
                      setCurrentPhotoSrc={setCurrentPhotoSrc}
                    />
                  );
                  lastId = 'message-' + message.id;
                }
              });
              if (uploadingFiles[props.roomId] !== undefined) {
                Object.values(uploadingFiles[props.roomId]).forEach((file) => {
                  messagesArr.push(
                    <MessageItem
                      key={'message-' + file.message.id}
                      message={file.message}
                      setPhotoViewerVisible={setPhotoViewerVisible}
                      setCurrentPhotoSrc={setCurrentPhotoSrc}
                    />,
                  )
                  lastId = 'message-' + file.message.id;
                })
              }
            }
            
            forceUpdate();
            
            let c = () => {
              if (document.getElementById(lastId) !== null) {
                setTimeout(() => {
                  scrollToBottom();
                });
              }
              else {
                setTimeout(() => {
                  c();
                }, 250);
              }
            }

            c();

            let requestOptions3 = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                token: token,
              },
              body: JSON.stringify({
                roomId: props.roomId,
              }),
              redirect: 'follow',
            }
            fetch(serverRoot + '/chat/get_chat', requestOptions3)
              .then((response) => response.json())
              .then((result) => {
                updateChat(result.room);
              });

            scrollReady = true;
          }
        })
        .catch((error) => console.log('error', error))
    });
  }, [props.roomId, props.userId])

  const ROOT_CSS = css({
    height: '100%',
    width: '100%',
  })

  function getCaret(el) {
    if (el.selectionStart) {
      return el.selectionStart
    } else if (document.selection) {
      el.focus()

      var r = document.selection.createRange()
      if (r == null) {
        return 0
      }

      var re = el.createTextRange(),
        rc = re.duplicate()
      re.moveToBookmark(r.getBookmark())
      rc.setEndPoint('EndToStart', re)

      return rc.text.length
    }
    return 0
  }

  let checkChatText = () => {
    if (document.getElementById('chatText') !== null) {
      var textAreaField = document.getElementById('chatText')
      textAreaField.addEventListener('keyup', function (e) {
        if (e.keyCode == 13 && e.ctrlKey) {
          var content = this.value
          var caret = getCaret(this)
          this.value =
            content.substring(0, caret) +
            '\n' +
            content.substring(caret)
          e.stopPropagation()
        } else if (e.keyCode == 13) {
          e.preventDefault()
          if (document.getElementById('chatText').value !== '') {
            document.getElementById('sendBtn').click();
          }
        }
      })
    } else {
      setTimeout(() => {
        checkChatText()
      }, 500)
    }
  }

  useEffect(() => {
    checkChatText();
  }, [])

  let checkChatTextForPaste = () => {
    if (document.getElementById('chatText') !== null) {
      var textAreaField = document.getElementById('chatText')
      textAreaField.onpaste = function (e) {
        let pasteContainer = document.getElementById('pasteRedirect');
        if (e.clipboardData.files.length > 0 && window.confirm('ارسال عکس ?')) {
          pasteContainer.focus();
          setTimeout(() => {
            if (pasteContainer.children !== undefined && pasteContainer.children !== null && pasteContainer.children.length > 0 ) {
                if (pasteContainer.children[0].tagName === 'IMG') {
                  fetch(pasteContainer.children[0].src).then((response) => response.blob()).then(function(file) {
                    pasteContainer.innerHTML = '';
                    let dataUrl = {name: 'uploading_image.png'};
                    let msg = {
                      time: Date.now(),
                      authorId: me.id,
                      roomId: props.roomId,
                      text: document.getElementById('chatText').value,
                      messageType:
                        dataUrl.name.endsWith('.svg') ||
                        dataUrl.name.endsWith('.png') ||
                        dataUrl.name.endsWith('.jpg') ||
                        dataUrl.name.endsWith('.jpeg') ||
                        dataUrl.name.endsWith('.gif')
                          ? 'photo'
                          : dataUrl.name.endsWith('.wav') ||
                            dataUrl.name.endsWith('.mp3') ||
                            dataUrl.name.endsWith('.mpeg') ||
                            dataUrl.name.endsWith('.aac')
                          ? 'audio'
                          : dataUrl.name.endsWith('.webm') ||
                            dataUrl.name.endsWith('.mkv') ||
                            dataUrl.name.endsWith('.flv') ||
                            dataUrl.name.endsWith('.3gp') ||
                            dataUrl.name.endsWith('.mp4')
                          ? 'video'
                          : undefined,
                      fileUrl: URL.createObjectURL(file),
                      User: me,
                    };
                    const id = markFileAsUploading(props.roomId, {message: msg, file: file, dataUrl: dataUrl});
                    addMessageToList(msg);
                    setLastMessage(msg);
                    let data = new FormData()
                    data.append('file', file)
                    let request = new XMLHttpRequest()
                    request.open(
                      'POST',
                      serverRoot +
                        `/file/upload_file?token=${token}&roomId=${props.roomId}&extension=${(dataUrl.name.lastIndexOf('.') + 1) >= 0 ? dataUrl.name.substr(dataUrl.name.lastIndexOf('.') + 1) : ''}&isPresent=false`,
                    )
                    let f = { progress: 0, name: file.name, size: file.size, local: true }
                    request.upload.addEventListener('progress', function (e) {
                      let percent_completed = (e.loaded * 100) / e.total
                      f.progress = percent_completed
                      if (percent_completed === 100) {
                        f.local = false
                      }
                      forceUpdate()
                    })
                    request.onreadystatechange = function () {
                      if (request.readyState === XMLHttpRequest.DONE) {
                        markFileAsUploaded(props.roomId, id);
                        let requestOptions = {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            token: token,
                          },
                          body: JSON.stringify({
                            roomId: props.roomId,
                            messageType:
                              dataUrl.name.endsWith('.svg') ||
                              dataUrl.name.endsWith('.png') ||
                              dataUrl.name.endsWith('.jpg') ||
                              dataUrl.name.endsWith('.jpeg') ||
                              dataUrl.name.endsWith('.gif')
                                ? 'photo'
                                : dataUrl.name.endsWith('.wav') ||
                                  dataUrl.name.endsWith('.mp3') ||
                                  dataUrl.name.endsWith('.mpeg') ||
                                  dataUrl.name.endsWith('.aac')
                                ? 'audio'
                                : dataUrl.name.endsWith('.webm') ||
                                  dataUrl.name.endsWith('.mkv') ||
                                  dataUrl.name.endsWith('.flv') ||
                                  dataUrl.name.endsWith('.3gp') ||
                                  dataUrl.name.endsWith('.mp4')
                                ? 'video'
                                : undefined,
                            fileId: JSON.parse(request.responseText).file.id,
                          }),
                          redirect: 'follow',
                        }
                        fetch(serverRoot + '/chat/create_message', requestOptions)
                          .then((response) => response.json())
                          .then((result) => {
                            console.log(JSON.stringify(result))
                            if (result.message !== undefined) {
                              cacheMessage(result.message);
                              for (let i = 0; i < messagesArr.length; i++) {
                                if (messagesArr[i].key === ('message-' + msg.id)) {
                                  messagesArr.splice(i, 1);
                                }
                              }
                              addMessageToList(result.message);
                              setLastMessage(result.message);
                              forceUpdate();
                            }
                          })
                          .catch((error) => console.log('error', error))
                        document.getElementById('chatText').value = ''
                      }
                    }
                    if (FileReader) {
                      let fr = new FileReader()
          
                      fr.onload = function () {
                        f.src = fr.result
                      }
                      fr.readAsDataURL(file)
                    }
                    request.send(data)
                  });
                }
            }
          }, 0);
        }
      };
    } else {
      setTimeout(() => {
        checkChatTextForPaste()
      }, 500)
    }
  }

  useEffect(() => {
    checkChatTextForPaste();
  }, [props.roomId])

  let replaceMessageInTheList = (msg) => {
    if (msg.roomId === props.roomId) {
      let lastMsg = (
        <MessageItem
          key={'message-' + msg.id}
          message={msg}
          setPhotoViewerVisible={setPhotoViewerVisible}
          setCurrentPhotoSrc={setCurrentPhotoSrc}
        />
      );
      let messageSeen = document.getElementById('message-seen-' + msg.id);
      let messageNotSeen = document.getElementById('message-not-seen-' + msg.id);
      if (messageSeen !== null && messageNotSeen !== null) {
        if (msg.seen > 0) {
          messageSeen.style.display = 'block';
          messageNotSeen.style.display = 'none';
        }
        else {
          messageSeen.style.display = 'none';
          messageNotSeen.style.display = 'block';
        }
        forceUpdate();
      }
    }
  }
  replaceMessageInTheList2 = replaceMessageInTheList;
  let addMessageToList = (msg) => {
    try {
      if (msg.roomId === props.roomId) {
        let isAtEnd = false
        let scroller = document.getElementById('scroller')
        if (
          scroller.scrollTop + $('#scroller').innerHeight() >=
          scroller.scrollHeight
        ) {
          isAtEnd = true
        }
        msg['User.id'] = msg.User.id
        msg['User.username'] = msg.User.username
        msg['User.firstName'] = msg.User.firstName
        let lastMsg = (
          <MessageItem
            key={'message-' + msg.id}
            message={msg}
            setPhotoViewerVisible={setPhotoViewerVisible}
            setCurrentPhotoSrc={setCurrentPhotoSrc}
          />
        )
        messagesArr.push(lastMsg);
        setScrollTrigger(!scrollTrigger);
        forceUpdate();
        if (msg.authorId === me.id) {
          updateMessageSeen();
        }
        let requestOptions3 = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            roomId: props.roomId,
            offset: 0
          }),
          redirect: 'follow',
        }
        fetch(serverRoot + '/chat/get_messages', requestOptions3)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result))
          })
          .catch((error) => console.log('error', error))
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  addMessageToList2 = addMessageToList

  useEffect(() => {
    if (
      !loading &&
      pickingFile &&
      filesContent !== undefined &&
      filesContent.length > 0
    ) {
      setPickingFile(false)
      let dataUrl = filesContent[0]
      fetch(dataUrl.content)
        .then((res) => res.blob())
        .then((file) => {
          let msg = {
            time: Date.now(),
            authorId: me.id,
            roomId: props.roomId,
            text: document.getElementById('chatText').value,
            messageType:
              dataUrl.name.endsWith('.svg') ||
              dataUrl.name.endsWith('.png') ||
              dataUrl.name.endsWith('.jpg') ||
              dataUrl.name.endsWith('.jpeg') ||
              dataUrl.name.endsWith('.gif')
                ? 'photo'
                : dataUrl.name.endsWith('.wav') ||
                  dataUrl.name.endsWith('.mp3') ||
                  dataUrl.name.endsWith('.mpeg') ||
                  dataUrl.name.endsWith('.aac')
                ? 'audio'
                : dataUrl.name.endsWith('.webm') ||
                  dataUrl.name.endsWith('.mkv') ||
                  dataUrl.name.endsWith('.flv') ||
                  dataUrl.name.endsWith('.3gp') ||
                  dataUrl.name.endsWith('.mp4')
                ? 'video'
                : undefined,
            fileUrl: URL.createObjectURL(file),
            User: me,
          };
          const id = markFileAsUploading(props.roomId, {message: msg, file: file, dataUrl: dataUrl});
          addMessageToList(msg);
          setLastMessage(msg);
          let data = new FormData()
          data.append('file', file)
          let request = new XMLHttpRequest()
          request.open(
            'POST',
            serverRoot +
              `/file/upload_file?token=${token}&roomId=${props.roomId}&extension=${(dataUrl.name.lastIndexOf('.') + 1) >= 0 ? dataUrl.name.substr(dataUrl.name.lastIndexOf('.') + 1) : ''}&isPresent=false`,
          )
          let f = { progress: 0, name: file.name, size: file.size, local: true }
          request.upload.addEventListener('progress', function (e) {
            let percent_completed = (e.loaded * 100) / e.total
            f.progress = percent_completed
            if (percent_completed === 100) {
              f.local = false
            }
            forceUpdate()
          })
          request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
              markFileAsUploaded(props.roomId, id);
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  token: token,
                },
                body: JSON.stringify({
                  roomId: props.roomId,
                  messageType:
                    dataUrl.name.endsWith('.svg') ||
                    dataUrl.name.endsWith('.png') ||
                    dataUrl.name.endsWith('.jpg') ||
                    dataUrl.name.endsWith('.jpeg') ||
                    dataUrl.name.endsWith('.gif')
                      ? 'photo'
                      : dataUrl.name.endsWith('.wav') ||
                        dataUrl.name.endsWith('.mp3') ||
                        dataUrl.name.endsWith('.mpeg') ||
                        dataUrl.name.endsWith('.aac')
                      ? 'audio'
                      : dataUrl.name.endsWith('.webm') ||
                        dataUrl.name.endsWith('.mkv') ||
                        dataUrl.name.endsWith('.flv') ||
                        dataUrl.name.endsWith('.3gp') ||
                        dataUrl.name.endsWith('.mp4')
                      ? 'video'
                      : undefined,
                  fileId: JSON.parse(request.responseText).file.id,
                }),
                redirect: 'follow',
              }
              fetch(serverRoot + '/chat/create_message', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(JSON.stringify(result))
                  if (result.message !== undefined) {
                    cacheMessage(result.message);
                    for (let i = 0; i < messagesArr.length; i++) {
                      if (messagesArr[i].key === ('message-' + msg.id)) {
                        messagesArr.splice(i, 1);
                      }
                    }
                    addMessageToList(result.message);
                    setLastMessage(result.message);
                    forceUpdate();
                  }
                })
                .catch((error) => console.log('error', error))
              document.getElementById('chatText').value = ''
            }
          }
          if (FileReader) {
            let fr = new FileReader()

            fr.onload = function () {
              f.src = fr.result
            }
            fr.readAsDataURL(file)
          }
          request.send(data)
        })
    }
  }, [loading])

  return (
    <div
      style={{
        display:
          props.roomId === undefined || props.roomId === 0 ? 'none' : 'block',
        width: isDesktop() ? 'calc(100% - 450px - 450px - 48px)' : 0,
        height: 'calc(100% - 16px - 56px)',
        position: 'absolute',
        top: 0,
        left: isDesktop() ? 128 : 0,
      }}
    >
      <div contenteditable="true" id="pasteRedirect" style={{position: 'fixed', top: -256, opacity: 0}}></div> 
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 40px)',
          position: 'absolute',
          backgroundImage: `url(${ChatWallpaper})`,
          transition: 'background 300ms ease-in 200ms',
          top: isDesktop() ? 16 + 64 : 0,
          left: isDesktop() ? 96 : 0,
          right: isDesktop()
            ? isInRoom() || histPage === '/app/settings'
              ? 0
              : 16
            : 0,
          backdropFilter: 'blur(10px)',
          borderRadius: '0 0 0 24px',
        }}
      />
      <Viewer
        zIndex={99999}
        style={{ position: 'fixed', left: 0, top: 0 }}
        visible={photoViewerVisible}
        onClose={() => {
          setPhotoViewerVisible(false)
        }}
        images={[{ src: currentPhotoSrc, alt: '' }]}
      />
      <ChatAppBar user={user} room={room} />
      <div style={{ width: '100%', height: 'auto', zIndex: 1000, display: (membership !== undefined && membership !== null && (membership.canAddMessage === true)) ? 'block' : 'none' }}>
        <div
          className={classes.root}
          style={{
            height: 56,
            bottom: showEmojiPad ? 352 + 56 : isDesktop() ? 48 : 88,
            transform: 'translateX(-128px)',
          }}
        >
          <IconButton
            className={classes.iconButton}
            onClick={() => {
              setPickingFile(true)
              openFileSelector()
            }}
          >
            <DescriptionIcon />
          </IconButton>
          <IconButton
            className={classes.iconButton}
            onClick={() => {
              if (showEmojiPad) {
                setShowEmojiPad(!showEmojiPad)
                window.onpopstate = function (event) {
                  if (setDialogOpen !== null) {
                    setDialogOpen(false)
                  }
                  setTimeout(popPage, 250)
                }
              } else {
                setShowEmojiPad(!showEmojiPad)
                window.onpopstate = function (event) {
                  setShowEmojiPad(false)
                  window.onpopstate = function (event) {
                    if (setDialogOpen !== null) {
                      setDialogOpen(false)
                    }
                    setTimeout(popPage, 250)
                  }
                }
              }
            }}
          >
            <EmojiEmotionsIcon />
          </IconButton>

          <InputBase
            type={"text"}
            multiline
            id={'chatText'}
            className={classes.input}
            style={{ flex: 1 }}
            placeholder={"پیام خود را بنویسید"}
            onChange={() => {
              socket.emit('chat-typing');
            }}
          />
          <IconButton
            id={'sendBtn'}
            color="primary"
            className={classes.iconButton}
            style={{ transform: 'rotate(180deg)' }}
            onClick={() => {
              if (document.getElementById('chatText').value !== '') {
                let msg = {
                  id: 'message-' + Date.now(),
                  time: Date.now(),
                  authorId: me.id,
                  roomId: props.roomId,
                  text: document.getElementById('chatText').value,
                  messageType: 'text',
                  User: me,
                }
                addMessageToList(msg)
                setLastMessage(msg)
                let requestOptions = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    token: token,
                  },
                  body: JSON.stringify({
                    roomId: props.roomId,
                    text: document.getElementById('chatText').value,
                    messageType: 'text',
                  }),
                  redirect: 'follow',
                }
                fetch(serverRoot + '/chat/create_message', requestOptions)
                  .then((response) => response.json())
                  .then((result) => {
                    console.log(JSON.stringify(result))
                    if (result.message !== undefined) {
                      cacheMessage(result.message);
                      let msgEl = document.getElementById('message-' + msg.id);
                      let msgSeenEl = document.getElementById('message-seen-' + msg.id);
                      let msgNotSeenEl = document.getElementById('message-not-seen-' + msg.id);
                      msgEl.id = 'message-' + result.message.id;
                      msgSeenEl.id = 'message-seen-' + result.message.id;
                      msgNotSeenEl.id = 'message-not-seen-' + result.message.id;
                      msg.id = result.message.id;
                      forceUpdate();
                    }
                  })
                  .catch((error) => console.log('error', error))
                document.getElementById('chatText').value = ''
              }
            }}
          >
            <SendIcon style={{fill: colors.primaryMedium}} />
          </IconButton>
          <br />
        </div>
        {
            showEmojiPad ?
              <Picker
                set={'apple'}
                style={{
                  width: isDesktop()
              ? isInRoom() || histPage === '/app/settings'
                ? 450
                : 'calc(100% - 658px - 96px)'
              : 'calc(100% - 450px)',
            height: 416,
            position: 'fixed',
            left: isDesktop()
              ? isInRoom() || histPage === '/app/settings'
                ? 'calc(100% - 450px)'
                : 96
              : 0,
            bottom: 0,
            zIndex: 5000,
                }}
                onSelect={currentEmoji => {
                  document.getElementById('chatText').value += currentEmoji.native;
                }}
              /> :
              null
        }
      </div>
      <div
        style={{
          position: 'relative',
          direction: 'ltr',
          width: isDesktop() ? 'calc(100% - 48px)' : '100%',
          height: showEmojiPad
            ? 'calc(100% - 416px - 56px)'
            : isTablet()
            ? 'calc(100% - 64px - 72px)'
            : isDesktop() &&
              (isInRoom() || histPage === '/app/settings')
            ? 'calc(100% - 96px)'
            : 'calc(100% - 64px)',
          marginTop: 32,
          marginLeft: isDesktop() ? 32 : 0,
          marginRight: 16,
        }}
      >
        <div
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
          id={'scroller'}
        >
          <div style={{ height: 64 }} />
          <div id={'messagesContainer'}>
              {messagesArr}
          </div>
          <div style={{ width: '100%', height: 80 }} />
        </div>
        <Fab
          color={'secondary'}
          style={{
            display: showScrollDown ? 'block' : 'none',
            position: 'fixed',
            left: 112 + 16,
            bottom: 48 + 16,
          }}
          onClick={() => {
            scrollToBottom();
          }}
        >
          <ArrowDownward />
        </Fab>
      </div>
    </div>
  )
}
