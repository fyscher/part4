require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const middleware = require('./middleware')

app.use(middleware.tokenExtractor)
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter, middleware.userExtractor)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

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

app.use(middleware.errorHandler)

module.exports = app;