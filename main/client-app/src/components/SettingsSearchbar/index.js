import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(21, 96, 233, 0.65)',
    backdropFilter: 'blur(10px)'
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

export default function SettingsSearchbar(props) {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <IconButton onClick={() => props.setDrawerOpen(true)} className={classes.iconButton} aria-label="menu">
        <MenuIcon style={{fill: '#fff'}}/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="جستجو در تنظیمات"
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon style={{fill: '#fff'}}/>
      </IconButton>
    </Paper>
  );
}
