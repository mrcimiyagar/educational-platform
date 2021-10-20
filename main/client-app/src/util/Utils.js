import React from "react";
import { pathConfig } from "..";
import { changeSendButtonState } from '../modules/chatbox/chatbox';
import store, { changeConferenceMode } from "../redux/main";
import { setMe, token } from "./settings";

export let websocketPath = undefined
export let serverRoot = undefined

export let setup = () => {
  websocketPath = pathConfig.mainWebsocket
  serverRoot = pathConfig.mainBackend
}

export function switchRoom(roomId, callback) {
  store.dispatch(changeConferenceMode(false));
  let requestOptions2 = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    body: JSON.stringify({
      fromRoomId: roomId,
      toRoomId: roomId
    }),
    redirect: 'follow'
  };
  fetch(serverRoot + "/room/switch_room", requestOptions2)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (callback !== undefined) {
          callback();
        }
      })
      .catch(error => console.log('error', error));
}

export function leaveRoom(callback) {
  store.dispatch(changeConferenceMode(false));
  let requestOptions2 = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    redirect: 'follow'
  };
  fetch(serverRoot + "/room/exit_room", requestOptions2)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.status !== 'success') {
          let requestOptions2 = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': localStorage.getItem('token')
            },
            redirect: 'follow'
          };
          fetch(serverRoot + "/room/exit_room", requestOptions2)
              .then(response => response.json())
              .then(result => {
                console.log(JSON.stringify(result));
                if (callback !== undefined) {
                  callback();
                }
              })
              .catch(error => console.log('error', error));
        } else {
          if (callback !== undefined) {
            callback();
          }
        }
      })
      .catch(error => console.log('error', error));
}

let events = {};

let setupSocketReconnection = (ws, t) => {
  ws.onerror = (err) => {
    console.error('Websocket encountered error: ', err.message, 'Closing Websocket');
    ws.close();
  }
  ws.onclose = () => {
    console.log('Websocket Disconnected');
    if (changeSendButtonState) {
      changeSendButtonState(false);
    }
    setTimeout(function() {
      console.log('Websocket Reconnecting...'); 
      ws = new WebSocket(websocketPath);
      ws.onopen = () => {
        console.log('WebSocket Client Connected');
        if (changeSendButtonState) {
          changeSendButtonState(true);
        }
        ws.send(JSON.stringify({event: 'auth', body: {token: t !== undefined ? t : localStorage.getItem('token')}}));
      }
      ws.onmessage = (message) => {
        console.log(message.data);
        let packet = JSON.parse(message.data);
        if (packet.event in events) {
          events[packet.event](packet.body);
        }
      };
      setupSocketReconnection(ws, t);
    }, 500);
  };
}

export class Kasperio {
  constructor(onConnect, t) {
    this.ws = new WebSocket(pathConfig.mainWebsocket);
    this.ws.onopen = () => {
      console.log('WebSocket Client Connected');
      if (changeSendButtonState) {
        changeSendButtonState(true);
      }
      onConnect();
    }
    this.ws.onmessage = (message) => {
      console.log(message.data);
      let packet = JSON.parse(message.data);
      if (packet.event in events) {
        events[packet.event](packet.body);
      }
    };
    setupSocketReconnection(this.ws, t);
  }
  off(event) {
    if (event in events) {
      delete events[event];
    }
  }
  on(event, func) {
    if (event in events) {
      delete events[event];
    }
    events[event] = func;
  }
  emit(event, args) {
    let packet = JSON.stringify({event: event, body: args});
    this.ws.send(packet);
  }
  disconnect() {
    this.ws.close();
  }
}

export let config;
export let setConfig = (c) => {
  config = c;
}

export let room;
export let setRoom = (r) => {
  if (r === undefined) return;
  room = r;
}

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key], B = b[key];
    if (order.indexOf(A + "") > order.indexOf(B + "")) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
};

export const isMobile = () => {
  return window.innerWidth < 500;
};

export const isVertical = () => {
  return window.innerWidth < window.innerHeight;
};

export let getColor = (name) => {
  switch (name) {
    case 'light.purple': {
      return '#922c88';
    }
    case 'light.blue': {
      return '#145388';
    }
    case 'light.green': {
      return '#576a3d';
    }
    case 'light.orange': {
      return '#e2863b';
    }
    case 'light.red': {
      return '#880a1f';
    }
    case 'dark.purple': {
      return '#922c88';
    }
    case 'dark.blue': {
      return '#145388';
    }
    case 'dark.green': {
      return '#576a3d';
    }
    case 'dark.orange': {
      return '#e2863b';
    }
    case 'dark.red': {
      return '#880a1f';
    }
    default: {
      return '#fff';
    }
  }
}

export const getDateWithFormat = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '.' + mm + '.' + yyyy;
}

export const getCurrentTime=()=>{
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes()
}

export const addCommas = (nStr) => {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

export let socket = undefined;

export const ConnectToIo = (t, onSocketAuth, force) => {
  if (socket !== null && socket !== undefined) {
    if (force) {
      try {socket.disconnect();} catch(ex) {}
    }
    else {
      return;
    }
  }
  socket = new Kasperio(() => {
    socket.on('auth-success', () => {
      if (onSocketAuth !== undefined) {
        onSocketAuth();
      }
    });
    socket.emit('auth', {token: t !== undefined ? t : localStorage.getItem('token')}, () => {});
  }, t);
}

export function validateToken(t, callback) {
  console.info('testing token : ' + t);
  let requestOptions2 = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': t
    },
    redirect: 'follow'
  };
  fetch(serverRoot + "/auth/get_me", requestOptions2)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.status === 'error' || result.user === null) {
          callback(false);
        }
        else {
          callback(true, result.user);
        }
      })
      .catch(error => console.log('error', error));
}

export function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

export let FetchMe = (callback) => {
  let requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    redirect: 'follow'
  };
  fetch(serverRoot + "/auth/get_me", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setMe(result.user);
        if (callback !== undefined) {
          callback();
        }
      });
}

export function useForceUpdate(){
  const [value, setValue] = React.useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}
