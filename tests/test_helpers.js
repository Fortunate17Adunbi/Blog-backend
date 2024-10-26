const Blog = require('../models/blog')

const initialBlog = [
  {
    title: 'How to write html',
    author: 'James brown',
    likes: 10
  },
  {
    title: 'writting test from backend',
    author: 'Lucy perry',
    likes: 20
  }
]

const noteInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlog, noteInDb
}