const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () =>
{
    await User.deleteMany({})
    console.log('Users Cleared')

    await Blog.deleteMany({})
    console.log('Blogs Cleared')

    // create both users
    await api
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(helper.Fyscher)
        .expect(201)

    await api
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(helper.Fyschman)
        .expect(201)
    
    // log in fyscher
    const loggedInFyscher = await api
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
            "username": helper.Fyscher.username,
            "password": helper.Fyscher.password
        })
        .expect(200)

    const fyscher = loggedInFyscher.request.response._body
    
    // log in fyschman
    const loggedInFyschman = await api
    .post('/api/login')
    .set('Content-Type', 'application/json')
    .send({
        "username": helper.Fyschman.username,
        "password": helper.Fyschman.password
    })
    .expect(200)
    
    const fyschman = loggedInFyschman.request.response._body
    
    // init and create a blog each
    const newBlog1 =
    {
        title: 'HTML is easy',
        author: 'FB Red',
        url: 'www.com',
        likes: 6969,
    }

    const newBlog2 =
    {
        title: 'HTML is too easy',
        author: 'FB Blue',
        url: 'www.420.com',
        likes: 420,
    }

    await api
        .post('/api/blogs')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${fyscher.token}`)
        .send(newBlog1)
        .expect(201)

    await api
        .post('/api/blogs')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${fyschman.token}`)
        .send(newBlog2)
        .expect(201)
})

describe('Step 1: All blogs returned as JSON', () =>
{
    test('all blogs are returned', async () =>
    {
        const blogs = await helper.blogsInDb()
        const res = await api.get('/api/blogs')
        assert.deepStrictEqual(res.body, blogs)
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
        const blogsAtStart = await helper.blogsInDb()

        const fyscherLogin = 
        {
            "username": helper.Fyscher.username,
            "password": helper.Fyscher.password
        }

        const login = await api
            .post('/api/login')
            .send(fyscherLogin)
            .expect(200)

        const body = login._body
        
        const newBlog =
        {
            title: 'WE HERE TO TEST',
            author: 'Fyscher',
            url: 'www.com',
            likes: 123,
        }

        const sentBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${body.token}`)
            .send(newBlog)
            .expect(201)
        const returnedBlog = await Blog.findById(sentBlog._body.id).populate('user', { username: 1, name: 1 })
        const savedBlog = returnedBlog.toJSON()
        const newTotalBlogs = [...blogsAtStart, savedBlog]

        const blogsAtEnd = await helper.blogsInDb()


        console.log('blogsAtStart: ', blogsAtStart)
        console.log('blogsAtEnd: ', blogsAtEnd)
        console.log('newTotalBlogs', newTotalBlogs)

        assert.strictEqual(blogsAtStart.length +1, blogsAtEnd.length)
        assert.deepStrictEqual(blogsAtEnd, newTotalBlogs)
    })
})

describe('Step 4 and 5: Handle Missing Information', () =>
{
    test('a blog without a title cannot be added ', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()

        const fyscherLogin = 
        {
            "username": helper.Fyscher.username,
            "password": helper.Fyscher.password
        }

        const login = await api
            .post('/api/login')
            .send(fyscherLogin)
            .expect(200)

        const body = login._body

        const newBlog = 
        {
            author: 'Mr. NoTitle',
            url: 'www.com',
            likes: 55,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${body.token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.deepStrictEqual(blogsAtStart, blogsAtEnd)
    })

    test('a blog without a url cannot be added ', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()

        const fyscherLogin = 
        {
            "username": helper.Fyscher.username,
            "password": helper.Fyscher.password
        }

        const login = await api
            .post('/api/login')
            .send(fyscherLogin)
            .expect(200)

        const body = login._body

        const newBlog = 
        {
            title: 'Mr. Title',
            author: 'Mr. NoURL',
            likes: 55,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${body.token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.deepStrictEqual(blogsAtStart, blogsAtEnd)

    })

    test('a blog missing "Likes" info will be treated as 0', async () =>
    {
        const fyscherLogin = 
        {
            "username": helper.Fyscher.username,
            "password": helper.Fyscher.password
        }

        const login = await api
            .post('/api/login')
            .send(fyscherLogin)
            .expect(200)

        const body = login._body

        const newBlog = 
        {
            title: 'Mr. Title',
            author: 'Mr. NoLikes',
            url: 'www.com',
        }

        const sentBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${body.token}`)
            .send(newBlog)
            .expect(201)

        const returnedBlog = await Blog.findById(sentBlog._body.id).populate('user', { username: 1, name: 1 })
        const foundBlog = returnedBlog.toJSON()

        assert.strictEqual(foundBlog.likes, 0)
    })
})
        
describe('Exercises 4.13 - 4.14:', () =>
{
    test('a blog can be deleted by id', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const fyscherLogin =
        {
            "username": helper.Fyscher.username,
            "password": helper.Fyscher.password
        }

        const login = await api
            .post('/api/login')
            .send(fyscherLogin)
            .expect(200)

        const body = login._body
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${body.token}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
        const testBlogsatEnd = blogsAtStart.filter( i => i.id !== blogToDelete.id)

        assert.deepStrictEqual(blogsAtEnd, testBlogsatEnd)
    })

    test.only('a blog can be updated by id', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()
        const updateBlog = blogsAtStart[0]
        console.log('updateBlog: ', updateBlog)
        const updatedBlog = 
        {   
            likes: 69,
        }

        const fyscherLogin =
        {
            "username": helper.Fyscher.username,
            "password": helper.Fyscher.password
        }

        const login = await api
            .post('/api/login')
            .send(fyscherLogin)
            .expect(200)

        const body = login._body
        console.log('body: ', body)
        await api
            .put(`/api/blogs/${updateBlog.id}`)
            .set('Authorization', `Bearer ${body.token}`)
            .send(updatedBlog)
            .expect(204)

        const foundBlog = await helper.findBlog(updateBlog.title)
        console.log('foundBlog: ', foundBlog)
        assert.strictEqual(foundBlog[0].likes, updatedBlog.likes)
    })

})

describe('How well Tokens are handled:', () =>
{
    test('A blog shouldn`t be deleted unless correct token is present', async () =>
    {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const users = await helper.usersInDb()
        const fyschman = users[1]

        const wrongToken = fyschman.token

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${wrongToken}`)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        assert.deepStrictEqual(blogsAtStart, blogsAtEnd)
    })
})

after(async () => await mongoose.connection.close())