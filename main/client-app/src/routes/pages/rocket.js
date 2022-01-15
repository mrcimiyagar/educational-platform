import { AppBar, Toolbar, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowForward, Search } from '@material-ui/icons'
import ViewListIcon from '@material-ui/icons/ViewList'
import React from 'react'
import { popPage } from '../../App'
import RocketDock from '../../components/RocketDock'
import RoomBottombar from '../../components/RoomBottombar'
import { PresentBox } from '../../modules/presentbox/presentbox'
import { colors } from '../../util/settings'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#ddd',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontFamily: 'mainFont',
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}))

export default function Rocket(props) {

  const urlSearchParams = new URLSearchParams(window.location.search);
  props = Object.fromEntries(urlSearchParams.entries());

  const [open, setOpen] = React.useState(true)
  const [presentOpen, setPresentMenuOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
    setTimeout(popPage, 250)
  }
  let classes = useStyles()
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
      style={{ backdropFilter: 'blur(10px)', zIndex: 99999, position: 'fixed' }}
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
        <RocketDock />
      </div>
    </Dialog>
  )
}
