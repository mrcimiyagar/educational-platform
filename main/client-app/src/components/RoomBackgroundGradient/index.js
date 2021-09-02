import Slide from '@material-ui/core/Slide'
import React, { useEffect } from 'react'
import { ChromePicker } from 'react-color'
import {
  isDesktop, isMobile,
  isTablet,
  registerDialogOpen
} from '../../App'
import GradientPicker from '../GradientPicker'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function RoomBackgroundGradient(props) {

  return (
    <div
      style={{
        ...(!isDesktop() && { position: 'absolute', top: 0, left: 0 }),
        height: '100%',
        width: '100%',
        position: 'relative'
      }}
    >
      <div
        style={{
          width: 'auto',
          height: 'auto',
          position: 'absolute', 
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <GradientPicker/>
      </div>
    </div>
  )
}
export default RoomBackgroundGradient
