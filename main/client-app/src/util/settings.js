import { createTheme } from '@material-ui/core'
import { pink, purple } from '@material-ui/core/colors'
import React, { useEffect } from 'react'
import { serverRoot, validateToken } from './Utils'

export let theme = undefined
export let colors = {}
export let setColors = (c) => {}
export let ColorBase = (props) => {
  ;[colors, setColors] = React.useState({
    primaryLight: 'rgba(24, 34, 44, 0.5)',
    primaryMedium: 'rgba(24, 34, 44, 0.85)',
    primaryDark: 'rgba(23, 29, 32, 0.85)',
    secondary: 'rgba(255, 193, 7, 0.55)',
    text: '#fff',
    textPassive: '#ddd',
    field: "rgba(91, 95, 99, 0.5)",
    icon: '#fff',
    accent: 'rgba(255, 193, 7, 1)',
    accent2: 'rgba(0, 51, 103, 1)',
    accentDark: 'rgba(173, 203, 227, 0.65)',
  });
  theme = createTheme({
    palette: {
      primary: {
        main: '#BBDEFB'
      },
      secondary: {
        main: '#FFC107'
      },
    },
  });
  return <div />
}

export let token = ''
export function setToken(t) {
  token = t
}

export let homeSpaceId = ''
export function setHomeSpaceId(t) {
  homeSpaceId = t
}

export let homeRoomId = ''
export function setHomeRoomId(t) {
  homeRoomId = t
}

export let phone = ''
export function setPhone(t) {
  phone = t
}

export let me = {}
export function setMe(m) {
  me = m
}

export let currentSurvey = {}
export function setCurrentSurvey(m) {
  currentSurvey = m
}
