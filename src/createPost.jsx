import { useState } from 'react'
import { UsePostContext } from './context/usePost'

function CreatePost () {
  const [textarea, setTextarea] = useState('')
  const { fetchPost, setLike, clickLike, setClickLike, like, post } = UsePostContext()

  function handleSubmit () {
    console.log(textarea)
    const formData = new FormData()
    formData.append('postText', textarea)
    const fetchCreatePost = async () => {
      const fetchPostResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/createpost`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const jsonData = await fetchPostResponse.json()
      console.log(jsonData)
      await fetchPost()
      setTextarea('')
    }
    fetchCreatePost()
  }
  return (
    <div>
      <textarea name='post' id='post' cols='30' rows='10' value={textarea} onChange={(e) => setTextarea(e.target.value)} />
      <button type='submit' onClick={() => handleSubmit()}>create post </button>
    </div>
  )
}

export default CreatePost
