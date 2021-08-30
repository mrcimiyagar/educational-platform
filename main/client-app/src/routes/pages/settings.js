import { AppBar, Drawer, Toolbar, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import { ArrowForward, Search } from '@material-ui/icons'
import React from 'react'
import {
  isDesktop,
  isInRoom,
  isMobile,
  isTablet,
  popPage,
  registerDialogOpen,
} from '../../App'
import { CirclePicker } from 'react-color'
import RoomWallpaperPicker from '../../components/RoomWallpaperPicker'
import RoomSettings from '../../components/RoomSettings'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function SettingsPage(props) {
  const [open, setOpen] = React.useState(true)
  registerDialogOpen(setOpen)
  let [backgroundOpen, setBackgroundOpen] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
    setTimeout(popPage, 250)
  }

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
        backdropFilter: !(isDesktop() && isInRoom()) ? 'blur(10px)' : undefined,
      }}
    >
      <div
        style={{
          ...(!isDesktop() && { position: 'absolute', top: 0, left: 0 }),
          height: isMobile() || isTablet() ? '100%' : 650,
          width: isMobile() || isTablet() ? '100%' : 500,
        }}
      >
        <AppBar
          position={'static'}
          style={{
            width: '100%',
            height: 64,
            backgroundColor: 'rgba(21, 96, 233, 0.65)',
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
              style={{ position: 'absolute', right: 16 + 32 + 16 }}
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

        <RoomSettings roomId={props.room_id}/>
        
      </div>
    </Dialog>
  )
}
export default SettingsPage
