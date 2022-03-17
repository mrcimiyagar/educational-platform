import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(10px)'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: '#333'
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
      <IconButton onClick={() => props.setDrawerOpen()} className={classes.iconButton} aria-label="menu">
        <ArrowForwardIcon style={{fill: '#333'}}/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="جستجو در تنظیمات"
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon style={{fill: '#333'}}/>
      </IconButton>
    </Paper>
  );
}
