import { createTheme } from '@material-ui/core'
import { pink } from '@material-ui/core/colors'
import React, { useEffect } from 'react'
import { serverRoot, validateToken } from './Utils'

export let theme = undefined
export let colors = {}
export let setColors = (c) => {}
export let ColorBase = (props) => {
  ;[colors, setColors] = React.useState({
    primaryLight: 'rgba(99, 172, 229, 0.75)',
    primaryMedium: 'rgba(75, 134, 180, 0.75)',
    primaryDark: 'rgba(42, 77, 105, 0.75)',
    accent: 'rgba(231, 239, 246, 0.75)',
    accentDark: 'rgba(173, 203, 227, 0.75)',
  })
  theme = createTheme({
    palette: {
      primary: {
        main: 'rgba(75, 134, 180, 0.75)',
      },
      secondary: pink,
    },
  })
  return <div />
}

export let token = ''
export function setToken(t) {
  token = t
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
