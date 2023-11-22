const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  facebookId: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  picture: { type: String }
})
module.exports = mongoose.model('User', UserSchema)
