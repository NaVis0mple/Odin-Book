import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login () {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/login/custom', {
      method: 'POST',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        if (data.authenticated && data.user) {
          navigate('/')
        }
        console.log(data)
      })
      .catch(error => console.error('Error checking authentication:', error))
  }

  return (
    <div>
      <a href='http://localhost:3000/login/facebook' className='btn btn-primary'><span className='fa fa-facebook' /> Login with Facebook</a>
      <a href='#' onClick={(e) => handleClick(e)}>local login</a>
    </div>
  )
}

export default Login
