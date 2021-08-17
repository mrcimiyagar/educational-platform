
import React, { useEffect, useState } from 'react';
import {Button, Card, CardBody} from 'reactstrap';
import PresentsGrid from '../../components/FilesGrid/PresentsGrid';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { token, colors } from '../../util/settings';
import { setRoomId, roomId } from '../../App'
import { roothPath, serverRoot, socket, useForceUpdate } from '../../util/Utils';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { membership } from '../../routes/pages/room';
import { Drawer, Fab, Typography } from '@material-ui/core';

let initialPage = '';

export function PresentBox(props) {
  let [currentPresent, setCp] = React.useState(0);
  let handle2 = useFullScreenHandle();
  const [numPages, setNumPages] = useState(null);
  const [files, setFiles] = React.useState([]);
  const [presents, setPresents] = React.useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isIdsAssigned, setIsIdsAssigned] = React.useState(false);
  let [viewHeight, setViewHeight] = React.useState(0);
  let [viewWidth, setViewWidth] = React.useState(0);
  let [pimgWidth, setPimgWidth] = React.useState(0);
  let [pimgHeight, setPimgHeight] = React.useState(0);
  let [pimgLoad, setPimgLoad] = React.useState(0);
  let [viewSizeX, setViewSizeX] = React.useState(0);
  let [viewSizeY, setViewSizeY] = React.useState(0);

  let forceUpdate = useForceUpdate();

  let fetchSize = (url) => {
    const img = new Image();
    img.onload = function() {
      setViewSizeX(this.width);
      setViewSizeY(this.height);
    }
    img.src = url;
  }
  useEffect(() => {
    let requestOptions4 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: roomId
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/present/get_current_page", requestOptions4)
        .then(response => response.json())
        .then(result => {
          setPageNumber(result.pageNumber);
          console.log(JSON.stringify(result));
          let pdfViewer = document.getElementById('pdfViewer');
          if (pdfViewer !== null) {
            pdfViewer.src = `data:image/png;base64,${result.currentPage}`;
            forceUpdate();
          }
        });
  }, []);
  let setCurrentPresent = (i) => {
    setCp(i);
    let requestOptions4 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: roomId,
        presentId: presents[i].id,
        pageNumber: pageNumber
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/present/pick_present", requestOptions4)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
        });
    fetchSize(serverRoot + `/file/download_file?token=${token}&roomId=${roomId}&fileId=${files[i].id}`)
  }
  let setCurrentPage = (i) => {
    setPageNumber(i);
    let requestOptions4 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        roomId: roomId,
        pageNumber: i
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/present/swich_page", requestOptions4)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
        });
  }
  socket.on('present-picked', present => {
    for (let i = 0; i < presents.length; i++) {
      if (presents[i].id === present.id) {
        setCp(i);
        break;
      }
    }
    setPageNumber(present.pageNumber);
    forceUpdate();
  });
  socket.on('page-switched', ({pn, image}) => {
    setPageNumber(pn);
    let pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.src = `data:image/png;base64,${image}`;
    forceUpdate();
  });
  let uploadBtn = React.useRef();
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    let file = event.target.files[0];
    let data = new FormData();
    data.append('file', file);
    let request = new XMLHttpRequest();
    request.open('POST', serverRoot + `/present/upload_present?token=${token}&roomId=${roomId}`);
    let f = {progress: 0, name: file.name, size: file.size, local: true};
    request.upload.addEventListener('progress', function(e) {
        let percent_completed = (e.loaded * 100 / e.total);
        if (percent_completed === 100) {
          f.local = false;
        }
    });
    if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = function () {
            f.src = fr.result;
        }
        fr.readAsDataURL(file);
    }
    request.send(data);
  }
  useEffect(() => {
    setViewWidth(document.getElementById('presentView').offsetWidth);
    setViewHeight(document.getElementById('presentView').offsetHeight);

    let requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token': token
      },
      body: JSON.stringify({
          roomId: roomId
      }),
      redirect: 'follow'
    };
    fetch(serverRoot + "/present/get_presents", requestOptions)
        .then(response => response.json())
        .then(result => {
              console.log(JSON.stringify(result));
              result.files.forEach(fi => {
                  fi.progress = 100;
              });
              result.files.reverse();
              result.presents.reverse();
              setFiles(result.files);
              setPresents(result.presents);
        })
        .catch(error => console.log('error', error));

    var pimg = document.getElementById('pimg');
    if (pimg === null) return;
    var img = new Image();
    img.src = pimg.src;
    img.onload = function() { 
      setPimgWidth(this.width);
      setPimgHeight(this.height); 
    }
  }, [pimgLoad]);
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    props.setOpen(open)
  };

  return (
    <div style={{height: 'calc(100% - 56px)', width: '100%', position: 'absolute', top: 56, 
                display: props.style.display === 'none' ? 'none' : 'block'}}>
      {(membership !== null && membership !== undefined && membership.canPresent === true) ?
        <Drawer anchor={'bottom'} style={{minHeight: 200, backgroundColor: '#fff'}} open={props.presentOpen} onClose={toggleDrawer(false)}>
          <Card style={{height: '100%', minHeight: 200 , width: '100%', backgroundColor: colors.primary}}>
            <input id="myInput"
              type="file"
              ref={(ref) => uploadBtn = ref}
              style={{display: 'none'}}
              onChange={onChangeFile}/>
            <Button color={'primary'} outline style={{width: 200, marginTop: 24, marginRight: 24, marginBottom: 32}} onClick={() => uploadBtn.click()}>آپلود فایل ارائه</Button>
            <div style={{height: 'calc(100vh - 256px)'}}>
              <PresentsGrid setIsIdsAssigned={setIsIdsAssigned} isIdsAssigned={isIdsAssigned} isPresent setCurrentPresent={setCurrentPresent} files={files} setFiles={setFiles} presents={presents} setPresents={setPresents} roomId={roomId}/>
            </div>
          </Card>
        </Drawer> :
        null
      }
      <div id={'presentView'} style={{height: '100%', width: '100%', position: 'relative', backgroundColor: 'rgba(255, 255, 255, 0.25)'}}>
        {
          (files.length > 0 ? 
            files[currentPresent].extension === 'png' || files[currentPresent].extension === 'jpg' || files[currentPresent].extension === 'jpeg' || files[currentPresent].extension === 'svg' || files[currentPresent].extension === 'gif' ?
              <img id={'pimg'} onLoad={() => {
                setPimgLoad(pimgLoad + 1);
              }} alt="Thumbnail" style={{objectFit: 'contain', width: pimgHeight > pimgWidth ? 'auto' : viewWidth,
               height: pimgHeight > pimgWidth ? viewHeight : 'auto',
               position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} 
               src={`../file/download_file?token=${token}&roomId=${roomId}&fileId=${files.length > 0 ? files[currentPresent].id : 0}`} /> :
            files[currentPresent].extension === 'pdf' ?
              <div style={{objectFit: 'contain', width: pimgHeight > pimgWidth ? 'auto' : viewWidth, height: pimgHeight > pimgWidth ? viewHeight : 'auto', 
                position: 'absolute', right: 0, top: '50%', transform: 'translate(0, -50%)'}}>
                  <img id={'pdfViewer'}/>
              </div> :
              null :
            null)
        }
        {(files.length > 0 && files[currentPresent].extension === 'pdf' && membership !== null && membership !== undefined && membership.canPresent) ? 
        (<div style={{display: 'flex', zIndex: 1900, width: 'auto', position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)'}}>
          <Fab color={'secondary'} onClick={() => {setCurrentPage(pageNumber + 1);}}><ArrowForwardIosIcon/></Fab>
          <Typography style={{backgroundColor: '#fff', width: 112, textAlign: 'center', justifyContent: 'center', alignItems: 'center', paddingTop: 12}} variant={'h6'}>{pageNumber}</Typography>
          <Fab color={'secondary'} onClick={() => {setCurrentPage(pageNumber - 1);}}><ArrowBackIosIcon/></Fab>
        </div>) :
        null
        }
      </div>
    </div>);
}