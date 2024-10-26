require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)


const url = process.env.TEST_MONGODB_URI
// console.log("url",url)
mongoose.set('strictQuery', false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'How to write html',
  author: 'James brown',
  likes: 10
})

blog.save().then(() => {
  console.log('blog saved!')
  mongoose.connection.close()
})