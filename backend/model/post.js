const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  like: { type: Number, default: 0 },
  comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})
module.exports = mongoose.model('Post', PostSchema)
