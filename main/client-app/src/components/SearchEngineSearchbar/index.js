import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowForward } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { setQuery } from '../../App';
import { colors } from '../../util/settings';

export default function SearchEngineSearchbar(props) {

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 'calc(100% - 64px)',
      maxWidth: 350,
      backgroundColor: colors.field,
      backdropFilter: 'blur(10px)',
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

  let useStylesInput = makeStyles((theme) => ({
    InputBaseStyle: {
      "&::placeholder": {
        color: colors.text,
        textAlign: 'center'
      }
    }
  }));

  const classes = useStyles();
  const classesInput = useStylesInput();
  let [value, setValue] = React.useState('');

  return (
    <Paper component="form" className={classes.root}>
      <IconButton onClick={() => props.onBackClicked()} className={classes.iconButton}>
        <ArrowForward style={{fill: colors.icon}}/>
      </IconButton>
      <InputBase
        value={value}
        onChange={(e) => {setQuery(e.target.value); setValue(e.target.value);}}
        className={classes.input}
        placeholder="جستجو"
        classes={{
          input: classesInput.InputBaseStyle
        }}
        style={{ color: colors.text, marginRight: 8, textAlign: 'center' }}
      />
      <IconButton className={classes.iconButton}>
        <SearchIcon style={{fill: colors.icon}}/>
      </IconButton>
    </Paper>
  );
}
