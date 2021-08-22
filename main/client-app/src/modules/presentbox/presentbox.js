
            import React, { useEffect, useState } from 'react';
            import {Button, Card, CardBody} from 'reactstrap';
            import PresentsGrid from '../../components/FilesGrid/PresentsGrid';
            import { FullScreen, useFullScreenHandle } from "react-full-screen";
            import { token, colors } from '../../util/settings';
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
              let [pageData, setPageData] = React.useState('')
            
              let forceUpdate = useForceUpdate();
            
              useEffect(() => {
                let requestOptions4 = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'token': token
                  },
                  body: JSON.stringify({
                    roomId: props.roomId
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
                        const img = new Image();
                        img.onload = function() {
                          pdfViewer.style.width = window.innerWidth + 'px'
                          pdfViewer.style.height = (window.innerWidth * img.height / img.width) + 'px'
                        }
                        img.src = `data:image/png;base64,${result.currentPage}`
                        setPageData(result.currentPage)
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
                    roomId: props.roomId,
                    presentId: presents.id,
                    pageNumber: pageNumber
                  }),
                  redirect: 'follow'
                };
                fetch(serverRoot + "/present/pick_present", requestOptions4)
                    .then(response => response.json())
                    .then(result => {
                      console.log(JSON.stringify(result));
                    })
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
                    roomId: props.roomId,
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
                if (pdfViewer !== null) {
                  const img = new Image();
                  img.onload = function() {
                    pdfViewer.style.width = window.innerWidth + 'px'
                    pdfViewer.style.height = (window.innerWidth * img.height / img.width) + 'px'
                  }
                  img.src = `data:image/png;base64,${image}`
                  setPageData(image)
                  forceUpdate();
                }
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
                request.open('POST', serverRoot + `/present/upload_present?token=${token}&roomId=${props.roomId}`);
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
                let requestOptions = {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'token': token
                  },
                  body: JSON.stringify({
                      roomId: props.roomId
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
                          setFiles(result.files.reverse());
                          setPresents(result.presents.reverse());
                    })
                    .catch(error => console.log('error', error));
              }, []);
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
                          <PresentsGrid setIsIdsAssigned={setIsIdsAssigned} isIdsAssigned={isIdsAssigned} isPresent setCurrentPresent={setCurrentPresent} files={files} setFiles={setFiles} presents={presents} setPresents={setPresents} roomId={props.roomId}/>
                        </div>
                      </Card>
                    </Drawer> :
                    null
                  }
                  <div id={'presentView'} style={{height: '100%', width: '100%', position: 'relative', backgroundColor: 'rgba(255, 255, 255, 0.25)'}}>
                    {
                      (files.length > 0 ? 
                        files[currentPresent].extension === 'png' || files[currentPresent].extension === 'jpg' || files[currentPresent].extension === 'jpeg' || files[currentPresent].extension === 'svg' || files[currentPresent].extension === 'gif' ?
                          <img id={'pimg'} alt="Thumbnail" style={{
                           position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} 
                           src={serverRoot + `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${files.length > 0 ? files[currentPresent].id : 0}`} /> :
                        files[currentPresent].extension === 'pdf' ?
                          <img id={'pdfViewer'} src={`data:image/png;base64,${pageData}`}/> :
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