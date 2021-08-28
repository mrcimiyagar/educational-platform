import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { isDesktop } from '../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
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

export default function HomeSearchbar(props) {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      {isDesktop === 'desktop' ?
        null :
        <IconButton onClick={() => props.setDrawerOpen(true)} className={classes.iconButton} aria-label="menu">
          <MenuIcon />
        </IconButton>
      }
      <InputBase
        className={classes.input}
        placeholder="جستجو در آسمان"
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
