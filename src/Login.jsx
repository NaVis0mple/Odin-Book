import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login () {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  // this not work
  // const handleClick = () => {
  //   fetch('http://localhost:3000/login/facebook', {
  //     method: 'GET',
  //     credentials: 'include'
  //   })
  //     // .then(response => {
  //     //   if (!response.ok) {
  //     //     throw new Error(`HTTP error! Status: ${response.status}`)
  //     //   }
  //     //   return response.json()
  //     // })
  //     // .then(data => {
  //     //   if (data.authenticated === true) {
  //     //     console.log('pass1')
  //     //     console.log('User is authenticated:', data.user)
  //     //     navigate('/')
  //     //   } else {
  //     //     console.log('pass2')
  //     //     console.log('User is not authenticated.')
  //     //     navigate('/login')
  //     //   }
  //     // })
  //     .catch(error => console.error('Error checking authentication:', error))
  // }

  return (
    <div>
      <a href='http://localhost:3000/login/facebook' className='btn btn-primary'><span className='fa fa-facebook' /> Login with Facebook</a>
    </div>
  )
}

export default Login
