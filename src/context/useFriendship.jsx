import { useState, useEffect, useCallback, useContext, createContext } from 'react'
import { friendshipContext } from './friendshipContext'
const useFriendship = () => {
  const [friendList, setFriendList] = useState([])
  const [pendingList, setPendingList] = useState([])
  const [acceptedList, setAcceptedList] = useState([])
  const fetchFriendShip = useCallback(async () => {
    const fetchData = await fetch(`${import.meta.env.VITE_BACKEND_URL}/friendship`, {
      method: 'GET',
      credentials: 'include'
    })
    const jsonData = await fetchData.json()

    const pending = jsonData
      .filter(obj => obj.status === 'pending')
      .map(obj => ({ name: obj.friend.first_name + ' ' + obj.friend.last_name, id: obj._id, whoSend: obj.user }))
    setPendingList(pending)

    const accepted = jsonData
      .filter(obj => obj.status === 'accepted')
      .map(obj => ({ name: obj.friend.first_name + ' ' + obj.friend.last_name, id: obj._id }))
    setAcceptedList(accepted)
    const getName = jsonData.map(obj => obj.friend.first_name + ' ' + obj.friend.last_name)

    setFriendList(getName)
  }, [])

  return { friendList, pendingList, acceptedList, fetchFriendShip }
}

export const UseFriendshipContext = () => {
  const context = useContext(friendshipContext)
  return context
}

export const FriendshipProvider = ({ children }) => {
  const value = useFriendship()
  return (
    <friendshipContext.Provider value={value}>
      {children}
    </friendshipContext.Provider>
  )
}

// why use useContext is because ,useState will create two diff state if only use useFriendship at two diff component,
// it create two diff state will not effect the other one.

// https://github.com/vitejs/vite/issues/3301
