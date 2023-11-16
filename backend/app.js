const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
// const facebookStrategy = require('./passport-setup')
require('dotenv').config()
const FacebookStrategy = require('passport-facebook').Strategy

const indexRouter = require('./routes/index')
const MongoStore = require('connect-mongo')
const User = require('./model/user')
const { fdatasync } = require('fs')

const app = express()

// mongodb connect

main().catch(err => console.log(err))
async function main () {
  await mongoose.connect(process.env.mongodbURL)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors({
  origin: true, // this is really important
  credentials: true

}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// passport session
app.use(session({
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.mongodbURL })
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new FacebookStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: 'http://localhost:3000/login/facebook/callback',
  profileFields: ['email', 'picture', 'name']
}, async function (accessToken, refreshToken, profile, done) {
  const data = profile._json

  //   email: 'navis0mple@gmail.com',
  //   picture: {
  //     data: {
  //       height: 50,
  //       is_silhouette: false,
  //       url: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=378431767860102&height=50&width=50&ext=1702738813&hash=AeQEdNtq_oGrAY6Jr2M',
  //       width: 50
  //     }
  //   },
  //   last_name: 'Doge',
  //   first_name: 'Do',
  //   id: '378431767860102'

  try {
    const existingUser = await User.findOne({ facebookId: data.id }).exec()
    // check if existing in db
    if (existingUser) { // update
      existingUser.email = data.email
      existingUser.first_name = data.first_name
      existingUser.last_name = data.last_name
      existingUser.picture = data.picture.data.url
      await existingUser.save()
      return done(null, existingUser)
    }

    const newUser = new User({
      facebookId: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      picture: data.picture.data.url
    })

    await newUser.save()
    return done(null, newUser) // pass to serialize func
  } catch (error) {
    console.error(error)
    return done(error, null)
  }
}))

passport.serializeUser(function (user, done) {
  console.log(user) // you can see it pass from return done(null, newUser)
  done(null, user.facebookId) // only save id to session
})

passport.deserializeUser(function (obj, done) {
  console.log('de') // this function call every subsequent req after login
  done(null, obj)
})

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json('error')
})

module.exports = app
