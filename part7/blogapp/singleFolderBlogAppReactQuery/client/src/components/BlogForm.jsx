import { TextField, Button, Stack } from '@mui/material'

import useField from '../hooks/useField'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const handleCreateNew = (event) => {
    event.preventDefault()
    createBlog({ title:title.inputProps.value, author:author.inputProps.value, url:url.inputProps.value })
    title.reset()
    author.reset()
    url.reset()
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateNew}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label="title"
            size="small"
            {...title.inputProps}
          />
          <TextField
            label="author"
            size="small"
            {...author.inputProps}
          />
          <TextField
            label="url"
            size="small"
            {...url.inputProps}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: 'flex-start' }}
          >
            create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm
