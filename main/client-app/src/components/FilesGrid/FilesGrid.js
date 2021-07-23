import React, {Fragment, useEffect} from 'react';
import {token} from "../../util/settings";
import {humanFileSize, serverRoot, socket, useForceUpdate} from "../../util/Utils";
import Progressbar from "../Progress/Progressbar";
import {colors} from '../../util/settings';
import { Card, Grid, ImageList, ImageListItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      marginTop: 32
    },
    imageList: {
        paddingTop: 16,
      width: '100%',
      height: window.innerHeight - 72 - 72 - 64 + 'px',
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
        f.progress = 100;
        props.files.push(f);
        props.setFiles(props.files);
        forceUpdate();
    });

    return (
        <div style={{width: '100%', position: 'relative', overflow: 'hidden', height: '100%'}}>
            <div className={classes.root}>
                <ImageList rowHeight={180} className={classes.imageList}>
                    {props.files.map((file, index) => (
                        <ImageListItem key={file.id}>
                            <Card style={{backgroundColor: colors.primaryLight, width: 'calc(100% - 32px)', marginTop: 8, marginLeft: 16, marginRight: 16, height: 'auto', direction: 'rtl'}}>
                                <a href={serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.id}`} download={file.name}>
                                    <div style={{display: 'flex'}}>
                                    {
                                        <img style={{width: '100%', height: '100%'}} key={index} alt="Thumbnail" src={file.local ? file.src : serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.previewFileId}`} />
                                   }
                                    </div>
                                </a>
                                <div style={{margin: 24}}>
                                    <Progressbar progress={file.progress}/>
                                </div>
                            </Card>
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
        </div>
    );
}
