import { useEffect } from 'react'
import './App.css'
import CheckLogin from './checklogin'
import Logout from './Logout'
import FriendList from './FriendList'
import FriendRequest from './FriendRequest'
import { Link } from 'react-router-dom'

function App () {
  return (
    <>
      <Logout />
      <Link to='/friend'>Friend</Link>
    </>

  )
}

export default App
