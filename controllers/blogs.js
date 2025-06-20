const blogsRouter = require('express').Router();
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id)
  {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user)
  {
    return response.status(400).json({ error: 'userId missing or not valid'})
  }

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
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) =>
{
  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  console.log('blog.user: ', blog.user)
  console.log('blog.user.id: ', blog.user.id)
  console.log('blog.user.id.toString(): ', blog.user.id.toString())

  if (decodedToken.id === blog.user.toString())
  {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  response.status(401).json({ error: 'Cannot Delete'})
  console.log('blog: ', blog)
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