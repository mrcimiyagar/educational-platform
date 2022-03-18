import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { isDesktop } from '../../App';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: 24,
    background: 'rgba(91, 95, 99, 0.5)'
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

const useStylesInput = makeStyles((theme) => ({
  InputBaseStyle: {
    "&::placeholder": {
      color: "#fff",
      textAlign: 'center'
    }
  }
}));

export default function HomeSearchbar(props) {
  const classes = useStyles();
  const classesInput = useStylesInput();

  return (
    <div className={classes.root}>
      {isDesktop() ?
        null :
        <IconButton onClick={() => props.setBackClicked()} className={classes.iconButton} aria-label="menu">
          <ArrowForwardIcon style={{fill: '#fff'}} />
        </IconButton>
      }
      <InputBase
        className={classes.input}
        placeholder="جستجو در آسمان"
        onChange={(e) => {
          props.onSearch(e.target.value);
        }}
        classes={{
          input: classesInput.InputBaseStyle
        }}
        style={{ color: "#fff", marginRight: 8, textAlign: 'center' }}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon style={{fill: '#fff'}} />
      </IconButton>
    </div>
  );
}
