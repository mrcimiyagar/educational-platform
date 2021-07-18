import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { Avatar, Card, Fab, Typography } from '@material-ui/core';
import SpacesSearchbar from '../SpacesSearchbar';
import HomeToolbar from '../HomeToolbar';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#eee',
    width: '100%',
    height: '100vh'
  },
  imageList: {
    backgroundColor: '#eee',
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
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
{
    img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
    title: 'Room A',
    author: 'author',
    featured: true,
},
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/breakfast.jpg',
        title: 'Room A',
        author: 'author',
        featured: true,
    },
];

export default function SpacesGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HomeToolbar>
        <div style={{width: '75%', position: 'fixed', right: '12.5%', top: 32, zIndex: 3}}>
          <SpacesSearchbar/>
        </div>
      </HomeToolbar>
      <ImageList style={{zIndex: 2}} rowHeight={188} cols={3} gap={1} className={classes.imageList}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} cols={1} rows={1}>
            <div style={{position: 'relative'}}>
                <img src={item.img} alt={item.title} style={{borderRadius: 16, marginTop: 16, marginRight: '2.5%', width: '95%', height: 128}} />
                <Card style={{borderRadius: 16, width: '95%', height: 72, marginRight: '2.5%', marginTop: -32 }}>
                    <Typography style={{position: 'absolute', top: 156, left: '50%', transform: 'translateX(-50%)'}}>{item.title}</Typography>
                </Card>
            </div>
          </ImageListItem>
        ))}
      </ImageList>
      <Fab color="secondary" style={{position: 'fixed', bottom: 56 + 16, left: 16}}>
        <HomeIcon />
      </Fab>
    </div>
  );
}
