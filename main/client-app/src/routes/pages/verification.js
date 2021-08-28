import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Button, Card, CardTitle, Form, Input, Label, Row } from "reactstrap";
import { gotoPage } from '../../App';
import { Colxx } from "../../components/CustomBootstrap";
import { phone, setToken, token } from "../../util/settings";
import { config, ConnectToIo, FetchMe, leaveRoom, setConfig, socket } from "../../util/Utils";


class Verification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vCode: ''
    };
  }

  componentDidMount() {
    document.body.classList.add("background");
    leaveRoom();
  }
  componentWillUnmount() {
    document.body.classList.remove("background");
  }
  render() {
    return (
      <Fragment>
        <div className="fixed-background" />
        <main>
          <div className="container">
            <Row className="h-100">
              <Colxx xxs="12" md="10" className="mx-auto my-auto">
                <Card className="auth-card" style={{background: 'rgba(255, 255, 255, 0.35)', backdropFilter: 'blur(24px)'}}>
                  <div className="position-relative image-side ">
                    <p className="text-white h2">جادو در جزئیات است</p>
                    <p className="white mb-0">
                     لطفا کد تایید را وارد نمایید
                    </p>
                  </div>
                  <div className="form-side">
                    <NavLink to={`/`} className="white">
                      <span className="logo-single" />
                    </NavLink>
                    <CardTitle className="mb-4">
                        تایید حساب
                    </CardTitle>
                    <Form>
                      <Label className="form-group has-float-label mb-4">
                        <Input type="email" onChange={(e) => this.setState({vCode: e.target.value})}
                               value={this.state.vCode} />
                        کد تایید
                      </Label>

                      <div className="d-flex justify-content-end align-items-center">
                        <Button
                          color="primary"
                          className="btn-shadow"
                          size="lg"
                          onClick={(e) => {
                              e.preventDefault();
                              let requestOptions = {
                                  method: 'POST',
                                  headers: {
                                      'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({
                                      phone: phone,
                                      vCode: this.state.vCode
                                  }),
                                  redirect: 'follow'
                              };
                              fetch("../auth/verify", requestOptions)
                                  .then(response => response.json())
                                  .then(result => {
                                      console.log(JSON.stringify(result));
                                      if (result.status === 'success') {
                                          setToken(result.session.token);
                                          localStorage.setItem('token', result.session.token);
                                          this.setState({
                                              vCode: ''
                                          })
                                          ConnectToIo(token, () => {
                                            if (config === null || config === undefined) {
                                              let requestOptions4 = {
                                                method: 'POST',
                                                headers: {
                                                  'Content-Type': 'application/json',
                                                  'token': token
                                                },
                                                redirect: 'follow'
                                              };
                                              fetch("../auth/fetch_config", requestOptions4)
                                                .then(response => response.json())
                                                .then(result => {
                                                  console.log(JSON.stringify(result));
                                                  setConfig(result.config);
                                                  gotoPage('/app/home');
                                                  localStorage.setItem('firstTime', 'true');
                                                });
                                            }
                                            else {
                                              gotoPage('/app/home');
                                              localStorage.setItem('firstTime', 'true');
                                            }
                                          });
                                          FetchMe();
                                          localStorage.setItem('isGuest', 'false');
                                          socket.emit('auth', {token: result.session.token}, () => {});

                                      }
                                  })
                                  .catch(error => console.log('error', error));
                          }}
                        >
                          تایید
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>
    );
  }
}

export default Verification;
