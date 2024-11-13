const mongoose = require('mongoose')

const usernameReg = /^[a-zA-Z][a-zA-Z0-9]*/
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    unique: true,
    required: true,
    validate: {
      validator: (text) => {
        return usernameReg.test(text)
      },
      message: 'username must start with alphabet and only contain alphanumeric values'
    }
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, transformedObject) => {
    transformedObject.id = transformedObject._id.toString()
    delete transformedObject._id
    delete transformedObject.__v
    delete transformedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)