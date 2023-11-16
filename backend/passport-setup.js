const FacebookStrategy = require('passport-facebook').Strategy
require('dotenv').config()

module.exports = new FacebookStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: 'http://localhost:3000/login/facebook/callback'
},
function (accessToken, refreshToken, profile, done) {
  // You can save the user profile information in your database or perform other actions.
  return done(null, profile)
}
)
