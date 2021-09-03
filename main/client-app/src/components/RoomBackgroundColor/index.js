import Slide from '@material-ui/core/Slide'
import React, { useEffect } from 'react'
import { ChromePicker } from 'react-color'
import { setWallpaper } from '../..'
import {
  isDesktop, isMobile,
  isTablet,
  registerDialogOpen
} from '../../App'
import { token } from '../../util/settings'
import { serverRoot } from '../../util/Utils'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function RoomBackgroundColor(props) {

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
        <ChromePicker onChange={(color, event) => {
          let requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
            body: JSON.stringify({
              roomId: props.roomId,
              title: props.room.title,
              avatarId: props.room.avatarId,
              wallpaper: JSON.stringify({
                type: 'color',
                color: color.hex
              })
            }),
            redirect: 'follow',
          }
          fetch(serverRoot + '/room/update_room', requestOptions)
            .then((response) => response.json())
            .then((result) => {
              console.log(JSON.stringify(result))
              setWallpaper({
                type: 'color',
                color: color.hex
              })
            })
            .catch((error) => console.log('error', error))
        }}
        />
      </div>
    </div>
  )
}
export default RoomBackgroundColor
