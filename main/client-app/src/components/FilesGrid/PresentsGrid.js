import React, {Fragment, useEffect} from 'react';
import {token} from "../../util/settings";
import "dropzone/dist/min/dropzone.min.css";
import {humanFileSize, serverRoot, socket, useForceUpdate} from "../../util/Utils";
import Progressbar from "../Progress/Progressbar";
import {colors} from '../../util/settings';
import {
    Card
} from "reactstrap";

export default function PresentsGrid(props) {

    let forceUpdate = useForceUpdate();

    socket.off('present-added');
    socket.on('present-added', ({f, p}) => {
        console.log(f);
        console.log(p);
        f.progress = 100;
        props.files.unshift(f);
        props.setFiles(props.files);
        props.presents.unshift(p);
        props.setPresents(props.presents);
        forceUpdate();
    });

    return (
        <div style={{width: '100%', position: 'relative', overflowX: 'hidden', height: '100%', overflowY: 'auto'}}>
            <div style={{height: 'auto'}}>
                    {props.files.map((file, index) => {
                    return (
                        <Card style={{backgroundColor: colors.primaryLight, width: 'calc(100% - 32px)', marginTop: 8, marginLeft: 16, marginRight: 16, height: 'auto', direction: 'rtl'}} onClick={(e) => {
                            e.preventDefault();
                            props.setCurrentPresent(index);
                        }}>
                            <a href={serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.id}`} download={file.name}>
                            <div style={{display: 'flex'}}>
                                {
                                    <img key={index} alt="Thumbnail" src={file.local ? file.src : serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${file.previewFileId}`} style={{width: '100%', height: '100%'}}/>
                                }
                                <div>
                                    <Card style={{textAlign: 'center', width: 72, paddingTop: 12, marginTop: 24, color: colors.textIcons, backgroundColor: colors.primary, height: 32, marginRight: 56, borderRadius: 24}}>{humanFileSize(file.size)}</Card>
                                    <div style={{fontSize: 12, width: '100%', marginRight: 16, marginLeft: 32, textAlign: 'center', marginTop: 16}}>{file.name}</div>
                                </div>
                            </div>
                            </a>
                            <div style={{margin: 24}}>
                                <Progressbar progress={file.progress}/>
                            </div>
                        </Card>
                    )
                    })}
            </div>
        </div>
    );
}