const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

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

module.exports = app;