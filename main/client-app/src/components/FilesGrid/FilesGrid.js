import React, {Fragment, useEffect} from 'react';
import {token} from "../../util/settings";
import "dropzone/dist/min/dropzone.min.css";
import {humanFileSize, serverRoot, socket, useForceUpdate} from "../../util/Utils";
import Progressbar from "../Progress/Progressbar";
import {colors} from '../../util/settings';
import {
    Card
} from "reactstrap";
import {PdfPreview} from '../../modules/pdfpreview/pdfpreview';
import { Grid } from '@material-ui/core';

export default function FilesGrid(props) {

    let forceUpdate = useForceUpdate();

    socket.off('file-added');
    socket.on('file-added', (f) => {
        console.log(f);
        f.progress = 100;
        props.files.push(f);
        props.setFiles(props.files);
        forceUpdate();
    });

    return (
        <div style={{width: '100%', position: 'relative', overflowX: 'hidden', height: '100%', overflowY: 'auto'}}>
            <div style={{height: 'auto', paddingTop: 16}}>
            <Grid container spacing={3}>
            {props.files.map((file, index) => 
        <Grid item xs={6}>
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
        </Grid>)
            }
      </Grid>
            </div>
        </div>
    );
}
