import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PhotoIcon from '@material-ui/icons/Photo';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#2196f3'
  },
});

const useStylesAction = makeStyles({
  /* Styles applied to the root element. */
  root: {
    color: '#ddd',
    '&$selected': {
      color: '#fff',
    },
  },
  /* Styles applied to the root element if selected. */
  selected: {},
});

export default function FilesBottombar(props) {
  const classes = useStyles();
  const classesAction = useStylesAction();

  return (
    <div>
      <BottomNavigation
        value={props.fileMode}
        onChange={(event, newValue) => props.setFileMode(newValue)}
        className={classes.root}
        style={{height: 56, position: 'fixed', right: 16, bottom: 16 + 72, width: 200, borderRadius: 28}}
      >
        <BottomNavigationAction value={0} classes={classesAction} showLabel={false} icon={<PhotoIcon />} />
        <BottomNavigationAction value={1} classes={classesAction} showLabel={false} icon={<AudiotrackIcon />} />
        <BottomNavigationAction value={2} classes={classesAction} showLabel={false} icon={<PlayCircleFilledIcon />} />
        <BottomNavigationAction value={3} classes={classesAction} showLabel={false} icon={<InsertDriveFileIcon />} />
      </BottomNavigation>
    </div>
  );
}
