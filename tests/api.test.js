const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helpers = require('./test_helpers')
const app = require('../app')

const Blog = require('../models/blog')
mongoose.set('bufferTimeoutMS', 30000)

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  const blogObject = helpers.initialBlog.map(blog => new Blog(blog))
  const promiseArray = blogObject.map(blog => blog.save())

  await Promise.all(promiseArray)
})

test('Get blogs', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('ammount of blogs corroborate', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body)
  assert.strictEqual(response.body.length, helpers.initialBlog.length)
})

test('new blog is added to db', async () => {
  await api.post('/api/blogs')
    .send(helpers.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogAtEnd = await helpers.blogInDb()
  assert.strictEqual(blogAtEnd.length, helpers.initialBlog.length + 1)

  const title = blogAtEnd.map(blog => blog.title)
  assert(title.includes('A new blog'))
})

test('a blog without like property is give 0', async () => {
  const response = await api.post('/api/blogs')
    .send(helpers.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blog = await helpers.findBlog(response.body.id)
  assert.strictEqual(blog.likes, 0)
})
after(async () => {
  await mongoose.connection.close()
})