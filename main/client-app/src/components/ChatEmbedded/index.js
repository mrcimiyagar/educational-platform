import { css } from '@emotion/css'
import { Avatar, Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
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
import EmptyIcon from '../../images/empty.png'
import { colors, me, setToken, token } from '../../util/settings'
import { isMobile, serverRoot, socket, useForceUpdate } from '../../util/Utils'
import ChatAppBar from '../ChatAppBar'
import EmptySign from '../EmptySign'
import { WaveSurferBox } from '../WaveSurfer'
import ChatWallpaper from '../../images/chat-wallpaper.png'
import { setLastMessage } from '../AllChats'

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

function MessageItem(props) {
  let message = props.message
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
                    `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'photo' ? (
                <img
                  onClick={() => {
                    props.setCurrentPhotoSrc(
                      serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
                    )
                    props.setPhotoViewerVisible(true)
                  }}
                  style={{ width: 200 }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'video' ? (
                <div>
                  <video
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        src:
                          serverRoot +
                          `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
                      })
                    }}
                    controls={false}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
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
                        `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
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
                    `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'photo' ? (
                <img
                  onClick={() => {
                    props.setCurrentPhotoSrc(
                      serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
                    )
                    props.setPhotoViewerVisible(true)
                  }}
                  style={{ width: 200 }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'video' ? (
                <div>
                  <video
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        src:
                          serverRoot +
                          `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
                      })
                    }}
                    controls={false}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
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
                        `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
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
                    `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'photo' ? (
                <img
                  onClick={() => {
                    props.setCurrentPhotoSrc(
                      serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
                    )
                    props.setPhotoViewerVisible(true)
                  }}
                  style={{ width: 200 }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'video' ? (
                <div>
                  <video
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        src:
                          serverRoot +
                          `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
                      })
                    }}
                    controls={false}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
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
                        `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
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
                    `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'photo' ? (
                <img
                  onClick={() => {
                    props.setCurrentPhotoSrc(
                      serverRoot +
                        `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
                    )
                    props.setPhotoViewerVisible(true)
                  }}
                  style={{ width: 200 }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
                  }
                />
              ) : message.messageType === 'video' ? (
                <div>
                  <video
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        src:
                          serverRoot +
                          `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
                      })
                    }}
                    controls={false}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`
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
                        `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${message.fileId}`,
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

export let addMessageToList3 = () => {}

export let updateChatEmbedded = undefined

export default function ChatEmbedded(props) {
  document.documentElement.style.overflowY = 'hidden'

  let forceUpdate = useForceUpdate()
  updateChatEmbedded = forceUpdate
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

  let addMessageToList = (msg) => {
    msg['User.id'] = msg.User.id
    msg['User.username'] = msg.User.username
    msg['User.firstName'] = msg.User.firstName
    let lastMsg = (
      <MessageItem
        key={Math.random()}
        message={msg}
        roomId={props.roomId}
        setPhotoViewerVisible={setPhotoViewerVisible}
        setCurrentPhotoSrc={setCurrentPhotoSrc}
      />
    )
    messagesArr.push(lastMsg)
    forceUpdate()
  }
  addMessageToList3 = addMessageToList

  useEffect(() => {
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
          if (result.messages.length > 10) {
            result.messages = result.messages.slice(result.messages.length - 10)
          }
          messagesArr = []
          result.messages.forEach((message) => {
            messagesArr.push(
              <MessageItem
                key={Math.random()}
                message={message}
                roomId={props.roomId}
                setPhotoViewerVisible={setPhotoViewerVisible}
                setCurrentPhotoSrc={setCurrentPhotoSrc}
              />,
            )
          })
          forceUpdate()
        }
      })
      .catch((error) => console.log('error', error))
  }, [props.roomId, props.userId])

  const ROOT_CSS = css({
    height: '100%',
    width: '100%',
  })

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
                    addMessageToList(result.message)
                    setLastMessage(result.message)
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

  let width = 0
  let height = 0
  let left = 0
  let right = 0
  let top = 0

  if (isDesktop()) {
    if (isInRoom()) {
      width = 450
      height = '100%'
      left = 'calc(100% - 450px)'
      right = 0
      top = 0
    } else if (isInMessenger()) {
      width = '100٪'
      height = '100%'
      left = 128
      right = undefined
      top = 48
    }
  } else if (isMobile() || isTablet()) {
    if (isInRoom()) {
      width = '100%'
      height = '100%'
      right = undefined
      left = 0
      top = 0
    } else if (isInMessenger()) {
      width = '100%'
      height = '100%'
      left = 0
      right = undefined
      top = 0
    }
  }

  return (
    <div
      style={{
        display:
          props.roomId === undefined || props.roomId === 0 ? 'none' : 'block',
        width: width,
        height: height,
        position: 'absolute',
        top: top,
        left: left,
        right: right,
        bottom: isDesktop() ? 16 : 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundImage: `url(${ChatWallpaper})`,
          top: isDesktop() ? 16 : 0,
          left: isDesktop() ? 96 : 0,
          right: isDesktop()
            ? histPage === '/app/room' || histPage === '/app/settings'
              ? 0
              : 16
            : 0,
          bottom: isDesktop() ? -16 : 0,
          backdropFilter: 'blur(10px)',
          borderRadius: '0 0 0 24px',
        }}
      />
      <Viewer
        zIndex={99999}
        style={{ position: 'fixed', left: 0, top: 0 }}
        visible={photoViewerVisible}
        onClose={() => {
          props.setPhotoViewerVisible(false)
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
                    fileId: null,
                  }),
                  redirect: 'follow',
                }
                fetch(serverRoot + '/chat/create_message', requestOptions)
                  .then((response) => response.json())
                  .then((result) => {
                    console.log(JSON.stringify(result))
                    if (result.message !== undefined) {
                      addMessageToList(result.message)
                      setLastMessage(result.message)
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
        <ScrollToBottom className={ROOT_CSS}>
          <div style={{ height: 64 }} />
          <div id={'messagesContainer'}>{messagesArr}</div>
          <div style={{ width: '100%', height: 80 }} />
        </ScrollToBottom>
      </div>
    </div>
  )
}
