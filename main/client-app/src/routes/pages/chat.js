import { css } from '@emotion/css'
import { Avatar, Fab, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowDownward, DoneAll, PlayArrowTwoTone } from '@material-ui/icons'
import DescriptionIcon from '@material-ui/icons/Description'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'
import SendIcon from '@material-ui/icons/Send'
import Picker from 'emoji-picker-react'
import React, { useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import Viewer from 'react-viewer'
import { useFilePicker } from 'use-file-picker'
import { gotoPage, popPage, registerDialogOpen, setDialogOpen } from '../../App'
import ChatAppBar from '../../components/ChatAppBar'
import { WaveSurferBox } from '../../components/WaveSurfer'
import { colors, me, token } from '../../util/settings'
import { serverRoot, socket, useForceUpdate } from '../../util/Utils'
import ChatWallpaper from '../../images/chat-wallpaper.jpg'
import RoomPage from './room'
import { setLastMessage } from '../../components/HomeMain'
import $ from 'jquery'
import Done from '@material-ui/icons/Done'
import ReactDOM from 'react-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    direction: 'rtl',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontFamily: 'mainFont',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}))

function MessageItem(props) {
  let message = props.message;
  let dateTime = new Date(Number(message.time));
  return (
    <div key={message.id} id={'message-' + message.id}>
      {message['User.id'] === me.id ? (
        <div style={{ position: 'relative', display: 'flex' }}>
          <Avatar
            src={
              serverRoot +
              `/file/download_user_avatar?token=${token}&userId=${message.authorId}`
            }
            style={{
              width: 40,
              height: 40,
              position: 'absolute',
              bottom: 16,
              right: 0,
            }}
          />
          <div
            style={{
              fontFamily: 'mainFont',
              fontSize: 15,
              display: 'inline-block',
              width: 'auto',
              minWidth: 150,
              maxWidth: 300,
              padding: 16,
              backgroundColor: '#1a8a98',
              color: '#fff',
              borderRadius: '16px 16px 0px 16px',
              position: 'absolute',
              right: 48,
              marginTop: 16,
              background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryMedium} 50%, ${colors.primaryLight} 100%)`,
            }}
          >
            <Typography
              style={{
                position: 'absolute',
                right: 16,
                fontWeight: 'bold',
                fontSize: 20,
              }}
            >
              {message['User.firstName']}
            </Typography>
            <br />
            <div style={{ marginTop: 8 }}>
              {message.messageType === 'text' ? (
                message.text
              ) : message.messageType === 'audio' ? (
                <WaveSurferBox
                  fileId={message.fileId}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'photo' ? (
                <img
                  onClick={() => {
                    props.setCurrentPhotoSrc(
                      serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                    )
                    props.setPhotoViewerVisible(true)
                  }}
                  style={{ width: 200 }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'video' ? (
                <div>
                  <video
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        src:
                          serverRoot +
                          `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                      })
                    }}
                    controls={false}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                    }
                  />
                </div>
              ) : (
                message.text
              )}
              {message.messageType === 'video' ? (
                <IconButton
                  onClick={() => {
                    gotoPage('/app/videoplayer', {
                      src:
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                    })
                  }}
                  style={{
                    width: 64,
                    height: 64,
                    position: 'absolute',
                    left: '50%',
                    top: 'calc(50% - 24px)',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <PlayArrowTwoTone style={{ width: 64, height: 64 }} />
                </IconButton>
              ) : null}
            </div>
            <br />
            <div
              style={{
                position: 'absolute',
                right: 12,
                bottom: 8,
                fontSize: 12,
                color: '#fff',
                display: 'flex',
              }}
            >
              <DoneAll id={'message-seen-' + message.id} style={{ display: message.seen > 0 ? 'block' : 'none', width: 16, height: 16, marginRight: 12 }} />
              <Done id={'message-not-seen-' + message.id} style={{ display: message.seen > 0 ? 'none' : 'block', width: 16, height: 16, marginRight: 12 }} />
              {dateTime.toLocaleDateString('fa-IR').toString() +
                ' ' +
                dateTime.getHours() +
                ':' +
                dateTime.getMinutes() +
                ':' +
                dateTime.getSeconds()}
            </div>
          </div>
          <div
            style={{
              visibility: 'hidden',
              fontFamily: 'mainFont',
              fontSize: 15,
              display: 'inline-block',
              width: 'auto',
              minWidth: 150,
              maxWidth: 300,
              padding: 16,
              backgroundColor: '#1a8a98',
              color: '#fff',
              borderRadius: '16px 16px 0px 16px',
              marginTop: 16,
              background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryMedium} 50%, ${colors.primaryLight} 100%)`,
            }}
          >
            <Typography
              style={{
                position: 'absolute',
                right: 16,
                fontWeight: 'bold',
                fontSize: 20,
              }}
            >
              {message['User.firstName']}
            </Typography>
            <br />
            <div style={{ marginTop: 8 }}>
              {message.messageType === 'text' ? (
                message.text
              ) : message.messageType === 'audio' ? (
                <WaveSurferBox
                  fileId={message.fileId}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'photo' ? (
                <img
                  onClick={() => {
                    props.setCurrentPhotoSrc(
                      serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                    )
                    props.setPhotoViewerVisible(true)
                  }}
                  style={{ width: 200 }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'video' ? (
                <div>
                  <video
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        src:
                          serverRoot +
                          `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                      })
                    }}
                    controls={false}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                    }
                  />
                </div>
              ) : (
                message.text
              )}
              {message.messageType === 'video' ? (
                <IconButton
                  onClick={() => {
                    gotoPage('/app/videoplayer', {
                      src:
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                    })
                  }}
                  style={{
                    width: 64,
                    height: 64,
                    position: 'absolute',
                    left: '50%',
                    top: 'calc(50% - 24px)',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <PlayArrowTwoTone style={{ width: 64, height: 64 }} />
                </IconButton>
              ) : null}
            </div>
            <br />
            <div
              style={{
                position: 'absolute',
                right: 12,
                bottom: 8,
                fontSize: 12,
                color: '#fff',
                display: 'flex',
              }}
            >
              {dateTime.toLocaleDateString('fa-IR').toString() +
                ' ' +
                dateTime.getHours() +
                ':' +
                dateTime.getMinutes() +
                ':' +
                dateTime.getSeconds()}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', display: 'flex' }}>
          <Avatar
            src={
              serverRoot +
              `/file/download_user_avatar?token=${token}&userId=${message.authorId}`
            }
            style={{
              width: 40,
              height: 40,
              position: 'absolute',
              bottom: 16,
              left: 0,
            }}
          />
          <div
            style={{
              fontFamily: 'mainFont',
              fontSize: 15,
              display: 'inline-block',
              width: 'auto',
              minWidth: 150,
              maxWidth: 300,
              padding: 16,
              backgroundColor: '#1a8a98',
              color: '#fff',
              borderRadius: '16px 16px 16px 0px',
              position: 'absolute',
              left: 48,
              marginTop: 16,
              background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryMedium} 50%, ${colors.primaryLight} 100%)`,
            }}
          >
            <Typography
              style={{
                position: 'absolute',
                left: 16,
                fontWeight: 'bold',
                fontSize: 20,
              }}
            >
              {message['User.firstName']}
            </Typography>
            <br />
            <div style={{ marginTop: 8 }}>
              {message.messageType === 'text' ? (
                message.text
              ) : message.messageType === 'audio' ? (
                <WaveSurferBox
                  fileId={message.fileId}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'photo' ? (
                <img
                  onClick={() => {
                    props.setCurrentPhotoSrc(
                      serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                    )
                    props.setPhotoViewerVisible(true)
                  }}
                  style={{ width: 200 }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'video' ? (
                <div>
                  <video
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        src:
                          serverRoot +
                          `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                      })
                    }}
                    controls={false}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                    }
                  />
                </div>
              ) : (
                message.text
              )}
              {message.messageType === 'video' ? (
                <IconButton
                  onClick={() => {
                    gotoPage('/app/videoplayer', {
                      src:
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                    })
                  }}
                  style={{
                    width: 64,
                    height: 64,
                    position: 'absolute',
                    left: '50%',
                    top: 'calc(50% - 24px)',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <PlayArrowTwoTone style={{ width: 64, height: 64 }} />
                </IconButton>
              ) : null}
            </div>
            <br />
            <div
              style={{
                position: 'absolute',
                right: 12,
                bottom: 8,
                fontSize: 12,
                color: '#fff',
              }}
            >
              {dateTime.toLocaleDateString('fa-IR').toString() +
                ' ' +
                dateTime.getHours() +
                ':' +
                dateTime.getMinutes() +
                ':' +
                dateTime.getSeconds()}
            </div>
          </div>
          <div
            style={{
              visibility: 'hidden',
              fontFamily: 'mainFont',
              fontSize: 15,
              display: 'inline-block',
              width: 'auto',
              minWidth: 150,
              maxWidth: 300,
              padding: 16,
              color: 'transparent',
              marginLeft: 16,
              marginTop: 16,
              color: '#fff',
              left: 0,
              background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryMedium} 50%, ${colors.primaryLight} 100%)`,
            }}
          >
            <Typography
              style={{
                position: 'absolute',
                left: 16,
                fontWeight: 'bold',
                fontSize: 20,
              }}
            >
              {message['User.firstName']}
            </Typography>
            <br />
            <div style={{ marginTop: 8 }}>
              {message.messageType === 'text' ? (
                message.text
              ) : message.messageType === 'audio' ? (
                <WaveSurferBox
                  fileId={message.fileId}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'photo' ? (
                <img
                  onClick={() => {
                    props.setCurrentPhotoSrc(
                      serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                    )
                    props.setPhotoViewerVisible(true)
                  }}
                  style={{ width: 200 }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'video' ? (
                <div>
                  <video
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        src:
                          serverRoot +
                          `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                      })
                    }}
                    controls={false}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`
                    }
                  />
                </div>
              ) : (
                message.text
              )}
              {message.messageType === 'video' ? (
                <IconButton
                  onClick={() => {
                    gotoPage('/app/videoplayer', {
                      src:
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                    })
                  }}
                  style={{
                    width: 64,
                    height: 64,
                    position: 'absolute',
                    left: '50%',
                    top: 'calc(50% - 24px)',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <PlayArrowTwoTone style={{ width: 64, height: 64 }} />
                </IconButton>
              ) : null}
            </div>
            <br />
            <div
              style={{
                position: 'absolute',
                right: 12,
                bottom: 8,
                fontSize: 12,
                color: '#fff',
              }}
            >
              {dateTime.toLocaleDateString('fa-IR').toString() +
                ' ' +
                dateTime.getHours() +
                ':' +
                dateTime.getMinutes() +
                ':' +
                dateTime.getSeconds()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

let messagesArr = []

let uplaodedFileId = 0

export let addMessageToList = () => {}
export let replaceMessageInTheList = () => {}

export default function Chat(props) {
  document.documentElement.style.overflowY = 'hidden'

  let forceUpdate = useForceUpdate()
  let [messages, setMessages] = React.useState([])
  let [photoViewerVisible, setPhotoViewerVisible] = React.useState(false)
  let [currentPhotoSrc, setCurrentPhotoSrc] = React.useState('')
  let [user, setUser] = React.useState(undefined)
  let [room, setRoom] = React.useState(undefined)
  const [open, setOpen] = React.useState(true)
  const [showEmojiPad, setShowEmojiPad] = React.useState(false)
  let [pickingFile, setPickingFile] = React.useState(false)
  registerDialogOpen(setOpen)
  const handleClose = () => {
    setOpen(false)
    setTimeout(popPage, 250)
  }
  let classes = useStyles()
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
  })
  let [scrollTrigger, setScrollTrigger] = React.useState(false)
  let [showScrollDown, setShowScrollDown] = React.useState(false)

  useEffect(() => {
    let scroller = document.getElementById('chatScroller')
    if (scroller !== null) scroller.scrollTo(0, scroller.scrollHeight)
  }, [scrollTrigger])

  replaceMessageInTheList = (msg) => {
    if (msg.roomId === props.room_id) {
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
  addMessageToList = (msg) => {
    try {
      if (msg.roomId === props.room_id) {
        let isAtEnd = false
        let scroller = document.getElementById('chatScroller')
        if (
          scroller.scrollTop + $('#chatScroller').innerHeight() >=
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
            roomId: props.room_id,
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

  let attachScrollListener = (scroller) => {
    scroller.onscroll = () => {
      if (
        scroller.scrollTop + $('#chatScroller').innerHeight() >=
        scroller.scrollHeight
      ) {
        setShowScrollDown(false)
      } else {
        setShowScrollDown(true)
      }
    }
  }

  let checkScroller = () => {
    let scroller = document.getElementById('chatScroller')
    if (scroller !== null) {
      attachScrollListener(scroller)
    } else {
      setInterval(() => {
        checkScroller()
      }, 250)
    }
  }

  useEffect(() => {
    checkScroller()
  }, [])

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        userId: props.user_id,
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
        roomId: props.room_id,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/room/get_room', requestOptions2)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.room !== undefined) {
          setRoom(result.room)
          forceUpdate()
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
        roomId: props.room_id,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/chat/get_messages', requestOptions3)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.messages !== undefined) {
          if (result.messages.length > 10) {
            result.messages = result.messages.slice(result.messages.length - 10)
          }
          messagesArr = []
          result.messages.forEach((message) => {
            messagesArr.push(
              <MessageItem
                key={'message-' + message.id}
                message={message}
                setPhotoViewerVisible={setPhotoViewerVisible}
                setCurrentPhotoSrc={setCurrentPhotoSrc}
              />,
            )
          })
          forceUpdate()
          setScrollTrigger(!scrollTrigger)
        }
      })
      .catch((error) => console.log('error', error))
  }, [])

  const ROOT_CSS = css({
    height: '100%',
    width: '100%',
  })

  useEffect(() => {
    if (!loading && pickingFile) {
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
              `/file/upload_file?token=${token}&roomId=${props.room_id}`,
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
            if (request.readyState == XMLHttpRequest.DONE) {
              let msg = {
                id: 'message_' + Date.now(),
                time: Date.now(),
                authorId: me.id,
                roomId: props.room_id,
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
                  roomId: props.room_id,
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
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation()
      }}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      style={{ zIndex: 2501 }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundImage: `url(${ChatWallpaper})`,
        }}
      >
        <Viewer
          zIndex={99999}
          style={{ position: 'fixed', left: 0, top: 0 }}
          visible={photoViewerVisible}
          onClose={() => {
            props.setPhotoViewerVisible(false)
          }}
          images={[{ src: currentPhotoSrc, alt: '' }]}
        />
        <ChatAppBar handleClose={handleClose} user={user} room={room} />
        <div
          style={{ position: 'fixed', bottom: 0, height: 'auto', zIndex: 1000 }}
        >
          <div
            className={classes.root}
            style={{ height: 56, bottom: showEmojiPad ? 300 : 0 }}
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
                    roomId: props.room_id,
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
                      roomId: props.room_id,
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
              width: '100%',
              height: showEmojiPad ? 300 : 0,
              marginTop: 40,
            }}
            onEmojiClick={(event, emojiObject) => {
              document.getElementById('chatText').value += emojiObject.emoji
            }}
          />
        </div>
        <div
          style={{
            width: '100%',
            height: showEmojiPad ? 'calc(100% - 300px)' : '100%',
          }}
        >
          <div
            style={{ width: '100%', height: '100%', overflow: 'auto' }}
            id={'chatScroller'}
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
              left: 24,
              bottom: 72 + 16,
            }}
            onClick={() => {
              setScrollTrigger(!scrollTrigger)
            }}
          >
            <ArrowDownward />
          </Fab>
        </div>
      </div>
    </Dialog>
  )
}
