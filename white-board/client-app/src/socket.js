

import io from "socket.io-client";

export let socket;

export let setup = (userId, roomId) => {
    socket = io({query: `room_id=${roomId}&user_id=${userId}`})
}