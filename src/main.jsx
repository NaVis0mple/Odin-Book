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
import { FriendshipProvider } from './useFriendship.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path='/'
        element={<ProtectRoute><App /></ProtectRoute>}
      />
      <Route
        path='/login'
        element={<Login />}
      />

      <Route
        path='/friend'
        element={
          <ProtectRoute>
            <FriendshipProvider>
              <Link to='/'>home</Link>
              <Logout />
              <FriendList />
              <FriendRequest />
            </FriendshipProvider>
          </ProtectRoute>
}
      />
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
