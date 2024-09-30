const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => {
      console.log("Error getting document ", error.message)
    })
})

blogRouter.post('/', (request, response) => {
  const body = request.body

  const blog = new Blog(request.body)
  console.log("blog", blog)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => {
      console.error("Error adding blog", error.message)
    })
})

module.exports = blogRouter