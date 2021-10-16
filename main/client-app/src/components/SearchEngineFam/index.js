import { Slide, Zoom } from '@material-ui/core'
import { pink } from '@material-ui/core/colors'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import { Home } from '@material-ui/icons'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import ExploreIcon from '@material-ui/icons/Explore'
import LocationCityIcon from '@material-ui/icons/LocationCity'
import NavigationIcon from '@material-ui/icons/Navigation'
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import React from 'react'
import {
  animatePageChange,
  gotoPage,
  inTheGame,
  isDesktop,
  isInMessenger,
  isInRoom,
  isTablet,
  setInTheGame,
} from '../../App'
import { homeRoomId, theme } from '../../util/settings'
import { isMobile, useForceUpdate } from '../../util/Utils'
import { createTheme } from '@material-ui/core';
import Chat from '@material-ui/icons/Chat'

export let notifyUrlChanged = undefined

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: 'translateZ(0px)',
    position: 'fixed',
    flexGrow: 1,
  },
}))

const actions = [
  { icon: <Chat />, name: 'پیامرسان' },
  { icon: <LocationCityIcon />, name: 'شهر' },
  { icon: <ExploreIcon />, name: 'گردش' },
  { icon: <StoreMallDirectoryIcon />, name: 'فروشگاه' },
  { icon: <AccountBalanceIcon />, name: '+روم' },
]

export default function Jumper(props) {
  const classes = useStyles()
  let forceUpdate = useForceUpdate()
  const [open, setOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  notifyUrlChanged = () => {
    forceUpdate()
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div
      className={classes.root}
      style={{
        bottom:
          window.location.pathname === '/app/searchengine'
            ? 0
            : isInMessenger() && isDesktop()
            ? -12
            : window.location.pathname === '/app/home'
            ? isMobile() || isTablet()
              ? -16
              : 40
            : 60,
      }}
    >
      <ThemeProvider theme={theme}>
        <Slide
          direction="left"
          in={inTheGame}
          mountOnEnter
          unmountOnExit
          {...{ timeout: 1000 }}
        >
          <SpeedDial
            ariaLabel=""
            color={'secondary'}
            hidden={hidden}
            icon={<NavigationIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
          >
            {actions.map((action, index) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={() => {
                  props.setOpen(false)
                  animatePageChange()
                  if (index === 0) {
                    setInTheGame(false);
                    setTimeout(() => {
                      gotoPage('/app/messenger');
                    }, 500);
                  } else if (index === 1) {
                    setInTheGame(false);
                    setTimeout(() => {
                      gotoPage('/app/room', {room_id: homeRoomId, tab_index: 0});
                    }, 500);
                  } else if (index === 2) {
                    gotoPage('/app/searchengine')
                  } else if (index === 3) {
                    gotoPage('/app/store')
                  } else if (index === 4) {
                    gotoPage('/app/createroom')
                  }
                }}
              />
            ))}
          </SpeedDial>
        </Slide>
      </ThemeProvider>
    </div>
  )
}
