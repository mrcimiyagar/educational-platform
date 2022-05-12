import { Card, Fab, Grow, Slide } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import React, { useEffect } from 'react';
import { gotoPage, inTheGame, isDesktop } from '../../App';
import EmptyIcon from '../../images/empty.png';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import EmptySign from '../EmptySign';
import HomeToolbar from '../HomeToolbar';
import SpacesSearchbar from '../SpacesSearchbar';
import {colors} from '../../util/settings';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh'
  },
  imageList: {
    paddingTop: 32,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    direction: 'rtl',
    paddingBottom: 112,
    paddingLeft: isDesktop() ? 112 : 16,
    paddingRight: 16,
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));

export default function RoomsGridList(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div style={{width: '100%', position: 'fixed', height: '100%'}}/>
      <ImageList rowHeight={250} cols={Math.max(1, Math.floor(((window.innerWidth / 2) - 112) / 150))} gap={1} className={classes.imageList} style={{zIndex: 2, overflow: 'auto' }}>
        {props.rooms.length > 0 ?
        props.rooms.map((room, index) => (
          <Grow in={inTheGame} {...{ timeout: (index + 1) * 500 }} transitionDuration={1000}>
          <ImageListItem key={room.avatarId} cols={1} rows={1} onClick={() => {
            if (props.clickCallback !== undefined) props.clickCallback(room.id);
          }}>
            <Card style={{position: 'relative', margin: 4, backdropFilter: colors.blur, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 16}}>
                <img src={'https://cdn.dribbble.com/users/6093092/screenshots/15548423/media/54c06b30c11db3ffd26b25c83ab9a737.jpg'} alt={room.title} style={{borderRadius: 16, width: '100%', height: 210}} />
                <div style={{width: '100%', height: '100%', paddingTop: 8, paddingBottom: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>{room.title}</div>
            </Card>
          </ImageListItem>
          </Grow>
        )) :
        <EmptySign/>
        }
      </ImageList>
    </div>
  );
}
