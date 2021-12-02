import { Slide, Zoom } from '@material-ui/core'
import { pink } from '@material-ui/core/colors'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import { Home } from '@material-ui/icons'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import ExploreIcon from '@material-ui/icons/Explore'
import ExitToApp from '@material-ui/icons/ExitToApp'
import NavigationIcon from '@material-ui/icons/Navigation'
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import React from 'react'
import {
  animatePageChange,
  db,
  gotoPage,
  histPage,
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
import { pathConfig } from '../..'

export let notifyUrlChanged = undefined

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    transform: `translateY(${isDesktop() ? -48 : -56}px) translateZ(0px)`,
    flexGrow: 1,
  },
}))

const actions = [
  { icon: <Home />, name: 'خانه' },
  { icon: <ExploreIcon />, name: 'گردش' },
  { icon: <StoreMallDirectoryIcon />, name: 'فروشگاه' },
  { icon: <AccountBalanceIcon />, name: '+روم' },
  { icon: <ExitToApp/>, name: 'خروج'},
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
                    if (histPage !== '/app/home') {
                      setInTheGame(false);
                      setTimeout(() => {
                        gotoPage('/app/home', {tab_index: 0});
                      }, 500);
                    }
                  } else if (index === 1) {
                    if (histPage !== '/app/searchengine') {
                      gotoPage('/app/searchengine');
                    }
                  } else if (index === 2) {
                    if (histPage !== '/app/store') {
                      gotoPage('/app/store');
                    }
                  } else if (index === 3) {
                    if (histPage !== '/app/createroom') {
                      gotoPage('/app/createroom');
                    }
                  } else if (index === 4) {
                    if (window.confirm('خروج از حساب ؟')) {
                      localStorage.clear();
                      db.allDocs().then(function (result) {
                        return Promise.all(result.rows.map(function (row) {
                          return db.remove(row.id, row.value.rev);
                        }));
                      }).then(function () {}).catch(function (err) {});
                      gotoPage('/app/auth');
                    }
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
