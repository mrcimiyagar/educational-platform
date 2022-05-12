import { createTheme } from '@material-ui/core';
import React from 'react';

export const LIGHT_THEME = {
  primaryLight: 'rgba(187, 222, 251, 0.7)',
  primaryMedium: 'rgba(25, 117, 210, 0.7)',
  primaryDark: 'rgba(25, 117, 210, 0.7)',
  secondary: 'rgba(255, 193, 7, 0.55)',
  backSide: 'rgba(240, 254, 252, 0.5)',
  text: '#000',
  textPassive: '#111',
  oposText: '#fff',
  field: "rgba(245, 245, 245, 0.7)",
  icon: '#000',
  accent: 'rgba(255, 193, 7, 1)',
  accent2: 'rgba(0, 51, 103, 1)',
  accentDark: 'rgba(173, 203, 227, 0.65)',
  nonTransparentPrimaryLight: 'rgba(187, 222, 251, 1)',
  blur: 'blur(10px)'
};

export const LIGHT_THEME_SOLID = {
  primaryLight: 'rgba(187, 222, 251, 1)',
  primaryMedium: 'rgba(25, 117, 210, 1)',
  primaryDark: 'rgba(25, 117, 210, 1)',
  secondary: 'rgba(255, 193, 7, 1)',
  backSide: 'rgba(215, 215, 215, 1)',
  text: '#000',
  textPassive: '#111',
  oposText: '#fff',
  field: "rgba(245, 245, 245, 1)",
  icon: '#000',
  accent: 'rgba(255, 193, 7, 1)',
  accent2: 'rgba(0, 51, 103, 1)',
  accentDark: 'rgba(173, 203, 227, 1)',
  nonTransparentPrimaryLight: 'rgba(187, 222, 251, 1)',
  blur: undefined
};

export const DARK_THEME = {
  primaryLight: 'rgba(24, 34, 44, 0.5)',
  primaryMedium: 'rgba(24, 34, 44, 0.85)',
  primaryDark: 'rgba(23, 29, 32, 0.85)',
  secondary: 'rgba(255, 193, 7, 0.55)',
  text: '#fff',
  textPassive: '#ddd',
  oposText: '#fff',
  field: "rgba(91, 95, 99, 0.5)",
  icon: '#fff',
  accent: 'rgba(255, 193, 7, 1)',
  accent2: 'rgba(0, 51, 103, 1)',
  accentDark: 'rgba(173, 203, 227, 0.65)',
  backSide: 'rgba(23, 29, 32, 0.5)',
  nonTransparentPrimaryLight: 'rgba(24, 34, 44, 1)',
};

export let theme = undefined;
export let colors = {};
export let setColors = (c) => {};
export let themeMode = undefined;
export let setThemeMode = (tm) => {};
export let ColorBase = (props) => {
  ;[themeMode, setThemeMode] = React.useState('light');
  ;[colors, setColors] = React.useState(themeMode === localStorage.getItem('themeMode') ? LIGHT_THEME_SOLID : DARK_THEME);
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
