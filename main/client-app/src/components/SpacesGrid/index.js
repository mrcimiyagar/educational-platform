import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { Avatar, Card, Fab, Typography } from '@material-ui/core';
import SpacesSearchbar from '../SpacesSearchbar';
import HomeToolbar from '../HomeToolbar';
import HomeIcon from '@material-ui/icons/Home';
import { gotoPage } from '../../App';
import { token } from '../../util/settings';
import EmptyIcon from '../../images/empty.png'
import { serverRoot } from '../../util/Utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh'
  },
  imageList: {
    paddingTop: 48,
    width: '100%',
    height: 'auto',
    paddingBottom: 56,
    paddingLeft: 16,
    paddingRight: 16,
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
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

const itemData = [
  {
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Space A',
    author: 'author',
    featured: true,
},
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Space A',
        author: 'author',
        featured: true,
    },
];

export default function SpacesGrid() {
  const classes = useStyles();

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
      <HomeToolbar>
        <div style={{width: '75%', position: 'fixed', right: '12.5%', top: 32, zIndex: 3}}>
          <SpacesSearchbar/>
        </div>
      </HomeToolbar>
      <ImageList style={{zIndex: 2}} rowHeight={188} cols={3} gap={1} className={classes.imageList}>
        {spaces.length > 0 ?
        spaces.map((item) => (
          <ImageListItem key={item.img} cols={1} rows={1} onClick={() => {gotoPage('/app/room', {room_id: 1})}}>
            <Card style={{position: 'relative', margin: 4, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 16}}>
                <img src={'https://cdn.dribbble.com/users/6093092/screenshots/15548423/media/54c06b30c11db3ffd26b25c83ab9a737.jpg'} alt={item.title} style={{borderRadius: 16, width: '100%', height: 112}} />
                <div style={{width: '100%', height: '100%', paddingTop: 8, paddingBottom: 12, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>{item.title}</div>
            </Card>
          </ImageListItem>
        )) :
        <div style={{width: 'calc(100% - 96px)', height: '100%', marginLeft: 48, marginRight: 48, marginTop: 144, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
          <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
        </div>
        }
      </ImageList>
      <Fab color="secondary" style={{position: 'fixed', bottom: 72 + 16, left: 16}}>
        <HomeIcon />
      </Fab>
    </div>
  );
}
