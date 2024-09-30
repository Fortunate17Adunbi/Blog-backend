const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
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

app.use('/api/blogs', blogRouter)


module.exports = app