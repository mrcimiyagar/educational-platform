import { Card } from '@material-ui/core'
import Email from '@material-ui/icons/Email';
import React, { useEffect } from 'react'
import { Button } from 'reactstrap';
import { token } from '../../util/settings';

export default function InvitesBox(props) {

  let [invites, setInvites] = React.useState([]);

  let fetchRooms = () => {
    
  }

  let fetchInvites = () => {
    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      redirect: 'follow'
    };
    fetch("../room/get_invites", requestOptions2)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          setInvites(result.invites);
        })
        .catch(error => console.log('error', error));
  }

  useEffect(() => {
    fetchRooms();
    fetchInvites();
  }, []);

  return (
    <Card style={{ marginTop: 16 }}>
      <div className="position-absolute card-top-buttons">
        <button className="btn btn-header-light icon-button">
          <i className="simple-icon-refresh" />
        </button>
      </div>
      <div>
        <div>
          <div style={{ fontSize: 20 }}>دعوت ها</div>
        </div>
        <div
          className="scroll dashboard-list-with-thumbs"
          style={{ height: window.innerHeight / 2 - 176, position: 'relative' }}
        >
            {invites.map((invite, index) => {
              return (
                <div
                  key={index}
                  className="d-flex flex-row mb-3"
                  style={{ direction: 'rtl', width: '100%' }}
                >
                  <div className="d-block position-relative">
                    <Email style={{ width: 48, height: 48 }} />
                  </div>

                  <div
                    className="pl-3 pt-2 pr-2 pb-2"
                    style={{ marginTop: 16 }}
                  >
                    <div>
                      <p className="list-item-heading">{invite.Room.name}</p>
                      <div style={{ display: 'flex' }}>
                        <Button
                          outline
                          color="secondary"
                          className="mb-2"
                          style={{ fontSize: 14 }}
                          onClick={() => {
                            let requestOptions = {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                token: token,
                              },
                              body: JSON.stringify({
                                inviteId: invite.id,
                              }),
                              redirect: 'follow',
                            }
                            fetch('../room/accept_invite', requestOptions)
                              .then((response) => response.json())
                              .then((result) => {
                                console.log(JSON.stringify(result))
                                if (result.status === 'success') {
                                  fetchInvites()
                                  fetchRooms()
                                }
                              })
                              .catch((error) => console.log('error', error))
                          }}
                        >
                          پذیرش
                        </Button>
                        <span>
                          <pre> </pre>
                        </span>
                        <Button
                          outline
                          color="secondary"
                          className="mb-2"
                          style={{ fontSize: 14 }}
                          onClick={() => {
                            let requestOptions = {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                token: token,
                              },
                              body: JSON.stringify({
                                inviteId: invite.id,
                              }),
                              redirect: 'follow',
                            }
                            fetch('../room/decline_invite', requestOptions)
                              .then((response) => response.json())
                              .then((result) => {
                                console.log(JSON.stringify(result))
                                if (result.status === 'success') {
                                  fetchInvites()
                                  fetchRooms()
                                }
                              })
                              .catch((error) => console.log('error', error))
                          }}
                        >
                          رد کرذن
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </Card>
  )
}
