const express = require('express')
const router = express.Router()
const controller_login = require('../controller/login')
const passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json('index')
})

router.get('/login/facebook', passport.authenticate('facebook', {
  scope: 'email'
}))

router.get('/login/facebook/callback', passport.authenticate('facebook'), function (req, res) {
  console.log(req.isAuthenticated())
  res.redirect('http://localhost:5173/')
})

router.get('/checkAuth', (req, res) => {
  if (req.isAuthenticated()) {
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
module.exports = router
