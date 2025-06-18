const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = 
[
    {
        title: 'HTML is easy',
        author: 'FB Red',
        url: 'www.com',
        likes: 6969,
        user: "68519d3f18bb2e60278ae9b6"
    },
    {
        title: 'HTML is too Easy',
        author: 'FB Blue',
        url: 'www.420.com',
        likes: 420,
        user: "6851aad2772dab9ef197f41d"
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
    initialBlogs, nonExistingId, blogsInDb, findBlog, usersInDb,
}
