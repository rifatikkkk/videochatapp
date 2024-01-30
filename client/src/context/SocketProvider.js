import { io } from 'socket.io-client'

const options = {
    'force new connection': true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
}

const socket = io("http://localhost:3002/", options)

export default socket;