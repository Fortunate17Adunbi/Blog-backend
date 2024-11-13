const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')

//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { name: 1, username: 1 })
  // logger.info("blogs from route handler",blogs)
  response.json(blogs)
  // logger.error("Error getting document ", error.message)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  logger.info('decoded token ', decodedToken)
  logger.info('username', request.user)
  // if(!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }

  if (!body.title || !body.url) {
    response.status(400).end()
  }

  const user = await User.findById(decodedToken.id)
  console.log('user',user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })


  const savedBlog = await blog.save()
  logger.info('saved Blog', savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  logger.info(decodedToken)
  
  const blog = await Blog.findById(request.params.id)
  logger.info('username', request.user)

  // if blog does not exist
  logger.info('blog user id', blog.user.toString())
  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'Not creator of blog' })
  }

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