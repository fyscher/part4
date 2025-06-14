const blogsRouter = require('express').Router();
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get(`/:id`, async (request, response) =>
{
  const blog = await Blog.findById(request.params.id)
  if (blog)
  {
    response.json(blog)
  } else
  {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) =>
{
  const body = request.body;

  if (!body.title)
  {
    logger.info('No Title!')
    logger.error('400: Must include Title')
    response.status(400).json('Bad Request')
  }
  else
  {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) =>
{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter