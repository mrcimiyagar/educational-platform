import React, { useEffect, useState } from 'react'
import { Drawer, Fab, SwipeableDrawer, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { useFullScreenHandle } from 'react-full-screen'
import { Button, Card } from 'reactstrap'
import PresentsGrid from '../../components/FilesGrid/PresentsGrid'
import { membership } from '../../routes/pages/room'
import { colors, token } from '../../util/settings'
import { registerEvent, serverRoot, socket, useForceUpdate } from '../../util/Utils'
import { useFilePicker } from 'use-file-picker'
import AddIcon from '@material-ui/icons/Add'
import FilesGrid from '../../components/FilesGrid/FilesGrid'
import { isDesktop } from '../../App'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

let pickingFile = false

export function PresentBox(props) {
  let [currentPresent, setCp] = React.useState(0)
  const [numPages, setNumPages] = useState(null)
  const [files, setFiles] = React.useState([])
  const [presents, setPresents] = React.useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [isIdsAssigned, setIsIdsAssigned] = React.useState(false)
  let [pageData, setPageData] = React.useState('')

  let forceUpdate = useForceUpdate()

  useEffect(() => {
    let requestOptions4 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/present/get_current_page', requestOptions4)
      .then((response) => response.json())
      .then((result) => {
        setPageNumber(result.pageNumber)
        console.log(JSON.stringify(result))
        setPageData(result.currentPage)
        forceUpdate()
      })
  }, [])

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    readAs: 'DataURL',
  })

  useEffect(() => {
    if (!loading && pickingFile) {
      pickingFile = false
      let dataUrl = filesContent[0].content
      if (dataUrl === undefined) return
      fetch(dataUrl)
        .then((d) => d.blob())
        .then((file) => {
          let data = new FormData()
          data.append('file', file)
          let request = new XMLHttpRequest()

          let ext = filesContent[0].name.includes('.')
            ? filesContent[0].name.substr(filesContent[0].name.indexOf('.') + 1)
            : ''
          let fileType =
            ext === 'png' ||
            ext === 'jpg' ||
            ext === 'jpeg' ||
            ext === 'webp' ||
            ext === 'gif' ||
            ext === 'svg'
              ? 'photo'
              : ext === 'wav' ||
                ext === 'mpeg' ||
                ext === 'aac' ||
                ext === 'mp3'
              ? 'audio'
              : ext === 'webm' ||
                ext === 'mkv' ||
                ext === 'flv' ||
                ext === 'mp4' ||
                ext === '3gp'
              ? 'video'
              : 'document'

          let f = {
            progress: 0,
            name: file.name,
            size: file.size,
            local: true,
            src: dataUrl,
            fileType: fileType,
          }

          request.onreadystatechange = function () {
            if (request.readyState == XMLHttpRequest.DONE) {
              loadFiles()
            }
          }

          request.open(
            'POST',
            serverRoot +
              `/present/upload_present?token=${token}&roomId=${props.roomId}&extension=${ext}&isPresent=true`,
          )

          files.push(f)
          setFiles(files)
          forceUpdate()
          request.upload.addEventListener('progress', function (e) {
            let percent_completed = (e.loaded * 100) / e.total
            f.progress = percent_completed
            if (percent_completed === 100) {
              f.local = false
            }
            forceUpdate()
          })
          if (FileReader && files && files.length) {
            let fr = new FileReader()
            fr.readAsDataURL(file)
          }
          request.send(data)
        })
    }
  }, [loading])
  let setCurrentPresent = (p) => {
    for (let i = 0; i < presents.length; i++) {
      if (presents[i].id === p.id) {
        setCp(i)
        let requestOptions4 = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            roomId: props.roomId,
            presentId: p.id,
            pageNumber: pageNumber,
          }),
          redirect: 'follow',
        }
        fetch(serverRoot + '/present/pick_present', requestOptions4)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result))
          })
      }
    }
  }
  let setCurrentPage = (i) => {
    setPageNumber(i)
    let requestOptions4 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
        pageNumber: i,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/present/swich_page', requestOptions4)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
      })
  }
  registerEvent('present-picked', (present) => {
    for (let i = 0; i < presents.length; i++) {
      if (presents[i].id === present.id) {
        setCp(i)
        break
      }
    }
    setPageNumber(present.pageNumber)
    forceUpdate()
  })
  registerEvent('page-switched', ({ pn, image }) => {
    setPageNumber(pn)
    setPageData(image)
    forceUpdate()
  })

  let loadFiles = () => {
    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        roomId: props.roomId,
      }),
      redirect: 'follow',
    }
    fetch(serverRoot + '/present/get_presents', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        result.files.forEach((fi) => {
          fi.progress = 100
        })
        setFiles(result.files)
        setPresents(result.presents)
      })
      .catch((error) => console.log('error', error))
  }

  useEffect(() => loadFiles(), [])
  const toggleDrawer = (open) => (event) => {
    props.setOpen(open)
  }

  return (
    <div
      style={{
        height: 'calc(100% - 64px)',
        width: '100%',
        direction: 'rtl',
        position: 'absolute',
        top: 64,
        display: props.style.display === 'none' ? 'none' : 'block',
      }}
    >
      {membership !== null &&
      membership !== undefined &&
      membership.canPresent === true ? (
        <SwipeableDrawer
          anchor={'bottom'}
          style={{ minHeight: 200, backgroundColor: '#fff' }}
          open={props.presentOpen}
          onClose={toggleDrawer(false)}
        >
          <Card
            style={{
              height: '100%',
              minHeight: 200,
              width: '100%',
              backgroundColor: colors.primary,
            }}
          >
            <div style={{ height: 'auto' }}>
              <FilesGrid
                setIsIdsAssigned={setIsIdsAssigned}
                isIdsAssigned={isIdsAssigned}
                isPresent
                setCurrentPresent={setCurrentPresent}
                files={files}
                setFiles={setFiles}
                presents={presents}
                setPresents={setPresents}
                roomId={props.roomId}
                fileType={'document'}
                usedBy={'presents'}
              />
              <Fab
                color="secondary"
                style={{ position: 'fixed', bottom: 24, left: 24 }}
                onClick={() => {
                  pickingFile = true
                  openFileSelector()
                }}
              >
                <AddIcon />
              </Fab>
            </div>
          </Card>
        </SwipeableDrawer>
      ) : null}
      <div
        id={'presentView'}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
        }}
      >
        {files.length > 0 ? (
          files[currentPresent].extension === 'png' ||
          files[currentPresent].extension === 'jpg' ||
          files[currentPresent].extension === 'jpeg' ||
          files[currentPresent].extension === 'svg' ||
          files[currentPresent].extension === 'gif' ||
          files[currentPresent].extension === 'webp' ? (
            <TransformWrapper>
              <TransformComponent>
                <img
                  id={'pimg'}
                  alt="Thumbnail"
                  style={{
                    width: window.innerWidth + 'px',
                    height: window.innerHeight - 64 + 'px',
                    objectFit: 'contain',
                  }}
                  src={
                    serverRoot +
                    `/file/download_file?token=${token}&roomId=${
                      props.roomId
                    }&fileId=${files.length > 0 ? files[currentPresent].id : 0}`
                  }
                />
              </TransformComponent>
            </TransformWrapper>
          ) : files[currentPresent].extension === 'pdf' ? (
            <TransformWrapper>
              <TransformComponent>
                <img
                  style={{
                    width: window.innerWidth + 'px',
                    height: window.innerHeight - 64 + 'px',
                    objectFit: 'contain',
                  }}
                  id={'pdfViewer'}
                  src={`data:image/png;base64,${pageData}`}
                />
              </TransformComponent>
            </TransformWrapper>
          ) : null
        ) : null}
        {files.length > 0 &&
        files[currentPresent].extension === 'pdf' &&
        membership !== null &&
        membership !== undefined &&
        membership.canPresent ? (
          <div
            style={{
              display: 'flex',
              zIndex: 1900,
              width: 'auto',
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Fab
              color={'secondary'}
              onClick={() => {
                setCurrentPage(pageNumber + 1)
              }}
            >
              <ArrowForwardIosIcon />
            </Fab>
            <Typography
              style={{
                backgroundColor: '#fff',
                width: 112,
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 12,
              }}
              variant={'h6'}
            >
              {pageNumber}
            </Typography>
            <Fab
              color={'secondary'}
              onClick={() => {
                setCurrentPage(pageNumber - 1)
              }}
            >
              <ArrowBackIosIcon />
            </Fab>
          </div>
        ) : null}
      </div>
    </div>
  )
}
