let peerConnection;
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

socket.on("offer", (id, description) => {
  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("answer", id, peerConnection.localDescription);
    });
  peerConnection.ontrack = event => {
    videoElement.srcObject = event.streams[0];
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
});


socket.on("candidate", (id, candidate) => {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

socket.on("connect", () => {
  socket.emit("watcher");
});

socket.on("broadcaster", () => {
  socket.emit("watcher");
});

socket.on('startBroadcast', () => {
  videoElement.style.display = 'block'
  window.parent.postMessage({sender: 'videoBroadcast', stream: true}, "https://kaspersoft.cloud")
});

socket.on('endBroadcast', () => {
  videoElement.srcObject = null
  videoElement.style.display = 'none'
  window.parent.postMessage({sender: 'videoBroadcast', stream: false}, "https://kaspersoft.cloud")
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
  peerConnection.close();
};
