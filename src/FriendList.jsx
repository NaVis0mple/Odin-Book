import { useState, useEffect, useCallback } from 'react'

function FriendList () {
  const [friendList, setFriendList] = useState([])
  const [pendingList, setPendingList] = useState([])
  const [acceptedList, setAcceptedList] = useState([])
  const [me, setMe] = useState()

  useEffect(() => {
    const fetchMe = async () => {
      const fetchData = await fetch('http://localhost:3000/me', {
        method: 'GET',
        credentials: 'include'
      })
      const jsonData = await fetchData.json()
      setMe(jsonData)
    }
    fetchMe()
  }, [])

  const fetchFriendShip = useCallback(async () => {
    const fetchData = await fetch('http://localhost:3000/friendship', {
      method: 'GET',
      credentials: 'include'
    })
    const jsonData = await fetchData.json()
    console.log(jsonData)
    const pending = jsonData
      .filter(obj => obj.status === 'pending')
      .map(obj => ({ name: obj.friend.first_name + ' ' + obj.friend.last_name, id: obj._id, whoSend: obj.user }))
    setPendingList(pending)

    const accepted = jsonData
      .filter(obj => obj.status === 'accepted')
      .map(obj => ({ name: obj.friend.first_name + ' ' + obj.friend.last_name, id: obj._id }))
    setAcceptedList(accepted)
    const getName = jsonData.map(obj => obj.friend.first_name + ' ' + obj.friend.last_name)
    console.log(getName)
    setFriendList(getName)
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
    const fetchData = await fetch('http://localhost:3000/friendRequestRespond', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    const response = await fetchData.json()
    console.log(response)
    fetchFriendShip()
  }

  const handleReject = async (id) => {
    const formData = new FormData()
    formData.append('friendRequestAction', 'reject')
    formData.append('friendship_id', id)
    const fetchData = await fetch('http://localhost:3000/friendRequestRespond', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    const response = await fetchData.json()
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
