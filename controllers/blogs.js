const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
  // logger.error("Error getting document ", error.message)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog(body)
  // logger.info("blog", blog)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogRouter