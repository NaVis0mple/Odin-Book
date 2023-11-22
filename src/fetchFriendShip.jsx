import { useState, useEffect, useCallback } from 'react'

const fetchFriendShip = useCallback(async () => {
  const [friendList, setFriendList] = useState([])
  const [pendingList, setPendingList] = useState([])
  const [acceptedList, setAcceptedList] = useState([])
  const fetchData = await fetch('http://localhost:3000/friendship', {
    method: 'GET',
    credentials: 'include'
  })
  const jsonData = await fetchData.json()
  console.log(jsonData)
  const pending = jsonData
    .filter(obj => obj.status === 'pending')
    .map(obj => ({ name: obj.friend.first_name + ' ' + obj.friend.last_name, id: obj._id }))
  setPendingList(pending)

  const accepted = jsonData
    .filter(obj => obj.status === 'accepted')
    .map(obj => ({ name: obj.friend.first_name + ' ' + obj.friend.last_name, id: obj._id }))
  setAcceptedList(accepted)
  const getName = jsonData.map(obj => obj.friend.first_name + ' ' + obj.friend.last_name)
  console.log(getName)
  setFriendList(getName)
}, [])
