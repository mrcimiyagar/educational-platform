
const peerConnections = {};
const config = {
  iceServers: [
    {"url":"stun:185.81.96.230:3478"},
    {
      "url":"turn:185.81.96.230:3478",
      "username":"guest",
      "credential":"somepassword"
    }
  ]
};

const socket = io.connect('https://webinarvideo.kaspersoft.cloud');
const videoElement = document.querySelector("video");

let handleConnection = (size) => {
  if (videoElement.srcObject === null) {
    navigator.mediaDevices.getUserMedia({video: size}).then(stream => {
      videoElement.style.display = 'block'
      videoElement.srcObject = stream;
      socket.emit("broadcaster");
      window.parent.postMessage({sender: 'videoBroadcast', stream: true}, "https://kaspersoft.cloud")
      socket.emit('start')
    })
  }
  else {
    videoElement.srcObject.getTracks().forEach(track => {
      track.stop()
    })
    navigator.mediaDevices.getUserMedia({video: size}).then(stream => {
      videoElement.srcObject = stream
      socket.emit("broadcaster")
    })
  }
};
let handleDisconnection = () => {
  socket.emit('end')
  if (videoElement.srcObject !== null) {
    videoElement.srcObject.getTracks().forEach(track => {
      track.stop()
    })
  }
  videoElement.srcObject = null
  videoElement.style.display = 'none'
  window.parent.postMessage({sender: 'videoBroadcast', stream: false}, "https://kaspersoft.cloud")
};

socket.on("answer", (id, description) => {
  peerConnections[id].setRemoteDescription(description);
});

socket.on("watcher", id => {
  const peerConnection = new RTCPeerConnection(config);
  peerConnections[id] = peerConnection;

  let stream = videoElement.srcObject;
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };

  peerConnection
    .createOffer()
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("offer", id, peerConnection.localDescription);
    });
});

socket.on("candidate", (id, candidate) => {
  peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on("disconnectPeer", id => {
  peerConnections[id].close();
  delete peerConnections[id];
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
};

window.onmessage = (e) => {
  if (e.data.sender === 'videoBroadcastWrapper') {
    if (e.data.stream === true) {
      handleConnection(e.data.size)
    }
    else if (e.data.stream === false) {
      handleDisconnection()
    }
  }
}