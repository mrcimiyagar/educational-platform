const sw = require('../db/models')
const express = require('express')
const formidable = require('formidable')
const fs = require('fs')
const bodyParser = require('body-parser')
const { rootPath, parentPath } = require('../tools')
const { fromPath } = require('pdf2pic')
var path = require('path')
const { authenticateMember } = require('../users')

const router = express.Router()
let jsonParser = bodyParser.json()

router.post('/upload_present', jsonParser, async function (req, res) {
  let roomId = Number(req.query.roomId)
  let ext = req.query.extension
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canPresent) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let form = new formidable.IncomingForm()
    form.parse(req, async function (err, fields, files) {
      if (!fs.existsSync('files')) {
        fs.mkdirSync('files')
      }
      let preview = await sw.File.create({
        extension: 'png',
        uploaderId: session.userId,
        roomId: roomId,
        isPreview: true,
        isPresent: false,
        type: 'photo'
      })
      let file = await sw.File.create({
        extension: ext,
        uploaderId: session.userId,
        roomId: roomId,
        previewFileId: preview.id,
        isPreview: false,
        isPresent: true,
        type: 'document'
      })
      let present = await sw.Present.create({
        fileId: file.id,
        roomId: roomId,
        pageNumber: 1,
      })

      sw.Room.findOne({ where: { id: membership.roomId } }).then((room) => {
        room.presentId = present.id
        room.save()

        let oldPath = files.file.path
        let newPath = rootPath + '/files/' + file.id
        fs.copyFileSync(oldPath, newPath)

        if (ext === 'pdf') {
          try {
            let newPath = rootPath + '/files/' + file.id
            let previewFactoryPath =
              rootPath + '/temp/' + file.id + '_' + '.pdf'

            try {
              fs.unlinkSync(previewFactoryPath)
            } catch (ex) {}

            fs.copyFileSync(newPath, previewFactoryPath)

            for (let i = 0; i < 1000; i++) {
              if (fs.existsSync(rootPath + '/pdfPages/' + file.id + '.1.png')) {
                fs.unlinkSync(rootPath + '/pdfPages/' + file.id + '.1.png')
              }
            }

            let PDFParser = require('pdf2json')
            let pdfParser = new PDFParser()

            pdfParser.loadPDF(previewFactoryPath) // ex: ./abc.pdf

            pdfParser.on('pdfParser_dataReady', (pdfData) => {
              fs.writeFileSync(
                previewFactoryPath + '.json',
                JSON.stringify(pdfData),
              )
              width = pdfData.formImage.Width / 4.5 // pdf width
              height = pdfData.formImage.Pages[0].Height / 4.5 // page height
              const options = {
                density: 100,
                saveFilename: file.id,
                savePath: './pdfPages',
                format: 'png',
                width: width * 40,
                height: height * 40,
              }
              const convert = fromPath(previewFactoryPath, options)

              convert(1, true).then((output) => {
                console.log('converted successfully.')

                fs.writeFile(
                  rootPath + '/files/' + preview.id,
                  output.base64,
                  'base64',
                  function (err) {
                    console.log(err)
                  },
                )

                require('../server').pushTo(
                  'room_' + membership.roomId,
                  'present-added',
                  { f: file, p: present },
                )
                require('../server').pushTo(
                  'room_' + membership.roomId,
                  'present-picked',
                  present,
                )

                res.send({ status: 'success', file: file, present: present })
              })
            })
          } catch (ex) {
            console.error(ex)
          }
        } else if (
          ext === 'png' ||
          ext === 'jpg' ||
          ext === 'jpeg' ||
          ext === 'gif' ||
          ext === 'webp' ||
          ext === 'svg'
        ) {
          fs.copyFileSync(
            rootPath + '/files/' + file.id,
            rootPath + '/files/' + preview.id,
          )
          require('../server').pushTo(
            'room_' + membership.roomId,
            'present-added',
            { f: file, p: present },
          )
          require('../server').pushTo(
            'room_' + membership.roomId,
            'present-picked',
            present,
          )
          res.send({ status: 'success', file: file, present: present })
        } else {
          require('../server').pushTo(
            'room_' + membership.roomId,
            'present-added',
            { f: file, p: present },
          )
          require('../server').pushTo(
            'room_' + membership.roomId,
            'present-picked',
            present,
          )
          res.send({ status: 'success', file: file, present: present })
        }
      })
    })
  })
})

router.get('/download_present', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    sw.File.findOne({
      where: { roomId: membership.roomId, id: req.query.fileId },
    }).then(async (file) => {
      res.sendFile(rootPath + '/files/' + file.id)
    })
  })
})

router.post('/get_presents', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    sw.File.findAll({
      where: { roomId: membership.roomId, isPreview: false, isPresent: true },
    }).then((files) => {
      sw.Present.findAll({ where: { fileId: files.map((f) => f.id) } }).then(
        async function (presents) {
          let data = []
          presents.forEach(p => {
            for (let i = 0; i < files.length; i++) {
              if (files[i].id === p.fileId) {
                let f = JSON.stringify(files[i])
                f = JSON.parse(f)
                f.present = p
                data.push(f)
                break
              }
            }
          });
          res.send({ status: 'success', presents: presents, files: data })
        },
      )
    })
  })
})

router.post('/pick_present', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canPresent) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    sw.Present.findOne({
      where: { roomId: membership.roomId, id: req.body.presentId },
    }).then(async function (present) {
      if (present === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'presentation does not exist.',
        })
        return
      }
      sw.RoomSecret.findOne({ where: { roomId: membership.roomId } }).then(
        async function (room) {
          room.presentId = present.id
          room.save()
          require('../server').pushTo(
            'room_' + membership.roomId,
            'present-picked',
            present,
          )

          let fileId = present.fileId

          try {
            let newPath = rootPath + '/files/' + fileId
            let previewFactoryPath = rootPath + '/temp/' + fileId + '_' + '.pdf'

            try {
              fs.unlinkSync(previewFactoryPath)
            } catch (ex) {}

            fs.copyFileSync(newPath, previewFactoryPath)

            if (present.pageNumber < 1) {
              res.send({ status: 'error' })
            }

            for (let i = 0; i < 100; i++) {
              if (
                fs.existsSync(
                  rootPath + '/pdfPages/' + fileId + '.' + i + '.png',
                )
              ) {
                fs.unlinkSync(
                  rootPath + '/pdfPages/' + fileId + '.' + i + '.png',
                )
              }
            }

            let rawdata = fs.readFileSync(previewFactoryPath + '.json')
            let pdfData = JSON.parse(rawdata)
            width = pdfData.formImage.Width / 4.5 // pdf width
            height = pdfData.formImage.Pages[0].Height / 4.5 // page height
            const options = {
              density: 100,
              saveFilename: fileId,
              savePath: './pdfPages',
              format: 'png',
              width: width * 40,
              height: height * 40,
            }
            const convert = fromPath(previewFactoryPath, options)

            convert(present.pageNumber, true).then((output) => {
              console.log('converted successfully.')
              require('../server').pushTo(
                'room_' + membership.roomId,
                'page-switched',
                { pn: present.pageNumber, image: output.base64 },
              )
              res.send({ status: 'success' })
            })
          } catch (ex) {
            console.error(ex)
          }
        },
      )
    })
  })
})

router.post('/swich_page', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canPresent) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    sw.RoomSecret.findOne({ where: { roomId: membership.roomId } }).then(
      async function (room) {
        room.save()

        sw.Present.findOne({ where: { id: room.presentId } }).then(
          (present) => {
            present.pageNumber = req.body.pageNumber
            present.save()
            let fileId = present.fileId

            try {
              let newPath = rootPath + '/files/' + fileId
              let previewFactoryPath =
                rootPath + '/temp/' + fileId + '_' + '.pdf'

              try {
                fs.unlinkSync(previewFactoryPath)
              } catch (ex) {}

              fs.copyFileSync(newPath, previewFactoryPath)

              if (req.body.pageNumber < 1) {
                res.send({ status: 'error' })
              }

              for (let i = 0; i < 100; i++) {
                if (
                  fs.existsSync(
                    rootPath + '/pdfPages/' + fileId + '.' + i + '.png',
                  )
                ) {
                  fs.unlinkSync(
                    rootPath + '/pdfPages/' + fileId + '.' + i + '.png',
                  )
                }
              }

              let rawdata = fs.readFileSync(previewFactoryPath + '.json')
              let pdfData = JSON.parse(rawdata)
              width = pdfData.formImage.Width / 4.5 // pdf width
              height = pdfData.formImage.Pages[0].Height / 4.5 // page height
              const options = {
                density: 100,
                saveFilename: fileId,
                savePath: './pdfPages',
                format: 'png',
                width: width * 40,
                height: height * 40,
              }
              const convert = fromPath(previewFactoryPath, options)

              convert(req.body.pageNumber, true).then((output) => {
                console.log('converted successfully.')
                require('../server').pushTo(
                  'room_' + membership.roomId,
                  'page-switched',
                  { pn: req.body.pageNumber, image: output.base64 },
                )
                res.send({ status: 'success' })
              })
            } catch (ex) {
              console.error(ex)
            }
          },
        )
      },
    )
  })
})

router.post('/get_current_page', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    sw.RoomSecret.findOne({ where: { roomId: membership.roomId } }).then(
      async function (room) {
        room.save()
        sw.Present.findOne({ where: { id: room.presentId } }).then(
          (present) => {
            if (present === null) {
              res.send({ status: 'error', currentPage: '', pageNumber: 1 })
              return
            }
            let fileId = present.fileId
            try {
              let newPath = rootPath + '/files/' + fileId
              let previewFactoryPath =
                rootPath + '/temp/' + fileId + '_' + '.pdf'

              try {
                fs.unlinkSync(previewFactoryPath)
              } catch (ex) {}

              fs.copyFileSync(newPath, previewFactoryPath)

              for (let i = 0; i < 100; i++) {
                if (
                  fs.existsSync(
                    rootPath + '/pdfPages/' + fileId + '.' + i + '.png',
                  )
                ) {
                  fs.unlinkSync(
                    rootPath + '/pdfPages/' + fileId + '.' + i + '.png',
                  )
                }
              }

              let rawdata = fs.readFileSync(previewFactoryPath + '.json')
              let pdfData = JSON.parse(rawdata)
              width = pdfData.formImage.Width / 4.5 // pdf width
              height = pdfData.formImage.Pages[0].Height / 4.5 // page height
              const options = {
                density: 100,
                saveFilename: fileId,
                savePath: './pdfPages',
                format: 'png',
                width: width * 40,
                height: height * 40,
              }
              const convert = fromPath(previewFactoryPath, options)

              convert(present.pageNumber, true).then((output) => {
                console.log('converted successfully.')
                res.send({
                  status: 'success',
                  currentPage: output.base64,
                  pageNumber: present.pageNumber,
                })
              })
            } catch (ex) {
              console.error(ex)
            }
          },
        )
      },
    )
  })
})

module.exports = router
