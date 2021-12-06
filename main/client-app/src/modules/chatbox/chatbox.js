
import { css } from '@emotion/css';
import "chartjs-plugin-datalabels";
import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import ScrollToBottom from 'react-scroll-to-bottom';
import "react-table/react-table.css";
import {
    Button, Card,
    CardBody,
    CardTitle, Input, InputGroup, InputGroupAddon
} from "reactstrap";
import { colors, me, token } from "../../util/settings";
import { registerEvent, socket, unregisterEvent, useForceUpdate } from "../../util/Utils";
import './style.css';

export let reloadChat = undefined;

let unread = 0;

export let changeSendButtonState = undefined;

function keyEnter(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('sendBtn').click();
  }
}

export let ChatBox = (props) => {
    let [message, setMessage] = useState('');
    let [messages, setMessages] = useState([]);
    let [refreshKey, setRefreshKey] = useState(0);
    let [isSendDisabled, setIsSendDisabled] = React.useState(false);
    let [typingUsers, setTypingUsers] = React.useState([]);

    reloadChat = () => {
      setRefreshKey(refreshKey + 1);
    }

    let forceUpdate = useForceUpdate();

    useEffect(() => {
      if (props.membership.canAddMessage === true) {
        document.getElementById('chatInput').removeEventListener("keyup", keyEnter)
        document.getElementById('chatInput').addEventListener("keyup", keyEnter)
      }
    }, [props.membership])

    const sendMessage = (event) => {
      event.preventDefault();
  
      if(message) {
  
        let requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify({
            roomId: props.roomId,
            text: message,
            fileId: 0
          }),
          redirect: 'follow'
        };
  
        fetch("../message/add_message", requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(JSON.stringify(result));
              setMessage('')
            })
            .catch(error => console.log('error', error));
      }
    };
    useEffect(() => {
      changeSendButtonState = (enabled) => {
        setIsSendDisabled(!enabled);
      };
      document.addEventListener('visibilitychange', function(ev) {
        if (!document.hidden) {
          unread = 0;
          document.title = 'مارلیک تیمز';
        }
      });  
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          roomId: props.roomId,
          offset: 0,
          limit: 100
        }),
        redirect: 'follow'
      };
      fetch("../message/get_messages", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(JSON.stringify(result));
            messages.splice(0, messages.length);
            result.messages.forEach(msg => {
              messages.push(msg);
            });
            setMessages(messages);
            forceUpdate();
          })
          .catch(error => console.log('error', error));
      unregisterEvent('message-added');
      registerEvent('message-added', ({msg, user}) => {
        msg.User = user;
        messages.push(msg);
        setMessages(messages);
        forceUpdate();
        if (document.hidden) {
          unread++;
          document.title = 'پیام جدید (' + unread + ')';
        } 
      });
      unregisterEvent('chat-typing');
      registerEvent('chat-typing', tus => {
        for (let i = 0; i < tus.length; i++) {
          if (tus[i].id === me.id) {
            tus.splice(i, 1);
            break;
          }
        }
        setTypingUsers(tus);
      });
    }, [refreshKey]);

    const ROOT_CSS = css({
      height: '100%',
      width: '100%'
    });
    return (<Card style={{display: props.style.display, backgroundColor: colors.primary, height: props.boxHeight, width: '100%'}}>
              <CardBody style={{height: props.boxHeightInner, width: '100%'}}>
                  <CardTitle style={{color: colors.textIcons}}>
                    پیام ها
                  </CardTitle>
                  <div style={{height: props.boxHeightInner, marginTop: -16, marginLeft: -12, marginRight: -12, width: 'calc(100% + 32px)'}}>
                      <ScrollToBottom className={ROOT_CSS}>
                      {messages.map((msg, index) => {
                        let diff = Date.now() - Number(msg.time);
                        let date = '';
                        diff = diff / 1000;
                        diff = Math.floor(diff);
                        if (diff < 1) {
                          date = 'اکنون';
                        }
                        else if (diff < 60) {
                          diff = Math.floor(diff);
                          date = diff + ' ثانیه پیش';
                        }
                        else if (diff >= 60 && diff < 3600) {
                          diff = diff / 60;
                          diff = Math.floor(diff);
                          date = diff + ' دقیقه پیش';
                        }
                        else if (diff >= 3600) {
                          diff = diff / 3600;
                          diff = Math.floor(diff);
                          date = diff + ' ساعت پیش';
                        }
                        return (
                            <div
                                key={index}
                                className="d-flex flex-row mb-3 pb-3"
                                style={{direction: 'rtl', marginTop: index > 0 ? -16 : 0}}
                            >
                              <div>
                                <div>
                                  <p className="font-weight-medium mb-0 " style={{color: colors.textIcons, width: '28ch', direction: 'rtl'}}>
                                  <b>{msg.User.firstName}</b><p>{msg.text}</p>
                                  </p>
                                  <p className="text-muted mb-0 text-small" style={{color: colors.textIcons, marginTop: -16}}>
                                    {date}
                                  </p>
                                </div>
                              </div>
                            </div>
                        );
                      })}
                      </ScrollToBottom>
                    </div>
                    {props.membership.canAddMessage ?
                      <InputGroup className="mb-3" style={{position: 'absolute', width: '80%', bottom: 0}}>
                        {typingUsers.length > 0 ? <p style={{color: colors.textIcons}}>{typingUsers.map(tu => tu.firstName).join(' , ')} در حال نوشتن...</p> : null}<br/>
                        <Input id={'chatInput'} style={{backgroundColor: 'transparent', color: colors.textIcons}} value={message} onChange={(e) => {
                          socket.emit('chat-typing', props.roomId);
                          setMessage(e.target.value);
                        }} placeholder={'پیام خود را بنویسید'}/>
                        <InputGroupAddon addonType="prepend">
                          <Button id={'sendBtn'} outline disabled={isSendDisabled} style={{color: colors.textIcons, border: '1px solid ' + colors.textIcons}} onClick={(e) => sendMessage(e)}>
                            ارسال
                          </Button>
                        </InputGroupAddon>
                      </InputGroup> : null
                    }
              </CardBody>
            </Card>
    );
}
