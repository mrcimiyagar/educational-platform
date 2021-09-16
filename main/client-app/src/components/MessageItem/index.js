
import { Avatar, Fab, Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { ArrowDownward, DoneAll, PlayArrowTwoTone } from '@material-ui/icons'
import React, { useEffect } from 'react'
import { gotoPage, popPage, registerDialogOpen, setDialogOpen } from '../../App'
import { WaveSurferBox } from '../../components/WaveSurfer'
import { colors, me, token } from '../../util/settings'
import { serverRoot, socket, useForceUpdate } from '../../util/Utils'
import Done from '@material-ui/icons/Done'

export default function MessageItem(props) {
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
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
                    }
                  />
                ) : message.messageType === 'photo' ? (
                  <img
                    onClick={() => {
                      props.setCurrentPhotoSrc(
                        serverRoot +
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
                      )
                      props.setPhotoViewerVisible(true)
                    }}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
                    }
                  />
                ) : message.messageType === 'video' ? (
                  <div>
                    <video
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          src:
                            serverRoot +
                            `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
                        })
                      }}
                      controls={false}
                      style={{ width: 200 }}
                      src={
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
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
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
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
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
                    }
                  />
                ) : message.messageType === 'photo' ? (
                  <img
                    onClick={() => {
                      props.setCurrentPhotoSrc(
                        serverRoot +
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
                      )
                      props.setPhotoViewerVisible(true)
                    }}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
                    }
                  />
                ) : message.messageType === 'video' ? (
                  <div>
                    <video
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          src:
                            serverRoot +
                            `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
                        })
                      }}
                      controls={false}
                      style={{ width: 200 }}
                      src={
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
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
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
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
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
                    }
                  />
                ) : message.messageType === 'photo' ? (
                  <img
                    onClick={() => {
                      props.setCurrentPhotoSrc(
                        serverRoot +
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
                      )
                      props.setPhotoViewerVisible(true)
                    }}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
                    }
                  />
                ) : message.messageType === 'video' ? (
                  <div>
                    <video
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          src:
                            serverRoot +
                            `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
                        })
                      }}
                      controls={false}
                      style={{ width: 200 }}
                      src={
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
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
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
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
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
                    }
                  />
                ) : message.messageType === 'photo' ? (
                  <img
                    onClick={() => {
                      props.setCurrentPhotoSrc(
                        serverRoot +
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
                      )
                      props.setPhotoViewerVisible(true)
                    }}
                    style={{ width: 200 }}
                    src={
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
                    }
                  />
                ) : message.messageType === 'video' ? (
                  <div>
                    <video
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          src:
                            serverRoot +
                            `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
                        })
                      }}
                      controls={false}
                      style={{ width: 200 }}
                      src={
                        serverRoot +
                        `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
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
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`,
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