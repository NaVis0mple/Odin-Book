import { useEffect } from 'react'
import './App.css'
import CheckLogin from './checklogin'
import Logout from './Logout'
import FriendList from './FriendList'
import FriendRequest from './FriendRequest'
import { Link } from 'react-router-dom'
import FetchPost from './FetchGetPost.jsx'
import CreatePost from './createPost.jsx'

function App () {
  return (
    <>
      <Logout />
      <CreatePost />
      <Link to='/friend'>Friend</Link>
      <FetchPost />
    </>

  )
}

export default App
