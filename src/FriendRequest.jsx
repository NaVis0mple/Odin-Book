import { useEffect, useState } from 'react'
import { UseFriendshipContext } from './useFriendship'
function FriendRequest () {
  const [friendName, setFriendName] = useState('')
  const [userList, setUserList] = useState([])
  const { fetchFriendShip } = UseFriendshipContext()
  const [addFriendClick, setAddFriendClick] = useState(false)
  // get user list
  useEffect(() => {
    try {
      const fetchUserList = async () => {
        const fetchData = await fetch('http://localhost:3000/users', {
          method: 'GET',
          credentials: 'include'
        })
        const jsonData = await fetchData.json()
        const getName = jsonData.map(obj => obj.first_name + ' ' + obj.last_name)
        setUserList(getName)
      }
      fetchUserList()
    } catch (error) {
      console.error(error)
    }
  }, [])
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      fetchPostFriendRequest()
      setAddFriendClick(true)
    }
    if (e.keyCode === 9) {
      e.preventDefault()
      const filteredList = userList.filter((name) =>
        name.toLowerCase().includes(friendName.toLowerCase())
      )
      if (filteredList.length > 0) {
        setFriendName(filteredList[0])
      }
    }
  }
  // post friendRequest
  const fetchPostFriendRequest = async () => {
    const formData = new FormData()
    formData.append('friendRequestName', friendName)
    const post = await fetch('http://localhost:3000/friendRequest', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    const postback = await post.json()
    console.log(postback + 'back')
  }
  useEffect(() => {
    if (addFriendClick) {
      fetchFriendShip()
      setAddFriendClick(false)
    }
  }, [fetchFriendShip, addFriendClick])
  return (
    <div>
      <input
        type='text'
        name='friendRequest'
        value={friendName}
        onKeyDown={handleKeyDown}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <ul>
        {userList
          .filter((name) => name.toLowerCase().includes(friendName.toLowerCase()))
          .map((name, index) => (
            <li key={index} onClick={() => setFriendName(name)}>
              {name}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default FriendRequest
