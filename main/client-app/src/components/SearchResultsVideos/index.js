import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { Avatar, IconButton, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { Info, More } from '@material-ui/icons';
import MoreVert from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    marginLeft: -16,
    marginRight: -16,
    width: 'calc(100% + 32px)'
  },
  imageList: {
    width: '100%',
    height: 'auto',
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

export default function SearchResultsVideos() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ImageList rowHeight={150} gap={1} className={classes.imageList}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
          <ImageListItem key={index} cols={2} rows={2} style={{marginTop: 8}}>
            <img src={'https://material-ui.com/static/images/image-list/breakfast.jpg'} alt={'preview'} />
            <ImageListItemBar
              title={<Typography style={{marginRight: 8, marginTop: 12}}>کیهان محمدی</Typography>}
              position="top"
              actionIcon={
                <Avatar style={{width: 40, height: 40, marginRight: 16, marginTop: 12}}/>
              }
              actionPosition="right"
              className={classes.titleBar}
            />
            <IconButton style={{borderRadius: 48, backgroundColor: '#666', width: 96, height: 96, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <PlayCircleFilledIcon style={{width: 96, height: 96, fill: '#fff'}}/>
            </IconButton>
            <IconButton style={{position: 'absolute', left: 8, top: 8}}>
                <MoreVert style={{fill: '#fff'}}/>
            </IconButton>
            <ImageListItemBar
                style={{color: '#fff'}}
                title={'ویدئوی روم 101'}
                subtitle={<span>{'این ویدئو در تاریخ 28 مهر ماه ضبط شده است.'}</span>}
                actionIcon={
                    <IconButton className={classes.icon}>
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
