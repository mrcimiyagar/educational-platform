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
import Picker from 'emoji-picker-react'
import React, { useEffect } from 'react'
import Viewer from 'react-viewer'
import { useFilePicker } from 'use-file-picker'
import {
  gotoPage,
  histPage,
  isDesktop,
  isInMessenger,
  isInRoom,
  isTablet,
  popPage,
  routeTrigger,
  setDialogOpen,
} from '../../App'
import { colors, me, setToken, token } from '../../util/settings'
import { isMobile, serverRoot, socket, useForceUpdate } from '../../util/Utils'
import ChatAppBar from '../ChatAppBar'
import ChatWallpaper from '../../images/chat-wallpaper.png'
import { setLastMessage, updateChat } from '../../components/HomeMain'
import $ from 'jquery';
import MessageItem from '../MessageItem';

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
      ? histPage === '/app/room' || histPage === '/app/settings'
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

export let addMessageToList2 = () => {}
export let replaceMessageInTheList2 = () => {}

export default function ChatEmbeddedInMessenger(props) {
  document.documentElement.style.overflowY = 'hidden'

  let forceUpdate = useForceUpdate()
  updateChatEmbedded = forceUpdate
  const [count, setCount] = React.useState(0)
  let [messages, setMessages] = React.useState([])
  let [photoViewerVisible, setPhotoViewerVisible] = React.useState(false)
  let [currentPhotoSrc, setCurrentPhotoSrc] = React.useState('')
  let [user, setUser] = React.useState(undefined)
  let [room, setRoom] = React.useState(undefined)
  const [showEmojiPad, setShowEmojiPad] = React.useState(false)
  let [pickingFile, setPickingFile] = React.useState(false)
  let classes = useStyles()
  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    readAs: 'DataURL',
  })
  let [scrollTrigger, setScrollTrigger] = React.useState(false)
  let [showScrollDown, setShowScrollDown] = React.useState(false)

  useEffect(() => {
    let scroller = document.getElementById('scroller')
    scroller.scrollTo(0, scroller.scrollHeight)
  }, [scrollTrigger])

  useEffect(() => {
    let scroller = document.getElementById('scroller')
    scroller.onscroll = () => {
      if (
        scroller.scrollTop + $('#scroller').innerHeight() >=
        scroller.scrollHeight
      ) {
        setShowScrollDown(false)
      } else {
        setShowScrollDown(true)
      }
    }

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
          messagesArr = []
          result.messages.forEach((message) => {
            messagesArr.push(
              <MessageItem
                key={'message-' + message.id}
                message={message}
                setPhotoViewerVisible={setPhotoViewerVisible}
                setCurrentPhotoSrc={setCurrentPhotoSrc}
              />
            )
          })
          forceUpdate()
          setScrollTrigger(!scrollTrigger)

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
        }
      })
      .catch((error) => console.log('error', error))
  }, [props.roomId, props.userId])

  const ROOT_CSS = css({
    height: '100%',
    width: '100%',
  })

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
        messagesArr.push(lastMsg)
        forceUpdate()
        if (isAtEnd) {
          setScrollTrigger(!scrollTrigger);
        }
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
          let data = new FormData()
          data.append('file', file)
          let request = new XMLHttpRequest()
          request.open(
            'POST',
            serverRoot +
              `/file/upload_file?token=${token}&roomId=${props.roomId}`,
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
              let msg = {
                id: 'message_' + Date.now(),
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
                      dataUrl.name.endsWith('.aac') ||
                      dataUrl.name.endsWith('.mp4')
                    ? 'audio'
                    : dataUrl.name.endsWith('.webm') ||
                      dataUrl.name.endsWith('.mkv') ||
                      dataUrl.name.endsWith('.flv') ||
                      dataUrl.name.endsWith('.3gp')
                    ? 'video'
                    : undefined,
                fileId: JSON.parse(request.responseText).file.id,
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
                        dataUrl.name.endsWith('.aac') ||
                        dataUrl.name.endsWith('.mp4')
                      ? 'audio'
                      : dataUrl.name.endsWith('.webm') ||
                        dataUrl.name.endsWith('.mkv') ||
                        dataUrl.name.endsWith('.flv') ||
                        dataUrl.name.endsWith('.3gp')
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
        height: 'calc(100% - 16px)',
        position: 'absolute',
        top: isDesktop() ? 16 : 0,
        left: isDesktop() ? 128 : 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 112px)',
          position: 'absolute',
          backgroundImage: `url(${ChatWallpaper})`,
          top: isDesktop() ? 16 + 64 : 0,
          left: isDesktop() ? 96 : 0,
          right: isDesktop()
            ? histPage === '/app/room' || histPage === '/app/settings'
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
      <div style={{ width: '100%', height: 'auto', zIndex: 1000 }}>
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
            id={'chatText'}
            className={classes.input}
            style={{ flex: 1 }}
            placeholder="پیام خود را بنویسید"
          />
          <IconButton
            color="primary"
            className={classes.iconButton}
            style={{ transform: 'rotate(180deg)' }}
            onClick={() => {
              if (document.getElementById('chatText').value !== '') {
                let msg = {
                  id: 'message_' + Date.now(),
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
            <SendIcon />
          </IconButton>
          <br />
        </div>
        <Picker
          pickerStyle={{
            width: isDesktop()
              ? histPage === '/app/room' || histPage === '/app/settings'
                ? 450
                : 'calc(100% - 658px - 96px)'
              : 'calc(100% - 450px)',
            height: showEmojiPad ? 356 : 0,
            position: 'fixed',
            left: isDesktop()
              ? histPage === '/app/room' || histPage === '/app/settings'
                ? 'calc(100% - 450px)'
                : 96
              : 0,
            bottom: 0,
            zIndex: 5000,
          }}
          onEmojiClick={(event, emojiObject) => {
            document.getElementById('chatText').value += emojiObject.emoji
          }}
        />
      </div>
      <div
        style={{
          position: 'relative',
          direction: 'ltr',
          width: isDesktop() ? 'calc(100% - 48px)' : '100%',
          height: showEmojiPad
            ? 'calc(100% - 300px - 56px)'
            : isTablet()
            ? 'calc(100% - 64px - 72px)'
            : isDesktop() &&
              (histPage === '/app/room' || histPage === '/app/settings')
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
          <div id={'messagesContainer'}>{messagesArr}</div>
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
            setScrollTrigger(!scrollTrigger)
          }}
        >
          <ArrowDownward />
        </Fab>
      </div>
    </div>
  )
}
