import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { setWallpaper } from '../..';
import { colors } from '../../util/settings';
import SettingsList from '../SettingsList';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function HomeSettings(props) {
  const classes = useStyles()

  useEffect(() => {
    setWallpaper({
      type: 'color',
      color: colors.accentDark
    });
  }, []);

  return (
    <div className={classes.root}>
        <SettingsList setDrawerOpen={props.setDrawerOpen}/>
    </div>
  )
}
