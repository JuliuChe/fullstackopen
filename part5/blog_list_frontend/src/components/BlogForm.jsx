import Field from './Field'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()
  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setAuthor('')
    setTitle('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Field name="title:" value={title} onChange={({ target }) => setTitle(target.value)} />
        <Field name="author:" value={ author } onChange = {({ target }) => setAuthor(target.value)}/>
        <Field name="url:" value={url} onChange={({ target }) => setUrl(target.value)} />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm