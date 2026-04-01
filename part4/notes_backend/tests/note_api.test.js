
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    const noteObjects = helper.initialNotes.map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)
    //OR - Speciality from mongoose
    //await Note.insertMany(helper.initialNotes)

    //OR initial idea - works for few values only
    // let noteObject = new Note(helper.initialNotes[0])
    // await noteObject.save()
    // noteObject = new Note(helper.initialNotes[1])
    // await noteObject.save()

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()

  })

  test('notes are returned as json', async () => {
    console.log('entered test')
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test.only('Succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[Math.floor(Math.random() * notesAtStart.length)]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 404 if note does not exists', async () => {
      const validNonExistingId = await helper.nonExistingId()

      await api.get(`/api/notes/${validNonExistingId}`).expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/notes/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('a valid note can be added', async () => {

      const newNote = {
        content: 'async/await simplifies async calls',
        important:true
      }

      const token = await api
        .post('/api/login')
        .send({ username: 'root', password:'sekret' })
        .expect(200)
        .expect('Content-type', /application\/json/)

      await api
        .post('/api/notes')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(newNote)
        .expect(201)
        .expect('Content-type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)


      const contents = notesAtEnd.map(r => r.content)

      assert(contents.includes('async/await simplifies async calls'))
    })

    test.only('fails with status code 400 if data invalid', async () => {
      const newNote = {
        important:true
      }


      const token = await api
        .post('/api/login')
        .send({ username: 'root', password:'sekret' })
        .expect(200)
        .expect('Content-type', /application\/json/)

      console.log('My Token :', token.body)

      await api
        .post('/api/notes')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('Succeed with code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[Math.floor(Math.random() * notesAtStart.length)]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      const ids = notesAtEnd.map(n => n.id)
      assert(!ids.includes(noteToDelete.id))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})


after(async () => {
  await mongoose.connection.close()
})