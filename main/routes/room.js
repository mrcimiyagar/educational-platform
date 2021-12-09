const { sockets, metadata } = require('../socket')
const sw = require('../db/models')
const {
  addUser,
  getRoomUsers,
  addGuestAcc,
  authenticateMember,
  guestAccsByUserId,
  removeUser,
  guestAccs,
  generateInvite,
  resolveInvite,
} = require('../users')
const tools = require('../tools')
const express = require('express')
const bodyParser = require('body-parser')
const { uuid } = require('uuidv4')
const fetch = require('node-fetch')

const router = express.Router()
let jsonParser = bodyParser.json()

router.post('/is_room_accessible', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    res.send({
      status: 'success',
      isAccessible: membership !== null && membership !== undefined,
    })
  })
})

router.post('/update_permissions', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    sw.RoomSecret.findOne({ where: { roomId: membership.roomId } }).then(
      (RoomSecret) => {
        if (
          (session.userId === req.body.targetUserId &&
            session.userId !== RoomSecret.ownerId) ||
          req.body.targetUserId === 1
        ) {
          res.send({
            status: 'error',
            errorCode: 'e0005',
            message: 'access denied.',
          })
          return
        }
        if (
          RoomSecret.ownerId === session.userId ||
          (membership.canAssignPermission &&
            req.body.targetUserId !== RoomSecret.ownerId)
        ) {
          sw.Membership.findOne({
            where: { roomId: req.body.roomId, userId: req.body.targetUserId },
          }).then((targetMem) => {
            if (targetMem === null) {
              if (req.body.targetUserId in guestAccsByUserId) {
                let temp = guestAccsByUserId[req.body.targetUserId]
                const p = Object.keys(req.body.permissions)
                  .filter((key) => key.startsWith('can'))
                  .reduce((obj, key) => {
                    obj[key] = req.body.permissions[key]
                    return obj
                  }, {})
                let userId = temp.userId
                let roomId = temp.roomId
                for (let prop in p) {
                  temp[prop] = req.body.permissions[prop]
                }
                temp.userId = userId
                temp.roomId = roomId

                if (temp.canActInVideo === true) {
                  let members = guestAccs[req.body.roomId]
                  if (members !== null && members !== undefined) {
                    for (const [key, mem] of Object.entries(members)) {
                      if (mem.userId !== temp.userId) {
                        mem.canActInVideo = false
                        require('../server').signlePushTo(
                          mem.userId,
                          'membership-updated',
                          mem,
                        )
                      }
                    }
                    sw.Membership.findAll({
                      where: { roomId: req.body.roomId },
                    }).then((mems) => {
                      mems.forEach((mem) => {
                        if (mem.userId !== temp.userId) {
                          mem.canActInVideo = false
                          mem.save()
                          require('../server').signlePushTo(
                            mem.userId,
                            'membership-updated',
                            mem,
                          )
                        }
                      })
                    })
                  }
                }
                setTimeout(() => {
                  require('../server').signlePushTo(
                    req.body.targetUserId,
                    'membership-updated',
                    temp,
                  )
                }, 5000)
                res.send({ status: 'success', permissions: temp })
                return
              }
              res.send({
                status: 'error',
                errorCode: 'e0005',
                message: 'target membership does not exist.',
              })
              return
            }
            let userId = targetMem.userId
            let roomId = targetMem.roomId
            for (let prop in req.body.permissions) {
              targetMem[prop] = req.body.permissions[prop]
            }
            targetMem.userId = userId
            targetMem.roomId = roomId
            targetMem.save()

            if (targetMem.canActInVideo === true) {
              let members = guestAccs[req.body.roomId]
              if (members !== null && members !== undefined) {
                for (const [key, mem] of Object.entries(members)) {
                  if (mem.userId !== targetMem.userId) {
                    mem.canActInVideo = false
                    require('../server').signlePushTo(
                      mem.userId,
                      'membership-updated',
                      mem,
                    )
                  }
                }
                sw.Membership.findAll({
                  where: { roomId: req.body.roomId },
                }).then((mems) => {
                  mems.forEach((mem) => {
                    if (mem.userId !== targetMem.userId) {
                      mem.canActInVideo = false
                      mem.save()
                      require('../server').signlePushTo(
                        mem.userId,
                        'membership-updated',
                        mem,
                      )
                    }
                  })
                })
              }
            }

            setTimeout(() => {
              require('../server').signlePushTo(
                req.body.targetUserId,
                'membership-updated',
                targetMem,
              )
            }, 1000)

            res.send({ status: 'success', permissions: targetMem })
          })
        } else {
          res.send({
            status: 'error',
            errorCode: 'e0005',
            message: 'access denied.',
          })
        }
      },
    )
  })
})

router.post('/get_permissions', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (req.body.targetUserId === 1) {
      res.send({ status: 'success', isAccessible: false })
      return
    }
    sw.RoomSecret.findOne({ where: { roomId: membership.roomId } }).then(
      (RoomSecret) => {
        if (
          RoomSecret.ownerId === session.userId ||
          (membership.canAssignPermission &&
            req.body.targetUserId !== RoomSecret.ownerId)
        ) {
          sw.Membership.findOne({
            where: { roomId: req.body.roomId, userId: req.body.targetUserId },
          }).then((targetMem) => {
            if (targetMem === null) {
              if (req.body.targetUserId in guestAccsByUserId) {
                let temp = guestAccsByUserId[req.body.targetUserId]
                const permissions = Object.keys(temp)
                  .filter((key) => key.startsWith('can'))
                  .reduce((obj, key) => {
                    obj[key] = temp[key]
                    return obj
                  }, {})
                res.send({ status: 'success', permissions: permissions })
                return
              }
              res.send({
                status: 'error',
                errorCode: 'e0005',
                message: 'target membership does not exist.',
              })
              return
            }

            res.send({ status: 'success', permissions: targetMem })
          })
        } else {
          res.send({
            status: 'error',
            errorCode: 'e0005',
            message: 'access denied.',
          })
        }
      },
    )
  })
})

router.post('/is_permissions_accessible', jsonParser, async function (
  req,
  res,
) {
  authenticateMember(req, res, async (membership, session, user) => {
    sw.RoomSecret.findOne({ where: { roomId: membership.roomId } }).then(
      (RoomSecret) => {
        if (
          (session.userId === req.body.targetUserId &&
            session.userId !== RoomSecret.ownerId) ||
          req.body.targetUserId === 1
        ) {
          res.send({ status: 'success', isAccessible: false })
          return
        }
        if (
          RoomSecret.ownerId === session.userId ||
          (membership.canAssignPermission &&
            req.body.targetUserId !== RoomSecret.ownerId)
        ) {
          sw.Membership.findOne({
            where: { roomId: req.body.roomId, userId: req.body.targetUserId },
          }).then((targetMem) => {
            if (targetMem === null) {
              if (req.body.targetUserId in guestAccsByUserId) {
                res.send({ status: 'success', isAccessible: true })
                return
              }
              res.send({
                status: 'error',
                errorCode: 'e0005',
                message: 'target membership does not exist.',
              })
              return
            }
            res.send({ status: 'success', isAccessible: true })
          })
        } else {
          res.send({ status: 'success', isAccessible: false })
        }
      },
    )
  })
})

router.post('/create_room', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      if (req.body.participentId !== null) {
        let p2pExistance = await sw.P2pExistance.findOne({
          where: {
            code:
              session.userId + ' ' + req.body.participentId ||
              req.body.participentId + ' ' + session.userId,
          },
        })
        if (p2pExistance !== null) {
          let room = await sw.Room.findOne({
            where: { id: p2pExistance.roomId },
          })
          res.send({
            status: 'success',
            room: room,
            message: 'room already exist.',
          })
          return
        }
      }
      let room
      let roomId = 0
      if (req.body.spaceId !== undefined) {
        let space = await sw.Space.findOne({ where: { id: req.body.spaceId } })
        if (space !== null) {
          let rs = await sw.SpaceSecret.findOne({
            where: { spaceId: req.body.spaceId },
          })
          if (rs.ownerId !== session.userId) {
            res.send({
              status: 'error',
              errorCode: 'e0005',
              message: 'access denied.',
            })
            return
          }
          room = await sw.Room.create({
            title: req.body.title,
            spaceId: req.body.spaceId,
          })
          roomId = room.id
        } else {
          room = await sw.Room.create({
            title: req.body.title,
            spaceId: req.body.spaceId,
          })
          roomId = room.id
        }
      } else {
        let space = await sw.Space.create({
          title: req.body.title,
          mainRoomId: null,
        })
        let spaceSecret = await sw.SpaceSecret.create({
          ownerId: session.userId,
          spaceId: space.id,
        })
        room = await sw.Room.create({
          title: req.body.title,
          spaceId: space.id,
        })
        space.mainRoomId = room.id
        space.save()
        roomId = room.id
      }
      let RoomSecret = await sw.RoomSecret.create({
        ownerId: session.userId,
        roomId: roomId,
      })
      let mem = await sw.Membership.create({
        userId: session.userId,
        roomId: roomId,
        ...tools.adminPermissions,
      })
      if (req.body.participentId !== undefined) {
        room.chatType = 'p2p'
        await room.save()
        let participent = await sw.User.findOne({
          where: { id: req.body.participentId },
        })
        let participentMem = await sw.Membership.create({
          userId: participent.id,
          roomId: roomId,
          ...tools.adminPermissions,
        })
        let p2pExistance = await sw.P2pExistance.create({
          code: session.userId + ' ' + req.body.participentId,
          roomId: room.id,
        })
        let roomCopy = {
          id: room.id,
          title: room.title,
          spaceId: room.spaceId,
          chatType: room.chatType,
        }
        roomCopy.participent = await sw.User.findOne({
          where: { id: session.userId },
        })
        require('../server').signlePushTo(
          req.body.participentId,
          'chat-created',
          { room: roomCopy },
        )
      } else {
        if (
          req.body.chatType === 'group' ||
          req.body.chatType === 'channel' ||
          req.body.chatType === 'bot'
        ) {
          room.chatType = req.body.chatType
          await room.save()
        }
      }

      let msg = await sw.Message.create({
        authorId: session.userId,
        time: Date.now(),
        roomId: room.id,
        text: 'روم ساخته شد',
        fileId: null,
        messageType: 'text',
      })
      let msgCopy = {
        authorId: session.userId,
        time: Date.now(),
        roomId: room.id,
        text: 'روم ساخته شد',
        fileId: null,
        messageType: 'text',
        User: await sw.User.findOne({ where: { id: session.userId } }),
      }
      require('../server').signlePushTo(
        req.body.participentId,
        'message-added',
        { msgCopy },
      )

      res.send({ status: 'success', room: room })
    },
  )
})

router.post('/delete_room', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Room.findOne({
        where: { id: req.body.roomId, ownerId: req.body.ownerId },
      }).then(async function (room) {
        if (room === null) {
          res.send({
            status: 'error',
            errorCode: 'e0005',
            message: 'room does not exist.',
          })
          return
        }
        await room.destroy()
        require('../server').pushTo('room_' + room.id, 'room-removed', room)
        res.send({ status: 'success' })
      })
    },
  )
})

router.post('/get_room', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership === null || membership === undefined) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'membership does not exist.',
      })
      return
    }
    sw.Room.findOne({ where: { id: membership.roomId } }).then(async function (
      room,
    ) {
      res.send({ status: 'success', room: room })
    })
  })
})

router.post('/get_rooms', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Membership.findAll({ where: { userId: session.userId } }).then(
        async function (memberships) {
          sw.Room.findAll({
            where: { id: memberships.map((m) => m.roomId) },
          }).then(async function (rooms) {
            res.send({ status: 'success', rooms: rooms })
          })
        },
      )
    },
  )
})

router.post('/update_room', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Membership.findOne({
        where: { userId: session.userId, roomId: req.body.roomId },
      }).then(async function (membership) {
        if (membership === null) {
          res.send({
            status: 'error',
            errorCode: 'e0005',
            message: 'membership does not exist.',
          })
          return
        }
        sw.Room.findOne({ where: { id: membership.roomId } }).then(
          async function (room) {
            room.title = req.body.title
            room.avatarId = req.body.avatarId
            await room.save()
            let roomSecret = await sw.RoomSecret.findOne({
              where: { roomId: room.id },
            })
            roomSecret.wallpaper = req.body.wallpaper
            await roomSecret.save()
            require('../server').pushTo(
              'room_' + membership.roomId,
              'room-updated',
              room,
            )
            res.send({ status: 'success' })
          },
        )
      })
    },
  )
})

router.post('/get_room_wallpaper', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'membership does not exist.',
      })
      return
    }
    sw.RoomSecret.findOne({ where: { roomId: membership.roomId } }).then(
      async function (roomSecret) {
        res.send({ status: 'success', wallpaper: roomSecret.wallpaper })
      },
    )
  })
})

router.post('/get_spaces_for_invitation', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Membership.findAll({ where: { userId: session.userId } }).then(
        async function (memberships) {
          sw.Room.findAll({
            where: { id: memberships.filter(m => m.canInviteToRoom === true).map(m => m.roomId) },
          }).then(async function (rooms) {
            sw.Space.findAll({
              where: {
                id: rooms
                  .map((r) => r.spaceId)
                  .filter((value, index, arr) => {
                    return value !== null
                  }),
              },
            }).then(async function (spaces) {
              res.send({ status: 'success', spaces: spaces })
            })
          })
        },
      )
    },
  )
})

router.post('/get_spaces', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Membership.findAll({ where: { userId: session.userId } }).then(
        async function (memberships) {
          sw.Room.findAll({
            where: { id: memberships.map((m) => m.roomId) },
          }).then(async function (rooms) {
            sw.Space.findAll({
              where: {
                id: rooms
                  .map((r) => r.spaceId)
                  .filter((value, index, arr) => {
                    return value !== null
                  }),
              },
            }).then(async function (spaces) {
              res.send({ status: 'success', spaces: spaces })
            })
          })
        },
      )
    },
  )
})

router.post('/enter_room', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership === null || membership === undefined) {
      res.send({ status: 'success' })
      return
    }

    let s = sockets[user.id]
    if (s === undefined) return
    let roomId = metadata[membership.userId].roomId

    if (membership.roomId === roomId) {
      require('../server').pushTo('room_' + membership.roomId, 'user-entered', {
        rooms: [],
        users: getRoomUsers(membership.roomId),
      })

      res.send({ status: 'success', membership: membership })
      return
    }

    sockets[user.id].leave()
    sockets[user.id].roomId = 0
    removeUser(roomId, user.id)

    sw.Room.findOne({ where: { spaceId: roomId } }).then(
      async (room) => {
        sw.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
          async (rooms) => {
            for (let i = 0; i < rooms.length; i++) {
              let room = rooms[i]
              room.users = getRoomUsers(room.id)
            }
            sw.Membership.findAll({
              raw: true,
              where: { roomId: roomId },
            }).then(async (memberships) => {
              sw.User.findAll({
                raw: true,
                where: { id: memberships.map((mem) => mem.userId) },
              }).then(async (users) => {
                require('../server').pushTo(
                  'room_' + roomId,
                  'user-exited',
                  {
                    rooms: rooms,
                    users: getRoomUsers(roomId),
                    allUsers: users,
                  },
                )
              })
            })
          },
        )
      },
    )

    s.join('room_' + membership.roomId)
    metadata[membership.userId].roomId = membership.roomId
    addUser(membership.roomId, user)

    sw.Room.findOne({ where: { spaceId: membership.roomId } }).then(
      async (room) => {
        sw.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
          async (rooms) => {
            for (let i = 0; i < rooms.length; i++) {
              let room = rooms[i]
              room.users = getRoomUsers(room.id)
            }
            sw.Membership.findAll({
              raw: true,
              where: { roomId: membership.roomId },
            }).then(async (memberships) => {
              sw.User.findAll({
                raw: true,
                where: { id: memberships.map((mem) => mem.userId) },
              }).then(async (users) => {
                require('../server').pushTo(
                  'room_' + membership.roomId,
                  'user-entered',
                  {
                    rooms: rooms,
                    users: getRoomUsers(membership.roomId),
                    allUsers: users,
                  },
                )
              })
            })
          },
        )
      },
    )

    res.send({ status: 'success', membership: membership })
  })
})

router.post('/exit_room', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let roomId = metadata[user.id].roomId;
    if (sockets[user.id] !== undefined) {
      sockets[user.id].leave();
      sockets[user.id].roomId = 0;
    }
    removeUser(roomId, user.id);
    if (roomId !== undefined) {
      sw.Room.findOne({ where: { id: roomId } }).then(
        async (room) => {
          sw.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
            async (rooms) => {
              for (let i = 0; i < rooms.length; i++) {
                let room = rooms[i]
                room.users = getRoomUsers(room.id)
              }
              sw.Membership.findAll({
                raw: true,
                where: { roomId: membership.roomId },
              }).then(async (memberships) => {
                sw.User.findAll({
                  raw: true,
                  where: { id: memberships.map((mem) => mem.userId) },
                }).then(async (users) => {
                  require('../server').pushTo(
                    'room_' + membership.roomId,
                    'user-exited',
                    {
                      rooms: rooms,
                      users: getRoomUsers(membership.roomId),
                      allUsers: users,
                    },
                  )
                })
              })
            },
          )
        },
      )
    }
  })
  res.send({ status: 'success' })
})

router.post('/invite_to_room', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (!membership.canInviteToRoom) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    sw.User.findOne({ where: { id: req.body.userId } }).then(async (user) => {
      if (user === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'account does not exist.',
        })
        return
      }
      sw.Invite.findOne({
        where: { userId: user.id, roomId: membership.roomId },
      }).then(async (invite) => {
        if (invite !== null) {
          sw.Room.findOne({ where: { id: membership.roomId } }).then(
            async (room) => {
              require('../server').signlePushTo(user.id, 'user-invited', {
                invite,
                user,
                room,
              })
              res.send({ status: 'success', invite: invite })
            },
          )
          return
        }
        invite = await sw.Invite.create({
          userId: user.id,
          roomId: membership.roomId,
          title: req.body.title,
          text: req.body.text,
          inviteType: 'webinar',
        })
        sw.Room.findOne({ where: { id: membership.roomId } }).then(
          async (room) => {
            require('../server').signlePushTo(user.id, 'user-invited', {
              invite,
              user,
              room,
            })
            res.send({ status: 'success', invite: invite })
          },
        )
      })
    })
  })
})

router.post('/accept_invite', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Invite.findOne({
        where: { id: req.body.inviteId, userId: session.userId },
      }).then(async (invite) => {
        if (invite === null) {
          res.send({
            status: 'error',
            errorCode: 'e0005',
            message: 'invite does not exist.',
          })
          return
        }
        await invite.destroy()
        let mem = await sw.Membership.create({
          userId: session.userId,
          roomId: invite.roomId,
          ...tools.defaultPermissions,
        })
        require('../server').pushTo(
          'room_' + invite.roomId,
          'invite-accepted',
          {},
        )
        res.send({ status: 'success', mem })
      })
    },
  )
})

router.post('/decline_invite', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Invite.findOne({
        where: { id: req.body.inviteId, userId: session.userId },
      }).then(async (invite) => {
        if (invite === null) {
          res.send({
            status: 'error',
            errorCode: 'e0005',
            message: 'invite does not exist.',
          })
          return
        }
        await invite.destroy()
        require('../server').pushTo(
          'room_' + invite.roomId,
          'invite-declined',
          {},
        )
        res.send({ status: 'success' })
      })
    },
  )
})

router.post('/get_invites', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Invite.findAll({
        include: [{ all: true }],
        where: { userId: session.userId },
      }).then(async (invites) => {
        res.send({ status: 'success', invites: invites })
      })
    },
  )
})

router.get('/generate_invite_link', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    let room = await sw.Room.findOne({ where: { id: membership.roomId } })
    if (room === null) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'room does not exist.',
      })
      return
    }
    let roomSecret = await sw.RoomSecret.findOne({ where: { roomId: room.id } })
    if (roomSecret.ownerId !== session.userId) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'access denied.',
      })
      return
    }
    let token = generateInvite(room.id)

    let requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    }
    fetch('https://config.kaspersoft.cloud', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        res.send({
          status: 'success',
          link: result.mainFrontend + '/app/use_invitation?token=' + token,
        })
      })
  })
})

router.post('/use_invitation', jsonParser, async function (req, res) {
  let invite = resolveInvite(req.body.token)
  if (invite.valid || req.body.token === undefined) {
    let user = await sw.User.create({
      id: uuid() + '-' + Date.now(),
      firstName: req.body.name,
      lastName: '',
      username: tools.makeRandomCode(32),
      isGuest: true,
    })
    let acc = {
      id: user.id,
      roomId: !invite.valid ? req.body.roomId : invite.roomId,
      user: user,
      userId: user.id,
      isGuest: true,
      ...tools.defaultPermissions,
      themeColor: tools.lightTheme,
      token: tools.makeRandomCode(64),
    }
    addUser(invite.valid ? invite.roomId : req.body.roomId, user)
    addGuestAcc(acc)
    require('../server').pushTo(
      'room_' + (invite.valid ? invite.roomId : req.body.roomId),
      'user_joined',
      user,
    )
    let requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    }
    fetch('https://config.kaspersoft.cloud', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        res.send({
          status: 'success',
          token: acc.token,
          roomId: invite.valid ? invite.roomId : req.body.roomId,
        })
      })
  } else {
    res.send({
      status: 'error',
      errorCode: 'e005',
      message: 'invitation invalid',
    })
  }
})

router.post('/leave_room', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.Membership.findOne({
        where: { userId: session.userId, roomId: req.body.roomId },
      }).then(async function (membership) {
        if (membership === null) {
          res.send({
            status: 'error',
            errorCode: 'e0005',
            message: 'membership does not exist.',
          })
          return
        }
        await membership.destroy()
        sw.User.findOne({ where: { id: membership.userId } }).then(
          async function (user) {
            require('../server').pushTo(
              'room_' + membership.roomId,
              'user_left',
              user,
            )
            res.send({ status: 'success' })
          },
        )
      })
    },
  )
})

router.post('/get_room_users', jsonParser, async function (req, res) {
  authenticateMember(req, res, async (membership, session, user) => {
    if (membership === null || membership === undefined) {
      res.send({
        status: 'error',
        errorCode: 'e0005',
        message: 'membership does not exist.',
      })
      return
    }
    sw.Room.findOne({ where: { spaceId: membership.roomId } }).then(
      async (room) => {
        sw.Room.findAll({ raw: true, where: { spaceId: room.spaceId } }).then(
          async (rooms) => {
            for (let i = 0; i < rooms.length; i++) {
              let room = rooms[i]
              room.users = getRoomUsers(room.id)
            }
            sw.Membership.findAll({
              raw: true,
              where: { roomId: membership.roomId },
            }).then(async (memberships) => {
              sw.User.findAll({
                raw: true,
                where: { id: memberships.map((mem) => mem.userId) },
              }).then(async (users) => {
                res.send({
                  status: 'success',
                  rooms: rooms,
                  users: getRoomUsers(membership.roomId),
                  allUsers: users,
                })
              })
            })
          },
        )
      },
    )
  })
})

router.post('/move_user', jsonParser, async function (req, res) {
  sw.Session.findOne({ where: { token: req.headers.token } }).then(
    async function (session) {
      if (session === null) {
        res.send({
          status: 'error',
          errorCode: 'e0005',
          message: 'session does not exist.',
        })
        return
      }
      sw.SpaceSecret.findOne({ where: { spaceId: req.body.spaceId } }).then(
        async (spaceSecret) => {
          if (spaceSecret === null) {
            res.send({
              status: 'error',
              errorCode: 'e0005',
              message: 'room does not exist.',
            })
            return
          }
          if (spaceSecret.ownerId !== session.userId) {
            res.send({
              status: 'error',
              errorCode: 'e0007',
              message: 'access denied.',
            })
            return
          }
          let spaceRooms = await sw.Room.findAll({
            raw: true,
            where: { spaceId: req.body.spaceId },
          })
          let fromMems = await sw.Membership.findAll({
            where: {
              roomId: spaceRooms.map((sr) => sr.id),
              userId: req.body.userId,
            },
          })
          let isGuest = false
          if (fromMems.length === 0) {
            isGuest = true
            spaceRooms.forEach((sr) => {
              if (guestAccs[sr.id] !== undefined) {
                if (guestAccs[sr.id][req.body.userId] !== undefined) {
                  fromMems.push(guestAccs[sr.id][req.body.userId])
                }
              }
            })
          }
          let fromRoom = await sw.Room.findOne({
            where: { id: fromMems[fromMems.length - 1].roomId },
          })
          if (fromRoom.spaceId !== spaceSecret.spaceId) {
            res.send({
              status: 'error',
              errorCode: 'e0008',
              message: 'access denied.',
            })
            return
          }
          let toRoom = await sw.Room.findOne({
            where: { id: req.body.toRoomId },
          })
          if (toRoom.spaceId !== spaceSecret.spaceId) {
            res.send({
              status: 'error',
              errorCode: 'e0009',
              message: 'access denied.',
            })
            return
          }
          if (isGuest) {
            fromMems.forEach((fm) => {
              if (guestAccs[fm.roomId] !== undefined) {
                guestAccs[fm.roomId][req.body.userId].roomId = toRoom.id
              }
            })
          } else {
            fromMems.forEach((fm) => {
              fm.destroy()
            })
          }

          if (!isGuest) {
            let mem = await sw.Membership.create({
              userId: req.body.userId,
              roomId: req.body.toRoomId,
              ...tools.defaultPermissions,
            })
          }

          removeUser(fromRoom.id, req.body.userId)
          let user = await sw.User.findOne({ where: { id: req.body.userId } })
          addUser(toRoom.id, user)

          if (isGuest) {
            fromMems.forEach((fm) => {
              if (guestAccs[fm.roomId] !== undefined) {
                guestAccs[fm.roomId][req.body.userId].user = user
              }
            })
          }

          sw.Room.findAll({
            raw: true,
            where: { spaceId: spaceSecret.spaceId },
          }).then((rooms) => {
            for (let i = 0; i < rooms.length; i++) {
              let room = rooms[i]
              if (room.id !== toRoom.id) removeUser(room.id, user.id)
              room.users = getRoomUsers(room.id)
            }
            require('../server').pushTo(
              'room_' + sockets[user.id].roomId,
              'user-exited',
              { rooms: rooms },
            )
            res.send({ status: 'success' })
          })
        },
      )
    },
  )
})

module.exports = router
