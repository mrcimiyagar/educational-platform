import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { Avatar, IconButton, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { Info, More } from '@material-ui/icons';
import MoreVert from '@material-ui/icons/MoreVert';
import './index.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    marginLeft: -24,
    marginRight: -24,
    width: 'calc(100% + 48px)'
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
            <ImageListItem key={0} cols={2} rows={2} style={{marginTop: 0}}>
            <div className={'roundImage'}>
              <img src={'https://material-ui.com/static/images/image-list/breakfast.jpg'} className={'roundImage'}/>
            </div>
            <ImageListItemBar
              title={<Typography style={{marginRight: 8, marginTop: 24}}>کیهان محمدی</Typography>}
              position="top"
              actionIcon={
                <Avatar style={{width: 40, height: 40, marginRight: 16, marginTop: 24}}/>
              }
              actionPosition="right"
              className={classes.titleBar}
            />
            <IconButton style={{borderRadius: 48, backgroundImage: 'radial-gradient(white, rgba(0, 0, 0, 0))', width: 96, height: 96, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <PlayCircleFilledIcon style={{width: 96, height: 96, fill: 'rgba(0, 0, 0, 0.65)'}}/>
            </IconButton>
            <IconButton style={{position: 'absolute', left: 8, top: 8}}>
                <MoreVert style={{fill: '#fff'}}/>
            </IconButton>
            <ImageListItemBar
                style={{color: '#fff', height: 48, borderRadius: 24, marginBottom: 12, marginLeft: 12, marginRight: 12}}
                title={'این ویدئو در تاریخ 28 مهر ماه ضبط شده است'}
                actionIcon={
                    <IconButton className={classes.icon}>
                        <Info style={{fill: '#fff'}}/>
                    </IconButton>
                }
            />
          </ImageListItem>
          <ImageListItem key={1} cols={2} rows={2} style={{marginTop: 0}}>
            <div className={'roundImage'}>
              <img src={'https://material-ui.com/static/images/image-list/vegetables.jpg'} className={'roundImage'}/>
            </div>
            <ImageListItemBar
              title={<Typography style={{marginRight: 8, marginTop: 24}}>کیهان محمدی</Typography>}
              position="top"
              actionIcon={
                <Avatar style={{width: 40, height: 40, marginRight: 16, marginTop: 24}}/>
              }
              actionPosition="right"
              className={classes.titleBar}
            />
            <IconButton style={{borderRadius: 48, backgroundImage: 'radial-gradient(white, rgba(0, 0, 0, 0))', width: 96, height: 96, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <PlayCircleFilledIcon style={{width: 96, height: 96, fill: 'rgba(0, 0, 0, 0.65)'}}/>
            </IconButton>
            <IconButton style={{position: 'absolute', left: 8, top: 8}}>
                <MoreVert style={{fill: '#fff'}}/>
            </IconButton>
            <ImageListItemBar
                style={{color: '#fff', height: 48, borderRadius: 24, marginBottom: 12, marginLeft: 12, marginRight: 12}}
                title={'این ویدئو در تاریخ 28 مهر ماه ضبط شده است'}
                actionIcon={
                    <IconButton className={classes.icon}>
                        <Info style={{fill: '#fff'}}/>
                    </IconButton>
                }
            />
          </ImageListItem>
          <ImageListItem key={2} cols={2} rows={2} style={{marginTop: 0}}>
            <div className={'roundImage'}>
              <img src={'https://material-ui.com/static/images/image-list/plant.jpg'} className={'roundImage'}/>
            </div>
            <ImageListItemBar
              title={<Typography style={{marginRight: 8, marginTop: 24}}>کیهان محمدی</Typography>}
              position="top"
              actionIcon={
                <Avatar style={{width: 40, height: 40, marginRight: 16, marginTop: 24}}/>
              }
              actionPosition="right"
              className={classes.titleBar}
            />
            <IconButton style={{borderRadius: 48, backgroundImage: 'radial-gradient(white, rgba(0, 0, 0, 0))', width: 96, height: 96, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <PlayCircleFilledIcon style={{width: 96, height: 96, fill: 'rgba(0, 0, 0, 0.65)'}}/>
            </IconButton>
            <IconButton style={{position: 'absolute', left: 8, top: 8}}>
                <MoreVert style={{fill: '#fff'}}/>
            </IconButton>
            <ImageListItemBar
                style={{color: '#fff', height: 48, borderRadius: 24, marginBottom: 12, marginLeft: 12, marginRight: 12}}
                title={'این ویدئو در تاریخ 28 مهر ماه ضبط شده است'}
                actionIcon={
                    <IconButton className={classes.icon}>
                        <Info style={{fill: '#fff'}}/>
                    </IconButton>
                }
            />
          </ImageListItem>
          <ImageListItem key={3} cols={2} rows={2} style={{marginTop: 0}}>
            <div className={'roundImage'}>
              <img src={'https://material-ui.com/static/images/image-list/mushroom.jpg'} className={'roundImage'}/>
            </div>
            <ImageListItemBar
              title={<Typography style={{marginRight: 8, marginTop: 24}}>کیهان محمدی</Typography>}
              position="top"
              actionIcon={
                <Avatar style={{width: 40, height: 40, marginRight: 16, marginTop: 24}}/>
              }
              actionPosition="right"
              className={classes.titleBar}
            />
            <IconButton style={{borderRadius: 48, backgroundImage: 'radial-gradient(white, rgba(0, 0, 0, 0))', width: 96, height: 96, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <PlayCircleFilledIcon style={{width: 96, height: 96, fill: 'rgba(0, 0, 0, 0.65)'}}/>
            </IconButton>
            <IconButton style={{position: 'absolute', left: 8, top: 8}}>
                <MoreVert style={{fill: '#fff'}}/>
            </IconButton>
            <ImageListItemBar
                style={{color: '#fff', height: 48, borderRadius: 24, marginBottom: 12, marginLeft: 12, marginRight: 12}}
                title={'این ویدئو در تاریخ 28 مهر ماه ضبط شده است'}
                actionIcon={
                    <IconButton className={classes.icon}>
                        <Info style={{fill: '#fff'}}/>
                    </IconButton>
                }
            />
          </ImageListItem>
          <ImageListItem key={4} cols={2} rows={2} style={{marginTop: 0}}>
            <div className={'roundImage'}>
              <img src={'https://material-ui.com/static/images/image-list/olive.jpg'} className={'roundImage'}/>
            </div>
            <ImageListItemBar
              title={<Typography style={{marginRight: 8, marginTop: 24}}>کیهان محمدی</Typography>}
              position="top"
              actionIcon={
                <Avatar style={{width: 40, height: 40, marginRight: 16, marginTop: 24}}/>
              }
              actionPosition="right"
              className={classes.titleBar}
            />
            <IconButton style={{borderRadius: 48, backgroundImage: 'radial-gradient(white, rgba(0, 0, 0, 0))', width: 96, height: 96, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <PlayCircleFilledIcon style={{width: 96, height: 96, fill: 'rgba(0, 0, 0, 0.65)'}}/>
            </IconButton>
            <IconButton style={{position: 'absolute', left: 8, top: 8}}>
                <MoreVert style={{fill: '#fff'}}/>
            </IconButton>
            <ImageListItemBar
                style={{color: '#fff', height: 48, borderRadius: 24, marginBottom: 12, marginLeft: 12, marginRight: 12}}
                title={'این ویدئو در تاریخ 28 مهر ماه ضبط شده است'}
                actionIcon={
                    <IconButton className={classes.icon}>
                        <Info style={{fill: '#fff'}}/>
                    </IconButton>
                }
            />
          </ImageListItem>
          <ImageListItem key={5} cols={2} rows={2} style={{marginTop: 0}}>
            <div className={'roundImage'}>
              <img src={'https://material-ui.com/static/images/image-list/camera.jpg'} className={'roundImage'}/>
            </div>
            <ImageListItemBar
              title={<Typography style={{marginRight: 8, marginTop: 24}}>کیهان محمدی</Typography>}
              position="top"
              actionIcon={
                <Avatar style={{width: 40, height: 40, marginRight: 16, marginTop: 24}}/>
              }
              actionPosition="right"
              className={classes.titleBar}
            />
            <IconButton style={{borderRadius: 48, backgroundImage: 'radial-gradient(white, rgba(0, 0, 0, 0))', width: 96, height: 96, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                <PlayCircleFilledIcon style={{width: 96, height: 96, fill: 'rgba(0, 0, 0, 0.65)'}}/>
            </IconButton>
            <IconButton style={{position: 'absolute', left: 8, top: 8}}>
                <MoreVert style={{fill: '#fff'}}/>
            </IconButton>
            <ImageListItemBar
                style={{color: '#fff', height: 48, borderRadius: 24, marginBottom: 12, marginLeft: 12, marginRight: 12}}
                title={'این ویدئو در تاریخ 28 مهر ماه ضبط شده است'}
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
