import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../context/SocketProvider'
import { ACTIONS } from '../context/ActionsSocket'
import { v4 } from 'uuid'

const Main = () => {

    const navigate = useNavigate()
    const [rooms, setRooms] = useState([])
    const rootNode = useRef()
    console.log(rootNode)


    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
            // if (rootNode.current) {
            //     setRooms(rooms)
            //     console.log(rooms)
            // }
            setRooms(rooms)
            console.log(rooms)
        })
    }, [])

    return (
        <div key={rootNode}>
            <h1>Available Rooms</h1>
            <ul>
                {rooms.map(roomID => (
                    <li key={roomID}>
                        {roomID}
                        <button onClick={() => {
                            navigate(`/room/${roomID}`)
                        }}>Join Room</button>
                    </li>
                ))}
            </ul>

            <button onClick={() => {
                navigate(`/room/${v4()}`)
            }}>Create new Room</button>
        </div>

    )
}

export default Main