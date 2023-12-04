import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Link, Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements, useNavigate } from 'react-router-dom'
import Login from './Login.jsx'
import ProtectRoute from './ProtectRoute.jsx'
import FriendList from './FriendList.jsx'
import Logout from './Logout.jsx'
import FriendRequest from './FriendRequest.jsx'
import CreatePost from './createPost.jsx'
import { FriendshipProvider } from './context/useFriendship.jsx'
import { PostContextProvider } from './context/usePost.jsx'
import Icon from '@mdi/react'
import { mdiHome } from '@mdi/js'
import { SocketProvider } from './socketio/socketio.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/Odin-Book/'>
      <Route
        path='/Odin-Book/'
        element={
          <ProtectRoute>
            <SocketProvider>
              <PostContextProvider>
                <App />
              </PostContextProvider>
            </SocketProvider>
          </ProtectRoute>
}
      />
      <Route
        path='/Odin-Book/login'
        element={<Login />}
      />
      <Route
        path='/Odin-Book/friend'
        element={
          <ProtectRoute>
            <SocketProvider>
              <FriendshipProvider>
                <Link to='/Odin-Book/'><Icon path={mdiHome} size={1} /></Link>
                <Logout />
                <FriendList />
                <FriendRequest />
              </FriendshipProvider>
            </SocketProvider>
          </ProtectRoute>
}
      />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <RouterProvider router={router} />

  </React.StrictMode>
)
