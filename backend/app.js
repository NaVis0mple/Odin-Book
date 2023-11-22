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
const CustomStrategy = require('passport-custom').Strategy

const indexRouter = require('./routes/index')
const MongoStore = require('connect-mongo')
const User = require('./model/user')

const { MongoMemoryServer } = require('mongodb-memory-server')
const { generateFakeUsers, generateFakeFriendship, generateFakeMeUserObjectId } = require('./seed')

const app = express()

// mongodb connect
let store // connect-mongo
async function main () {
  let connectionURI
  if (process.env.NODE_ENV === 'test') {
    const mongod = await MongoMemoryServer.create()
    connectionURI = mongod.getUri()
  } else {
    connectionURI = process.env.mongodbURL
  }
  try {
    await mongoose.connect(connectionURI)
    console.log(`Connected to MongoDB at ${connectionURI}`)
    store = MongoStore.create({ mongoUrl: connectionURI }) // connect-mongo
    return connectionURI
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

main()
process.on('SIGINT', async () => { // graceful shutdown
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed due to SIGINT')
    process.exit(0)
  } catch (error) {
    console.error('Error closing MongoDB connection:', error)
    process.exit(1)
  }
})

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
  store,
  cookie: { maxAge: 6000 * 60 * 1000 } // if set ,connect-mongo will get it.
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
    const existingUser = await User.findOne({ email: data.email }).exec()
    // check if existing in db
    if (existingUser) { // update
      existingUser.email = data.email
      existingUser.first_name = data.first_name
      existingUser.last_name = data.last_name
      existingUser.picture = data.picture.data.url
      await existingUser.save()
      return done(null, existingUser)
    }
    if (process.env.NODE_ENV === 'test') {
      const newUser = new User({
        _id: generateFakeMeUserObjectId(), // fixed the admin objectid
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        picture: data.picture.data.url
      })

      await newUser.save()
      generateFakeUsers(3)
      generateFakeFriendship(0)
      generateFakeFriendship(1)
      return done(null, newUser)
    } else {
      const newUser = new User({
        facebookId: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        picture: data.picture.data.url
      })
      await newUser.save()
      return done(null, newUser) // pass to serialize func
    }
  } catch (error) {
    console.error(error)
    return done(error, null)
  }
}))
passport.use(new CustomStrategy(
  async function (req, done) {
    const existingUser = await User.findOne({ email: 'example@example.com' }).exec()
    if (existingUser) {
      return done(null, existingUser)
    }
    const anonymousUser = new User({
      email: 'example@example.com',
      first_name: 'anony',
      last_name: 'mous'
    })
    const save = await anonymousUser.save()
    console.log('hi')
    return done(null, anonymousUser)
  })) // default: user:undefined, deal this in route

passport.serializeUser(function (user, done) {
  // console.log(user) // you can see it pass from return done(null, newUser)
  done(null, user._id) // only save id to session
})

passport.deserializeUser(async function (_id, done) {
  // console.log(_id)
  try {
    const user = await User.findById(_id)
    console.log('de') // this function call every subsequent req after login
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

app.use('/', indexRouter)
// generate fake user

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
