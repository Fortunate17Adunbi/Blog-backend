const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => {
      logger.error("Error getting document ", error.message)
    })
})

blogRouter.post('/', (request, response) => {
  const body = request.body

  const blog = new Blog(request.body)
  logger.info("blog", blog)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => {
      logger.error("Error adding blog", error.message)
    })
})

module.exports = blogRouter