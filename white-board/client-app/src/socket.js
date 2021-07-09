

import io from "socket.io-client";

export let socket;

export let setup = () => {
    socket = io({query: `room_id=${1}&user_id=${1}`})
}