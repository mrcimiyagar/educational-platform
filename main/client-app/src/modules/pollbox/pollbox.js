import React, { useEffect } from 'react';
import { Button, Card, CardBody, CardTitle, CustomInput, Form, FormGroup, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { colors, token } from '../../util/settings';
import { socket, useForceUpdate } from '../../util/Utils';
import Poll from 'react-polls';
import CloseIcon from '@material-ui/icons/Close';

export let togglePolling = undefined;

let po = [];
 
export function PollBox(props) {

  let forceUpdate = useForceUpdate();
  
  let [polls, setPolls] = React.useState(po);
  useEffect(() => {
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
    fetch("../poll/get_polls", requestOptions)
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
        pollId: polls[pollIndex].id,
        optionId: polls[pollIndex].options[optionIndex].id
      }),
      redirect: 'follow'
    };
    fetch("../poll/vote", requestOptions)
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
  <Modal
    isOpen={open}
    toggle={() => setOpen(!open)}
    wrapClassName="modal-right"
    backdrop={true}
    >
      <div
    style={{backgroundColor: colors.primaryLight, width: '100%', height: '100%', minHeight: '100vh'}}>
      <ModalHeader toggle={() => setOpen(!open)} close={<Button style={{border: 'none', background: 'transparent'}} onClick={() => setOpen(!open)}><CloseIcon style={{fill: colors.textIcons}}/></Button>}>
        <span><p style={{color: colors.textIcons}}>رای گیری ها</p></span>
      </ModalHeader>
      <ModalBody style={{height: '100%', overflowY: 'auto'}}>
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
      </ModalBody>
      </div>
  </Modal>
  );
}
