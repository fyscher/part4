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

  if (!body.title || !body.url)
  {
    logger.info('No Title or URL!')
    logger.error('400: Must include both Title and URL')
    response.status(400).json('Bad Request')
  }
  else
  {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes? body.likes : 0,
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

blogsRouter.put('/:id', async (request, response) =>
{
  const body = request.body;

  const updated = await Blog.findByIdAndUpdate(request.params.id,
  {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  response.status(204).json(updated)
})

module.exports = blogsRouter