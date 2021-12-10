import { makeStyles } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import React from 'react'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
})

export default function BottomSheet(props) {
  return (
    <SwipeableDrawer
      anchor={'bottom'}
      open={props.open}
      onClose={() => props.setOpen(false)}
    >
      {props.children}
    </SwipeableDrawer>
  )
}
