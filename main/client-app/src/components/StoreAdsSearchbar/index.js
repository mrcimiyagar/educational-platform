import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

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

export default function StoreAdsSearchbar(props) {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <IconButton onClick={() => props.setDrawerOpen(true)} className={classes.iconButton} onClick={() => props.handleClose()}>
        <ArrowForwardIcon style={{fill: '#fff'}}/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="جستجو در تبلیغات"
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon style={{fill: '#fff'}}/>
      </IconButton>
    </Paper>
  );
}
