import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '@mdi/react'
import { mdiThumbUpOutline, mdiThumbUp } from '@mdi/js'
import moment from 'moment'
import { UsePostContext } from './context/usePost'

const FetchPost = () => {
  const { fetchPost, setLike, clickLike, setClickLike, like, post } = UsePostContext()
  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  // like button
  async function handleLikeButtonClick (postId) {
    setLike((preLike) => ({
      ...preLike,
      [postId]: !preLike[postId]
    }))
    setClickLike(true)
  }

  useEffect(() => {
    if (!clickLike) { return }
    const updatePostLike = async () => {
      const fetchLike = await fetch('http://localhost:3000/updatePostLike', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(like)
      })
      const json1 = await fetchLike.json()
      console.log(json1)
      fetchPost()
    }
    updatePostLike()

    setClickLike(false)
  }, [like, clickLike, fetchPost, setClickLike])

  // create comment
  const [createComment, setCreateComment] = useState({})
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const formData = new FormData()
      formData.append('newComment', JSON.stringify(createComment))
      const fetchCreateCommentPost = async () => {
        const fetchdata = await fetch('http://localhost:3000/createComment', {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        const jsondata = await fetchdata.json()
        setCreateComment({})
        fetchPost()
      }

      fetchCreateCommentPost()
    }
  }
  return (
    <>
      {post
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(p =>
          <div key={p._id}>
            <div style={{ color: 'green' }}>{p.user.first_name + ' ' + p.user.last_name}</div>
            <div>{moment(p.timestamp).format('MM DD YYYY,  HH:mm:ss')} {moment(p.timestamp).fromNow()}  </div>
            <div>{p.text}</div>
            <div>
              <div>{p.like.length}</div>
              <button onClick={() => {
                handleLikeButtonClick(p._id)
              }}
              >
                {like[p._id]
                  ? (
                    <div>
                      <Icon path={mdiThumbUp} size={1} />

                    </div>
                    )
                  : (
                    <div>
                      <Icon path={mdiThumbUpOutline} size={1} />

                    </div>
                    )}

              </button>
            </div>
            <div>
              {p.comment.map(comment =>
                <div key={comment._id}>
                  <div style={{ color: 'red' }}>{comment.user.first_name + ' ' + comment.user.last_name}</div>
                  <div>{comment.text}</div>

                </div>)}
            </div>
            <div>
              <input
                type='text'
                name={p._id}
                value={Object.keys(createComment)[0] === p._id ? Object.values(createComment)[0] : ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  setCreateComment({ [p._id]: value })
                  console.log(Object.entries(createComment)[0])
                }}
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>
          </div>)}
    </>
  )
}

export default FetchPost
