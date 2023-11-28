// generate in http://localhost:3000/
const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')
const User = require('./model/user')
const Friendship = require('./model/friendship')
const Post = require('./model/post')
const Comment = require('./model/comment')

faker.seed(5)

const generateFakeUsers = async (num) => {
  try {
    for (let i = 0; i < num; i++) {
      const newUser = new User({
        _id: faker.database.mongodbObjectId(),
        email: faker.internet.email(),
        // facebookId: faker.string.numeric(15),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        picture: faker.image.url()
      })
      const saveUser = await newUser.save()
    }
  } catch (error) {
    console.error(error)
  }
}
const generateFakeFriendship = async (arrayIndex1, arrayIndex2) => {
  // const Admin = await User.findOne({ email: process.env.testEmail }).exec()
  // const Userlist = await User.find({ $nor: [{ email: process.env.testEmail }] }).exec() // not include admin
  // seed 5
  try {
    const Userlist = await User.find().exec()

    const newFriendship = new Friendship({
      user: Userlist[arrayIndex1]._id,
      friend: Userlist[arrayIndex2]._id,
      status: 'accepted'
    })
    const saveFriendship = await newFriendship.save()
  } catch (error) {
    console.error(error)
  }
}

const generateFakeMeUserObjectId = () => { // fix the admin objectid
  const ObjectId = faker.database.mongodbObjectId()
  return ObjectId
}

const generateFakePost = async (postAuthorIndex) => {
  const Userlist = await User.find().exec()
  const newPost = new Post({
    user: Userlist[postAuthorIndex]._id,
    text: faker.lorem.paragraph(),
    like: [Userlist[postAuthorIndex]._id, Userlist[5]._id]
  })

  console.log(Userlist.length)

  const savePost = await newPost.save()
}

const generateFakeComment = async () => {
  const numberOfComment = 4
  const PostList = await Post.find().exec()
  const Userlist = await User.find().exec()
  for (let i = 0; i < numberOfComment; i++) {
    const newComment = new Comment({
      post: PostList[0]._id,
      user: Userlist[i % Userlist.length]._id,
      text: faker.lorem.paragraph()
    })
    PostList[0].comment.push(newComment._id)
    const saveComment = await newComment.save()
    const savePost = await PostList[0].save()
  }
}

module.exports = { generateFakeUsers, generateFakeFriendship, generateFakeMeUserObjectId, generateFakePost, generateFakeComment }

// email:'navis0mple@gmail.com'
// facebookId:'378431767860102' 15
// first_name:'Do'
// last_name: 'Doge'
// picture: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=378431767860102&height=50&width=50&ext=1702908395&hash=AeTTrfJJA8XK5KnwUUU'
