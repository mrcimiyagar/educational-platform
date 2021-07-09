import React, { Component, Fragment } from "react";
import { Row, Card, CardTitle, Form, Label, Input, Button } from "reactstrap";
import {Link, NavLink} from "react-router-dom";

import { Colxx } from "../../components/CustomBootstrap";
import {phone, setPhone, setToken} from "../../util/settings";
import {gotoPage} from '../../App';
import { leaveRoom } from "../../util/Utils";

class Register extends Component {
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
                     لطفا شماره موبایل را وارد نمایید
                    </p>
                  </div>
                  <div className="form-side">
                    <NavLink to={`/`} className="white">
                      <span className="logo-single" />
                    </NavLink>
                    <CardTitle className="mb-4">
                        ثبت نام
                    </CardTitle>
                    <Form>
                      <Label className="form-group has-float-label mb-4">
                        <Input type="email" onChange={(e) => this.setState({phone: e.target.value})}
                               value={this.state.phone} />
                        شماره موبایل
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
                                  phone: this.state.phone
                                }),
                                redirect: 'follow'
                              };
                              fetch("../auth/register", requestOptions)
                                  .then(response => response.json())
                                  .then(result => {
                                    console.log(JSON.stringify(result));
                                    if (result.status === 'success') {
                                      setPhone(this.state.phone);
                                      this.setState({
                                        phone: '',
                                        password: '',
                                        firstname: '',
                                        lastname: ''
                                      });
                                      gotoPage('/app/verification');
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

export default Register;