;(function () {
  var USE_AUDIO = true
  var USE_VIDEO = true
  var MUTE_AUDIO_BY_DEFAULT = false
  var userId = undefined
  var roomId = undefined
  var permises = {}
  let pathConfig = undefined

  /** You should probably use a different stun server doing commercial stuff **/
  /** Also see: https://gist.github.com/zziuni/3741933 **/
  var ICE_SERVERS = [
    {
      url: 'stun:185.81.96.105:3478',
    },
    {
      url: 'turn:185.81.96.105:3478',
      username: 'guest',
      credential: 'somepassword',
    },
  ]

  let attachMediaStream = function (element, stream) {
    console.log('DEPRECATED, attachMediaStream will soon be removed.')
    element.srcObject = stream
  }
  function join_chat_channel(channel, userId, userdata) {
    signaling_socket.emit('join', {
      channel: channel,
      userId: userId,
      userdata: userdata,
    })
  }
  function part_chat_channel(channel) {
    signaling_socket.emit('part', channel)
  }
  function produceEmptyStream() {
    const createEmptyAudioTrack = () => {
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const dst = oscillator.connect(ctx.createMediaStreamDestination())
      oscillator.start()
      const track = dst.stream.getAudioTracks()[0]
      return Object.assign(track, { enabled: false })
    }

    const createEmptyVideoTrack = ({ width, height }) => {
      const canvas = Object.assign(document.createElement('canvas'), {
        width,
        height,
      })
      canvas.getContext('2d').fillRect(0, 0, width, height)

      const stream = canvas.captureStream()
      const track = stream.getVideoTracks()[0]

      return Object.assign(track, { enabled: false })
    }

    let ms = new MediaStream([
      createEmptyAudioTrack(),
      createEmptyVideoTrack({ width: 480, height: 480 }),
    ])

    return ms
  }
  var signaling_socket = null /* our socket.io connection to our webserver */
  var local_media_stream = null /* our own microphone / webcam */
  var peers = {} /* keep track of our peer connections, indexed by peer_id (aka socket.io id) */
  var localMediaEl = undefined
  let isMediaAvailable = false

  function init(user_id, room_id, videoServerWebsocket) {
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
        pathConfig = result
        initInner(user_id, room_id, videoServerWebsocket)
      })
  }

  function initInner(user_id, room_id, videoServerWebsocket) {
    userId = user_id
    roomId = room_id
    console.log('Connecting to signaling server')
    signaling_socket = io(videoServerWebsocket, { query: `userId=${userId}` })

    signaling_socket.on('connect', function () {
      console.log('Connected to signaling server')
      setup_local_media({}, function (stream) {
        /* once the user has given us access to their
         * microphone/camcorder, join the channel and start peering up */
        join_chat_channel(roomId, userId, { 'whatever-you-want-here': 'stuff' })
      })
    })
    signaling_socket.on('disconnect', function () {
      console.log('Disconnected from signaling server')
      /* Tear down all of our peer connections and remove all the
       * media divs when we disconnect */
      for (peer_id in window.peer_media_elements) {
        window.peer_media_elements[userId].remove()
      }
      for (peer_id in peers) {
        peers[peer_id].close()
      }

      peers = {}
      window.peer_media_elements = {}
    })

    signaling_socket.on('show_peer', (peer_id) => {
      let el = document.getElementById('videoconf' + peer_id)
      if (el !== null) el.style.display = 'block'
    })

    signaling_socket.on('hide_peer', (peer_id) => {
      let el = document.getElementById('videoconf' + peer_id)
      if (el !== null) el.style.display = 'none'
    })

    /**
     * When we join a group, our signaling server will send out 'addPeer' events to each pair
     * of users in the group (creating a fully-connected graph of users, ie if there are 6 people
     * in the channel you will connect directly to the other 5, so there will be a total of 15
     * connections in the network).
     */
    signaling_socket.on('addPeer', function (config) {
      console.log('Signaling server said to add peer:', config)
      var peer_id = config.peer_id
      var userId = config.userId
      if (peer_id in peers) {
        /* This could happen if the user joins multiple channels where the other peer is also in. */
        console.log('Already connected to peer ', peer_id)
        return
      }
      var peer_connection = new RTCPeerConnection(
        { iceServers: ICE_SERVERS },
        { optional: [{ DtlsSrtpKeyAgreement: true }] },
        /* this will no longer be needed by chrome
         * eventually (supposedly), but is necessary
         * for now to get firefox to talk to chrome */
      )
      peer_connection.userId = config.userId
      peers[peer_id] = peer_connection

      peer_connection.onicecandidate = function (event) {
        if (event.candidate) {
          signaling_socket.emit('relayICECandidate', {
            peer_id: peer_id,
            ice_candidate: {
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
            },
          })
        }
      }
      peer_connection.onaddstream = function (event) {
        console.log('onAddStream', event)
        var remote_media = $('<video>')
        remote_media.attr('id', 'videoconf' + peer_id)
        remote_media.attr('autoplay', 'autoplay')
        if (MUTE_AUDIO_BY_DEFAULT) {
          remote_media.attr('muted', 'true')
        }
        remote_media.attr('controls', '')
        if (!(userId in window.peer_media_elements)) {
          var remote_div = $('<div>')
          remote_div.attr('id', 'videoconf' + userId)
          remote_div[0].style.width = 'auto'
          remote_div[0].style.height = 'auto'
          remote_div[0].style.margin = '8px'
          $('body').append(remote_div)
          window.peer_media_elements[userId] = remote_div
          window.peer_media_streams[userId] = {webcam: event.stream}
        }
        else {
          window.peer_media_streams[userId].webcam = event.stream
        }
        remote_media[0].onclick = function (e) {
          if (document.getElementById('max').style.display === 'none') {
            document.getElementById('max').style.display = 'block'
            let webcamMax = document.getElementById('webcamMax')
            webcamMax.srcObject = window.peer_media_streams[userId].webcam
            let screenMax = document.getElementById('screenMax')
            screenMax.srcObject = window.peer_media_streams[userId].screen
          }
          else {
            document.getElementById('max').style.display = 'none'
          }
        }
        remote_media[0].style.width = (window.innerWidth / 2) - 24 + 'px'
        remote_media[0].style.maxWidth = '300px'
        remote_media[0].style.height = '300px'
        remote_media[0].style.margin = '8px'
        remote_media[0].style.display = 'none'
        remote_media[0].srcObject = event.stream
        $('#videoconf' + userId).append(remote_media)
        signaling_socket.on('answerAppearence', (peer_id) => {
          remote_media[0].style.display = 'block'
        })
        signaling_socket.emit('askAppearence', peer_id)
      }

      /* Add our local stream */
      peer_connection.addStream(local_media_stream)

      /* Only one side of the peer connection should create the
       * offer, the signaling server picks one to be the offerer.
       * The other user will get a 'sessionDescription' event and will
       * create an offer, then send back an answer 'sessionDescription' to us
       */
      if (config.should_create_offer) {
        console.log('Creating RTC offer to ', peer_id)
        peer_connection.createOffer(
          function (local_description) {
            console.log('Local offer description is: ', local_description)
            peer_connection.setLocalDescription(
              local_description,
              function () {
                signaling_socket.emit('relaySessionDescription', {
                  peer_id: peer_id,
                  session_description: local_description,
                })
                console.log('Offer setLocalDescription succeeded')
              },
              function () {
                Alert('Offer setLocalDescription failed!')
              },
            )
          },
          function (error) {
            console.log('Error sending offer: ', error)
          },
        )
      }
    })

    signaling_socket.on('askAppearence', (peer_id) => {
      if (isMediaAvailable) {
        signaling_socket.emit('answerAppearence', peer_id)
      }
    })

    signaling_socket.on('disableUser', (peer_id) => {
      if (signaling_socket.id === peer_id) endVideo()
      else peers[peer_id].close()
    })

    /**
     * Peers exchange session descriptions which contains information
     * about their video / video settings and that sort of stuff. First
     * the 'offerer' sends a description to the 'answerer' (with type
     * "offer"), then the answerer sends one back (with type "answer").
     */
    signaling_socket.on('sessionDescription', function (config) {
      console.log('Remote description received: ', config)
      var peer_id = config.peer_id
      var peer = peers[peer_id]
      var remote_description = config.session_description
      console.log(config.session_description)

      var desc = new RTCSessionDescription(remote_description)
      var stuff = peer.setRemoteDescription(
        desc,
        function () {
          console.log('setRemoteDescription succeeded')
          if (remote_description.type == 'offer') {
            console.log('Creating answer')
            peer.createAnswer(
              function (local_description) {
                console.log('Answer description is: ', local_description)
                peer.setLocalDescription(
                  local_description,
                  function () {
                    signaling_socket.emit('relaySessionDescription', {
                      peer_id: peer_id,
                      session_description: local_description,
                    })
                    console.log('Answer setLocalDescription succeeded')
                  },
                  function () {
                    Alert('Answer setLocalDescription failed!')
                  },
                )
              },
              function (error) {
                console.log('Error creating answer: ', error)
                console.log(peer)
              },
            )
          }
        },
        function (error) {
          console.log('setRemoteDescription error: ', error)
        },
      )
      console.log('Description Object: ', desc)
    })

    /**
     * The offerer will send a number of ICE Candidate blobs to the answerer so they
     * can begin trying to find the best path to one another on the net.
     */
    signaling_socket.on('iceCandidate', function (config) {
      var peer = peers[config.peer_id]
      var ice_candidate = config.ice_candidate
      peer.addIceCandidate(new RTCIceCandidate(ice_candidate))
    })

    /**
     * When a user leaves a channel (or is disconnected from the
     * signaling server) everyone will recieve a 'removePeer' message
     * telling them to trash the media channels they have open for those
     * that peer. If it was this client that left a channel, they'll also
     * receive the removePeers. If this client was disconnected, they
     * wont receive removePeers, but rather the
     * signaling_socket.on('disconnect') code will kick in and tear down
     * all the peer sessions.
     */
    signaling_socket.on('removePeer', function (config) {
      console.log('Signaling server said to remove peer:', config)
      var peer_id = config.peer_id
      $('#videoconf' + peer_id).remove()
      // if (document.getElementById('videoconf' + userId).childElementCount === 0) {
      //   window.peer_media_elements[userId].remove()
      // }
      if (peer_id in peers) {
        peers[peer_id].close()
      }

      delete peers[peer_id]
      delete window.peer_media_elements[config.peer_id]
    })

    window.onunload = () => {
      signaling_socket.emit('hide')
      local_media_stream.getVideoTracks().forEach((track) => track.stop())
      signaling_socket.close()
    }

    window.onbeforeunload = () => {
      signaling_socket.emit('hide')
      local_media_stream.getVideoTracks().forEach((track) => track.stop())
      signaling_socket.close()
    }

    signaling_socket.on('takePermissions', (permissions) => {
      permises = permissions
      window.parent.postMessage(
        {
          sender: 'confvideo',
          action: 'takePermissions',
          permissions: permissions,
        },
        pathConfig.mainFrontend,
      )
      if (permissions[userId] === true) {
        window.parent.postMessage(
          {
            sender: 'confvideo',
            action: 'switchVideoControlVisibility',
            visibility: true,
          },
          pathConfig.mainFrontend,
        )
      } else {
        endVideo()
        window.parent.postMessage(
          {
            sender: 'confvideo',
            action: 'switchVideoControlVisibility',
            visibility: false,
          },
          pathConfig.mainFrontend,
        )
      }
    })

    window.addEventListener('message', (e) => {
      console.log(e.data)
      if (e.data.sender === 'main') {
        if (e.data.action === 'switchPermission') {
          signaling_socket.emit('switchPermission', {
            userId: e.data.targetId,
            permission: e.data.status,
          })
        } else if (e.data.action === 'getPermissions') {
          signaling_socket.emit('getPermissions')
        }
      }
    })
  }

  /***********************/
  /** Local media stuff **/
  /***********************/
  function setup_local_media(constraints, callback, errorback) {
    /* Ask user for permission to use the computers microphone and/or camera,
     * attach it to an <video> or <video> tag if they give us access. */
    console.log('Requesting access to local video / video inputs')

    if (constraints.video === undefined && constraints.video === undefined) {
      let stream = produceEmptyStream()
      local_media_stream = stream
      if (localMediaEl === undefined) {
        var local_media = $('<video>')
        local_media.attr('autoplay', 'autoplay')
        local_media.attr('muted', 'true') /* always mute ourselves by default */
        local_media.attr('controls', '')
        document.getElementById('me').appendChild(local_media[0])
        local_media[0].style.width = 'calc(50% - 24px)'
        local_media[0].style.maxWidth = '300px'
        local_media[0].style.height = 'min(300px, ' + (window.innerWidth / 2 - 24) + 'px' + ')';
        local_media[0].style.margin = '8px'
        local_media[0].muted = true
        localMediaEl = local_media[0]
      }
      attachMediaStream(localMediaEl, stream)
      if (callback) callback(stream)
      return
    }

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia

    navigator.getUserMedia(
      constraints,
      function (stream) {
        /* user accepted access to a/v */
        console.log('Access granted to video/video')
        local_media_stream = stream
        if (localMediaEl === undefined) {
          var local_media = $('<video>')
          local_media.attr('autoplay', 'autoplay')
          local_media.attr(
            'muted',
            'true',
          ) /* always mute ourselves by default */
          local_media.attr('controls', '')
          document.getElementById('me').appendChild(local_media[0])
          local_media[0].style.width = 'calc(50% - 24px)'
          local_media[0].style.maxWidth = '300px'
          local_media[0].style.height = 'min(300px, ' + (window.innerWidth / 2 - 24) + 'px' + ')';
          local_media[0].style.margin = '8px'
          local_media[0].muted = true
          localMediaEl = local_media[0]
        }
        attachMediaStream(localMediaEl, stream)
        if (callback) callback(stream)
      },
      function () {
        /* user denied access to a/v */
        console.log('Access denied for video/video')
        alert(
          'You chose not to provide access to the camera/microphone, demo will not work.',
        )
        if (errorback) errorback()
      },
    )
  }

  let startVideo = () => {
    if (local_media_stream !== null && local_media_stream !== undefined) {
      local_media_stream.getVideoTracks().forEach((track) => {
        track.stop()
      })
    }
    setup_local_media({ video: { width: 480, height: 480 } }, function (
      stream,
    ) {
      let videoTrack = stream.getVideoTracks()[0]
      for (let id in peers) {
        if (peers[id] === undefined) continue
        let pc = peers[id]
        var sender = pc.getSenders().find(function (s) {
          return s.track.kind == videoTrack.kind
        })
        console.log('found sender:', sender)
        sender.replaceTrack(videoTrack)
      }
      isMediaAvailable = true
      signaling_socket.emit('show')
    })
  }

  let endVideo = () => {
    local_media_stream.getVideoTracks().forEach((track) => {
      track.stop()
    })
    isMediaAvailable = false
    signaling_socket.emit('hide')
  }

  let enableVideoUser = (targetId) => {
    signaling_socket.emit('enableUser', targetId)
  }

  let disableVideoUser = (targetId) => {
    signaling_socket.emit('disableUser', targetId)
  }

  window.startVideo = startVideo
  window.endVideo = endVideo
  window.initVideo = init
  window.enableVideoUser = enableVideoUser
  window.disableVideoUser = disableVideoUser
})()
