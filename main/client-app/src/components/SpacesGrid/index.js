import { Card, Fab, Grow, Slide } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import React, { useEffect } from 'react';
import { setWallpaper } from '../..';
import { cacheSpace, fetchSpaces, gotoPage, inTheGame, isDesktop, isMobile } from '../../App';
import EmptyIcon from '../../images/empty.png';
import { colors, homeRoomId, token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import EmptySign from '../EmptySign';
import HomeToolbar from '../HomeToolbar';
import SpacesSearchbar from '../SpacesSearchbar';
import RoomWallpaper from '../../images/desktop-wallpaper.jpg';

const useStyles = makeStyles((theme) => ({
  imageList: {
    width: '100%',
    direction: 'rtl',
    paddingLeft: isDesktop() ? 112 : 16,
    paddingRight: isDesktop() ? 388 : 16,
    paddingTop: 96,
    paddingBottom: 96,
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

var lastScrollTop = 0

export default function SpacesGrid(props) {
  const classes = useStyles();

  document.documentElement.style.overflowY = 'hidden';

  let [spaces, setSpaces] = React.useState([]);
  let [visibilityAllowed, setVisibilityAllowed] = React.useState(false);

  useEffect(() => {
    let spacesSearchBarContainer = document.getElementById('spacesSearchBarContainer');
    if (spacesSearchBarContainer !== null) {
      spacesSearchBarContainer.style.transform = (inTheGame && visibilityAllowed) ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-100px)';
    }
  }, [inTheGame, visibilityAllowed]);

  useEffect(() => {

    setTimeout(() => {
      setVisibilityAllowed(true);
    }, 250);

    let spacesSearchBarContainer = document.getElementById('spacesSearchBarContainer');
    let spacesSearchBarScroller = document.getElementById('spacesSearchBarScroller');
    spacesSearchBarScroller.addEventListener(
      'scroll',
      function () {
        var st = spacesSearchBarScroller.scrollTop
        if (st > lastScrollTop) {
          spacesSearchBarContainer.style.transform = 'translateX(-50%) translateY(-100px)'
        } else {
          spacesSearchBarContainer.style.transform = 'translateX(-50%) translateY(0)'
        }
        lastScrollTop = st <= 0 ? 0 : st
      },
      false
    );

    setWallpaper({
      type: 'photo',
      photo: RoomWallpaper
    });

    fetchSpaces().then((result) => {
      setSpaces(result);
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
                if (result.spaces !== undefined) {
                  setSpaces(result.spaces);
                  result.spaces.forEach(s => {
                    cacheSpace(s);
                  });
                }
            })
            .catch(error => console.log('error', error));
    }).catch((ex) => {
      console.log(ex);
    })
  }, [])

  return (
    <div id="spacesSearchBarScroller" style={{overflow: 'auto', position: 'fixed', left: 0, top: 0, right: 0, bottom: 0}}>
      <SpacesSearchbar id="spacesSearchBarContainer" setDrawerOpen={props.setDrawerOpen}  style={{transform: 'translateX(-50%) translateY(-100px)', transition: 'transform .5s', width: '75%',
            maxWidth: 300, position: 'fixed', right: '12.5%', top: 32, zIndex: 3}}/>
      <div style={{width: '100%', position: 'fixed', height: isDesktop() ? '100%' : 'calc(100% - 64px)', backdropFilter: 'blur(15px)', backgroundColor: colors.accentDark, opacity: (inTheGame && visibilityAllowed) ? 1 : 0, transition: 'opacity 1s'}}/>
      <ImageList rowHeight={266} cols={Math.max(1, Math.floor((window.innerWidth - 112 - 240) / 200))} gap={1} className={classes.imageList} style={{zIndex: 2}}>
        {spaces.length > 0 ?
        spaces.map((item, index) => (
          <Grow in={inTheGame} {...{ timeout: (index + 1) * 500 }} transitionDuration={1000}>
          <ImageListItem key={item.img} cols={1} rows={1} onClick={() => {gotoPage('/app/room', {room_id: item.mainRoomId, tab_index: 0})}}>
            <Card style={{position: 'relative', margin: 4, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 16}}>
                <img src={'https://cdn.dribbble.com/users/6093092/screenshots/15548423/media/54c06b30c11db3ffd26b25c83ab9a737.jpg'} alt={item.title} style={{borderRadius: 16, width: '100%', height: 210}} />
                <div style={{width: '100%', height: '100%', paddingTop: 8, paddingBottom: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>{item.title}</div>
            </Card>
          </ImageListItem>
          </Grow>
        )) :
        <EmptySign/>
        }
      </ImageList>
      <Slide direction="right" in={inTheGame} mountOnEnter unmountOnExit {...{timeout: 1000}}>
      <Fab color="secondary" style={{position: 'fixed', bottom: isDesktop() ? 16 : 72 + 16, left: 16}}
           onClick={() => gotoPage('/app/room', {room_id: homeRoomId, tab_index: 0})}>
        <HomeIcon />
      </Fab>
      </Slide>
    </div>
  );
}
