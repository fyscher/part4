const Blog = require('../models/blog')

const initialBlogs = 
[
    {
        title: 'HTML is easy',
        author: 'FB Red',
        url: 'www.com',
        likes: 6969,
    },
    {
        title: 'HTML is too Easy',
        author: 'FB Blue',
        url: 'www.420.com',
        likes: 420,
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

module.exports = 
{
    initialBlogs, nonExistingId, blogsInDb, findBlog
}
