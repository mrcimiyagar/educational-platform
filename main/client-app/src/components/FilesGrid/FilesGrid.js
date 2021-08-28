import { Card, IconButton, ImageList, ImageListItem, makeStyles } from '@material-ui/core';
import { PlayArrowTwoTone } from '@material-ui/icons';
import React, { useEffect } from 'react';
import Viewer from 'react-viewer';
import { gotoPage, isDesktop } from '../../App';
import { colors, me, token } from "../../util/settings";
import { serverRoot, socket, useForceUpdate } from "../../util/Utils";
import Progressbar from "../Progress/Progressbar";

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      marginTop: (isDesktop === 'desktop' && window.location.pathname === '/app/room') ? 64 : 16,
      width: (isDesktop === 'desktop' && window.location.pathname === '/app/room') ? 'calc(100% - 64px)' : '100%',
      borderRadius: (isDesktop === 'desktop' && window.location.pathname === '/app/room') ? 24 : undefined,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(15px)',
      marginRight: (isDesktop === 'desktop' && window.location.pathname === '/app/room') ? 32 : undefined,
      marginLeft: (isDesktop === 'desktop' && window.location.pathname === '/app/room') ? 32 : undefined
    },
    imageList: {
      paddingTop: 16,
      width: '100%',
      height: (isDesktop === 'desktop' && window.location.pathname === '/app/room') ? 'calc(100% - 112px)' : 'calc(100% - 112px - 72px)',
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }));

export default function FilesGrid(props) {

    let forceUpdate = useForceUpdate();

    let classes = useStyles()

    socket.off('file-added');
    socket.on('file-added', (f) => {
        console.log(f);
        if (f.uploaderId !== me.id) {
            f.progress = 100;
            props.files.push(f);
            props.setFiles(props.files);
            forceUpdate();
        }
    });

    let [photoViewerVisible, setPhotoViewerVisible] = React.useState(false)
    let [currentPhotoSrc, setCurrentPhotoSrc] = React.useState('')
    let [covers, setCovers] = React.useState(props.files.map(file => ''))

    useEffect(() => {
        if (props.fileType === 'audio') {
        props.files.forEach((file, index) => {
            var tags = {};
            window.jsmediatags.read(serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.id}`, {
               onSuccess: function(tag) {
                  tags = tag;
                  var picture = tags.tags.picture; // create reference to track art
                  var base64String = "";
                  for (var i = 0; i < picture.data.length; i++) {
                      base64String += String.fromCharCode(picture.data[i]);
                  }
                  var imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);
                  covers[index] = imageUri
                  setCovers(covers)
                  forceUpdate()
                }, 
               onError: function(error) {
                  console.log(error);
               }
            }); 
        });
        }
    }, [props.files])

    let cols = Math.floor(window.innerWidth / 300)

    return (
        <div style={{width: '100%', position: 'relative', overflow: 'hidden', height: '100%'}}>
            <div className={classes.root}>
                <Viewer
                    zIndex={99999}
                    style={{position: 'fixed', left: 0, top: 0}}
                    visible={photoViewerVisible}
                    onClose={() => {setPhotoViewerVisible(false);}}
                    images={[{src: currentPhotoSrc, alt: ''}]}
                />
                <ImageList rowHeight={180} className={classes.imageList} cols={cols}>
                    {props.files.reverse().map((file, index) => {
                        return <ImageListItem key={file.id} cols={1}>
                            <Card style={{backgroundColor: colors.primaryLight, width: 'calc(100% - 32px)', marginTop: 8, marginLeft: 16, marginRight: 16, height: 128, direction: 'rtl'}}>
                                <div style={{width: '100%', height: '100%'}}>
                                    <div style={{display: 'flex', position: 'relative', width: '100%', height: '100%'}}>
                                      {
                                        <img onClick={() => {
                                            if (props.fileType === 'photo') {
                                                setCurrentPhotoSrc(file.local ? file.src : serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.id}`);
                                                setPhotoViewerVisible(true)
                                            }
                                        }} style={{width: '100%', height: '100%'}} key={index} alt="Thumbnail" src={(props.fileType === 'photo' || props.fileType === 'video') ?
                                            (file.local ? file.src : serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.previewFileId}`) :
                                            (covers[index])    
                                        } />
                                      }
                                      {
                                          props.fileType === 'video' ?
                                            <IconButton
                                                onClick={() => {
                                                    gotoPage('/app/videoplayer', {src: file.local ? file.src : serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.id}`})
                                                }}
                                                style={{width: 40, height: 40, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                                                <PlayArrowTwoTone style={{width: 40, height: 40}}/>
                                            </IconButton> :
                                            props.fileType === 'audio' ?
                                                <IconButton
                                                    onClick={() => {
                                                        gotoPage('/app/audioplayer', {room_id: props.roomId, src: file.local ? file.src : serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.id}`})
                                                    }}
                                                    style={{backgroundColor: '#fff', borderRadius: '50%', width: 40, height: 40, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                                                    <PlayArrowTwoTone style={{width: 40, height: 40}}/>
                                                </IconButton> :
                                                null
                                      }
                                    </div>
                                </div>
                                <div style={{marginTop: -24, marginLeft: 24, marginRight: 24, display: file.local === true ? 'block' : 'none'}}>
                                    <Progressbar progress={file.progress}/>
                                </div>
                            </Card>
                        </ImageListItem>
                    })}
                </ImageList>
            </div>
        </div>
    );
}
