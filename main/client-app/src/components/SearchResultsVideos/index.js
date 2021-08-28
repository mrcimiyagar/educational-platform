import { Avatar, IconButton, Typography } from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { makeStyles } from '@material-ui/core/styles';
import { Info } from '@material-ui/icons';
import MoreVert from '@material-ui/icons/MoreVert';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import React from 'react';
import EmptyIcon from '../../images/empty.png';
import { token } from '../../util/settings';
import { serverRoot } from '../../util/Utils';
import './index.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    width: '100%'
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
      borderRadius: '24px 24px 0px 0px'
  },
  icon: {
    color: 'white',
  },
}));

export default function SearchResultsVideos(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.data.length > 0 ?
        <ImageList rowHeight={196} style={{width: 'calc(100% + 32px)', marginLeft: -16, marginRight: -16}} cols={2}>
          {props.data.map(video => (
            <ImageListItem key={0} cols={2} rows={2} style={{marginTop: 16}}>
            <div className={'roundImage'} style={{width: '100%', height: '100%'}}>
              <video src={serverRoot + `/file/download_file?token=${token}&roomId=${video.roomId}&fileId=${video.id}`} className={'roundImage'} style={{width: '100%', height: '100%'}}/>
            </div>
            <ImageListItemBar
              title={<Typography style={{marginRight: 8, marginTop: 24}}>{video.User.firstName + ' ' + video.User.lastName}</Typography>}
              position="top"
              actionIcon={
                <Avatar style={{width: 40, height: 40, marginRight: 16, marginTop: 24}} src={serverRoot + `/file/download_user_avatar?token=${token}&userId=${video.User.id}`}/>
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
                title={video.caption}
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
