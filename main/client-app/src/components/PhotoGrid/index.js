
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { Info } from '@material-ui/icons';
import { IconButton, ImageListItemBar } from '@material-ui/core';
import { propTypes } from 'react-polls';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import EmptyIcon from '../../images/empty.png'

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

export default function PhotoGrid(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.data.length > 0 ?
          <ImageList rowHeight={140} className={classes.imageList} cols={3}>
              {props.data.map((photo) => (
                <ImageListItem key={'search-photo-' + photo.id} cols={1}>
                  <img src={serverRoot + `/file/download_file?token=${token}&roomId=${photo.roomId}&fileId=${photo.id}`} alt={''} />
                  <ImageListItemBar
                    style={{color: '#fff'}}
                    title={photo.User.firstName + ' ' + photo.User.lastName}
                    actionIcon={
                      <IconButton className={classes.icon}>
                        <Info style={{fill: '#fff'}}/>
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
          </ImageList>  :
          <div style={{width: 'calc(100% - 96px)', height: '100%', marginLeft: 48, marginRight: 48, marginTop: 80, backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', borderRadius: '50%'}}>
            <img src={EmptyIcon} style={{width: '100%', height: '100%', padding: 64}}/>
          </div>
      }
    </div>
  );
}
