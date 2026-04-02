const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ username :1, name:1 })
  response.json(blogs)
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs)
  // })
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (body.likes === undefined) {
    body.likes = 0
  }

  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const user = await User.findById(request.user)

  if(!user){
    return response.status(400).json({ error: 'user id is not in the DB' })
  }
  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes,
    user:user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!blog.user || blog.user.toString() !== request.user) {
    return response.status(403).json({ error: 'forbidden' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    response.status(404).end()
  }

  const { title, author, url, likes } = request.body

  if (title) { blogToUpdate.title = title }
  if (author) { blogToUpdate.author = author }
  if (url) { blogToUpdate.url = url }
  if (likes) { blogToUpdate.likes = likes }
  const updatedBlog = await blogToUpdate.save()
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter