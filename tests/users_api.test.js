const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

describe.only('when there is initially one user in db', () =>
{
    beforeEach( async () =>
    {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        console.log('hash ', passwordHash)

        await user.save()
    })

    test('creation succeeds with a fresh username', async () =>
    {
        const usersAtStart = await helper.usersInDb()

        const newUser =
        {
            username: 'fysch',
            name: 'Fyscher',
            password: 'FUCKKKK'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1 )

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () =>
    {
        const usersAtStart = await helper.usersInDb()

        const newUser = 
        {
            username: 'root',
            name: 'Superuser',
            password: 'fookenHell'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        assert(result.body.error.includes('E11000 duplicate key error collection'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails if username received is below the minimum character length', async () =>
    {
        const usersAtStart = await helper.usersInDb()

        const newUser = 
        {
            username: 'R',
            name: 'oot',
            password: 'foooookenell'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()

        assert(result.body.error.includes('User validation failed: username: Path `username`'))
        assert.deepStrictEqual(usersAtEnd, usersAtStart)
    })
    
    test('creation fails if password received is below the minimum character length', async () =>
    {
        const usersAtStart = await helper.usersInDb()

        const newUser = 
        {
            username: 'Root',
            name: 'oot',
            password: 'f'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()

        assert(result.body.error.includes('Password too short'))
        assert.deepStrictEqual(usersAtEnd, usersAtStart)
    })
})

after(async () => await mongoose.connection.close())
