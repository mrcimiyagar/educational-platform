import { AppBar, Toolbar, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowForward, Search } from '@material-ui/icons'
import ViewListIcon from '@material-ui/icons/ViewList'
import React from 'react'
import { popPage } from '../../App'
import { PresentBox } from '../../modules/presentbox/presentbox'
import { colors } from '../../util/settings'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />
})

export default function Deck(props) {

  const [open, setOpen] = React.useState(true)
  const [presentOpen, setPresentMenuOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
    setTimeout(props.onClose, 250)
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
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <AppBar
          style={{
            width: '100%',
            height: 64,
            backgroundColor: colors.primaryMedium,
            backdropFilter: 'blur(10px)',
            direction: 'rtl'
          }}
        >
          <Toolbar
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            <IconButton
              onClick={() => handleClose()}
            >
              <ArrowForward style={{ fill: colors.oposText }} />
            </IconButton>
            <Typography
              variant={'h6'}
              style={{ textAlign: 'right', color: colors.oposText, flex: 1 }}
            >
              تابلو
            </Typography>
            <IconButton
              onClick={() => setPresentMenuOpen(true)}
            >
              <ViewListIcon style={{ fill: colors.oposText }} />
            </IconButton>
            <IconButton>
              <Search style={{ fill: colors.oposText }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div
          style={{ width: '100%', height: 'calc(100% - 64px)', marginTop: 64 }}
        >
          <PresentBox
            style={{ display: 'block' }}
            membership={props.membership}
            setOpen={setPresentMenuOpen}
            presentOpen={presentOpen}
            roomId={props.room_id}
          />
        </div>
      </div>
    </Dialog>
  )
}
