import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {
  ArrowForward,
  Attachment,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons'
import CallIcon from '@material-ui/icons/Call'
import MoreIcon from '@material-ui/icons/MoreVert'
import VideocamIcon from '@material-ui/icons/Videocam'
import React, { useEffect } from 'react'
import {
  gotoPage,
  histPage,
  isDesktop,
  isInRoom,
  isMobile,
  isTablet,
  setInTheGame,
} from '../../App'
import { setCurrentRoomNavBackup } from '../../routes/pages/room'
import { colors, token, me } from '../../util/settings'
import {
  registerEvent,
  serverRoot,
  socket,
  unregisterEvent,
} from '../../util/Utils'
import HomeToolbar from '../HomeToolbar'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    direction: 'rtl',
  },
  menuButton: {
    marginRight: -16,
  },
  search: {
    position: 'absolute',
    left: 0,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'auto',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

export default function ChatAppBar(props) {
  const classes = useStyles()

  let [tl, setTl] = React.useState('')

  useEffect(() => {
    if (socket !== undefined) {
      unregisterEvent('uploading')
      unregisterEvent('uploading', () => {
        setTl('در حال آپلود...')
      })
      unregisterEvent('uploading_done')
      unregisterEvent('uploading_done', () => {
        setTl('')
      })
      unregisterEvent('chat-typing')
      registerEvent('chat-typing', (typingList) => {
        typingList = typingList.filter((u) => {
          if (u === undefined) return false;
          if (u.id === me.id) {
            return false
          }
          return true
        })
        if (typingList.length === 0) {
          setTl('')
        } else {
          setTl('در حال نوشتن...')
        }
      })
    }
  }, [])

  return (
    <div className={classes.root}>
      <HomeToolbar>
        <AppBar
          position="fixed"
          style={{
            width: isDesktop()
              ? isInRoom()
                ? 450
                : 'calc(100% - 658px - 96px - 208px - 96px - 48px + 180px - 4px - 16px)'
              : isTablet()
              ? isInRoom()
                ? '100%'
                : 'calc(100% - 450px)'
              : '100%',
            borderRadius:
              isTablet() || isMobile()
                ? 0
                : window.location.pathname === '/app/chat' || isInRoom()
                ? 0
                : '24px 0 0 0',
            position: isDesktop() || isTablet() ? 'fixed' : undefined,
            top: isDesktop()
              ? isInRoom()
                ? props.webcamOn === true
                  ? 300
                  : 0
                : 32
              : 0,
            left: isInRoom()
              ? isDesktop()
                ? 'calc(100% - 450px)'
                : 0
              : isDesktop()
              ? 96 + 16
              : 0,
            paddingTop: 8,
            height: 64,
            backgroundColor: colors.primaryMedium,
          }}
        >
          <Toolbar
            style={{
              height: '100%',
              marginTop: isDesktop() || isTablet() ? -8 : 0,
            }}
          >
            {isMobile() || (isTablet() && isInRoom()) ? (
              <IconButton
                style={{ marginRight: -16 }}
                onClick={() => props.handleClose()}
              >
                <ArrowForward style={{ fill: '#fff' }} />
              </IconButton>
            ) : null}
            <Avatar
              style={{
                width: 28,
                height: 28,
                marginRight: isDesktop() || isTablet() ? 8 : -8,
              }}
              alt={
                props.user !== undefined && props.user !== null
                  ? props.user.firstName + ' ' + props.user.lastName
                  : props.room !== undefined && props.room !== null
                  ? props.room.title
                  : ''
              }
              src={
                props.room !== undefined && props.room !== null
                  ? serverRoot +
                    `/file/download_room_avatar?token=${token}&roomId=${props.room.id}`
                  : props.user !== undefined && props.user !== null
                  ? serverRoot +
                    `/file/download_user_avatar?token=${token}&userId=${props.user.id}`
                  : ''
              }
              onClick={() => {
                if (isInRoom()) return
                gotoPage('/app/userprofile', {
                  user_id: props.user !== undefined ? props.user.id : undefined,
                  room_id: props.room !== undefined ? props.room.id : undefined,
                })
              }}
            />
            <Typography
              variant="h6"
              style={{ fontFamily: 'mainFont', marginRight: 8, color: '#fff' }}
            >
              {props.user !== undefined && props.user !== null
                ? props.user.firstName + ' ' + props.user.lastName
                : props.room !== undefined && props.room !== null
                ? props.room.title
                : ''}
            </Typography>
            <br />
            <Typography style={{ color: '#fff', marginRight: 16 }}>
              {tl.toString()}
            </Typography>
            <div className={classes.search}>
              {props.viewCallback === undefined ? null : (
                <IconButton
                  onClick={() => {
                    props.viewCallback()
                  }}
                >
                  <VisibilityOff style={{ fill: '#fff' }} />
                </IconButton>
              )}
              {isInRoom() ? null : (
                <IconButton
                  onClick={() => {
                    setInTheGame(false)
                    setTimeout(() => {
                      gotoPage('/app/room', {
                        room_id: props.room.id,
                        tab_index: 2,
                      })
                    }, 500)
                  }}
                >
                  <VideocamIcon style={{ fill: '#fff' }} />
                </IconButton>
              )}
              {isInRoom() ? null : (
                <IconButton
                  onClick={() => {
                    props.handleCallClicked()
                    setInTheGame(false)
                    setTimeout(() => {
                      gotoPage('/app/room', {
                        room_id: props.room.id,
                        tab_index: 2,
                      })
                    }, 500)
                  }}
                >
                  <CallIcon style={{ fill: '#fff' }} />
                </IconButton>
              )}
              <IconButton>
                <MoreIcon style={{ fill: '#fff' }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </HomeToolbar>
    </div>
  )
}
