import {
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { createTheme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import InvertColorsIcon from '@material-ui/icons/InvertColors'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { me, token } from '../../util/settings'
import { serverRoot } from '../../util/Utils'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import WallpaperIcon from '@material-ui/icons/Wallpaper'
import VideocamIcon from '@material-ui/icons/Videocam'
import BorderColorIcon from '@material-ui/icons/BorderColor'
import DesktopMacIcon from '@material-ui/icons/DesktopMac'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import DescriptionIcon from '@material-ui/icons/Description'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import Gradient from '@material-ui/icons/Gradient'
import RoomBackgroundPhoto from '../../components/RoomBackgroundPhoto'
import RoomBackgroundColor from '../../components/RoomBackgroundColor'
import RoomBackgroundGradient from '../../components/RoomBackgroundGradient'
import { gotoPage } from '../../App'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
      style={{ width: '100%', height: '100%' }}
    >
      {value === index && (
        <Box p={3} style={{ width: '100%', height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    direction: 'rtl',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  listRoot: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}))

export default function RoomSettings(props) {
  const classes = useStyles()
  let [room, setRoom] = React.useState({})

  const theme = createTheme({
    palette: {
      primary: {
        main: '#666',
      },
    },
  })

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/room/get_room', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        if (result.room !== undefined) {
          setRoom(result.room)
        }
      })
      .catch((error) => console.log('error', error))
  }, [])

  let [subSettingsIndex, setSubSettingsIndex] = React.useState(0)
  let [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className={classes.root}>
      <Drawer
        style={{
          zIndex: 5000,
          position: 'relative',
          width: '100%',
        }}
        anchor={'bottom'}
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
      >
        {subSettingsIndex === 1 ? (
          <div style={{ width: '100%', height: 600, backgroundColor: '#fff' }}>
            <RoomBackgroundPhoto room={room} roomId={room.id} />
          </div>
        ) : subSettingsIndex === 2 ? (
          <div style={{ width: '100%', height: 400, backgroundColor: '#fff' }}>
            <RoomBackgroundColor room={room} roomId={room.id} />
          </div>
        ) : subSettingsIndex === 3 ? (
          <div style={{ width: '100%', height: 400, backgroundColor: '#fff' }}>
            <RoomBackgroundGradient room={room} roomId={room.id} />
          </div>
        ) : null}
      </Drawer>
      <div style={{ width: '100%', height: 64 }} />
      <Avatar
        src={room.avatarId}
        style={{
          width: 112,
          height: 112,
          position: 'absolute',
          left: '50%',
          marginTop: 32,
          transform: 'translateX(-50%)',
        }}
      />
      <div style={{ width: '100%', height: 112 + 32 + 16 }} />
      <Typography
        style={{
          color: '#666',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {room.title}
      </Typography>

      <div style={{ width: '100%', height: 32 }} />
      <div>
        <List>
          <ListItem
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  پس زمینه
                </Typography>
              }
            />
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              setSubSettingsIndex(1)
              setMenuOpen(true)
            }}
            style={{ position: 'relative' }}
          >
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <WallpaperIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  عکس
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              setSubSettingsIndex(2)
              setMenuOpen(true)
            }}
            style={{ position: 'relative' }}
          >
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <InvertColorsIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  رنگ
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              setSubSettingsIndex(3)
              setMenuOpen(true)
            }}
            style={{ position: 'relative' }}
          >
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <Gradient style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  گرادیان
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem
            button
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  مدیا
                </Typography>
              }
            />
          </ListItem>
          <Divider />
          <ListItem button style={{ position: 'relative' }}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <VideocamIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  ویدئو
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />

          <ListItem button style={{ position: 'relative' }}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <DescriptionIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  فایل ها
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem
            button
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  کار گروهی
                </Typography>
              }
            />
          </ListItem>
          <Divider />
          <ListItem button style={{ position: 'relative' }}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <DesktopMacIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  بات ها
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem button style={{ position: 'relative' }}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <AssignmentTurnedInIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  تسک بورد
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem button style={{ position: 'relative' }}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <BorderColorIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  وایت بورد
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>

          <Divider />
          <ListItem
            button
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  کاربران
                </Typography>
              }
            />
          </ListItem>
          <Divider />
          <ListItem button style={{ position: 'relative' }}
            onClick={() => {
              gotoPage('/app/generate_invite_link', {room_id: props.roomId})
            }} >
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <LiveHelpIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  لینک مهمان
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem button style={{ position: 'relative' }}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <LiveHelpIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  دعوتنامه
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
          <Divider />
          <ListItem button style={{ position: 'relative' }}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <LiveHelpIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  لیست کل کاربران
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>

          <Divider />
          <ListItem
            button
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  پشتیبانی
                </Typography>
              }
            />
          </ListItem>
          <Divider />
          <ListItem button style={{ position: 'relative' }}>
            <ListItemAvatar>
              <Avatar
                style={{
                  backgroundColor: 'transparent',
                  width: 56,
                  height: 56,
                }}
              >
                <LiveHelpIcon style={{ fill: '#666' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  style={{
                    color: '#666',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: 18.5,
                    paddingRight: 16,
                  }}
                >
                  سوالات
                </Typography>
              }
            />
            <IconButton
              style={{
                width: 40,
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16,
              }}
            >
              <ArrowBackIos style={{ fill: '#666' }} />
            </IconButton>
          </ListItem>
        </List>
      </div>
    </div>
  )
}
