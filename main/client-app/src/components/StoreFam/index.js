import { Slide, Zoom } from '@material-ui/core'
import { pink } from '@material-ui/core/colors'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import { Category, Home, Inbox } from '@material-ui/icons'
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
  currentRoomId,
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
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { SmartToy } from '@mui/icons-material'

export let notifyUrlChanged = undefined

const useStyles = makeStyles((theme) => ({
  root: {
    height: 380,
    position: 'fixed',
    flexGrow: 1,
    bottom: -56,
    left: 16 + 56 + 16
  },
}))

const actions = [
  { icon: <Category/>, name: '+دسته'},
  { icon: <Inbox/>, name: '+پکیچ'},
  { icon: <SmartToy/>, name: '+بات'},
]

export default function StoreFam(props) {
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
        <Slide
          direction="left"
          in={inTheGame}
          mountOnEnter
          unmountOnExit
          {...{ timeout: 1000 }}
        >
          <SpeedDial
            ariaLabel=""
            color={'primary'}
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
                  handleClose();
                  animatePageChange();
                  if (index === 2) {
                    gotoPage('/app/createbot');
                  }
                  else if (index === 1) {
                    gotoPage('/app/createbotpackage');
                  }
                  else if (index === 0) {
                    gotoPage('/app/createbotcategory');
                  }
                }}
              />
            ))}
          </SpeedDial>
        </Slide>
    </div>
  )
}
