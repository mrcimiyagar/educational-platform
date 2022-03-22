import { AppBar, Toolbar, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import { ArrowForward, Search } from '@material-ui/icons'
import React, { useEffect } from 'react'
import {
  isDesktop,
  isInRoom,
  isMobile,
  isTablet,
  popPage,
  registerDialogOpen,
  setInTheGame
} from '../../App'
import RoomSettings from '../../components/RoomSettings'
import { colors } from '../../util/settings'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />
})

function SettingsPage(props) {
  
  const [open, setOpen] = React.useState(true)
  registerDialogOpen(setOpen)

  const handleClose = () => {
    setOpen(false)
    setTimeout(props.onClose, 250)
  }

  useEffect(() => setInTheGame(true), []);

  return (
    <Dialog
      onTouchStart={(e) => {
        e.stopPropagation()
      }}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
      fullScreen={!isDesktop()}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      style={{
        zIndex: 2501,
      }}
    >
      <div
        style={{
          position: 'relative',
          ...(!isDesktop() && { position: 'absolute', top: 0, left: 0 }),
          height: isMobile() || isTablet() ? '100%' : 650,
          width: isMobile() || isTablet() ? '100%' : 500,
        }}
      >
        <AppBar
          position={'fixed'}
          style={{
            width: isMobile() || isTablet() ? '100%' : 516,
            height: 64,
            top: isDesktop() ? '50%' : 0,
            left: isDesktop() ? '50%' : 0,
            transform: isDesktop() ? 'translate(-258px, -390px)' : undefined,
            position: 'fixed',
            backgroundColor: colors.primaryMedium,
            backdropFilter: 'blur(10px)',
            borderRadius: isDesktop() ? '24px 24px 0 0' : undefined,
          }}
        >
          <Toolbar
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <IconButton
              style={{ width: 32, height: 32, position: 'absolute', left: 16 }}
            >
              <Search style={{ fill: '#fff' }} />
            </IconButton>
            <Typography
              variant={'h6'}
              style={{ color: '#fff', position: 'absolute', right: 16 + 32 + 16 }}
            >
              تنظیمات روم
            </Typography>
            <IconButton
              style={{ width: 32, height: 32, position: 'absolute', right: 16 }}
              onClick={() => handleClose()}
            >
              <ArrowForward style={{ fill: '#fff' }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <div
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <RoomSettings roomId={props.room_id} />
        </div>
      </div>
    </Dialog>
  )
}
export default SettingsPage
