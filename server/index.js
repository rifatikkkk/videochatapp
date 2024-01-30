import path from 'path'
import express from 'express'
const app = express()

import { createServer } from 'http'
import { Server } from 'socket.io'
import { ACTIONS } from './ActionsSocket.js'

import { version, validate } from 'uuid'

const httpServer = createServer(app)
const io = new Server(httpServer)

const PORT = process.env.PORT || 3002

function getClientRooms() {
    const { rooms } = io.sockets.adapter
    console.log(Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4))
    return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4)
}

function shareRoomsInfo() {
    io.emit(ACTIONS.SHARE_ROOMS, {
        rooms: getClientRooms(),
    })
}

io.on("connection", socket => {
    console.log("Socket connected111")

    shareRoomsInfo()

    socket.on(ACTIONS.JOIN, config => {
        const { room: roomID } = config
        const { rooms: joinedRooms } = socket

        console.log('last share')

        if (Array.from(joinedRooms).includes(roomID)) {
            return console.warn(`Already joined to ${roomID}`)
        }

        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || [])


        clients.forEach(cliendID => {
            io.to(cliendID).emit(ACTIONS.ADD_PEER, {
                peerID: socket.id,
                createOffer: false,
            })

            socket.emit(ACTIONS.ADD_PEER, {
                peerID: cliendID,
                createOffer: true,
            })
        })

        socket.join(roomID)
        shareRoomsInfo()
    })

    function leaveRoom() {
        const { rooms } = socket

        Array.from(rooms).forEach(roomID => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || [])

            clients.forEach(clientID => {
                io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                    peerID: socket.id,
                })

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerID: clientID,
                })
            })

            socket.leave(roomID)
        })

        shareRoomsInfo()
    }

    socket.on(ACTIONS.LEAVE, leaveRoom)

    socket.on('disconnecting', leaveRoom)

    socket.on(ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
        io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerID: socket.id,
            sessionDescription,
        })
    })

    socket.on(ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
        io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
            peerID: socket.id,
            iceCandidate,
        })
    })
})

async function start() {
    try {
        httpServer.listen(PORT, (req, res) => {
            // var url = req.headers.host + '/' + req.url 
            console.log("Server started on " + PORT)
        })
    } catch (error) {
        console.log(error)
    }
}

start()