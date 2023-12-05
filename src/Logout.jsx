import { useNavigate } from 'react-router-dom'

function Logout () {
  const navigate = useNavigate()
  const handleCheck = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
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
        if (data.authenticated) {
          console.log('pass1')
          console.log('User is authenticated:', data.user)
        } else {
          console.log('pass2')
          console.log('User is not authenticated.')
          navigate('/Odin-Book/login')
        }
      })
      .catch(error => console.error('Logout:', error))
  }
  return (
    <div><button onClick={handleCheck}>logout</button></div>
  )
}
export default Logout
