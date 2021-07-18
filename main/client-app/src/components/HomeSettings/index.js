import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { Container, Fab, Toolbar } from '@material-ui/core';
import NotifsList from '../NotifsList';
import SettingsList from '../SettingsList';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function HomeSettings() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
        <SettingsList/>
    </div>
  )
}
