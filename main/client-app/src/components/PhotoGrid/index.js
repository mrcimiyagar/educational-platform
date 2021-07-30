
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { Info } from '@material-ui/icons';
import { IconButton, ImageListItemBar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    marginLeft: -24,
    marginRight: -24
  },
  imageList: {
    width: '100%',
    height: 'auto',
  },
}));

const itemData = [
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 2,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 2,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 2,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 2,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 2,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 2,
    },
    {
        img: 'https://material-ui.com/static/images/image-list/vegetables.jpg',
        title: 'Image',
        author: 'author',
        cols: 1,
    },
]

export default function PhotoGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList rowHeight={140} className={classes.imageList} cols={3}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} cols={item.cols || 1}>
            <img src={item.img} alt={item.title} />
            <ImageListItemBar
              style={{color: '#fff'}}
              title={item.title}
              subtitle={<span>by: {item.author}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${item.title}`} className={classes.icon}>
                  <Info style={{fill: '#fff'}}/>
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
