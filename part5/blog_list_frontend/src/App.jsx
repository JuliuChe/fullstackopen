import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Field from './components/Field'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification]=useState({ message:null, type:'info' })
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })


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
      blogFormRef.current.toggleVisibility()
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

  const loginForm = () => (
    <LoginForm handler={handleLogin} />
  )

  const blogFormRef = useRef()
  const blogsList = () => (
    <div>
      <h2>blogs</h2>
      <p>logged in as {user.name}
        <button onClick={() => { setUser(null); window.localStorage.removeItem('loggedBlogappUser')}}>logout</button>
      </p>
      <Togglable buttonLabel='create new blog' ref={ blogFormRef }>
        <BlogForm createBlog={handleNewBlog} />
      </Togglable>

      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} />
      )}
    </div>
  )

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {!user && loginForm()}
      {user && blogsList()}
    </div>
  )
}

export default App