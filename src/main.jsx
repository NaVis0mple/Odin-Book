import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, Routes, createBrowserRouter, createRoutesFromElements, useNavigate } from 'react-router-dom'
import Login from './Login.jsx'
import ProtectRoute from './ProtectRoute.jsx'

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
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
