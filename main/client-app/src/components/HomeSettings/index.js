import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { setWallpaper } from '../..';
import SettingsList from '../SettingsList';
import MainWallpaper from '../../images/home-wallpaper.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
}));

export default function HomeSettings(props) {

  const classes = useStyles()

  setWallpaper({
    type: 'photo',
    photo: MainWallpaper
  });

  return (
    <div className={classes.root}>
        <SettingsList setDrawerOpen={props.setDrawerOpen}/>
    </div>
  )
}
