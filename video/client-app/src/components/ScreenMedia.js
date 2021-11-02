import React, { useEffect } from 'react';
import $ from 'jquery';
import io from 'socket.io-client';

var USE_AUDIO = true
var USE_VIDEO = true
var MUTE_AUDIO_BY_DEFAULT = false
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

export default function ScreenMedia(props) {

  let userId = props.userId;
  let roomId = props.roomId;

  function setup_local_media(constraints, callback, errorback) {
    /* Ask user for permission to use the computers microphone and/or camera,
     * attach it to an <video> or <video> tag if they give us access. */
    console.log('Requesting access to local video / video inputs')
  
    if (constraints.video === undefined) {
      let stream = produceEmptyStream();
      local_media_stream = stream;
      props.data['me_screen'] = stream;
      props.updateData(props.data);
      props.forceUpdate();
      if (callback) callback(stream);
      return;
    }
  
    navigator.mediaDevices.getDisplayMedia().then(stream => {
        /* user accepted access to a/v */
        console.log('Access granted to video/video')
        local_media_stream = stream;
        let foundTag = undefined;
        Object.entries(props.data).forEach(([id, stream]) => {
          if (id.startsWith('me_screen')) {
            foundTag = id;
          }
        })
        if (foundTag !== undefined) {
          props.data[foundTag] = undefined;
        }
        props.data['me_screen_' + Date.now()] = stream;
        props.forceUpdate();
        props.updateData();
        if (callback) callback(stream);
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

let startScreen = () => {
  if (local_media_stream !== null && local_media_stream !== undefined) {
    local_media_stream.getVideoTracks().forEach((track) => {
      track.stop()
    })
  }
  setup_local_media({ video: { width: 480, height: 480 } }, function (
    stream,
  ) {
    document.getElementById('me_screen').srcObject = stream;
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
  })
}

let endScreen = () => {
  if (local_media_stream !== null && local_media_stream !== undefined) {
    local_media_stream.getVideoTracks().forEach((track) => {
      track.stop()
    })
  }
}

  function initInner(videoServerWebsocket) {

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
      for (let peer_id in window.peer_media_elements) {
        window.peer_media_elements[userId].remove()
      }
      for (let peer_id in peers) {
        peers[peer_id].close()
      }
  
      peers = {}
      window.peer_media_elements = {}
    })
  
    signaling_socket.on('show_peer', (peer_id) => {
      let el = document.getElementById('videoconf' + peer_id)
      if (el !== null) {
        el.style.display = 'block'
        window.peer_media_availability[
          'video-' + window.peer_owners_dict[peer_id]
        ] = true
        window.updateVideoScreen(window.peer_owners_dict[peer_id])
      }
    })
  
    signaling_socket.on('hide_peer', (peer_id) => {
      let el = document.getElementById('videoconf' + peer_id)
      if (el !== null) {
        el.style.display = 'none'
        window.peer_media_availability[
          'video-' + window.peer_owners_dict[peer_id]
        ] = false
        window.updateVideoScreen(window.peer_owners_dict[peer_id])
      }
    })
  
    signaling_socket.on('answerAppearence', (peer_id) => {
      document.getElementById('videoconf' + peer_id).style.display = 'block'
      window.peer_media_availability[
        'video-' + window.peer_owners_dict[peer_id]
      ] = true
      window.updateVideoScreen(window.peer_owners_dict[peer_id])
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
        console.log('onAddStream', event);
        let foundTag = undefined;
        Object.entries(props.data).forEach(([id, stream]) => {
          if (id.startsWith(config.userId + '_video_')) {
            foundTag = id;
          }
        })
        if (foundTag !== undefined) {
          props.data[foundTag] = undefined;
        }
        props.data[config.userId + '_video_' + Date.now()] = event.stream;
        props.updateData(props.data);
        props.forceUpdate();
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
                alert('Offer setLocalDescription failed!')
              },
            )
          },
          function (error) {
            console.log('Error sending offer: ', error)
          },
        )
      }
    })
  
    signaling_socket.on('disableUser', (peer_id) => {
      if (signaling_socket.id === peer_id) endScreen()
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
                    console.log('Answer setLocalDescription failed!')
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
  }
  
  function init() {
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
            initInner(pathConfig.videoConfScreen)
          })
  };

  useEffect(() => {
    init();
    setTimeout(() => {
      startScreen();
    }, 2500);
  }, []);

  return <div/>;
}