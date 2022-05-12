import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {colors} from '../../util/settings';

export default function SettingsSearchbar(props) {
  let useStylesInput = makeStyles((theme) => ({
    InputBaseStyle: {
      "&::placeholder": {
        color: colors.text,
        textAlign: 'center'
      }
    }
  }));

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      backgroundColor: colors.field,
      backdropFilter: colors.blur,
      borderRadius: 24
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      color: '#fff',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));

  const classes = useStyles();
  const classesInput = useStylesInput();

  return (
    <div component="form" className={classes.root}>
      <IconButton onClick={() => props.setDrawerOpen()} className={classes.iconButton} aria-label="menu">
        <ArrowForwardIcon style={{fill: colors.icon}}/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="جستجو در تنظیمات"
        classes={{
          input: classesInput.InputBaseStyle
        }}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon style={{fill: colors.icon}}/>
      </IconButton>
    </div>
  );
}
