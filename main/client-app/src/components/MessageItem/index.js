
import { Avatar, Fab, Grow, StylesProvider, Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import { ArrowDownward, DoneAll, PlayArrowTwoTone } from '@material-ui/icons'
import React, { useEffect } from 'react'
import { cacheFile, fetchFile, gotoPage, inTheGame, popPage, registerDialogOpen, setDialogOpen } from '../../App'
import { WaveSurferBox } from '../../components/WaveSurfer'
import { colors, me, token } from '../../util/settings'
import { serverRoot, socket, useForceUpdate } from '../../util/Utils'
import Done from '@material-ui/icons/Done'
import { RichPaper } from '../RichComponents'

export default function MessageItem(props) {
    let forceUpdate = useForceUpdate();
    let message = props.message;
    let dateTime = new Date(Number(message.time));
    useEffect(async () => {
      let cachedFile = await fetchFile(message.fileId);
      if (message.messageType === 'photo') {
        if (cachedFile === undefined || cachedFile.data === undefined) {
          fetch(
            serverRoot + `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
          ).then(r => r.blob()).then(async blob => {
            let dataUrl = await new Promise(resolve => {
              let reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            cacheFile(message.fileId, dataUrl);
            message.fileUrl = dataUrl;
            forceUpdate();
          });
        }
        else {
          message.fileUrl = cachedFile.data;
          forceUpdate();
        }
      }
      else if (message.messageType === 'audio') {
        if (cachedFile === undefined || cachedFile.data === undefined) {
        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            fileId: message.fileId,
            roomId: message.roomId,
          }),
          redirect: 'follow',
        }
        fetch(
          serverRoot + '/file/download_audio_preview',
          requestOptions,
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result))
            if (result !== undefined) {
              cacheFile(message.fileId, result);
              message.previewData = result;
              forceUpdate();
            }
          })
          .catch((error) => console.log('error', error));
        }
        else {
          message.previewData = cachedFile.data;
          forceUpdate();
        }
      }
      else if (message.messageType === 'video') {
        if (cachedFile === undefined || cachedFile.data === undefined) {
          fetch(
            serverRoot + `/file/download_file_thumbnail?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}`
          ).then(r => r.blob()).then(async blob => {
            let dataUrl = await new Promise(resolve => {
              let reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            cacheFile(message.fileId, dataUrl);
            message.previewData = dataUrl;
            forceUpdate();
          });
        }
        else {
          message.previewData = cachedFile.data;
          forceUpdate();
        }
      }
    }, [])
    return (
      <StylesProvider injectFirst>
      <div key={message.id} id={'message-' + message.id}>
        {message.authorId === me.id ? (
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
            <RichPaper
              style={{
                fontFamily: 'mainFont',
                fontSize: 15,
                display: 'inline-block',
                width: 'auto',
                minWidth: 150,
                maxWidth: 300,
                minHeight: message.messageType === 'text' ? undefined : message.messageType === 'audio' ? 64 : 224,
                paddingTop: 8,
                paddingBottom: 4,
                paddingRight: 16,
                paddingLeft: 16,
                color: '#fff',
                borderRadius: '16px 16px 0px 16px',
                position: 'absolute',
                marginTop: 8,
                right: 48
              }}
            >
              <Typography
                style={{
                  position: 'absolute',
                  right: 16,
                  fontWeight: 'bold',
                  fontSize: 15,
                  wordWrap: "break-word"
                }}
              >
                {message['User.firstName']}
              </Typography>
              <br />
              <div >
                {message.messageType === 'text' ? (
                  
                  <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {message.text}
                  </div>
                ) : message.messageType === 'audio' ? (
                  <WaveSurferBox
                    fileId={message.fileId}
                    roomId={message.roomId}
                    previewData={message.previewData}
                    src={message.fileUrl === undefined ?
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                      message.fileUrl
                    }
                  />
                ) : message.messageType === 'photo' ? (
                  <img
                    onClick={() => {
                      props.setCurrentPhotoSrc(message.fileUrl === undefined ?
                        serverRoot +
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                          message.fileUrl
                      )
                      props.setPhotoViewerVisible(true)
                    }}
                    style={{ width: 200 }}
                    src={
                      message.fileUrl === undefined ?
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                      message.fileUrl
                    }
                  />
                ) : message.messageType === 'video' ? (
                  <div>
                    {message.previewData !== undefined ?
                    <img
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        roomId: message.roomId,
                        fileId: message.fileId
                      })
                    }}
                    style={{ width: 200 }}
                    src={message.previewData}
                    /> : message.fileUrl !== undefined ?
                    <video
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          src: message.fileUrl
                        })
                      }}
                      style={{ width: 200 }}
                      src={
                        message.fileUrl
                      }
                    /> :
                    <img
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          roomId: message.roomId,
                          fileId: message.fileId
                        })
                      }}
                      style={{ width: 200 }}
                      src={ message.previewData === undefined ?
                        serverRoot +
                        `/file/download_file_thumbnail?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                        message.previewData
                      }
                    />
                    }
                  </div>
                ) : (
                  <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {message.text}
                  </div>
                )}
                {message.messageType === 'video' ? (
                  <IconButton
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        roomId: message.roomId,
                        fileId: message.fileId
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
                  display: 'flex'
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
            </RichPaper>
            <div
              style={{
                visibility: 'hidden',
                fontFamily: 'mainFont',
                fontSize: 15,
                display: 'inline-block',
                width: 'auto',
                minWidth: 150,
                maxWidth: 300,
                minHeight: message.messageType === 'text' ? undefined : message.messageType === 'audio' ? 64 : 224,
                paddingTop: 8,
                paddingBottom: 4,
                paddingRight: 16,
                paddingLeft: 16,
                marginTop: 8,
                color: '#fff',
                borderRadius: '16px 16px 0px 16px',
              }}
            >
              <Typography
                style={{
                  position: 'absolute',
                  right: 16,
                  fontWeight: 'bold',
                  fontSize: 15,
                  wordWrap: "break-word"
                }}
              >
                {message['User.firstName']}
              </Typography>
              <br />
              <div >
                {message.messageType === 'text' ? (
                  
                  <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {message.text}
                  </div>
                ) : message.messageType === 'audio' ? (
                  <WaveSurferBox
                    fileId={message.fileId}
                    roomId={message.roomId}
                    previewData={message.previewData}
                    src={message.fileUrl === undefined ?
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                      message.fileUrl
                    }
                  />
                ) : message.messageType === 'photo' ? (
                  <img
                    onClick={() => {
                      props.setCurrentPhotoSrc(message.fileUrl === undefined ?
                        serverRoot +
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                          message.fileUrl
                      )
                      props.setPhotoViewerVisible(true)
                    }}
                    style={{ width: 200 }}
                    src={
                      message.fileUrl === undefined ?
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                      message.fileUrl
                    }
                  />
                ) : message.messageType === 'video' ? (
                  <div>
                    {message.previewData !== undefined ?
                    <img
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        roomId: message.roomId,
                        fileId: message.fileId
                      })
                    }}
                    style={{ width: 200 }}
                    src={message.previewData}
                    /> : message.fileUrl !== undefined ?
                    <video
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          src: message.fileUrl
                        })
                      }}
                      style={{ width: 200 }}
                      src={
                        message.fileUrl
                      }
                    /> :
                    <img
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          roomId: message.roomId,
                          fileId: message.fileId
                        })
                      }}
                      style={{ width: 200 }}
                      src={ message.previewData === undefined ?
                        serverRoot +
                        `/file/download_file_thumbnail?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                        message.previewData
                      }
                    />
                    }
                  </div>
                ) : (
                  <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {message.text}
                  </div>
                )}
                {message.messageType === 'video' ? (
                  <IconButton
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        roomId: message.roomId,
                        fileId: message.fileId
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
                  display: 'flex'
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
            <RichPaper
              style={{
                fontFamily: 'mainFont',
                fontSize: 15,
                display: 'inline-block',
                width: 'auto',
                minWidth: 150,
                maxWidth: 300,
                minHeight: message.messageType === 'text' ? undefined : message.messageType === 'audio' ? 64 : 224,
                paddingTop: 8,
                paddingBottom: 4,
                paddingRight: 16,
                paddingLeft: 16,
                color: '#fff',
                borderRadius: '16px 16px 16px 0px',
                position: 'absolute',
                marginTop: 8,
                left: 48
              }}
            >
              <Typography
                style={{
                  position: 'absolute',
                  left: 16,
                  fontWeight: 'bold',
                  fontSize: 15,
                  wordWrap: "break-word"
                }}
              >
                {message['User.firstName']}
              </Typography>
              <br />
              <div >
                {message.messageType === 'text' ? (
                  
                  <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {message.text}
                  </div>
                ) : message.messageType === 'audio' ? (
                  <WaveSurferBox
                    fileId={message.fileId}
                    roomId={message.roomId}
                    previewData={message.previewData}
                    src={message.fileUrl === undefined ?
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                      message.fileUrl
                    }
                  />
                ) : message.messageType === 'photo' ? (
                  <img
                    onClick={() => {
                      props.setCurrentPhotoSrc(message.fileUrl === undefined ?
                        serverRoot +
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                          message.fileUrl
                      )
                      props.setPhotoViewerVisible(true)
                    }}
                    style={{ width: 200 }}
                    src={
                      message.fileUrl === undefined ?
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                      message.fileUrl
                    }
                  />
                ) : message.messageType === 'video' ? (
                  <div>
                    {message.previewData !== undefined ?
                    <img
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        roomId: message.roomId,
                        fileId: message.fileId
                      })
                    }}
                    style={{ width: 200 }}
                    src={message.previewData}
                    /> : message.fileUrl !== undefined ?
                    <video
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          src: message.fileUrl
                        })
                      }}
                      style={{ width: 200 }}
                      src={
                        message.fileUrl
                      }
                    /> :
                    <img
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          roomId: message.roomId,
                          fileId: message.fileId
                        })
                      }}
                      style={{ width: 200 }}
                      src={ message.previewData === undefined ?
                        serverRoot +
                        `/file/download_file_thumbnail?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                        message.previewData
                      }
                    />
                    }
                  </div>
                ) : (
                  <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {message.text}
                  </div>
                )}
                {message.messageType === 'video' ? (
                  <IconButton
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        roomId: message.roomId,
                        fileId: message.fileId
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
                  transform: 'translateY(-8px)'
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
            </RichPaper>
            <div
              style={{
                visibility: 'hidden',
                fontFamily: 'mainFont',
                fontSize: 15,
                display: 'inline-block',
                width: 'auto',
                minWidth: 150,
                maxWidth: 300,
                minHeight: message.messageType === 'text' ? undefined : message.messageType === 'audio' ? 64 : 224,
                paddingTop: 8,
                paddingBottom: 4,
                paddingRight: 16,
                paddingLeft: 16,
                color: 'transparent',
                marginLeft: 16,
                marginTop: 8,
                color: '#fff',
                left: 0
              }}
            >
              <Typography
                style={{
                  position: 'absolute',
                  left: 16,
                  fontWeight: 'bold',
                  fontSize: 15,
                  wordWrap: "break-word"
                }}
              >
                {message['User.firstName']}
              </Typography>
              <br />
              <div >
                {message.messageType === 'text' ? (
                  
                  <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {message.text}
                  </div>
                ) : message.messageType === 'audio' ? (
                  <WaveSurferBox
                    fileId={message.fileId}
                    roomId={message.roomId}
                    previewData={message.previewData}
                    src={message.fileUrl === undefined ?
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                      message.fileUrl
                    }
                  />
                ) : message.messageType === 'photo' ? (
                  <img
                    onClick={() => {
                      props.setCurrentPhotoSrc(message.fileUrl === undefined ?
                        serverRoot +
                          `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                          message.fileUrl
                      )
                      props.setPhotoViewerVisible(true)
                    }}
                    style={{ width: 200 }}
                    src={
                      message.fileUrl === undefined ?
                      serverRoot +
                      `/file/download_file?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                      message.fileUrl
                    }
                  />
                ) : message.messageType === 'video' ? (
                  <div>
                    {message.previewData !== undefined ?
                    <img
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        roomId: message.roomId,
                        fileId: message.fileId
                      })
                    }}
                    style={{ width: 200 }}
                    src={message.previewData}
                    /> : message.fileUrl !== undefined ?
                    <video
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          src: message.fileUrl
                        })
                      }}
                      style={{ width: 200 }}
                      src={
                        message.fileUrl
                      }
                    /> :
                    <img
                      onClick={() => {
                        gotoPage('/app/videoplayer', {
                          roomId: message.roomId,
                          fileId: message.fileId
                        })
                      }}
                      style={{ width: 200 }}
                      src={ message.previewData === undefined ?
                        serverRoot +
                        `/file/download_file_thumbnail?token=${token}&roomId=${message.roomId}&fileId=${message.fileId}` :
                        message.previewData
                      }
                    />
                    }
                  </div>
                ) : (
                  <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {message.text}
                  </div>
                )}
                {message.messageType === 'video' ? (
                  <IconButton
                    onClick={() => {
                      gotoPage('/app/videoplayer', {
                        roomId: message.roomId,
                        fileId: message.fileId
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
                  fontSize: 12,
                  color: '#fff',
                  transform: 'translateY(-8px)'
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
      </StylesProvider>
    )
  }