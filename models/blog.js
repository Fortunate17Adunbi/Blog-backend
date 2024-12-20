const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, transformedObject) => {
    transformedObject.id = transformedObject._id.toString() 
    delete transformedObject._id
    delete transformedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)