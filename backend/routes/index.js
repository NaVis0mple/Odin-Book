const express = require('express')
const router = express.Router()
const controller_login = require('../controller/login')
const passport = require('passport')
const User = require('../model/user')
const Friendship = require('../model/friendship')
const multer = require('multer')
const upload = multer()

/* GET home page. */
router.get('/', async function (req, res, next) {
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

router.get('/login/facebook/callback', passport.authenticate('facebook'), function (req, res) {
  console.log(req.isAuthenticated())
  res.redirect('http://localhost:5173/')
})

router.get('/checkAuth', async (req, res) => {
  if (req.isAuthenticated()) {
    const finduser = await User.find().exec()
    console.log(finduser)

    // User is authenticated
    console.log('pass1')
    res.json({ authenticated: true, user: req.user })
  } else {
    // User is not authenticated
    console.log('pass2')
    res.json({ authenticated: false })
  }
})

router.get('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if (err) { return next(err) }
    if (req.isAuthenticated()) {
      console.log('pass1')
      res.json({ authenticated: true, user: require.user })
    } else {
      console.log('pass2')
      res.json({ authenticated: false })
    }
  })
})

router.get('/friendship', async (req, res, next) => {
  const findfriendship = await Friendship.find({
    $or: [{ user: req.user._id }, { friend: req.user._id }
    ]
  }).populate('friend').exec()
  console.log(findfriendship)
  res.json(findfriendship)
})

router.get('/users', async (req, res, next) => {
  const users = await User.find().exec()
  res.json(users)
})

router.get('/me', async (req, res, next) => {
  console.log(req.user)
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
    res.json('already send friend request')
  }
  if (findFriendRequestName) {
    const newFriendship = new Friendship({
      user: req.user._id,
      friend: findFriendRequestName._id
    })
    await newFriendship.save()
    res.json('add friend ')
  } else {
    res.json(friendRequestName + 'not in db')
  }
})

router.post('/friendRequestRespond', upload.none(), async (req, res, next) => {
  console.log(req.body.friendRequestAction)
  console.log(req.body.friendship_id)
  if (req.body.friendRequestAction === 'accept') {
    const findFriendship = await Friendship.findByIdAndUpdate(req.body.friendship_id, { status: 'accepted' }).exec()
    await findFriendship.save()
  }
  if (req.body.friendRequestAction === 'reject') {
    const findFriendship = await Friendship.findByIdAndDelete(req.body.friendship_id).exec()
  }
  res.json('hi')
})
module.exports = router
