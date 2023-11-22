const mongoose = require('mongoose')

const FriendshipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
})

FriendshipSchema.index({ user: 1, friend: 1 }, { unique: true })
module.exports = mongoose.model('Friend', FriendshipSchema)
