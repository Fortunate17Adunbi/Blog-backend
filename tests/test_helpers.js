const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
  {
    title: 'How to write html',
    author: 'James brown',
    url: 'http://blog.cleancoder.com/How-to-write-html',
    likes: 10
  },
  {
    title: 'writting test from backend',
    author: 'Lucy perry',
    url: 'http://blog.cleancoder.com/writting-test-from-backend',
    likes: 20
  }
]

const newBlog = {
  title: 'A new blog',
  author: 'me',
  url: 'http://blog.react.com/A-new-blog',
  likes: ''
}

const blogInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const findBlog = async (id) => {
  console.log("blog title", id)
  const blog = await Blog.findById(id)
  // console.log("blog",blog)
  return blog
}

const userInDb = async () => {
  const blog = await User.find({})
  return blog
}
module.exports = {
  initialBlog, blogInDb, newBlog, findBlog, userInDb
}