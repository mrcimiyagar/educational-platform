import { Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowForward } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { isDesktop } from '../../App';
import { colors } from '../../util/settings';
import PublicIcon from '@mui/icons-material/Public';

export default function SpacesSearchbar(props) {

  const useStyles = makeStyles((theme) => ({
    root: {
      direction: 'rtl',
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      ...((isDesktop()) && {maxWidth: 450}),
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: colors.field,
      backdropFilter: colors.blur,
      borderRadius: 24
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      textAlign: 'center',
      color: colors.text
    }
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

  return (
    <Paper className={classes.root} {...props}>
      <IconButton onClick={() => props.onBackClicked()} className={classes.iconButton}>
        <ArrowForward style={{fill: colors.icon}}/>
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="جستجو در آسمان"
        classes={{
          input: classesInput.InputBaseStyle
        }}
        style={{ color: colors.text, marginRight: 8, textAlign: 'center' }}
      />
      <IconButton>
        <SearchIcon style={{fill: colors.icon}}/>
      </IconButton>
      <IconButton onClick={() => props.onGlobeClicked()}>
        <PublicIcon style={{fill: colors.accent}}/>
      </IconButton>
    </Paper>
  );
}
