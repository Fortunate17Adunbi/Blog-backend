const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  // console.log("blogs from route handler",blogs)
  response.json(blogs)
  // logger.error("Error getting document ", error.message)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (!body.title || !body.url) {
    response.status(400).end()
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put(('/:id'), async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  // console.log("blog from router", blog)
  const returnedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, context: 'query', runValidators: true })
  // console.log("returned blog from router", returnedBlog)
  response.json(returnedBlog)
})

module.exports = blogRouter