// generate when login, so is position at new FacebookStrategy
const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')
const User = require('./model/user')
const Friendship = require('./model/friendship')

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
const generateFakeFriendship = async (arrayIndex) => {
  const Admin = await User.findOne({ email: process.env.testEmail }).exec()
  const Userlist = await User.find({ $nor: [{ email: process.env.testEmail }] }).exec() // not include admin
  // seed 5
  try {
    const newFriendship = new Friendship({
      user: Admin._id, // is fixed when test env
      friend: Userlist[arrayIndex]._id // fixed
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

module.exports = { generateFakeUsers, generateFakeFriendship, generateFakeMeUserObjectId }

// email:'navis0mple@gmail.com'
// facebookId:'378431767860102' 15
// first_name:'Do'
// last_name: 'Doge'
// picture: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=378431767860102&height=50&width=50&ext=1702908395&hash=AeTTrfJJA8XK5KnwUUU'
