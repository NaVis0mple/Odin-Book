import { useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { socketioContext } from '../context/socketioConetxt'

export const SocketProvider = ({ children }) => {
  const socket = useRef(null)

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_URL, {
      'force new connection': true,
      reconnectionAttempts: 'Infinity',
      timeout: 10000,
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: false
    })
    socket.current.connect()
    socket.current.on('connect', () => {
      console.log('socketio Connected to the server')
    })

    // Disconnect event
    socket.current.on('disconnect', () => {
      console.log('socketio Disconnected from the server')
    })
    return () => {
      socket.current.disconnect()
      socket.current.off('connect')
      socket.current = null
    }
  }, [])
  return (
    <socketioContext.Provider value={socket}>
      {children}
    </socketioContext.Provider>
  )
}

export const UseSocket = () => useContext(socketioContext)
