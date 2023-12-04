import { useState, useEffect, useCallback } from 'react'
import { UseFriendshipContext } from './context/useFriendship'
import { UseSocket } from './socketio/socketio'

function FriendList () {
  const [me, setMe] = useState()
  const { friendList, pendingList, acceptedList, fetchFriendShip } = UseFriendshipContext()
  const socket = UseSocket().current
  // socket
  useEffect(() => {
    if (!socket) { return } // if refresh socket may not be create first
    if (me) {
      // add to connect array
      socket.emit('connectinfo', { userid: me._id })
    }
    socket.on('friendAddNotify', status => {
      if (status) {
        alert('someoneaddyou')
        fetchFriendShip()
      }
    })

    socket.on('friendAcceptedNotify', data => {
      if (data) {
        alert(data + ' ' + 'accepted')
        fetchFriendShip()
      }
    })

    socket.on('friendRejectedNotify', data => {
      if (data) {
        alert(data + ' ' + 'rejected')
        fetchFriendShip()
      }
    })

    return () => {
      socket.off('friendAddNotify')
      socket.off('friendAcceptedNotify')
      socket.off('friendRejectedNotify')
    }
  }, [me, socket, fetchFriendShip])
  // me

  useEffect(() => {
    const fetchMe = async () => {
      const fetchData = await fetch(`${import.meta.env.VITE_BACKEND_URL}/me`, {
        method: 'GET',
        credentials: 'include'
      })
      const jsonData = await fetchData.json()
      setMe(jsonData)
    }
    fetchMe()
  }, [])

  useEffect(() => {
    try {
      fetchFriendShip()
    } catch (error) {
      console.error(error)
    }
  }, [fetchFriendShip])

  const handleAccept = async (id) => {
    const formData = new FormData()
    formData.append('friendRequestAction', 'accept')
    formData.append('friendship_id', id)
    const fetchData = await fetch(`${import.meta.env.VITE_BACKEND_URL}/friendRequestRespond`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    const response = await fetchData.json()
    socket.emit('friendRequestAcceptedNotification', response.data)
    console.log(response)
    fetchFriendShip()
  }

  const handleReject = async (id) => {
    const formData = new FormData()
    formData.append('friendRequestAction', 'reject')
    formData.append('friendship_id', id)
    const fetchData = await fetch(`${import.meta.env.VITE_BACKEND_URL}/friendRequestRespond`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    const response = await fetchData.json()
    socket.emit('friendRequestRejectedNotification', response.data)
    console.log(response)
    fetchFriendShip()
  }

  return (
    <div>
      <p>{me ? 'whoisme' + ' : ' + me.email : ''}</p>
      <p>pending</p>
      <ul>
        {pendingList.map(item =>
          <div key={item.id}>
            <li>
              {item.name}
            </li>
            {item.whoSend === me._id
              ? (
                  'waiting'
                )
              : (
                <>
                  <button onClick={() => handleAccept(item.id)}>V</button>
                  <button onClick={() => handleReject(item.id)}>X</button>
                </>
                )}
          </div>
        )}
      </ul>
      <p>accepted</p>
      <ul>
        {acceptedList.map(item =>
          <div key={item.id}>
            <li>
              {item.name}
            </li>
          </div>
        )}
      </ul>
    </div>
  )
}

export default FriendList
