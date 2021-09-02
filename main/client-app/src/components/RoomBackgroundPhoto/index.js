import {
  AppBar,
  Button,
  ButtonGroup,
  Card,
  Fab,
  Toolbar,
  Typography,
} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import { ArrowForward, Search } from '@material-ui/icons'
import React, { useEffect } from 'react'
import { useFilePicker } from 'use-file-picker'
import {
  isDesktop,
  isInRoom,
  isMobile,
  isTablet,
  popPage,
  registerDialogOpen,
} from '../../App'
import { ChromePicker, CirclePicker } from 'react-color'
import GradientPicker from '../GradientPicker'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { token } from '../../util/settings'
import { serverRoot, useForceUpdate } from '../../util/Utils'
import { setWallpaper } from '../..'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

let pickingFile = false

function RoomBackgroundPhoto(props) {
  let forceUpdate = useForceUpdate()
  const [open, setOpen] = React.useState(true)
  registerDialogOpen(setOpen)

  let [uploadedFile, setUploadedFile] = React.useState(undefined)

  const handleClose = () => {
    setOpen(false)
    setTimeout(popPage, 250)
  }
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
  })

  useEffect(() => {
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
    fetch(serverRoot + '/room/get_room_wallpaper', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result))
        let wall = JSON.parse(result.wallpaper)
        if (wall.type === 'photo') {
          setUploadedFile({id: wall.photoId})
          setWallpaper(
            serverRoot +
              `/file/download_file?token=${token}&roomId=${props.room_id}&fileId=${wall.photoId}`,
          )
        } else if (wall.type === 'color') {
          setWallpaper(wall.color)
        }
      })
      .catch((error) => console.log('error', error))
  }, [])

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
            ext === 'gif' ||
            ext === 'svg'
              ? 'photo'
              : ext === 'wav' ||
                ext === 'mpeg' ||
                ext === 'mp4' ||
                ext === 'mp3'
              ? 'audio'
              : ext === 'webm' ||
                ext === 'mkv' ||
                ext === 'flv' ||
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
              let requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  token: token,
                },
                body: JSON.stringify({
                  roomId: props.roomId,
                  title: props.room.title,
                  avatarId: props.room.avatarId,
                  wallpaper: JSON.stringify({
                    type: 'photo',
                    photoId: JSON.parse(request.responseText).file.id,
                  }),
                }),
                redirect: 'follow',
              }
              fetch(serverRoot + '/room/update_room', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(JSON.stringify(result))
                  setUploadedFile(JSON.parse(request.responseText).file)
                  setWallpaper(
                    serverRoot +
                      `/file/download_file?token=${token}&roomId=${
                        props.roomId
                      }&fileId=${JSON.parse(request.responseText).file.id}`,
                  )
                })
                .catch((error) => console.log('error', error))
            }
          }

          request.open(
            'POST',
            serverRoot +
              `/file/upload_file?token=${token}&roomId=${props.roomId}&extension=${ext}`,
          )

          request.upload.addEventListener('progress', function (e) {
            let percent_completed = (e.loaded * 100) / e.total
            f.progress = percent_completed
            if (percent_completed === 100) {
              f.local = false
            }
            forceUpdate()
          })
          if (FileReader) {
            let fr = new FileReader()
            fr.readAsDataURL(file)
          }
          request.send(data)
        })
    }
  }, [loading])

  return (
    <div
      style={{
        ...(!isDesktop() && { position: 'absolute', top: 0, left: 0 }),
        height: isMobile() || isTablet() ? '100%' : 650,
        width: isMobile() || isTablet() ? '100%' : 500,
      }}
    >
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 80px - 48px)',
          marginTop: 64,
        }}
      >
        <img
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          }}
          src={
            serverRoot +
            `/file/download_file?token=${token}&roomId=${props.roomId}&fileId=${
              uploadedFile === undefined ? 0 : uploadedFile.id}`
          }
        />

        <Button
          onClick={() => {
            pickingFile = true
            openFileSelector()
          }}
          variant={'contained'}
          style={{
            fontSize: 18,
            direction: 'ltr',
            width: '100%',
            height: 68,
            marginTop: -16,
          }}
          color={'secondary'}
          startIcon={<CloudUploadIcon style={{ width: 28, height: 28 }} />}
        >
          آپلود
        </Button>
      </div>
    </div>
  )
}
export default RoomBackgroundPhoto
