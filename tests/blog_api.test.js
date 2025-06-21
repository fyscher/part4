const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

// fix this!
// one user added, one to go...
beforeEach(async () =>
{
    await User.deleteMany({})
    console.log('Users Cleared')

    await Blog.deleteMany({})
    console.log('Blogs Cleared')

    await Blog.insertMany(helper.initialBlogs)
    console.log('Inserted Initial Blogs')
    
    await api
        .post('/api/users')
        .send(helper.createFyscher)
        .expect(201)

    const loggedInFyscher = await api
        .post('/api/login')
        .send({
            "username": helper.createFyscher.username,
            "password": helper.createFyscher.password
        })
        .expect(200)

    const fyscher = loggedInFyscher.request.response._body
    console.log(`logged in!`)
    console.log('fyscher: ', fyscher)

})

describe('Step 1: All blogs returned as JSON', () =>
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

describe('Step 2: Verify the unique identifier is "ID"', () =>
{
    test('Inspect a specific blogs attributes', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        assert(Object.keys(blogToView).includes('id'))
        assert(!Object.keys(blogToView).includes('_id'))
    })
})

describe('Step 3: Add a blog post to DB', () =>
{
    test('a valid blog can be added ', async () =>
    {
        const users = await helper.usersInDb()
        const user = users[0]

        console.log('users: ', users)
        const newBlog =
        {
            title: 'WE HERE TO TEST',
            author: 'Fyscher',
            url: 'www.com',
            likes: 123,
            user: user.id
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        
        const updatedDB = [...helper.initialBlogs, newBlog]
        // strip the 'id' attribute to test deepStrictEqual
        const dataAtEnd = blogsAtEnd.reduce((acc, obj) =>
        {
            const { id: remove, ...rest } = obj
            acc.push(rest)
            return acc
        }, [])
        const updatedDBAtEnd = updatedDB.reduce((acc, obj) =>
        {
            const { user: remove, ...rest } = obj
            acc.push(rest)
            return acc
        }, [])

        assert.deepStrictEqual(dataAtEnd, updatedDBAtEnd)
        
        const titles = blogsAtEnd.map(r => r.title)
        assert(titles.includes('WE HERE TO TEST'))
        

    })
})

describe('Step 4 and 5: Handle Missing Information', () =>
{
    test('a blog without a title cannot be added ', async () =>
    {
        const users = await User.find({})
        const user = users[0]
        console.log('user: ', user)
        const newBlog = 
        {
            author: 'Mr. NoTitle',
            url: 'www.com',
            likes: 55,
            user: user._id
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a blog without a url cannot be added ', async () =>
    {
        const newBlog = 
        {
            title: 'MISSING URL',
            author: 'Frank',
            likes: 55
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a blog missing "Likes" info will be treated as 0', async () =>
    {
        const newBlog = 
        {
            title: 'No Likes',
            author: 'Mr. NoLikes',
            url: 'www.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const foundBlog = await helper.findBlog('No Likes')

        assert.strictEqual(foundBlog[0].likes, 0)
    })
})
        
describe('Exercises 4.13 - 4.14:', () =>
{
    test('a blog can be deleted by id', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        const titles = blogsAtEnd.map(r => r.title)
        
        assert(!titles.includes(blogToDelete.title))
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('a blog can be updated by id', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()
        const updateBlog = blogsAtStart[0]
        const updatedBlog = 
        {   
            title: updateBlog.title,
            author: updateBlog.author,
            url: updateBlog.url,
            likes: 69
        }

        await api
            .put(`/api/blogs/${updateBlog.id}`)
            .send(updatedBlog)
            .expect(204)

        const foundBlog = await helper.findBlog('HTML is easy')
        assert.strictEqual(foundBlog[0].likes, updatedBlog.likes)
    })

})

describe('How well Tokens are handled:', () =>
{
    test.only('A blog shouldn`t be deleted unless correct token is present', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const wrongToken = loggedInUser._body.token

        const result = await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${wrongToken}`)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        console.log('result.error: ', result.error)

        assert.deepStrictEqual(blogsAtStart, blogsAtEnd)
    })
})

after(async () => await mongoose.connection.close())