import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginLeft: 16,
    marginRight: 16
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
]
export default function StoreHead() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList rowHeight={100} className={classes.imageList} cols={3}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} cols={item.cols || 1}>
            <img src={item.img} alt={item.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
