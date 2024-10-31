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
  await Blog.insertMany(helpers.initialBlog)
  console.log('cleared')

  // const blogObject = helpers.initialBlog.map(blog => new Blog(blog))
  // const promiseArray = blogObject.map(blog => blog.save())

  // await Promise.all(promiseArray)
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

test('blog without url or title is not stored', async () => {
  const incompleteBlog  = {
    title: 'A new blog',
    author: 'me',
    url: '',
    likes: 8
  }
  await api.post('/api/blogs')
    .send(incompleteBlog)
    .expect(400)
})

test('blog with valid note is deleted', async () => {
  const blogsAtStart = await helpers.blogInDb()
  const blogToDelete = blogsAtStart[1]

  await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const blogAtEnd = await helpers.blogInDb()

  assert(!blogAtEnd.includes(blogToDelete))
  assert.strictEqual(blogAtEnd.length, helpers.initialBlog.length - 1)
})

test('blog info can be updated', async () => {
  const blogsAtStart = await helpers.blogInDb()
  const updatedBlog = blogsAtStart[1]

  updatedBlog.likes = 30
  // console.log("Updated Blog", updatedBlog)

  const response = await api.put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  // console.log(response.body)
  assert.deepStrictEqual(response.body, updatedBlog)
})

after(async () => {
  await mongoose.connection.close()
})