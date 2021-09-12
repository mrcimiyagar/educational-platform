import { css } from '@emotion/css'
import { Avatar, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'
import { PlayArrowTwoTone } from '@material-ui/icons'
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

let uplaodedFileId = 0

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
          setMessages(result.messages)
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
                    result.message['User.id'] = result.message.User.id
                    result.message['User.username'] =
                      result.message.User.username
                    result.message['User.firstName'] =
                      result.message.User.firstName
                    messages.push(result.message)
                    setMessages(messages)
                    forceUpdate()
                    document.getElementById('chatText').value = ''
                  }
                })
                .catch((error) => console.log('error', error))
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

  useEffect(() => {
    socket.off('message-added')
    socket.on('message-added', ({ msgCopy }) => {
      if (me.id !== msgCopy.authorId) {
        msgCopy['User.id'] = msgCopy.User.id
        msgCopy['User.username'] = msgCopy.User.username
        msgCopy['User.firstName'] = msgCopy.User.firstName
        messages.push(msgCopy)
        setMessages(messages)
      }
    })
  }, [])

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
            setPhotoViewerVisible(false)
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
                }
                else {
                  setShowEmojiPad(!showEmojiPad)
                  window.onpopstate = function (event) {
                    
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
                        result.message['User.id'] = result.message.User.id
                        result.message['User.username'] =
                          result.message.User.username
                        result.message['User.firstName'] =
                          result.message.User.firstName
                        messages.push(result.message)
                        setMessages(messages)
                        forceUpdate()
                        document.getElementById('chatText').value = ''
                      }
                    })
                    .catch((error) => console.log('error', error))
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
          <ScrollToBottom className={ROOT_CSS}>
            <div style={{ height: 64 }} />
            {messages.map((message) => {
              let dateTime = new Date(Number(message.time))
              return (
                <div key={message.id}>
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
                          minWidth: 125,
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
                                setCurrentPhotoSrc(
                                  serverRoot +
                                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                                )
                                setPhotoViewerVisible(true)
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
                              <PlayArrowTwoTone
                                style={{ width: 64, height: 64 }}
                              />
                            </IconButton>
                          ) : null}
                        </div>
                        <br />
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
                          minWidth: 125,
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
                                setCurrentPhotoSrc(
                                  serverRoot +
                                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                                )
                                setPhotoViewerVisible(true)
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
                              <PlayArrowTwoTone
                                style={{ width: 64, height: 64 }}
                              />
                            </IconButton>
                          ) : null}
                        </div>
                        <br />
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
                          minWidth: 125,
                          maxWidth: 300,
                          padding: 16,
                          backgroundColor: '#1a8a98',
                          color: '#fff',
                          borderRadius: '16px 16px 0px 16px',
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
                                setCurrentPhotoSrc(
                                  serverRoot +
                                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                                )
                                setPhotoViewerVisible(true)
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
                              <PlayArrowTwoTone
                                style={{ width: 64, height: 64 }}
                              />
                            </IconButton>
                          ) : null}
                        </div>
                        <br />
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
                          minWidth: 125,
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
                                setCurrentPhotoSrc(
                                  serverRoot +
                                    `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`,
                                )
                                setPhotoViewerVisible(true)
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
                              <PlayArrowTwoTone
                                style={{ width: 64, height: 64 }}
                              />
                            </IconButton>
                          ) : null}
                        </div>
                        <br />
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
            })}
            <div style={{ width: '100%', height: 80 }} />
          </ScrollToBottom>
        </div>
      </div>
    </Dialog>
  )
}
