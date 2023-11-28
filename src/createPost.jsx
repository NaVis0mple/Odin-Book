import { useState } from 'react'

function CreatePost () {
  const [textarea, setTextarea] = useState('')

  function handleSubmit () {
    console.log(textarea)
    const formData = new FormData()
    formData.append('postText', textarea)
    const fetchCreatePost = async () => {
      const fetchPost = await fetch('http://localhost:3000/createpost', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const jsonData = await fetchPost.json()
      console.log(jsonData)
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
