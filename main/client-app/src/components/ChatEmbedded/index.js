import React, {useEffect, useState} from 'react';
import ChatAppBar from "../ChatAppBar";
import Slide from "@material-ui/core/Slide";
import {gotoPage, isDesktop, popPage, registerDialogOpen, roomId} from "../../App";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import {makeStyles} from "@material-ui/core/styles";
import DescriptionIcon from '@material-ui/icons/Description';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import SendIcon from '@material-ui/icons/Send';
import { me, setToken, token } from '../../util/settings';
import { serverRoot, useForceUpdate } from '../../util/Utils';
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';
import {WaveSurferBox} from '../WaveSurfer'
import Picker from 'emoji-picker-react';
import { useFilePicker } from 'use-file-picker';
import { PlayArrowTwoTone } from '@material-ui/icons';
import Viewer from 'react-viewer';
import EmptyIcon from '../../images/empty.png'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: isDesktop ? '450px' : '100%',
        position: 'fixed',
        bottom: 48,
        left: 'calc(50% - 329px - 225px)',
        borderRadius: 16,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        direction: 'rtl'
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

let uplaodedFileId = 0

export default function ChatEmbedded(props) {

    setToken(localStorage.getItem('token'))

    let forceUpdate = useForceUpdate()
    let [messages, setMessages] = React.useState([])
    let [photoViewerVisible, setPhotoViewerVisible] = React.useState(false)
    let [currentPhotoSrc, setCurrentPhotoSrc] = React.useState('')
    let [user, setUser] = React.useState({})
    const [open, setOpen] = React.useState(true)
    const [showEmojiPad, setShowEmojiPad] = React.useState(false)
    let [pickingFile, setPickingFile] = React.useState(false)
    registerDialogOpen(setOpen)
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250);
    };
    let classes = useStyles();
    const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
        readAs: 'DataURL'
    });
    useEffect(() => {
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                userId: props.user_id
            }),
            redirect: 'follow'
        };
        fetch(serverRoot + "/auth/get_user", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(JSON.stringify(result));
                if (result.user !== undefined) {
                    setUser(result.user)
                }
            })
            .catch(error => console.log('error', error));

        let requestOptions2 = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'token': token
          },
          body: JSON.stringify({
              roomId: Number(props.room_id)
          }),
          redirect: 'follow'
        };
        fetch(serverRoot + "/chat/get_messages", requestOptions2)
            .then(response => response.json())
          .then(result => {
              console.log(JSON.stringify(result));
              if (result.messages !== undefined) {
                  setMessages(result.messages);
              }
          })
          .catch(error => console.log('error', error));
      }, [])

      const ROOT_CSS = css({
        height: '100%',
        width: '100%'
      });

      useEffect(() => {
        if (!loading && pickingFile) {
            setPickingFile(false)
            let dataUrl = filesContent[0]
            fetch(dataUrl.content)
            .then(res => res.blob())
            .then((file => {
                let data = new FormData();
                data.append('file', file);
                let request = new XMLHttpRequest();
                request.open('POST', serverRoot + `/file/upload_file?token=${token}&roomId=${props.room_id}`);
                let f = {progress: 0, name: file.name, size: file.size, local: true};
                request.upload.addEventListener('progress', function(e) {
                    let percent_completed = (e.loaded * 100 / e.total);
                    f.progress = percent_completed
                    if (percent_completed === 100) {
                      f.local = false;
                    }
                    forceUpdate()
                });
                request.onreadystatechange = function() {
                    if (request.readyState == XMLHttpRequest.DONE) {
                        let requestOptions = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'token': token
                            },
                            body: JSON.stringify({
                                roomId: props.room_id,
                                messageType: (dataUrl.name.endsWith('.svg') || dataUrl.name.endsWith('.png') || dataUrl.name.endsWith('.jpg') || dataUrl.name.endsWith('.jpeg') || dataUrl.name.endsWith('.gif')) ? 'photo' :
                                             (dataUrl.name.endsWith('.wav') || dataUrl.name.endsWith('.mp3') || dataUrl.name.endsWith('.mpeg') || dataUrl.name.endsWith('.mp4')) ? 'audio' :
                                             (dataUrl.name.endsWith('.webm') || dataUrl.name.endsWith('.mkv') || dataUrl.name.endsWith('.flv') || dataUrl.name.endsWith('.3gp')) ? 'video' :
                                             undefined,
                                fileId: JSON.parse(request.responseText).file.id
                            }),
                            redirect: 'follow'
                        };
                        fetch(serverRoot + "/chat/create_message", requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                console.log(JSON.stringify(result));
                                if (result.message !== undefined) {
                                    messages.push(result.message)
                                    setMessages(messages)
                                    forceUpdate()
                                    document.getElementById('chatText').value = ''
                                }
                            })
                            .catch(error => console.log('error', error));
                    }
                }
                if (FileReader) {
                    let fr = new FileReader();
                    
                    fr.onload = function () {
                        f.src = fr.result;
                    }
                    fr.readAsDataURL(file);
                }
                request.send(data);
            }))
          }
      }, [loading])

    return (
            <div style={{width: "calc(100% - 32px - 64px)", height: "calc(100% - 64px)", position: "absolute", top: 32, left: 96, right: 16, bottom: 16, borderRadius: 32}}>
                <div style={{width: "calc(100% - 32px)", height: "calc(100% - 32px)", position: "absolute", backgroundColor: 'rgba(255, 255, 255, 0.45)', borderRadius: 32, top: 16, left: 96, right: 16, bottom: 16, backdropFilter: 'blur(10px)'}}/>
                <Viewer
                    zIndex={99999}
                    style={{position: 'fixed', left: 0, top: 0}}
                    visible={photoViewerVisible}
                    onClose={() => {setPhotoViewerVisible(false);}}
                    images={[{src: currentPhotoSrc, alt: ''}]}
                />
                <ChatAppBar closeCallback={handleClose} user={user}/>
                <div style={{width: '100%', height: 'auto', zIndex: 1000}}>
                    <div className={classes.root} style={{height: 40, bottom: showEmojiPad ? 332 : 32}}>
                    <IconButton className={classes.iconButton} onClick={() => {
                        setPickingFile(true)
                        openFileSelector()
                    }}>
                        <DescriptionIcon />
                    </IconButton>
                    <IconButton className={classes.iconButton} onClick={() => {setShowEmojiPad(!showEmojiPad)}}>
                        <EmojiEmotionsIcon />
                    </IconButton>
                    <InputBase
                        id={'chatText'}
                        className={classes.input}
                        style={{flex: 1}}
                        placeholder="پیام خود را بنویسید"
                    />
                    <IconButton color="primary" className={classes.iconButton} style={{transform: 'rotate(180deg)'}} onClick={() => {
                        if (document.getElementById('chatText').value !== '') {
                            let requestOptions = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'token': token
                                },
                                body: JSON.stringify({
                                    roomId: props.room_id,
                                    text: document.getElementById('chatText').value,
                                    messageType: 'text'
                                }),
                                redirect: 'follow'
                            };
                            fetch(serverRoot + "/chat/create_message", requestOptions)
                                .then(response => response.json())
                                .then(result => {
                                    console.log(JSON.stringify(result));
                                    if (result.message !== undefined) {
                                        messages.push(result.message)
                                        setMessages(messages)
                                        forceUpdate()
                                        document.getElementById('chatText').value = ''
                                    }
                                })
                                .catch(error => console.log('error', error));
                        }
                    }}>
                        <SendIcon />
                    </IconButton>
                    <br/>
                    </div>
                    <Picker pickerStyle={{width: 'calc(100% - 658px - 96px)', height: showEmojiPad ? 300 : 0, position: 'fixed', left: 96, bottom: 0}} onEmojiClick={(event, emojiObject) => {
                        document.getElementById('chatText').value += emojiObject.emoji
                    }} />
                </div>
                <div style={{width: "100%", height: showEmojiPad ? "calc(100% - 300px)" : '100%'}}>
                    <ScrollToBottom className={ROOT_CSS}>
                      <div style={{height: 64}}/>
                      {messages.length > 0 ?
                        messages.map(message => {
                            let dateTime = new Date(Number(message.time))
                            return (
                            <div key={message.id}>
                                {message.User.id === me.id ?
                                    <div style={{position: 'relative'}}>
                                    <div style={{fontFamily: 'mainFont', fontSize: 15, display: 'inline-block', width: 'auto', minWidth: 125, maxWidth: 300, padding: 16,
                                        backgroundColor: '#1a8a98', color: '#fff',
                                        borderRadius: '16px 16px 0px 16px', position: 'absolute', right: 12, marginTop: 16,
                                        background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(179,0,255,1) 100%)'}}>
                                            {message.messageType === 'text' ?
                                                message.text :
                                                message.messageType === 'audio' ?
                                                    <WaveSurferBox fileId={message.fileId} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/> :
                                                    message.messageType === 'photo' ?
                                                        <img onClick={() => {setCurrentPhotoSrc(serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`); setPhotoViewerVisible(true);}} style={{width: 200}} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/> :
                                                        message.messageType === 'video' ?
                                                            <div>
                                                                <video onClick={() => {gotoPage('/app/videoplayer', {src: serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`})}} controls={false} style={{width: 200}} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/>
                                                            </div> :
                                                            message.text
                                            }
                                            {
                                                message.messageType === 'video' ?
                                                    <IconButton onClick={() => {gotoPage('/app/videoplayer', {src: serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`})}} style={{width: 64, height: 64, position: 'absolute', left: '50%', top: 'calc(50% - 24px)', transform: 'translate(-50%, -50%)'}}>
                                                        <PlayArrowTwoTone style={{width: 64, height: 64}}/>
                                                    </IconButton> :
                                                    null    
                                            }
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8, fontSize: 12, color: '#fff'}}>{dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds()}</div>
                                    </div>
                                    <div style={{visibility: 'hidden', fontFamily: 'mainFont', fontSize: 15, display: 'inline-block', width: 'auto', minWidth: 125, maxWidth: 300, padding: 16,
                                        backgroundColor: '#1a8a98', color: '#fff',
                                        borderRadius: '16px 16px 0px 16px', marginTop: 16,
                                        background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(179,0,255,1) 100%)'}}>
                                            {message.messageType === 'text' ?
                                                message.text :
                                                message.messageType === 'audio' ?
                                                    <WaveSurferBox fileId={message.fileId} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/> :
                                                    message.messageType === 'photo' ?
                                                        <img onClick={() => {setCurrentPhotoSrc(serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`); setPhotoViewerVisible(true);}} style={{width: 200}} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/> :
                                                        message.messageType === 'video' ?
                                                            <div>
                                                                <video onClick={() => {gotoPage('/app/videoplayer', {src: serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`})}} controls={false} style={{width: 200}} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/>
                                                            </div> :
                                                            message.text
                                            }
                                            {
                                                message.messageType === 'video' ?
                                                    <IconButton onClick={() => {gotoPage('/app/videoplayer', {src: serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`})}} style={{width: 64, height: 64, position: 'absolute', left: '50%', top: 'calc(50% - 24px)', transform: 'translate(-50%, -50%)'}}>
                                                        <PlayArrowTwoTone style={{width: 64, height: 64}}/>
                                                    </IconButton> :
                                                    null    
                                            }
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8, fontSize: 12, color: '#fff'}}>{dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds()}</div>
                                    </div>
                                </div> :
                                <div style={{position: 'relative'}}>
                                    <div style={{fontFamily: 'mainFont', fontSize: 15, display: 'inline-block', width: 'auto', minWidth: 125, maxWidth: 300, padding: 16,
                                        backgroundColor: '#4dabf5', color: '#fff',
                                        borderRadius: '16px 16px 16px 0px', marginLeft: 16, marginTop: 16,
                                        position: 'absolute', left: 0,
                                        background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(179,0,255,1) 100%)'}}>
                                            {message.messageType === 'text' ?
                                                message.text :
                                                message.messageType === 'audio' ?
                                                    <WaveSurferBox fileId={message.fileId} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/> :
                                                    message.messageType === 'photo' ?
                                                        <img onClick={() => {setCurrentPhotoSrc(serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`); setPhotoViewerVisible(true);}} style={{width: 200}} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/> :
                                                        message.messageType === 'video' ?
                                                            <div>
                                                                <video onClick={() => {gotoPage('/app/videoplayer', {src: serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`})}} controls={false} style={{width: 200}} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/>
                                                            </div> :
                                                            message.text
                                            }
                                            {
                                                message.messageType === 'video' ?
                                                    <IconButton onClick={() => {gotoPage('/app/videoplayer', {src: serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`})}} style={{width: 64, height: 64, position: 'absolute', left: '50%', top: 'calc(50% - 24px)', transform: 'translate(-50%, -50%)'}}>
                                                        <PlayArrowTwoTone style={{width: 64, height: 64}}/>
                                                    </IconButton> :
                                                    null    
                                            }
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8, fontSize: 12, color: '#fff'}}>{dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds()}</div>
                                    </div>
                                    <div style={{visibility: 'hidden', fontFamily: 'mainFont', fontSize: 15, display: 'inline-block', width: 'auto', minWidth: 125, maxWidth: 300, padding: 16,
                                        color: 'transparent', marginLeft: 16, marginTop: 16, color: '#fff', left: 0,
                                        background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(179,0,255,1) 100%)'}}>
                                            {message.messageType === 'text' ?
                                                message.text :
                                                message.messageType === 'audio' ?
                                                    <WaveSurferBox fileId={message.fileId} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/> :
                                                    message.messageType === 'photo' ?
                                                        <img onClick={() => {setCurrentPhotoSrc(serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`); setPhotoViewerVisible(true);}} style={{width: 200}} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/> :
                                                        message.messageType === 'video' ?
                                                            <div>
                                                                <video onClick={() => {gotoPage('/app/videoplayer', {src: serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`})}} controls={false} style={{width: 200}} src={serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`}/>
                                                            </div> :
                                                            message.text
                                            }
                                            {
                                                message.messageType === 'video' ?
                                                    <IconButton onClick={() => {gotoPage('/app/videoplayer', {src: serverRoot + `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${message.fileId}`})}} style={{width: 64, height: 64, position: 'absolute', left: '50%', top: 'calc(50% - 24px)', transform: 'translate(-50%, -50%)'}}>
                                                        <PlayArrowTwoTone style={{width: 64, height: 64}}/>
                                                    </IconButton> :
                                                    null    
                                            }
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8, fontSize: 12, color: '#fff'}}>{dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds()}</div>
                                    </div>
                                </div>
                                }
                            </div>
                        );
                    }) :
                    <div style={{width: 250, height: 250, position: isDesktop ? undefined : 'absolute', top: isDesktop ? undefined : 80, right: isDesktop ? undefined : 'calc(50% - 225px)', marginRight: isDesktop ? 'calc(50% - 125px)' : undefined, marginTop: isDesktop ? 160 : undefined, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
                      <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
                    </div>
                    }
                    <div style={{width: '100%', height: 64}}/>
                    </ScrollToBottom>
                </div>
            </div>
    );
}
