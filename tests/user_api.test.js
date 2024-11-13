const { test, beforeEach, describe, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helpers = require('./test_helpers')
const User = require('../models/user')
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const bcrypt = require('bcryptjs')

mongoose.set('bufferTimeoutMS', 30000)



describe('Adding user', () => {
  beforeEach(async () => {
    await User.deleteMany()
    console.log('cleared')
  })
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'cip',
      name: 'Incognito',
      password: 'cip450'
    }

    const userAtStart = await helpers.userInDb()
    console.log('users db', userAtStart)

    const respone = await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    console.log('response  ', respone.body)
    const userAtEnd = await helpers.userInDb()
    const username = userAtEnd.map(user => user.username)
    assert.strictEqual(userAtEnd.length, 1)
    assert(username.includes(newUser.username))
  })

  test('invalid user cannot be added', async () => {
    const newUser = {
      username: 'cip',
      name: 'Incognito',
      password: 'ci'
    }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    console.log('response', response.body)
    
    const userAtEnd = await helpers.userInDb()
    assert.strictEqual(userAtEnd.length, 0)
  })

})

describe('Authenticating users', () => {
  beforeEach(async () => {
    await User.deleteMany()
    logger.info('cleared')

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ name: 'cip', username: 'root', passwordHash })
    user.save()
  })

  test('user can login succesfully', async () => {
    const response = await api.post('/api/login')
      .send({ username: 'root', password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    logger.info('respone ', response.body)
  })

  test('login fails with invalid parameter', async () => {
    const response = await api.post('/api/login')
      .send({ username: 'root', password: '' })
      .expect(401)

    logger.info('response', response.body)
  })
})

describe('adding blog', () => {
  beforeEach(async () => {
    await User.deleteMany()
    logger.info('cleared')
    await Blog.deleteMany()
    logger.info('cleared')

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ name: 'cip', username: 'root', passwordHash })
    user.save()
  })

  test('verified user can add blog', async () => {
    const response = await api.post('/api/login')
      .send({ username: 'root', password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log('respone', response.body)
    const blogAtStart = await helpers.blogInDb()
    console.log('blog at start', blogAtStart)

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send(helpers.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await helpers.blogInDb()
    assert.strictEqual(blogAtEnd.length, 1)
  })

  test('fails with invalid token', async () => {
    const blogAtStart = await helpers.blogInDb()
    console.log('blog at start', blogAtStart)

    await api.post('/api/blogs')
      .send(helpers.newBlog)
      .expect(401)

    const blogAtEnd = await helpers.blogInDb()
    assert.strictEqual(blogAtEnd.length, 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})