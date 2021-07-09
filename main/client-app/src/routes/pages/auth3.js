import React, {Component} from 'react';
import LoginButton from '../../components/Buttons';
import Container from "@material-ui/core/Container";
import {Box} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import FullCenterLayout from '@bit/ivanli.ogcio.full-center-layout';
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/styles";
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import clsx from "clsx";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {blue, lightBlue, green, red, yellow, purple, grey} from "@material-ui/core/colors";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
import {AnimatedRotation, AnimatedPosition} from 'react-declare-animate';
import PhoneIcon from '@material-ui/icons/Phone';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import EmailIcon from '@material-ui/icons/Email';
import Animate from "react-smooth";
import ReactLoading from 'react-loading';
import GraphicsHandler from '../../util/GraphicsHandler';
import Redirect from "react-router-dom/Redirect";
import {phone, setMe, setPhone, setToken} from "../../util/settings";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import {gotoPage} from '../../App';
import { ConnectToIo, FetchMe, leaveRoom, serverRoot, setConfig } from '../../util/Utils';

export default class AuthPage extends Component {

    mobileWidth = 700;
    classes = {};

    constructor(props) {
        super(props);
        this.state = {
            loading: 3,
            signupForCardAngles: false,
            signupForFormItems: false,
            resizeTrigger: false,
            showPassword: false,
            verification: false
        };
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'hidden';
        document.body.style.backgroundColor = '#000';
        this.graphicsHandler = new GraphicsHandler();
        this.scrollTopTargetRef = React.createRef();
        this.classes = makeStyles({
            authCard: {
                minHeight: this.graphicsHandler.width < this.mobileWidth ? this.graphicsHandler.height * 3 / 5 : this.graphicsHandler.dpToPx(350),
                height: this.graphicsHandler.width < this.mobileWidth ? this.graphicsHandler.height * 3 / 5 : this.graphicsHandler.dpToPx(350)
            }
        });
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        leaveRoom();
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.graphicsHandler.width = window.innerWidth / this.graphicsHandler.density;
        this.graphicsHandler.height = window.innerHeight / this.graphicsHandler.density;
        this.setState({resizeTrigger: !this.state.resizeTrigger});
    }

    measureAuthCardHeight() {
        if (this.graphicsHandler.width < this.mobileWidth) {
            if (this.state.signupForFormItems) {
                return this.graphicsHandler.dpToPx(200);
            } else {
                return '60vh';
            }
        } else {
            if (this.state.signupForFormItems) {
                return this.graphicsHandler.dpToPx(400);
            } else {
                return this.graphicsHandler.dpToPx(350);
            }
        }
    }

    measureAuthCardWidth() {
        return this.graphicsHandler.width < this.mobileWidth ?
            this.graphicsHandler.width * this.graphicsHandler.density * 4 / 5 :
            this.graphicsHandler.dpToPx(700);
    }

    handleScrollReset() {
        if (this.state.loading === 1) {
            window.scrollTo(0, 0);
        }
    }

    render() {

        const classes = makeStyles(theme => ({
            root: {
                display: 'flex',
                flexWrap: 'wrap',
            },
            margin: {
                margin: theme.spacing(1),
            },
            textField: {
                flexBasis: 200
            },
        }));
        return (
            <div style={{width: '100%', height: '100%'}} onLoadStart={this.handleScrollReset()}>
                <div ref={this.scrollTopTargetRef} style={{width: '0px', height: '0px'}}/>
                <img
                    style={{width: '100%', height: '100vh', position: 'fixed'}}
                    alt={''}
                    src={GraphicsHandler.instance.loginBackground()}/>
                <FullCenterLayout>
                    <AnimatedPosition
                        duration={1500}
                        top={this.state.loading < 3 || this.state.loading > 3 ?
                            this.graphicsHandler.height * 1.5 :
                            this.graphicsHandler.height * 15 / 100}>
                        <AnimatedRotation
                            duration={2500}
                            angleX={this.state.signupForCardAngles ? 3.14 : 0}
                            angleY={this.state.signupForCardAngles ? 3.14 : 0}
                            angleZ={this.state.signupForCardAngles ? 3.14 : 0}>
                            <Animate isActive={this.state.loading >= 3}
                                     duration={1500}
                                     to={this.state.loading === 3 ? 1 : 0}
                                     from={this.state.loading === 3 ? 0 : 1}
                                     attributeName="opacity">
                                <Box
                                    width={this.measureAuthCardWidth()}
                                    style={{margin: '15% 0% 0% 0%', opacity: 0}}>
                                    <Card
                                        width={this.measureAuthCardWidth()}
                                        style={{borderRadius: '12px 12px 12px 12px', zIndex: '2', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)'}}>
                                        <Box
                                            width={'100%'}
                                            height={this.measureAuthCardHeight()}>
                                            <Box
                                                width={
                                                    this.graphicsHandler.width < this.mobileWidth ?
                                                        '100%' :
                                                        '49%'
                                                }
                                                height={this.measureAuthCardHeight()}
                                                style={{float: 'left'}}>
                                                <form style={{display: (this.state.verification === true) ? 'block' : 'none'}}>
                                                    <FullCenterLayout>
                                                        <TextField
                                                            id="vCodeInput"
                                                            label="کد تایید"
                                                            style={{width: '80%', marginTop: '56px'}}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div style={{width: '48px'}}>
                                                                        <VerifiedUserIcon
                                                                            component={svgProps => {
                                                                                return (
                                                                                    <svg {...svgProps}>
                                                                                        <defs>
                                                                                            <linearGradient
                                                                                                id="gradient0">
                                                                                                <stop offset="30%"
                                                                                                      stopColor={blue[400]}/>
                                                                                                <stop offset="70%"
                                                                                                      stopColor={red[400]}/>
                                                                                            </linearGradient>
                                                                                        </defs>
                                                                                        {React.cloneElement(svgProps.children[0], {
                                                                                            fill: 'url(#gradient0)',
                                                                                        })}
                                                                                    </svg>
                                                                                );
                                                                            }}/>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </FullCenterLayout>
                                                </form>
                                                <form style={{display: (this.state.verification !== true) ? 'block' : 'none'}}>
                                                    <FullCenterLayout>
                                                        <TextField
                                                            id="loginUsernameInput"
                                                            label="نام کاربری"
                                                            style={{width: '80%', marginTop: '56px'}}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div style={{width: '48px'}}>
                                                                        <PersonIcon
                                                                            component={svgProps => {
                                                                                return (
                                                                                    <svg {...svgProps}>
                                                                                        <defs>
                                                                                            <linearGradient
                                                                                                id="gradient1">
                                                                                                <stop offset="30%"
                                                                                                      stopColor={blue[400]}/>
                                                                                                <stop offset="70%"
                                                                                                      stopColor={red[400]}/>
                                                                                            </linearGradient>
                                                                                        </defs>
                                                                                        {React.cloneElement(svgProps.children[0], {
                                                                                            fill: 'url(#gradient1)',
                                                                                        })}
                                                                                    </svg>
                                                                                );
                                                                            }}/>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </FullCenterLayout>
                                                    <FullCenterLayout>
                                                        <TextField
                                                            id="loginPasswordInput"
                                                            className={clsx(classes.margin, classes.textField)}
                                                            type={this.state.showPassword ? 'text' : 'password'}
                                                            label="رمز عبور"
                                                            style={{width: '80%', marginTop: '24px'}}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div style={{width: '48px'}}>
                                                                        <VpnKeyIcon
                                                                            component={svgProps => {
                                                                                return (
                                                                                    <svg {...svgProps}>
                                                                                        <defs>
                                                                                            <linearGradient
                                                                                                id="gradient2">
                                                                                                <stop offset="30%"
                                                                                                      stopColor={green[400]}/>
                                                                                                <stop offset="70%"
                                                                                                      stopColor={yellow[600]}/>
                                                                                            </linearGradient>
                                                                                        </defs>
                                                                                        {React.cloneElement(svgProps.children[0], {
                                                                                            fill: 'url(#gradient2)',
                                                                                        })}
                                                                                    </svg>
                                                                                );
                                                                            }}/>
                                                                    </div>
                                                                ),
                                                                endAdornment: (
                                                                    <div style={{width: '48px'}}>
                                                                        <IconButton
                                                                            href={''}
                                                                            style={{outline: 'none'}}
                                                                            onClick={() => {
                                                                                this.setState({showPassword: !this.state.showPassword});
                                                                            }}>
                                                                            {this.state.showPassword ?
                                                                                <Visibility/> :
                                                                                <VisibilityOff/>}
                                                                        </IconButton>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </FullCenterLayout>
                                                    <Container
                                                        hidden={!this.state.signupForFormItems || this.graphicsHandler.width > this.mobileWidth}>
                                                        <FullCenterLayout>
                                                            <TextField
                                                                id={"registerEmailInputM"}
                                                                className={clsx(classes.margin, classes.textField)}
                                                                label="ایمیل"
                                                                style={{marginTop: '24px'}}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <div style={{width: '48px'}}>
                                                                            <EmailIcon
                                                                                component={svgProps => {
                                                                                    return (
                                                                                        <svg {...svgProps}>
                                                                                            <defs>
                                                                                                <linearGradient
                                                                                                    id="gradient7">
                                                                                                    <stop
                                                                                                        offset="30%"
                                                                                                        stopColor={purple[400]}/>
                                                                                                    <stop
                                                                                                        offset="70%"
                                                                                                        stopColor={grey[400]}/>
                                                                                                </linearGradient>
                                                                                            </defs>
                                                                                            {React.cloneElement(svgProps.children[0], {
                                                                                                fill: 'url(#gradient7)',
                                                                                            })}
                                                                                        </svg>
                                                                                    );
                                                                                }}/>
                                                                        </div>
                                                                    )
                                                                }}
                                                            />
                                                        </FullCenterLayout>
                                                        <FullCenterLayout>
                                                            <TextField
                                                                id="registerFirstNameInputM"
                                                                className={clsx(classes.margin, classes.textField)}
                                                                label="نام"
                                                                style={{marginTop: '24px'}}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <div style={{width: '48px'}}>
                                                                            <TextFormatIcon
                                                                                component={svgProps => {
                                                                                    return (
                                                                                        <svg {...svgProps}>
                                                                                            <defs>
                                                                                                <linearGradient
                                                                                                    id="gradient8">
                                                                                                    <stop
                                                                                                        offset="30%"
                                                                                                        stopColor={purple[400]}/>
                                                                                                    <stop
                                                                                                        offset="70%"
                                                                                                        stopColor={grey[400]}/>
                                                                                                </linearGradient>
                                                                                            </defs>
                                                                                            {React.cloneElement(svgProps.children[0], {
                                                                                                fill: 'url(#gradient8)',
                                                                                            })}
                                                                                        </svg>
                                                                                    );
                                                                                }}/>
                                                                        </div>
                                                                    )
                                                                }}
                                                            />
                                                        </FullCenterLayout>
                                                        <FullCenterLayout>
                                                            <TextField
                                                                id="registerLastNameInputM"
                                                                className={clsx(classes.margin, classes.textField)}
                                                                label="نام خانوادگی"
                                                                style={{marginTop: '24px'}}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <div style={{width: '48px'}}>
                                                                            <TextFormatIcon
                                                                                component={svgProps => {
                                                                                    return (
                                                                                        <svg {...svgProps}>
                                                                                            <defs>
                                                                                                <linearGradient
                                                                                                    id="gradient9">
                                                                                                    <stop
                                                                                                        offset="30%"
                                                                                                        stopColor={purple[400]}/>
                                                                                                    <stop
                                                                                                        offset="70%"
                                                                                                        stopColor={grey[400]}/>
                                                                                                </linearGradient>
                                                                                            </defs>
                                                                                            {React.cloneElement(svgProps.children[0], {
                                                                                                fill: 'url(#gradient9)',
                                                                                            })}
                                                                                        </svg>
                                                                                    );
                                                                                }}/>
                                                                        </div>
                                                                    )
                                                                }}
                                                            />
                                                        </FullCenterLayout>
                                                        <FullCenterLayout>
                                                            <TextField
                                                                id="registerPhoneInputM"
                                                                className={clsx(classes.margin, classes.textField)}
                                                                label="تلفن"
                                                                style={{marginTop: '24px'}}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <div style={{width: '48px'}}>
                                                                            <PhoneIcon
                                                                                component={svgProps => {
                                                                                    return (
                                                                                        <svg {...svgProps}>
                                                                                            <defs>
                                                                                                <linearGradient
                                                                                                    id="gradient10">
                                                                                                    <stop
                                                                                                        offset="30%"
                                                                                                        stopColor={purple[400]}/>
                                                                                                    <stop
                                                                                                        offset="70%"
                                                                                                        stopColor={grey[400]}/>
                                                                                                </linearGradient>
                                                                                            </defs>
                                                                                            {React.cloneElement(svgProps.children[0], {
                                                                                                fill: 'url(#gradient10)',
                                                                                            })}
                                                                                        </svg>
                                                                                    );
                                                                                }}/>
                                                                        </div>
                                                                    )
                                                                }}
                                                            />
                                                        </FullCenterLayout>
                                                    </Container>
                                                </form>
                                                <Container hidden={this.state.signupForFormItems || this.state.verification} height={'32px'}>
                                                    <FullCenterLayout>
                                                        <Box height={'32px'}
                                                             style={{width: '100%', marginTop: '12px', marginRight: -32}}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        color={lightBlue[700]}/>
                                                                }
                                                                label="به خاطر سپاری رمز عبور"/>
                                                        </Box>
                                                    </FullCenterLayout>
                                                </Container>
                                                <FullCenterLayout>
                                                    <Box
                                                        marginTop={'2em'}
                                                        style={{width: '80%'}}>
                                                        <Link component="button"
                                                              variant="body2"
                                                              onClick={() => {
                                                                  let currState = this.state.signupForCardAngles;
                                                                  currState = !currState;
                                                                  if (this.state.verification === true) {
                                                                    this.setState({signupForCardAngles: false, verification: false});
                                                                    setTimeout(() => {
                                                                        this.setState({signupForFormItems: false});
                                                                        if (this.graphicsHandler.width < this.mobileWidth && this.state.signupForFormItems) {
                                                                            document.body.style.overflow = 'auto';
                                                                        } else {
                                                                            document.body.style.overflow = 'hidden';
                                                                        }
                                                                    }, 700);
                                                                  }
                                                                  else {
                                                                    this.setState({signupForCardAngles: !this.state.signupForCardAngles, verification: false});
                                                                    if (this.graphicsHandler.width < this.mobileWidth && !currState) {
                                                                      this.scrollTopTargetRef.current.scrollIntoView({behavior: 'smooth'});
                                                                    }
                                                                    setTimeout(() => {
                                                                      this.setState({signupForFormItems: !this.state.signupForFormItems});
                                                                      if (this.graphicsHandler.width < this.mobileWidth && this.state.signupForFormItems) {
                                                                          document.body.style.overflow = 'auto';
                                                                      } else {
                                                                          document.body.style.overflow = 'hidden';
                                                                      }
                                                                    }, 700);
                                                                  }
                                                              }}>
                                                                  {this.state.verification ? 'حساب کاربری دارید ؟' : this.state.signupForFormItems ? 'حساب کاربری دارید ؟' : 'می خواهید حساب کاربری جدید بسازید ؟'}
                                                        </Link>
                                                    </Box>
                                                </FullCenterLayout>
                                            </Box>
                                            <Container
                                                width={'1px'}
                                                height={this.signupForFormItems ? this.measureAuthCardHeight() : this.measureAuthCardHeight()}
                                                hidden={this.graphicsHandler.width < this.mobileWidth || !this.state.signupForFormItems}>
                                                <Box
                                                    marginTop={this.graphicsHandler.dpToPx(1.5)}
                                                    width={'1px'}
                                                    height={this.measureAuthCardHeight()}
                                                    style={{backgroundColor: '#999', float: 'left'}}>
                                                </Box>
                                            </Container>
                                            <Box
                                                width={'50%'}
                                                hidden={this.state.signupForFormItems || (this.graphicsHandler.width < this.mobileWidth)}
                                                style={{
                                                    float: 'right',
                                                    backgroundColor: '#0288d1',
                                                    height: '100%'
                                                }}>
                                                <FullCenterLayout><h3
                                                    style={{marginTop: '56px', color: '#ffffff'}}>به پروژه ی </h3></FullCenterLayout>
                                                <FullCenterLayout><h2 style={{marginTop: '12px', color: '#fff'}}>مارلیک</h2>
                                                </FullCenterLayout>
                                                <FullCenterLayout><h3
                                                    style={{marginTop: '12px', color: '#ffffff'}}> خوش آمدید.</h3></FullCenterLayout>
                                                <FullCenterLayout><h6 style={{
                                                    marginTop: '24px',
                                                    marginLeft: '24px',
                                                    marginRight: '24px',
                                                    color: '#ffffff'
                                                }}>جادو در جزئیات است.</h6>
                                                </FullCenterLayout>
                                            </Box>
                                            <Container
                                                style={{width: '50%', float: 'right'}}
                                                hidden={!this.state.signupForFormItems || this.graphicsHandler.width < this.mobileWidth}>
                                                <form>
                                                    <FullCenterLayout>
                                                        <TextField
                                                            id="registerEmailInput"
                                                            label="ایمیل"
                                                            style={{marginTop: '56px'}}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div style={{width: '48px'}}>
                                                                        <EmailIcon
                                                                            component={svgProps => {
                                                                                return (
                                                                                    <svg {...svgProps}>
                                                                                        <defs>
                                                                                            <linearGradient
                                                                                                id="gradient3">
                                                                                                <stop offset="30%"
                                                                                                      stopColor={purple[400]}/>
                                                                                                <stop offset="70%"
                                                                                                      stopColor={grey[400]}/>
                                                                                            </linearGradient>
                                                                                        </defs>
                                                                                        {React.cloneElement(svgProps.children[0], {
                                                                                            fill: 'url(#gradient3)',
                                                                                        })}
                                                                                    </svg>
                                                                                );
                                                                            }}/>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </FullCenterLayout>
                                                    <FullCenterLayout>
                                                        <TextField
                                                            id="registerFirstNameInput"
                                                            label="نام"
                                                            style={{marginTop: '24px'}}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div style={{width: '48px'}}>
                                                                        <TextFormatIcon
                                                                            component={svgProps => {
                                                                                return (
                                                                                    <svg {...svgProps}>
                                                                                        <defs>
                                                                                            <linearGradient
                                                                                                id="gradient4">
                                                                                                <stop offset="30%"
                                                                                                      stopColor={purple[400]}/>
                                                                                                <stop offset="70%"
                                                                                                      stopColor={grey[400]}/>
                                                                                            </linearGradient>
                                                                                        </defs>
                                                                                        {React.cloneElement(svgProps.children[0], {
                                                                                            fill: 'url(#gradient4)',
                                                                                        })}
                                                                                    </svg>
                                                                                );
                                                                            }}/>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </FullCenterLayout>
                                                    <FullCenterLayout>
                                                        <TextField
                                                            id="registerLastNameInput"
                                                            label="نام خانوادگی"
                                                            style={{marginTop: '24px'}}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div style={{width: '48px'}}>
                                                                        <TextFormatIcon
                                                                            component={svgProps => {
                                                                                return (
                                                                                    <svg {...svgProps}>
                                                                                        <defs>
                                                                                            <linearGradient
                                                                                                id="gradient5">
                                                                                                <stop offset="30%"
                                                                                                      stopColor={purple[400]}/>
                                                                                                <stop offset="70%"
                                                                                                      stopColor={grey[400]}/>
                                                                                            </linearGradient>
                                                                                        </defs>
                                                                                        {React.cloneElement(svgProps.children[0], {
                                                                                            fill: 'url(#gradient5)',
                                                                                        })}
                                                                                    </svg>
                                                                                );
                                                                            }}/>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </FullCenterLayout>
                                                    <FullCenterLayout>
                                                        <TextField
                                                            id="registerPhoneInput"
                                                            label="تلفن"
                                                            style={{marginTop: '24px', marginBottom: '48px'}}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <div style={{width: '48px'}}>
                                                                        <PhoneIcon
                                                                            component={svgProps => {
                                                                                return (
                                                                                    <svg {...svgProps}>
                                                                                        <defs>
                                                                                            <linearGradient
                                                                                                id="gradient6">
                                                                                                <stop offset="30%"
                                                                                                      stopColor={purple[400]}/>
                                                                                                <stop offset="70%"
                                                                                                      stopColor={grey[400]}/>
                                                                                            </linearGradient>
                                                                                        </defs>
                                                                                        {React.cloneElement(svgProps.children[0], {
                                                                                            fill: 'url(#gradient6)',
                                                                                        })}
                                                                                    </svg>
                                                                                );
                                                                            }}/>
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    </FullCenterLayout>
                                                </form>
                                            </Container>
                                        </Box>
                                    </Card>
                                    <Box width={this.graphicsHandler.width < this.mobileWidth ? '100%' : '50%'}
                                        style={{transform: this.graphicsHandler.width >= this.mobileWidth ? 'translateX(-100%)' : 'translateX(0)'}}>
                                        <FullCenterLayout>
                                            <LoginButton
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    if (this.state.verification) {
                                                        let requestOptions = {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                email: phone,
                                                                vCode: document.getElementById('vCodeInput').value,
                                                            }),
                                                            redirect: 'follow'
                                                        };
                                                        fetch(serverRoot + "/auth/verify", requestOptions)
                                                          .then(response => response.json())
                                                          .then(result => {
                                                            console.log(JSON.stringify(result));
                                                            if (result.status === 'success') {
                                                              setMe(result.user);
                                                              setToken(result.session.token);
                                                              localStorage.setItem('token', result.session.token);
                                                              document.getElementById('vCodeInput').value = '';
                                                              gotoPage('/app/home');
                                                            }
                                                          })
                                                          .catch(error => console.log('error', error));
                                                    }
                                                    else if (!this.state.signupForFormItems) {
                                                        let requestOptions = {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                username: document.getElementById('loginUsernameInput').value,
                                                                password: document.getElementById('loginPasswordInput').value,
                                                            }),
                                                            redirect: 'follow'
                                                        };
                                                        fetch(serverRoot + "/auth/login", requestOptions)
                                                          .then(response => response.json())
                                                          .then(result => {
                                                            console.log(JSON.stringify(result));
                                                            if (result.status === 'success') {
                                                              setMe(result.user);
                                                              setToken(result.session.token);
                                                              localStorage.setItem('token', result.session.token);
                                                              ConnectToIo();
                                                              document.getElementById('loginUsernameInput').value = '';
                                                              document.getElementById('loginPasswordInput').value = '';
                                                              let requestOptions4 = {
                                                                method: 'POST',
                                                                headers: {
                                                                  'Content-Type': 'application/json',
                                                                  'token': result.session.token
                                                                },
                                                                redirect: 'follow'
                                                              };
                                                              fetch(serverRoot + "/auth/fetch_config", requestOptions4)
                                                                .then(response => response.json())
                                                                .then(res => {
                                                                    console.log(JSON.stringify(res));
                                                                    setConfig(res.config);
                                                                    gotoPage('/app/home');
                                                                });
                                                            }
                                                          })
                                                          .catch(error => console.log('error', error));
                                                    }
                                                    else {
                                                        let requestOptions = {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                username: document.getElementById('loginUsernameInput').value,
                                                                password: document.getElementById('loginPasswordInput').value,
                                                                phone: document.getElementById('registerPhoneInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value,
                                                                email: document.getElementById('registerEmailInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value,
                                                                firstName: document.getElementById('registerFirstNameInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value,
                                                                lastName: document.getElementById('registerLastNameInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value
                                                            }),
                                                            redirect: 'follow'
                                                        };
                                                        fetch(serverRoot + "/auth/register", requestOptions)
                                                          .then(response => response.json())
                                                          .then(result => {
                                                            console.log(JSON.stringify(result));
                                                            if (result.status === 'success') {
                                                              setPhone(document.getElementById('registerEmailInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value);
                                                              document.getElementById('loginUsernameInput').value = '';
                                                              document.getElementById('loginPasswordInput').value = '';
                                                              document.getElementById('registerPhoneInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value = '';
                                                              document.getElementById('registerEmailInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value = '';
                                                              document.getElementById('registerFirstNameInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value = '';
                                                              document.getElementById('registerLastNameInput' + (this.graphicsHandler.width <= this.mobileWidth ? 'M' : '')).value = '';
                                                              this.setState({verification: true, signupForCardAngles: false});
                                                              setTimeout(() => {
                                                                this.setState({signupForFormItems: false});
                                                              }, 750);
                                                            }
                                                          })
                                                          .catch(error => console.log('error', error));
                                                    }
                                                }}
                                                style={{
                                                    outline: 'none',
                                                    position: 'relative',
                                                    top: '-24px',
                                                    width: '100px',
                                                    height: '48px',
                                                    zIndex: '3',
                                                }}>
                                                { this.state.verification ? 'تایید' : this.state.signupForFormItems ? 'ثبت نام کن' : 'وارد شو'}
                                            </LoginButton>
                                        </FullCenterLayout>
                                    </Box>
                                </Box>
                            </Animate>
                        </AnimatedRotation>
                    </AnimatedPosition>
                </FullCenterLayout>
            </div>
        );
    }
}
