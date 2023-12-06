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
const TwitterStrategy = require('@passport-js/passport-twitter').Strategy

const indexRouter = require('./routes/index')
const MongoStore = require('connect-mongo')
const User = require('./model/user')

const { MongoMemoryServer } = require('mongodb-memory-server')
const { generateFakeUsers, generateFakeFriendship, generateFakeMeUserObjectId, generateFakePost } = require('./seed')

const app = express()
app.enable('trust proxy')
// mongodb connect

async function main () {
  try {
    let connectionURI
    if (process.env.NODE_ENV === 'development') {
      // const mongod = await MongoMemoryServer.create()
      // connectionURI = mongod.getUri()
      connectionURI = process.env.mongodbURL
    } else {
      connectionURI = process.env.mongodbURL
    }
    await mongoose.connect(connectionURI)
    console.log(`Connected to MongoDB at ${connectionURI}`)
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
  store: MongoStore.create({
    mongoUrl: process.env.mongodbURL
  }),
  cookie: {
    maxAge: 6000 * 60 * 1000,
    secure: process.env.NODE_ENV !== 'development', // For HTTPS connections
    sameSite: process.env.NODE_ENV === 'development' ? '' : 'none'
  } // if set ,connect-mongo will get it.
}))
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
app.use(passport.initialize())
app.use(passport.session())

passport.use(new FacebookStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: `${process.env.NODE_ENV === 'development' ? process.env.backendURL_DEVELOPMENT : process.env.backendURL_PRODUCTION}login/facebook/callback`,
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
    if (process.env.NODE_ENV === 'development') {
      const newUser = new User({
        _id: generateFakeMeUserObjectId(), // fixed the admin objectid
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        picture: data.picture.data.url
      })

      await newUser.save()

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

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: `${process.env.NODE_ENV === 'development' ? process.env.backendURL_DEVELOPMENT : process.env.backendURL_PRODUCTION}login/twitter/callback`,
  includeEmail: true
},
async function (token, tokenSecret, profile, done) {
  const data = profile

  console.log(data.id)
  console.log(data.username)
  console.log(data.emails[0].value)
  console.log(data.photos[0].value)

  // {
  //   id: '2364366926',
  //   username: '_____Kappa_____',
  //   displayName: '¯\\_(ヅ)_/¯',
  //   emails: [ { value: 'yudj3ej8@gmail.com' } ],
  //   photos: [
  //     {
  //       value: 'https://pbs.twimg.com/profile_images/1491107434403807232/x-enYWsJ_normal.jpg'
  //     }
  //   ],

  try {
    const existingUser = await User.findOne({ email: data.emails[0].value }).exec()
    // check if existing in db
    if (existingUser) { // update
      existingUser.email = data.emails[0].value
      existingUser.first_name = data.username
      existingUser.last_name = data.displayname
      existingUser.picture = data.photos[0].value
      await existingUser.save()
      return done(null, existingUser)
    } else {
      const newUser = new User({
        facebookId: data.id,
        email: data.emails[0].value,
        first_name: data.username,
        last_name: data.displayname,
        picture: data.photos[0].value

      })
      await newUser.save()
      return done(null, newUser) // pass to serialize func
    }
  } catch (error) {
    console.error('Error in Twitter authentication:', error)
    return done(error, null)
  }
}))

app.use('/', indexRouter)
// generate fake user

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err.stack)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json('error')
})

module.exports = app
