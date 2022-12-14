import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { MoreVert } from '@material-ui/icons';
import Menu from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { isDesktop, isTablet } from '../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    ...((isDesktop() || isTablet()) && {maxWidth: 450}),
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: colors.blur,
    ...((isDesktop()|| isTablet()) && {marginRight: 'calc(50% - 225px)'}),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: '#666'
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function BotsBoxSearchbar(props) {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <IconButton onClick={() => props.openMenu()} className={classes.iconButton} aria-label="menu">
        <Menu style={{fill: '#666'}}/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="جستجو در خانه"
      />
      <IconButton className={classes.iconButton}>
        <SearchIcon style={{fill: '#666'}}/>
      </IconButton>
      <IconButton className={classes.iconButton} onClick={() => {}}>
        <MoreVert style={{fill: '#666'}}/>
      </IconButton>
    </Paper>
  );
}
