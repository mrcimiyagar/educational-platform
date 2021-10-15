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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh'
  },
  imageList: {
    paddingTop: 48,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    direction: 'rtl',
    paddingBottom: 112,
    paddingLeft: isDesktop() ? 112 : 16,
    paddingRight: isDesktop() ? 388 : 16,
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

export default function SpacesGrid(props) {
  const classes = useStyles();

  document.documentElement.style.overflowY = 'hidden'

  let [spaces, setSpaces] = React.useState([])

  useEffect(() => {
    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      redirect: 'follow'
    };
    fetch(serverRoot + "/room/get_spaces", requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log(JSON.stringify(result));
              setSpaces(result.spaces);
          })
          .catch(error => console.log('error', error));
  }, [])

  return (
    <div className={classes.root}>
      <div style={{width: '100%', position: 'fixed', height: '100%'}}/>
      <HomeToolbar inTheGame={inTheGame}>
        <div style={{width: '75%', position: 'fixed', right: '12.5%', top: 32, zIndex: 3}}>
          <SpacesSearchbar setDrawerOpen={props.setDrawerOpen}/>
        </div>
      </HomeToolbar>
      <ImageList style={{zIndex: 2}} rowHeight={188} cols={Math.floor((window.innerWidth - 112 - 360) / 150)} gap={1} className={classes.imageList}>
        {spaces.length > 0 ?
        spaces.map((item, index) => (
          <Grow in={inTheGame} {...{ timeout: (index + 1) * 500 }} transitionDuration={1000}>
          <ImageListItem key={item.img} cols={1} rows={1} onClick={() => {gotoPage('/app/room', {room_id: 1})}}>
            <Card style={{position: 'relative', margin: 4, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 16}}>
                <img src={'https://cdn.dribbble.com/users/6093092/screenshots/15548423/media/54c06b30c11db3ffd26b25c83ab9a737.jpg'} alt={item.title} style={{borderRadius: 16, width: '100%', height: 112}} />
                <div style={{width: '100%', height: '100%', paddingTop: 8, paddingBottom: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>{item.title}</div>
            </Card>
          </ImageListItem>
          </Grow>
        )) :
        <EmptySign/>
        }
      </ImageList>
      <Slide direction="right" in={inTheGame} mountOnEnter unmountOnExit {...{timeout: 1000}}>
      <Fab color="secondary" style={{position: 'fixed', bottom: isDesktop() ? 16 : 72 + 16, left: 16}}>
        <HomeIcon />
      </Fab>
      </Slide>
    </div>
  );
}
