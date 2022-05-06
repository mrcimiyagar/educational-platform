import React from "react";
import { pathConfig, setClientConnected } from "..";
import store, { changeConferenceMode } from "../redux/main";
import { setMe, token } from "./settings";
import io from "socket.io-client";

import { setMembership as smRoom } from "../routes/pages/room";
import { setMembership as smChat } from "../routes/pages/chat";
import { setMembership as smChatE } from "../components/ChatEmbedded";
import { setMembership as smChatM } from "../components/ChatEmbeddedInMessenger";
import { setMembership2 } from "../routes/pages/home";

export let websocketPath = undefined;
export let serverRoot = undefined;

export let setup = () => {
  websocketPath = pathConfig.mainWebsocket;
  serverRoot = pathConfig.mainBackend;
};

export function leaveRoom(callback) {
  store.dispatch(changeConferenceMode(false));
  let requestOptions2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    redirect: "follow",
  };
  fetch(serverRoot + "/room/exit_room", requestOptions2)
    .then((response) => response.json())
    .then((result) => {
      console.log(JSON.stringify(result));
      if (result.status !== "success") {
        let requestOptions2 = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
          redirect: "follow",
        };
        fetch(serverRoot + "/room/exit_room", requestOptions2)
          .then((response) => response.json())
          .then((result) => {
            console.log(JSON.stringify(result));
            if (callback !== undefined) {
              callback();
            }
          })
          .catch((error) => console.log("error", error));
      } else {
        if (callback !== undefined) {
          callback();
        }
      }
    })
    .catch((error) => console.log("error", error));
}

export let config;
export let setConfig = (c) => {
  config = c;
};

export let room;
export let setRoom = (r) => {
  if (r === undefined) return;
  room = r;
};

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key],
      B = b[key];
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
    case "light.purple": {
      return "#922c88";
    }
    case "light.blue": {
      return "#145388";
    }
    case "light.green": {
      return "#576a3d";
    }
    case "light.orange": {
      return "#e2863b";
    }
    case "light.red": {
      return "#880a1f";
    }
    case "dark.purple": {
      return "#922c88";
    }
    case "dark.blue": {
      return "#145388";
    }
    case "dark.green": {
      return "#576a3d";
    }
    case "dark.orange": {
      return "#e2863b";
    }
    case "dark.red": {
      return "#880a1f";
    }
    default: {
      return "#fff";
    }
  }
};

export const getDateWithFormat = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return dd + "." + mm + "." + yyyy;
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes();
};

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
};

export let socket = undefined;
let eventDict = {};
export let registerEvent = (eventName, func) => {
  try {
    socket.on(eventName, func);
    eventDict[eventName] = func;
  } catch (ex) {}
};
export let unregisterEvent = (eventName) => {
  try {
    socket.removeAllListeners(eventName);
    delete eventDict[eventName];
  } catch (ex) {}
};

let pingTimer = undefined;

export const ConnectToIo = (t, onSocketAuth, force) => {
  if (socket !== null && socket !== undefined) {
    if (force) {
      try {
        socket.disconnect();
      } catch (ex) {}
    } else {
      return;
    }
  }
  socket = io(pathConfig.mainBackend);
  if (pingTimer !== undefined) {
    try {
      clearInterval(pingTimer);
    } catch (ex) {
      console.log(ex);
    }
  }
  pingTimer = setInterval(() => {
    if (socket !== null && socket !== undefined) {
      try {
        socket.emit("ping");
      } catch (ex) {
        console.log(ex);
      }
    }
  }, 1000);
  socket.on("sync", () => {
    let requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      redirect: "follow",
    };
    fetch(serverRoot + "/notifications/sync", requestOptions2)
      .then((response) => response.json())
      .then((result) => {
        console.log(JSON.stringify(result));
        if (result.notifications !== undefined) {
          result.notifications.forEach((notif) => {
            if (notif.key === "membership-updated") {
              smRoom(notif.data);
              smChat(notif.data);
              smChatE(notif.data);
              smChatM(notif.data);
              setMembership2(notif.data);
            }
            let eventFunc = eventDict[notif.key];
            if (eventFunc !== undefined) {
              try {
                eventFunc(notif.data);
              } catch (ex) {
                console.log(ex);
              }
            }
          });
          let requestOptions3 = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
            body: JSON.stringify({
              notifsCount: result.notifications.length,
            }),
            redirect: "follow",
          };
          fetch(serverRoot + "/notifications/recycle", requestOptions3);
        }
      })
      .catch((error) => console.log("error", error));
  });
  registerEvent("log", (data) => {
    alert(JSON.stringify(data));
  });
  registerEvent("disconnect", () => {
    setClientConnected(false);
  });
  registerEvent("connect", () => {
    registerEvent("auth-success", () => {
      if (onSocketAuth !== undefined) {
        onSocketAuth();
      }
      setClientConnected(true);
    });
    socket.emit("auth", {
      token: t !== undefined ? t : localStorage.getItem("token"),
    });
  });
  registerEvent("disconnect", () => {
    setClientConnected(false);
    socket = null;
    setTimeout(() => {
      ConnectToIo(t, onSocketAuth);
    }, 5000);
  });
};

export function validateToken(t, callback) {
  console.info("testing token : " + t);
  let requestOptions2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: t,
    },
    redirect: "follow",
  };
  fetch(serverRoot + "/auth/get_me", requestOptions2)
    .then((response) => response.json())
    .then((result) => {
      console.log(JSON.stringify(result));
      if (result.status === "error" || result.user === null) {
        callback(false);
      } else {
        callback(true, result.user);
      }
    })
    .catch((error) => console.log("error", error));
}

export function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export let FetchMe = (callback) => {
  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    redirect: "follow",
  };
  fetch(serverRoot + "/auth/get_me", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      setMe(result.user);
      if (callback !== undefined) {
        callback();
      }
    });
};

export function useForceUpdate() {
  const [value, setValue] = React.useState(0); // integer state
  return () => setValue((value) => ++value); // update the state to force render
}
