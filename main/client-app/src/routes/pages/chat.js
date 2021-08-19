import React, {useEffect} from 'react';
import ChatAppBar from "../../components/ChatAppBar";
import Slide from "@material-ui/core/Slide";
import {popPage, registerDialogOpen, roomId} from "../../App";
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
        direction: 'rtl'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontFamily: 'mainFont'
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

export default function Chat(props) {

    setToken(localStorage.getItem('token'))

    let forceUpdate = useForceUpdate()
    let [messages, setMessages] = React.useState([])
    let [title, setTitle] = React.useState('')
    let [user, setUser] = React.useState({})
    const [open, setOpen] = React.useState(true);
    registerDialogOpen(setOpen)
    const handleClose = () => {
        setOpen(false);
        setTimeout(popPage, 250);
    };
    let classes = useStyles();
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

    return (
        <Dialog
            onTouchStart={(e) => {e.stopPropagation();}}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
            fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} style={{backdropFilter: 'blur(10px)'}}>
            <div style={{width: "100%", height: "100%", position: "absolute", top: 0, left: 0}}>
                <ChatAppBar closeCallback={handleClose} user={user}/>
                <div style={{height: 64}}/>
                <div className={classes.root}>
                    <IconButton className={classes.iconButton}>
                        <DescriptionIcon />
                    </IconButton>
                    <IconButton className={classes.iconButton}>
                        <EmojiEmotionsIcon />
                    </IconButton>
                    <InputBase
                        id={'chatText'}
                        className={classes.input}
                        placeholder="پیام خود را بنویسید"
                    />
                    <IconButton color="primary" className={classes.iconButton} style={{transform: 'rotate(180deg)'}} onClick={() => {
                        let requestOptions = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'token': token
                            },
                            body: JSON.stringify({
                                roomId: props.room_id,
                                text: document.getElementById('chatText').value
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
                    }}>
                        <SendIcon />
                    </IconButton>
                </div>
                <div style={{width: "100%", height: "calc(100% - 72px)", paddingTop: 16}}>
                    <ScrollToBottom className={ROOT_CSS}>
                    {messages.map(message => {
                        let dateTime = new Date(Number(message.time))
                        return (
                            <div key={message.id}>
                                {message.User.id === me.id ?
                                    <div style={{position: 'relative'}}>
                                    <div style={{fontFamily: 'mainFont', fontSize: 15, display: 'inline-block', width: 'auto', minWidth: 125, maxWidth: 300, padding: 16,
                                        backgroundColor: '#1a8a98', color: '#fff',
                                        borderRadius: '16px 16px 16px 0px', position: 'absolute', left: 12, marginTop: 16,
                                        background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(0,212,255,1) 100%)'}}>
                                            {message.text}
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8, fontSize: 12, color: '#fff'}}>{dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds()}</div>
                                    </div>
                                    <div style={{visibility: 'hidden', fontFamily: 'mainFont', fontSize: 15, display: 'inline-block', width: 'auto', minWidth: 125, maxWidth: 300, padding: 16,
                                        backgroundColor: '#1a8a98', color: '#fff',
                                        borderRadius: '16px 16px 16px 0px', marginTop: 16,
                                        background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(0,212,255,1) 100%)'}}>
                                            {message.text}
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8, fontSize: 12, color: '#fff'}}>{dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds()}</div>
                                    </div>
                                </div> :
                                <div style={{position: 'relative'}}>
                                    <div style={{fontFamily: 'mainFont', fontSize: 15, display: 'inline-block', width: 'auto', minWidth: 125, maxWidth: 300, padding: 16,
                                        backgroundColor: '#4dabf5', color: '#fff',
                                        borderRadius: '16px 16px 0px 16px', marginLeft: 16, marginTop: 16,
                                        position: 'absolute', right: 16,
                                        background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(0,212,255,1) 100%)'}}>
                                            {message.text}
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8, fontSize: 12, color: '#fff'}}>{dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds()}</div>
                                    </div>
                                    <div style={{visibility: 'hidden', fontFamily: 'mainFont', fontSize: 15, display: 'inline-block', width: 'auto', minWidth: 125, maxWidth: 300, padding: 16,
                                        color: 'transparent', marginLeft: 16, marginTop: 16, color: '#fff',
                                        background: 'linear-gradient(135deg, rgba(7,0,120,1) 0%, rgba(9,9,121,1) 13%, rgba(0,212,255,1) 100%)'}}>
                                            {message.text}
                                        <br/>
                                        <br/>
                                        <div style={{position: 'absolute', right: 12, bottom: 8, fontSize: 12, color: '#fff'}}>{dateTime.toLocaleDateString('fa-IR').toString() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds()}</div>
                                    </div>
                                </div>
                                }
                            </div>
                        );
                    })}
                    <div style={{width: '100%', height: 64}}/>
                    </ScrollToBottom>
                </div>
            </div>
        </Dialog>
    );
}
