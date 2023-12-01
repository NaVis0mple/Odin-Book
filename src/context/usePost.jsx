import { useState, useEffect, useContext, createContext, useCallback } from 'react'
import { PostContext } from './postContext'
const usePost = () => {
  const [post, setPost] = useState([])
  const [like, setLike] = useState({})
  const [me, setMe] = useState('')
  const [clickLike, setClickLike] = useState(false)

  // fetch posts
  const fetchPost = useCallback(async () => {
    // me
    const fetchMe = async () => {
      const fetchData = await fetch('http://localhost:3000/me', {
        method: 'GET',
        credentials: 'include'
      })
      const jsonData = await fetchData.json()
      setMe(jsonData)
    }
    fetchMe()

    const fetchData = await fetch('http://localhost:3000/post', {
      method: 'GET',
      credentials: 'include'
    })
    const jsonData = await fetchData.json()
    setPost(jsonData)

    for (const post of jsonData) {
      if (post.like.includes(me._id)) {
        setLike(preLike => ({ ...preLike, [post._id]: true }))
      } else {
        setLike(preLike => ({ ...preLike, [post._id]: false }))
      }
    }
  }, [me._id])
  const object = { fetchPost, setLike, clickLike, setClickLike, like, post }
  return object
}

export const UsePostContext = () => {
  const context = useContext(PostContext)
  return context
}

export const PostContextProvider = ({ children }) => {
  const value = usePost()
  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  )
}

// same use as useFriendship, at FetchGetPost.jsx , createPost.jsx

// https://github.com/vitejs/vite/issues/3301
