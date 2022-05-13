
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { colors } from '../../util/settings';

export default function StoreSearchbar(props) {

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: window.innerWidth > 450 ? 400 : '100%',
      borderRadius: 24,
      background: colors.field,
      height: 48
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      color: colors.text,
      textAlign: 'center'
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
        color: colors.text,
        textAlign: 'center'
      }
    }
  }));
  const classes = useStyles();
  const classesInput = useStylesInput();
  return (
    <div className={classes.root}>
      {props.removeIcon === false ? 
        <IconButton className={classes.iconButton} aria-label="menu" onClick={() => props.setDrawerOpen(true)}>
          {
            <ArrowBack style={{transform: 'rotateZ(180deg)', fill: colors.icon}}/>
          }
        </IconButton> :
        null
      }
      <InputBase
        className={classes.input}
        placeholder="جستجو در فروشگاه"
        classes={{
          input: classesInput.InputBaseStyle
        }}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon style={{fill: colors.icon}} />
      </IconButton>
    </div>
  );
}
