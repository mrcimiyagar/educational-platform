import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { gotoPage, setDrawerOpen } from '../../App';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#2196f3'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: '#fff'
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function StoreAdsSearchbar() {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <IconButton onClick={() => setDrawerOpen(true)} className={classes.iconButton} onClick={() => gotoPage('/app/store')}>
        <ArrowForwardIcon style={{fill: '#fff'}}/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="جستجو در آسمان"
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon style={{fill: '#fff'}}/>
      </IconButton>
    </Paper>
  );
}