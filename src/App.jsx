import { useEffect } from 'react'
import './App.css'
import CheckLogin from './checklogin'
import Logout from './Logout'
import FriendList from './FriendList'
import FriendRequest from './FriendRequest'
import { Link } from 'react-router-dom'
import FetchPost from './FetchGetPost.jsx'
import CreatePost from './createPost.jsx'
import { PostContextProvider } from './context/usePost.jsx'
import Icon from '@mdi/react'
import { mdiAccountGroup } from '@mdi/js'

function App () {
  return (
    <>
      <Link to='/friend'><Icon path={mdiAccountGroup} size={1} /></Link>
      <Logout />
      <CreatePost />
      <FetchPost />
    </>

  )
}

export default App
