const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () =>
{
    await Blog.deleteMany({})
    console.log('Database Cleared')

    await Blog.insertMany(helper.initialBlogs)
})

describe ('Step 1: All blogs returned as JSON', () =>
{
    test('all blogs are returned', async () =>
    {
        const res = await api.get('/api/blogs')
        assert.strictEqual(res.body.length, helper.initialBlogs.length)
    })

    test('blogs are returned as json', async () =>
    {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
})

describe ('Step 2: Verify the unique identifier is "ID"', () =>
{
    test('Inspect a specific blogs attributes', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        assert(Object.keys(blogToView).includes('id'))
        assert(!Object.keys(blogToView).includes('_id'))
    })
})

    // test('Inspect a specific blogs attributes', async () =>
    // {
    //     const blogsAtStart = await helper.blogsInDb()
    //     const blogToView = blogsAtStart[0]
        
    //     const resultBlog = await api
    //     .get(`/api/blogs/${blogToView.id}`)
    //     .expect(200)
    //     .expect('Content-Type', /application\/json/)
        
    //     console.log('blogToView: ', blogToView)
    //     console.log('resultBlog.body ', resultBlog.body)
    //     assert.deepStrictEqual(resultBlog.body, blogToView)
    // })

    // test('a specific blog is within the returned blogs', async () =>
    // {
    //     const res = await api.get('/api/blogs')
    //     const titles = res.body.map(e => e.title)
    //     assert.strictEqual(titles.includes('HTML is too Easy'), true)
    // })
        
                    
// describe ('About Adding Blogs: Valid and Denying Invalid', () =>
// {
//     test('a valid blog can be added ', async () =>
//     {
//         const newBlog =
//         {
//             title: 'WE HERE TO TEST',
//             author: 'Fyscher',
//             url: 'www.com',
//             likes: 123
//         }

//         await api
//             .post('/api/blogs')
//             .send(newBlog)
//             .expect(201)
//             .expect('Content-Type', /application\/json/)

//         const blogsAtEnd = await helper.blogsInDb()
//         assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

//         const titles = blogsAtEnd.map(r => r.title)
//         assert(titles.includes('WE HERE TO TEST'))

//     })

//     test('a blog without a title cannot be added ', async () =>
//     {
//         const newBlog = 
//         {
//             author: 'Frank',
//             url: 'www.com',
//             likes: 0
//         }

//         await api
//             .post('/api/blogs')
//             .send(newBlog)
//             .expect(400)

//         const blogsAtEnd = await helper.blogsInDb()
//         console.log('blogs after blog rejected: ', blogsAtEnd)

//         assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
//     })
// })

// describe ('About Removing Blogs: Can delete successfully', () =>
// {
//     test('a specific blog can be deleted', async () =>
//     {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogToDelete = blogsAtStart[0]
    
//         await api
//             .delete(`/api/blogs/${blogToDelete.id}`)
//             .expect(204)
    
//         const blogsAtEnd = await helper.blogsInDb()
    
//         const titles = blogsAtEnd.map(r => r.title)
        
//         assert(!titles.includes(blogToDelete.title))
//         assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
//     })
// })

after(async () => await mongoose.connection.close())