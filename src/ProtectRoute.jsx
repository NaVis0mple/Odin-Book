import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectRoute = ({ children }) => {
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    fetch('http://localhost:3000/checkAuth', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        if (data.authenticated === true) {
          // console.log('User is authenticated:', data.user)
          setAuth(true)
        } else {
          // console.log('User is not authenticated.Route is Protected')
          setAuth(false)
          navigate('/login')
        }
      })
      .catch(error => console.error('Error checking authentication:', error))
  }, [navigate])

  return (
    <>
      {auth === true ? children : null}
    </>
  )
}
export default ProtectRoute
