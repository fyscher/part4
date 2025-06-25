const Blog = require('../models/blog')
const User = require('../models/user')

const Fyscher = 
{
    "username": "fyscher",
    "name": "fyscher",
    "password": "testy"
}

const Fyschman =
{
    "username": "Fyschman",
    "name": "Fyschman",
    "password": "testerrr"
}

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
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    return users.map(u => u.toJSON())
}

module.exports = 
{
    nonExistingId,
    blogsInDb,
    findBlog,
    usersInDb,
    Fyscher,
    Fyschman
}
