function CheckLogin () {
  const handleCheck = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/checkAuth`, {
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
          // console.log('pass1')
          console.log('User is authenticated:', data.user)
        } else {
          // console.log('pass2')
          console.log('User is not authenticated.')
        }
      })
      .catch(error => console.error('Error checking authentication:', error))
  }
  return (
    <>
      <div><button onClick={handleCheck}>check</button></div>
      <img src='https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=378431767860102&height=50&width=50&ext=1702719590&hash=AeQLseBUCl6j487B4Jo' />
    </>
  )
}
export default CheckLogin
