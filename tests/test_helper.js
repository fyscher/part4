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

const initialUserLogins =
[
    {
        "username": "fyscher",
        "password": "test"
    },
    {
        "username": "Fyschman",
        "password": "test2"
    }
]

const initialUsers = 
[
    {
        "username": "Fyschman",
        "name": "fyschman",
        "blogs": [],
        "passwordHash": "$2b$10$.RzXjsjdkSsv/1N3i7wQDu3Gg.lUArmfxW2BJYo9qJqUazi.ahLy2",
        "id": "6854e69bca75c1280332731f"
    },
    {
        "username": "fyscher",
        "name": "fyschman",
        "blogs": [],
        "passwordHash": "$2b$10$wqi.a7Hg0AbzkuDcnuLjpOW8DswtYY7DeStYm7mU92biPnI.XmcxK",
        "id": "6854e6b0ca75c12803327323"
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
    const blogs = await Blog.find({})
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
    initialBlogs, initialUserLogins, initialUsers, nonExistingId, blogsInDb, findBlog, usersInDb,
}
