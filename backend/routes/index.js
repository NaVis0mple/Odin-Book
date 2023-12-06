const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../model/user')
const Friendship = require('../model/friendship')
const Post = require('../model/post')
const Comment = require('../model/comment')
const multer = require('multer')
const upload = multer()
const { generateFakeFriendship, generateFakeMeUserObjectId, generateFakePost, generateFakeUsers, generateFakeComment } = require('../seed')
const mongoose = require('mongoose')

/* generateFakeUsers */
router.get('/', async function (req, res, next) {
  await generateFakeUsers(10)
  await generateFakeFriendship(0, 1)
  await generateFakeFriendship(0, 2)
  await generateFakePost(0)
  await generateFakePost(1)
  await generateFakePost(3)

  await generateFakeComment()
  res.json('index')
})

router.post('/login/custom',
  passport.authenticate('custom'),
  async (req, res) => {
    res.json({ authenticated: req.isAuthenticated(), user: req.user })
  })

router.get('/login/facebook', passport.authenticate('facebook', {
  scope: ['email', 'user_photos']
}))

router.get('/login/facebook/callback',
  passport.authenticate('facebook'), function (req, res) {
    res.redirect(process.env.frontendURL_DEVELOPMENT)
  })

router.get('/login/twitter',
  passport.authenticate('twitter'))

router.get('/login/twitter/callback',
  passport.authenticate('twitter'),
  function (req, res) {
    res.redirect(process.env.frontendURL_DEVELOPMENT)
  }
)
router.get('/checkAuth', async (req, res) => {
  if (req.isAuthenticated()) {
    const finduser = await User.find().exec()

    // User is authenticated
    res.json({ authenticated: true, user: req.user })
  } else {
    // User is not authenticated
    res.json({ authenticated: false })
  }
})

router.get('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if (err) { return next(err) }
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: require.user })
    } else {
      res.json({ authenticated: false })
    }
  })
})

router.get('/friendship', async (req, res, next) => {
  const findfriendship = await Friendship.find({
    $or: [{ user: req.user._id }, { friend: req.user._id }
    ]
  }).populate('friend').exec()
  res.json(findfriendship)
})

router.get('/users', async (req, res, next) => {
  const users = await User.find().exec()
  res.json(users)
})

router.get('/me', async (req, res, next) => {
  res.json(req.user)
})

router.post('/friendRequest', upload.none(), async (req, res, next) => { // need body validator
  const friendRequestName = req.body.friendRequestName
  const [first_name, last_name] = friendRequestName.split(' ')
  const findFriendRequestName = await User.findOne({ $and: [{ first_name }, { last_name }] }).exec()

  const findfriendship = await Friendship.findOne({
    $or: [{ user: req.user._id, friend: findFriendRequestName._id }, { user: findFriendRequestName._id, friend: req.user._id }
    ]
  }).exec()
  if (findfriendship) {
    res.json({ status: 1, mes: 'already send friend request' })
  } else if (findFriendRequestName) {
    const newFriendship = new Friendship({
      user: req.user._id,
      friend: findFriendRequestName._id
    })
    await newFriendship.save()
    res.json({ status: 2, mes: 'add friend ', friendid: findFriendRequestName._id, me: req.user })
  } else {
    res.json({ status: 3, mes: friendRequestName + 'not in db' })
  }
})

router.post('/friendRequestRespond', upload.none(), async (req, res, next) => {
  if (req.body.friendRequestAction === 'accept') {
    const findFriendship = await Friendship
      .findByIdAndUpdate(req.body.friendship_id, { status: 'accepted' })
      .populate('friend')
      .populate('user')
      .exec()
    await findFriendship.save()
    res.json({ status: 1, mes: 'he add you', data: findFriendship })
  }
  if (req.body.friendRequestAction === 'reject') {
    const findFriendship = await Friendship
      .findByIdAndDelete(req.body.friendship_id)
      .populate('friend')
      .populate('user')
      .exec()
    res.json({ status: 2, mes: 'he reject you', data: findFriendship })
  }
})

router.get('/post', async (req, res, next) => {
  // find friend post and me post
  // only fetch friend accepted
  const findfriendshipUser = await Friendship.distinct('user', {

    $or: [{ user: req.user._id }, { friend: req.user._id }
    ],
    status: 'accepted'
  }).exec()

  const findfriendshipFriend = await Friendship.distinct('friend', {

    $or: [{ user: req.user._id }, { friend: req.user._id }
    ],
    status: 'accepted'
  }).exec()
  const uniqueUserAndFriendID = [...new Set([...findfriendshipFriend, ...findfriendshipUser])]

  const findPost = await Post.find({ user: { $in: uniqueUserAndFriendID } })
    .populate('user')
    .populate({
      path: 'comment',
      populate: {
        path: 'user', model: 'User'
      }
    })
    .exec()
  res.json(findPost)
})

router.post('/createpost', upload.none(), async (req, res, next) => {
  console.log(req.body)
  console.log(req.user)
  try {
    const newPost = new Post({
      user: req.user._id,
      text: req.body.postText
    })
    const savePost = await newPost.save()
    res.json('createpost')
  } catch (error) {
    res.json(error)
  }
})

router.post('/updatePostLike', async (req, res, next) => {
  for await (const [key, value] of Object.entries(req.body)) {
    const post = await Post.findById(key).exec()

    if (value) {
      if (!post.like.includes(req.user._id)) {
        post.like.push(req.user._id)
        await post.save()
      }
    } else {
      post.like = post.like.filter(id => id.toString() !== req.user._id.toString())
      await post.save()
    }
  }

  res.json('updatelike')
})

router.post('/createComment', upload.none(), async (req, res, next) => {
  try {
    const objectdata = JSON.parse(req.body.newComment)
    const [key, value] = Object.entries(objectdata)[0]
    const PostobjectId = new mongoose.Types.ObjectId(key)
    const newComment = new Comment({
      user: req.user._id,
      post: PostobjectId,
      text: value
    })
    const saveComment = await newComment.save()
    const findPost = await Post.findById(PostobjectId)
    findPost.comment.push(newComment._id)
    const savePost = await findPost.save()
    res.json('create comment')
  } catch (error) {
    console.error(error)
    res.json(error)
  }
})
module.exports = router
