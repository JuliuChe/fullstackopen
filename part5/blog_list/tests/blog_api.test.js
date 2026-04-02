const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt  = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  const savedUser = await user.save()



  const blogObjects = helper.initialBlogs.map(blog =>
    new Blog({ ...blog, user:savedUser._id })
  )

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)




})

after(async () => {
  await mongoose.connection.close()
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have uuid named id', async () => {
  const response = await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  response.body.forEach(blog => assert(blog.id))
})


test('posting a new blog is successfully created', async () => {
  const newBlog = {
    title: 'Learn python in 3 minutes',
    author: 'A guy named Zaza',
    url: 'https://www.helsinki.fi/en/admissions-and-education/international-students/10-reasons-study-us',
    likes:2500
  }

  const token = await api
    .post('/api/login')
    .send({ username: 'root', password:'sekret' })
    .expect(200)
    .expect('Content-type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token.body.token)
    .send(newBlog)
    .expect(201)
    .expect('Content-type', /application\/json/)

  const blogsAfterPost = await helper.blogsInDb()

  assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length+1)
  const titles = blogsAfterPost.map(b => b.title)
  const authors = blogsAfterPost.map(b => b.author)
  const urls = blogsAfterPost.map(b => b.url)

  assert(titles.includes(newBlog.title))
  assert(authors.includes(newBlog.author))
  assert(urls.includes(newBlog.url))
})

test('posting a new blog with missing likes property is created with 0 likes', async () => {
  const newBlog = {
    title: 'Learn python in 3 minutes',
    author: 'A guy named Zaza',
    url: 'https://www.helsinki.fi/en/admissions-and-education/international-students/10-reasons-study-us',
  }

  const token = await api
    .post('/api/login')
    .send({ username: 'root', password:'sekret' })
    .expect(200)
    .expect('Content-type', /application\/json/)

  const response = await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token.body.token)
    .send(newBlog)
    .expect(201)
    .expect('Content-type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('posting a new blog with missing title returns 400', async () => {
  const newBlog = {
    author: 'A guy named Zaza',
    url: 'https://www.helsinki.fi/en/admissions-and-education/international-students/10-reasons-study-us',
    likes:2500
  }
  const token = await api
    .post('/api/login')
    .send({ username: 'root', password:'sekret' })
    .expect(200)
    .expect('Content-type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token.body.token)
    .send(newBlog)
    .expect(400)
})
test('posting a new blog with missing url returns 400', async () => {
  const newBlog = {
    title: 'Learn python in 3 minutes',
    author: 'A guy named Zaza',
    likes:2500
  }
  const token = await api
    .post('/api/login')
    .send({ username: 'root', password:'sekret' })
    .expect(200)
    .expect('Content-type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + token.body.token)
    .send(newBlog)
    .expect(400)
})

test('posting a new blog with missing token fails with 401', async () => {
  const newBlog = {
    title: 'Learn python in 3 minutes',
    author: 'A guy named Zaza',
    url: 'https://www.helsinki.fi/en/admissions-and-education/international-students/10-reasons-study-us',
  }


  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-type', /application\/json/)

})

test('Delete a blog with valid id returns 204', async () => {
  const blogsInDb = await helper.blogsInDb()
  const aBlog = blogsInDb[Math.floor(Math.random() * blogsInDb.length)]

  const token = await api
    .post('/api/login')
    .send({ username: 'root', password:'sekret' })
    .expect(200)
    .expect('Content-type', /application\/json/)

  await api
    .delete(`/api/blogs/${aBlog.id}`)
    .set('Authorization', 'Bearer ' + token.body.token)
    .expect(204)

  const blogsAfterDelete = await helper.blogsInDb()
  const ids = blogsAfterDelete.map(b => b.id)
  assert(!ids.includes(aBlog.id))
  assert.strictEqual(blogsAfterDelete.length,blogsInDb.length-1)
})

test('Delete a blog with a malformatted Id returns 400', async () => {
  const malformattedId = 'ajkrjlet9e43hdj'
  const token = await api
    .post('/api/login')
    .send({ username: 'root', password:'sekret' })
    .expect(200)
    .expect('Content-type', /application\/json/)

  await api
    .delete(`/api/blogs/${malformattedId}`)
    .set('Authorization', 'Bearer ' + token.body.token)
    .expect(400)
})

test('Updating a blog\'s number of likes return 200', async () => {
  const blogsInDb = await helper.blogsInDb()
  const aBlog = blogsInDb[Math.floor(Math.random() * blogsInDb.length)]
  const update = { likes:aBlog.likes+1 }
  const response = await api
    .put(`/api/blogs/${aBlog.id}`)
    .send(update)
    .expect(200)
    .expect('Content-type', /application\/json/)
  assert.strictEqual(response.body.likes, update.likes)
})

test('Updating a blog\'s author returns 200', async () => {
  const blogsInDb = await helper.blogsInDb()
  const aBlog = blogsInDb[Math.floor(Math.random() * blogsInDb.length)]
  const update = { author:'Albert Einstein' }
  const response = await api
    .put(`/api/blogs/${aBlog.id}`)
    .send(update)
    .expect(200)
    .expect('Content-type', /application\/json/)
  assert.strictEqual(response.body.author, update.author)
})

test('Updating a blog\'s url returns 200', async () => {
  const blogsInDb = await helper.blogsInDb()
  const aBlog = blogsInDb[Math.floor(Math.random() * blogsInDb.length)]
  const update = { url:'www.albereinsteingenius.com' }
  const response = await api
    .put(`/api/blogs/${aBlog.id}`)
    .send(update)
    .expect(200)
    .expect('Content-type', /application\/json/)
  assert.strictEqual(response.body.url, update.url)
})
test('Updating a blog\'s title returns 200', async () => {   const blogsInDb = await helper.blogsInDb()
  const aBlog = blogsInDb[Math.floor(Math.random() * blogsInDb.length)]
  const update = { title:'Albert Einistein was not a genius' }
  const response = await api
    .put(`/api/blogs/${aBlog.id}`)
    .send(update)
    .expect(200)
    .expect('Content-type', /application\/json/)
  assert.strictEqual(response.body.title, update.title)
})

test('Updating a blog\'s complete returns 200', async () => {   const blogsInDb = await helper.blogsInDb()
  const aBlog = blogsInDb[Math.floor(Math.random() * blogsInDb.length)]
  const update = {
    title: 'Albert Einistein was not a genius',
    author: 'Albert Einstein',
    url: 'www.albereinsteingenius.com',
    likes:aBlog.likes+1
  }
  const response = await api
    .put(`/api/blogs/${aBlog.id}`)
    .send(update)
    .expect(200)
    .expect('Content-type', /application\/json/)
  assert.strictEqual(response.body.title, update.title)
  assert.strictEqual(response.body.author, update.author)
  assert.strictEqual(response.body.url, update.url)
  assert.strictEqual(response.body.likes, aBlog.likes+1)
})

test('Udpate a non existent Id returns 404', async () => {
  const update = { likes: 20000 }
  const inexistentId=await helper.nonExistingId()
  await api
    .put(`/api/blogs/${inexistentId}`)
    .send(update)
    .expect(404)
})
test('Udpate a malformatted Id returns 400', async () => {
  const update = { likes: 20000 }
  const wrongId='kfaskoéf8347fsd'
  await api
    .put(`/api/blogs/${wrongId}`)
    .send(update)
    .expect(400)
})