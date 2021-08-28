import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { setQuery } from '../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 'calc(100% - 64px)',
    maxWidth: 350,
    backgroundColor: '#fff',
    position: 'absolute',
    left: '50%',
    top: '35%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 24
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: '#000'
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchEngineSearchbar(props) {
  const classes = useStyles();
  let [value, setValue] = React.useState('')

  return (
    <Paper component="form" className={classes.root}>
      <IconButton onClick={() => props.openMenu()} className={classes.iconButton}>
        <Menu style={{fill: '#666'}}/>
      </IconButton>
      <InputBase
        value={value}
        onChange={(e) => {setQuery(e.target.value); setValue(e.target.value);}}
        className={classes.input}
        placeholder="جستجو"
      />
      <IconButton className={classes.iconButton}>
        <SearchIcon style={{fill: '#666'}}/>
      </IconButton>
    </Paper>
  );
}
