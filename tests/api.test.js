const {test, after} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const blog = require('../models/blog')
mongoose.set('bufferTimeoutMS', 30000)

const api = supertest(app)

test('Get notes', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('ammount of notes corroborate', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 8)
})
after(async () => {
  await mongoose.connection.close()
})