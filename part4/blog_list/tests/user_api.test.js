const User = require('../models/user')
const bcrypt = require('bcrypt')

const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')

const mongoose = require('mongoose')

const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {

    await User.deleteMany({})


    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Oizo',
      name: 'Mr. Oizo',
      password: 'secretBird',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))

    const names = usersAtEnd.map(u => u.name)
    assert(names.includes(newUser.name))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const newUser = {
      username: 'Oizo',
      name: 'Mr. Oizo',
      password: 'secretBird',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtStart = await helper.usersInDb()
    const resultTwo = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(resultTwo.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Oi',
      name: 'Mr. Oizo',
      password: 'secretBird',
    }


    const result= await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('is shorter than the minimum allowed length'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username not specified', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '',
      name: 'Mr. Oizo',
      password: 'secretBird',
    }


    const result= await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('`username` is required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Oizo',
      name: 'Mr. Oizo',
      password: 'se',
    }


    const result= await api
      .post('/api/users')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password with at least 3 characters required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password not specified', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Oizo',
      name: 'Mr. Oizo',
      password: '',
    }


    const result= await api
      .post('/api/users')
      .send(newUser)
      .expect(422)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password with at least 3 characters required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })


})

after(async () => {
  await mongoose.connection.close()
})