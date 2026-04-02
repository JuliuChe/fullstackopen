import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Field from './components/Field'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification]=useState({message:null, type:'info'})
  const [username, setUsername] = useState([])
  const [password, setPassword] = useState([])
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl]=useState('')

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      console.log(user)
    } catch { 
      setNotification({ message: `Wrong login credentials`, type: 'error' })
      setTimeout(() => { setNotification({...notification, message:null}) }, 5000)
    }


  }

  const handleNewBlog = async (event) => { 
    event.preventDefault()
    try {
      const blog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(blog))
      setAuthor('')
      setTitle('')
      setUrl('')
      setNotification({ message: `a new blog ${blog.title} by ${blog.author} added`, type:'info' })
      setTimeout(() => { setNotification({...notification, message:null}) }, 5000)
    } catch { 
      setNotification({ message: `Could not add new blog`, type: 'error' })
      setTimeout(() => { setNotification({...notification, message:null}) }, 5000)
    }

  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h1>log in to application</h1>
        <Field name="username" value={ username } onChange = {({ target }) => setUsername(target.value)}/>
        <Field name="password" value={password} onChange={({ target }) => setPassword(target.value)}/>
        <button type="submit">login</button>
      </div>
    </form>
  )

  const blogsList = () => (
    <div>
      <h2>blogs</h2>
      <p>logged in as {user.name}
        <button onClick={() => { setUser(null); window.localStorage.removeItem('loggedBlogappUser')}}>logout</button>
      </p>
      <h2>create new</h2>
        <Field name="title:" value={title} onChange={({ target }) => setTitle(target.value)} />
        <Field name="author:" value={ author } onChange = {({ target }) => setAuthor(target.value)}/>
      <Field name="url:" value={url} onChange={({ target }) => setUrl(target.value)} />
      <button onClick={handleNewBlog}>create</button>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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