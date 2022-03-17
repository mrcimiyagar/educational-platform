import { Avatar, Card, Fab, Grow, Paper, Slide, TextField, Typography, ThemeProvider } from '@material-ui/core'
import ImageList from '@material-ui/core/ImageList'
import ImageListItem from '@material-ui/core/ImageListItem'
import { makeStyles } from '@material-ui/core/styles'
import ColorLensIcon from '@material-ui/icons/ColorLens'
import DataUsageIcon from '@material-ui/icons/DataUsage'
import LanguageIcon from '@material-ui/icons/Language'
import NotificationsIcon from '@material-ui/icons/Notifications'
import SecurityIcon from '@material-ui/icons/Security'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import WebIcon from '@material-ui/icons/Web'
import WifiTetheringIcon from '@material-ui/icons/WifiTethering'
import React, { useEffect } from 'react'
import { setWallpaper } from '../..'
import { inTheGame, isDesktop, isMobile, isTablet, setBottomSheetContent, setBSO } from '../../App'
import { colors, me, theme, token } from '../../util/settings'
import HomeToolbar from '../HomeToolbar'
import SettingsSearchbar from '../SettingsSearchbar'
import RoomWallpaper from '../../images/desktop-wallpaper.jpg';
import { serverRoot } from '../../util/Utils'
import { Done, Save } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%'
  },
  imageList: {
    paddingTop: 48,
    width: '100%',
    height: 'auto',
    paddingBottom: 56,
    paddingLeft: 16,
    paddingRight: 16,
    overflow: 'hidden',
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}))

const itemData = [
  {
    icon: NotificationsIcon,
    title: 'اعلانات',
  },
  {
    icon: ColorLensIcon,
    title: 'تم',
  },
  {
    icon: WifiTetheringIcon,
    title: 'شبکه',
  },
  {
    icon: SecurityIcon,
    title: 'امنیت',
  },
  {
    icon: WebIcon,
    title: 'ظاهر',
  },
  {
    icon: DataUsageIcon,
    title: 'دیتا',
  },
  {
    icon: LanguageIcon,
    title: 'زبان',
  },
]

var lastScrollTop = 0

export default function SettingsList(props) {

  const classes = useStyles()
  
  let [visibilityAllowed, setVisibilityAllowed] = React.useState(false);

  useEffect(() => {
    let settingsSearchBarContainer = document.getElementById('settingsSearchBarContainer');
    if (settingsSearchBarContainer !== null) {
      settingsSearchBarContainer.style.transform = (inTheGame && visibilityAllowed) ? `translateX(${isDesktop() ? 'calc(-50% - 125px)' : '-50%'}) translateY(0)` : `translateX(${isDesktop() ? 'calc(-50% - 125px)' : '-50%'}) translateY(-100px)`;
    }
  }, [inTheGame, visibilityAllowed]);

  useEffect(() => {

    setTimeout(() => {
      setVisibilityAllowed(true);
    }, 250);

    let settingsSearchBarContainer = document.getElementById('settingsSearchBarContainer');
    let settingsSearchBarScroller = document.getElementById('settingsSearchBarScroller');
    settingsSearchBarScroller.addEventListener(
      'scroll',
      function () {
        var st = settingsSearchBarScroller.scrollTop
        if (st > lastScrollTop) {
          settingsSearchBarContainer.style.transform = `translateX(${isDesktop() ? 'calc(-50% - 125px)' : '-50%'}) translateY(-100px)`
        } else {
          settingsSearchBarContainer.style.transform = `translateX(${isDesktop() ? 'calc(-50% - 125px)' : '-50%'}) translateY(0)`
        }
        lastScrollTop = st <= 0 ? 0 : st
      },
      false
    );

  }, []);

  return (
    <div className={classes.root} id="settingsSearchBarScroller">
      <div
          id="settingsSearchBarContainer"
          style={{
            transform: `translateX(${isDesktop() ? 'calc(-50% - 125px)' : '-50%'}) translateY(-100px)`,
            transition: 'transform .5s', 
            width: '75%',
            maxWidth: 300,
            position: 'fixed',
            left: '50%',
            top: 32,
            zIndex: 2501,
            direction: 'rtl'
          }}
        >
          <SettingsSearchbar setDrawerOpen={props.onClose} />
      </div>
      <div style={{width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, bottom: 0, top: 0, backdropFilter: 'blur(15px)', background: colors.accentDark}} />
      <ImageList
        rowHeight={224}
        cols={2}
        gap={1}
        className={classes.imageList}
        style={{width: isDesktop() ? 'calc(100% - 32px - 280px - 144px - 16px)' : '100%', position: 'absolute', left: isDesktop() ? 72 + 32 : 0, zIndex: 1, opacity: (inTheGame && visibilityAllowed) ? 1 : 0}}
      >
        <ImageListItem
          key={'settings-my-profile-tag'}
          cols={2}
          rows={1}
          style={{ marginTop: 48, height: 96 }}
        >
          <Grow in={inTheGame} {...{ timeout: 1000 }} transitionDuration={1000}>
            <Card
              onClick={() => {
                setBottomSheetContent(
                  <div style={{width: '100%', height: 300}}>
                    <Avatar style={{zIndex: 99999, width: 150, height: 150, position: 'absolute', left: '50%', transform: 'translateX(-50%)'}} src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${me.id}`} />
                    <ThemeProvider theme={theme}>
                      <Fab color={'secondary'} style={{zIndex: 99999, position: 'absolute', left: 'calc(50% - 150px)', transform: 'translate(-50%, 47px)'}}
                         onClick={() => {
                          let requestOptions = {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              token: token,
                            },
                            body: JSON.stringify({
                              firstName: document.getElementById('profileEditFirstName').value,
                              lastName: document.getElementById('profileEditLastName').value,
                            }),
                            redirect: 'follow',
                          }
                          fetch(serverRoot + '/auth/edit_me', requestOptions)
                            .then((response) => response.json())
                            .then((result) => {
                              if (result.status === 'success') {
                                me.firstName = document.getElementById('profileEditFirstName').value;
                                me.lastName = document.getElementById('profileEditLastName').value;
                                setBSO(false);
                                setTimeout(() => {
                                  setBottomSheetContent(null);
                                }, 250);
                              }
                              else {
                                alert(result.message);
                              }
                            });
                         }}>
                      <Save />
                      </Fab>
                    </ThemeProvider>
                    <Paper style={{borderRadius: '24px 24px 0 0', width: '100%', height: 'calc(100% - 75px)', position: 'absolute', top: 100, left: 0, background: colors.accentDark, backdropFilter: 'blur(10px)'}}>
                      <TextField
                        id="profileEditFirstName"
                        defaultValue={me.firstName}
                        variant={'outlined'}
                        label={'نام'}
                        style={{marginTop: 16 + 76 + 8, marginLeft: 16, marginRight: 16, width: 'calc(100% - 32px)'}} />
                      <TextField 
                        id="profileEditLastName"
                        defaultValue={me.lastName}
                        variant={'outlined'}
                        label={'نام خاموادگی'}
                        style={{marginTop: 16, marginLeft: 16, marginRight: 16, width: 'calc(100% - 32px)'}} />
                    </Paper>
                  </div>
                );
                setBSO(true);
              }}
              style={{
                width: 'calc(100% - 64px)',
                maxWidth: 200,
                height: 48,
                borderRadius: 24,
                position: 'absolute',
                right: 16,
                transform: 'translateY(24px)',
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ padding: 8, width: 48, height: 48 }}>
                <Avatar src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${me.id}`}
                  style={{ width: '100%', height: '100%' }}
                ></Avatar>
              </div>
              <Typography style={{ fontSize: 17, marginTop: 12 }}>
                {me.firstName + ' ' + me.lastName}
              </Typography>
            </Card>
          </Grow>
        </ImageListItem>
        {itemData.map((item, index) => {
          let IconComp = item.icon
          return (
            <ImageListItem
              key={item.img}
              cols={1}
              rows={1}
              style={{
                padding: 8,
              }}
            >
              <Grow
                in={inTheGame}
                {...{ timeout: (index + 2) * 500 }}
                transitionDuration={1000}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 16,
                  }}
                >
                  <IconComp
                    style={{
                      position: 'absolute',
                      top: 32,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fill: '#2196f3',
                      width: 112,
                      height: 112,
                    }}
                  />
                  <Typography
                    style={{
                      color: '#333',
                      position: 'absolute',
                      top: 156,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.title}
                  </Typography>
                </div>
              </Grow>
            </ImageListItem>
          )
        })}
        <ImageListItem
          key={'settings-my-profile-tag'}
          cols={2}
          rows={1}
          style={{ marginTop: '100%' }}
        >
        </ImageListItem>
      </ImageList>
      <Slide direction="right" in={inTheGame} mountOnEnter unmountOnExit {...{timeout: 1000}}>
        <Fab
          color="secondary"
          style={{ position: 'fixed', bottom: 72 + 16, left: 16, zIndex: 2501 }}
        >
          <VpnKeyIcon />
        </Fab>
      </Slide>
    </div>
  )
}
