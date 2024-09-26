const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`)
  console.log(`Path: ${request.path}`)
  console.log(`Headers: ${JSON.stringify(request.headers)}`)
  console.log(`Body: ${JSON.stringify(request.body)}`)
  console.log(`---`)
  next()
}

mongoose.set('strictQuery', false)
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb+srv://noteUser:notebook@cluster1.hywww.mongodb.net/Blog?retryWrites=true&w=majority'
mongoose.connect(mongoUrl)
  .then(()=> {
    console.log(`connected to ${mongoUrl}`)
  })
  .catch(error =>{
    console.error(`Error connecting to mongodb ${error.message}`)
  })

app.use(cors())
app.use(express.json())


app.use(requestLogger)

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => {
      console.log("Error getting document ", error.message)
    })
})

app.post('/api/blogs', (request, response) => {
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

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})