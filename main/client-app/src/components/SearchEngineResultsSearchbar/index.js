import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { popPage, query, setDrawerOpen } from '../../App';
import ArrowForward from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchEngineResultsSearchbar(props) {
  const classes = useStyles();

  useEffect(() => {
    let globalSearchInput = document.getElementById('globalSearchInput')
    globalSearchInput.value = query
  }, [])

  return (
    <Paper component="form" className={classes.root}>
      <IconButton onClick={() => props.handleClose()} className={classes.iconButton}>
        <ArrowForward style={{fill: '#666'}}/>
      </IconButton>
      <InputBase
        id={'globalSearchInput'}
        className={classes.input}
        placeholder="جستجو در آسمان"
        onChange={(e) => {
          props.onQueryChange(e.target.value)
        }}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}