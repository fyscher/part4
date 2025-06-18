require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')

const errorHandler = (error, req, res, next) =>
{
  console.log('error name: ', error.name)
  switch (error.name)
  {
    case 'CastError':
      res.status(400).json({ error: 'Malformatted Id' })
      break
    case 'ValidationError':
      res.status(400).json({ error: error.message })
      break
    case 'MongoServerError':
      if (error.errmsg.includes('E11000 duplicate key error collection'))
      {
        console.log('error code: ', error.code)
        console.log('error errmsg: ', error.errmsg)
        res.status(400).json({ error: 'expected `username` to be unique' })
      } else
      {
        res.status(400).json({ error: 'Mongojs Server Error' })
      }
  }
  next(error)
}

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

logger.info('Connecting to MongoDB: ', config.MONGODB_URI)
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() =>
  {
    logger.info('MongoDB connection successful')
  })
  .catch((error) =>
  {
    logger.error('Connection Error: ', error.message)
  })

app.use(errorHandler)

module.exports = app;