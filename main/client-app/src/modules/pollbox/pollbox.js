import { Button, Drawer, Fab, IconButton, TextField, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect } from 'react';
import Poll from 'react-polls';
import { colors, token } from '../../util/settings';
import { serverRoot, socket, useForceUpdate } from '../../util/Utils';

export let togglePolling = undefined;

let po = [];
 
export function PollBox(props) {

  let forceUpdate = useForceUpdate();
  
  let [polls, setPolls] = React.useState(po)
  let [pollQuestion, setPollQuestion] = React.useState('')
  let [pollOptions, setPollOptions] = React.useState([])
  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: Number(props.roomId),
        offset: 0,
        limit: 100
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/poll/get_polls", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            result.polls.forEach(poll => {
              let pollOptions = result.options[poll.id]['options'];
              poll.myVote = result.options[poll.id]['myVote'];
              pollOptions.forEach(opt => {
                opt.option = opt.caption;
              });
              poll.options = pollOptions;
            })
            po = result.polls;
            setPolls(po);
          }
        })
        .catch(error => console.log('error', error));
    socket.off('poll-added');
    socket.on('poll-added', ({poll, options}) => {
      options.forEach(opt => {
        opt.option = opt.caption;
      });
      poll.options = options;
      po.push(poll);
      setPolls(po);
      forceUpdate();
    });
    socket.on('vote-added', ({poll, options}) => {
      let p = undefined;
      for (let i = 0; i < po.length; i++) {
        if (po[i].id === poll.id) {
          p = po[i];
          break;
        }
      }
      let pollOptions = options['options'];
      for (let i = 0; i < pollOptions.length; i++) {
        p.options[i].votes = pollOptions[i].votes;
        p.options[i].option = p.options[i].caption;
      }
      
      console.log(po);
      console.log(poll);
      setPolls(po);
      forceUpdate();
    });
  }, []);

  let handleVote = (voteAnswer, pollIndex) => {
    let optionIndex = 0;
    for (let i = 0; i < polls[pollIndex].options.length; i++) {
      if (polls[pollIndex].options[i].option === voteAnswer) {
        optionIndex = i;
        break;
      }
    }
    
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: props.roomId,
        pollId: Number(polls[pollIndex].id),
        optionId: Number(polls[pollIndex].options[optionIndex].id)
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/poll/vote", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            po[pollIndex].myVote = result.vote;
            setPolls(po);
          }
        })
        .catch(error => console.log('error', error));
  }

  let [open, setOpen] = React.useState(false);
  togglePolling = () => setOpen(!open);

  return (
  <div style={{width: '100%', height: 'calc(100% - 56px)', marginTop: 56, backgroundColor: 'rgba(255, 255, 255, 0.25)'}}>
      <div style={{backgroundColor: colors.primaryLight, width: '100%', height: '100%'}}>
      <div style={{height: '100%', overflowY: 'auto', paddingBottom: 64}}>
        {polls.map((poll, index) => {
          if (poll.myVote !== undefined && poll.myVote !== null) {
            let myVoteText = '';
            for (let i = 0; i < poll.options.length; i++) {
              if (poll.options[i].id === poll.myVote.optionId) {
                myVoteText = poll.options[i].option;
                break;
              }
            }
            return <Poll question={poll.question} answers={poll.options} onVote={(va) => handleVote(va, index)} noStorage={true} vote={myVoteText}/>;
          }
          else {
            return <Poll question={poll.question} answers={poll.options} onVote={(va) => handleVote(va, index)} noStorage={true}/>;
          }
        })}
      </div>
      <Fab color={'secondary'} style={{position: 'fixed', bottom: 16, left: 16}} onClick={() => props.setOpen(true)}><Add/></Fab>
      </div>
      <Drawer onClose={() => props.setOpen(false)} open={props.open} anchor={'right'}>
        <div style={{backgroundColor: colors.primaryLight, minWidth: 300, width: '100%', height: '100vh'}}>
          <div>
            <Typography variant={'h6'} style={{marginTop: 24, marginRight: 16}}>افزودن رای گیری جدید</Typography>
          </div>
          <div>
            <TextField label="متن سوال" variant="outlined" style={{marginRight: 24, marginTop: 24}}
              defaultValue={pollQuestion}
              onChange={event => {
                setPollQuestion(event.target.value);
              }} />
              {pollOptions.map((option, index) => {
                  return (
                      <>
                        <div style={{display: 'flex'}}>
                          <TextField label={"گزینه ی" + ' ' + (index + 1)} variant="outlined" style={{marginRight: 24, marginTop: 16}}
                            defaultValue={pollOptions[index].caption}
                            onChange={event => {
                              let options = pollOptions;
                              options[index].caption = event.target.value;
                              setPollOptions(options);
                              forceUpdate()
                            }}
                          />
                          <IconButton
                              onClick={() => {
                                let options = pollOptions;
                                options.splice(index, 1);
                                setPollOptions(options);
                                forceUpdate()
                              }}>
                            <CloseIcon/>
                          </IconButton>
                        </div>
                      </>
                  );
                })}
                <br/>
                <Button variant={'outlined'} style={{width: 246, height: 56, marginTop: 16, marginRight: 24}} onClick={() => {
                  let options = pollOptions;
                  options.push({id: options.length, caption: ''});
                  setPollOptions(options);
                  forceUpdate()
                }}>
                  افزودن گزینه
                </Button>
              </div>
              <div style={{position: 'fixed', bottom: 24, right: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
                <Button
                    color="secondary"
                    variant={'outlined'}
                    onClick={() => props.setOpen(false)}>
                  لغو
                </Button>
                <Button style={{marginRight: 16}} color="primary" variant={'outlined'} onClick={() => {
                  let requestOptions = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'token': token
                    },
                    body: JSON.stringify({
                      roomId: props.roomId,
                      question: pollQuestion,
                      options: pollOptions.map(o => o.caption)
                    }),
                    redirect: 'follow'
                  };
                  fetch(serverRoot + "/poll/add_poll", requestOptions)
                      .then(response => response.json())
                      .then(result => {
                        console.log(JSON.stringify(result));
                        if (result.status === 'success') {
                          props.setOpen(false)
                        }
                      })
                      .catch(error => console.log('error', error));
                }}>
                  تایید
                </Button>
              </div>
              </div>
            </Drawer>
            
  </div>
  );
}
