import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Field from './components/Field'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

import { Routes, Route, Link, useMatch } from 'react-router-dom'

import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification]=useState({ message:null, type:'info' })
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })
  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    if (user?.token) {
      console.log('Adding token for '+ user.name)
      blogService.setToken(user.token)
    }
  }, [user])

  const handleLogin = async (username, password) => {
    try {
      console.log(username, password)
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      console.log(user)

    } catch {
      setNotification({ message: 'Wrong login credentials', type: 'error' })
      setTimeout(() => { setNotification({ ...notification, message:null }) }, 5000)
    }
  }

  const handleNewBlog = async (newBlog ) => {
    try {
      // blogFormRef.current.toggleVisibility()
      console.log(newBlog)
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      setNotification({ message: `a new blog ${blog.title} by ${blog.author} added`, type:'info' })
      setTimeout(() => { setNotification({ ...notification, message:null }) }, 5000)
    } catch {
      setNotification({ message: 'Could not add new blog', type: 'error' })
      setTimeout(() => { setNotification({ ...notification, message:null }) }, 5000)
    }
  }

  const handleLike = async (blogToUpdate) => {
    const { id, ...updatedBlog } = { ...blogToUpdate, likes:blogToUpdate.likes+1,user:blogToUpdate.user.id }
    const response = await blogService.updateBlog(id, updatedBlog)
    setBlogs(blogs.map(blog => blog.id === id ? response:blog))
  }

  const handleRemove = async (blogId) => {
    const blog = blogs.filter(b => b.id === blogId)[0]
    console.log(blog)
    const deleteBlog = window.confirm(`Remove blog ${blog.title} ${blog.author}`)
    if (deleteBlog) {
      try {
        const response = await blogService.deleteBlog(blogId)
        console.log(response)
        setBlogs(blogs.filter(b => b.id !== blogId))
        setNotification({ message: `Blog ${blog.title} ${blog.author} successfully deleted from DB`, type: 'info' })
        setTimeout(() => { setNotification({ ...notification, message:null }) }, 5000)
      } catch {
        setNotification({ message: `Could not delete blog with id : ${blogId}`, type: 'error' })
        setTimeout(() => { setNotification({ ...notification, message:null }) }, 5000)
      }
    }
  }


  // const blogFormRef = useRef()

  const padding = {
    padding: 5
  }


  return (
    <div>
      <div>
        <Notification message={notification.message} type={notification.type} />
        <Link style={padding} to="/">blogs</Link>
        {user ? <Link style={padding} to="/create">new blog</Link> : <></>}
        { user ? <button onClick={ () => { setUser(null); window.localStorage.removeItem('loggedBlogappUser')}}>logout</button> : <Link style={padding} to="/login">login</Link> }
      </div>
      <Routes>
        <Route path="/blogs/:id" element={
          <Blog blog={blog} handleLike={handleLike} handleRemove={handleRemove} />
        } />
        <Route path="/login" element={
          <LoginForm handler={handleLogin} />
        } />
        <Route path="/create" element={<BlogForm createBlog={ handleNewBlog } /> }/>
        <Route path="/" element={<BlogList blogs={ blogs } />} />
      </Routes>
    </div>
  )
}

export default App