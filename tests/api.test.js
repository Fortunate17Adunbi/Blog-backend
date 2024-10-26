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

  const blogObject = helpers.initialBlog.map(blog => new Blog({blog}))
  const promiseArray = blogObject.map(blog => blog.save())

  await Promise.all(promiseArray)
})

test('Get notes', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('ammount of notes corroborate', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helpers.initialBlog.length)
})
after(async () => {
  await mongoose.connection.close()
})