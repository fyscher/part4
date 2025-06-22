const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = 
[
  {
    "title": "HTML is easy",
    "author": "FB Red",
    "url": "www.com",
    "likes": 6969,
    "id": "6854e361bedc5a77b6a9b6da"
  },
  {
    "title": "HTML is too easy",
    "author": "FB Blue",
    "url": "www.420.com",
    "likes": 420,
    "id": "6854e379bedc5a77b6a9b6de"
  }
]

const createFyscher = 
{
    "username": "fyscher",
    "name": "fyscher",
    "password": "testy"
}

const createFyschman =
{
    "username": "Fyschman",
    "name": "Fyschman",
    "password": "testerrr"
}

const initialUserLogins =
[
    {
        "username": "fyscher",
        "password": "testy"
    },
    {
        "username": "Fyschman",
        "password": "testerrr"
    }
]

const nonExistingId = async () =>
{
    const blog = new Blog({ title: "willremovethissoon" })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () =>
{
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    return blogs.map(b => b.toJSON())
}

const findBlog = async (title) =>
{
    const blog = await Blog.find({title})
    return blog
}

const usersInDb = async () =>
{
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = 
{
    initialBlogs,
    initialUserLogins,
    nonExistingId,
    blogsInDb,
    findBlog,
    usersInDb,
    createFyscher,
    createFyschman
}
