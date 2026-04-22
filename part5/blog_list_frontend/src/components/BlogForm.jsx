
import { TextField, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault()
    await createBlog({ title, author, url })
    setAuthor('')
    setTitle('')
    setUrl('')
    navigate('/')
  }
  const textFiledStyle= {
    '& .MuiInputBase-input':
      { padding: '4px 10px', margin: 'auto' },
    '& .MuiInputLabel-root':
      { top: '-5px', },
    '& .MuiInputLabel-shrink':
      { top: '-3px', }
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ marginTop: 2, width:300 }}>
          <TextField label="title" value={title} onChange={({ target }) => setTitle(target.value)} variant="outlined" size="small"
            sx={textFiledStyle} />
          <TextField label="author" value={author} onChange={({ target }) => setAuthor(target.value)} variant="outlined" size="small" sx={textFiledStyle} />
          <TextField label="url" value={url} onChange={({ target }) => setUrl(target.value)} variant="outlined" size="small" sx={textFiledStyle}/>
          <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>create</Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm