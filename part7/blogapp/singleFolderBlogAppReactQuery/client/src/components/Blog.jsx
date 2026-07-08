import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material'

import useField from '../hooks/useField'

const Blog = ({ blog, addLike, currentUser, removeBlog, addComment }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const comment = useField('text')

  if (!blog) {
    throw new Error('No blog found')
  }

  const canBeRemoved = () =>
    currentUser && currentUser.username === blog.user.username

  const handleRemove = () => {
    removeBlog(blog)
    setConfirmOpen(false)
  }

  return (
    <Card sx={{ mt: 2, maxWidth: 600 }} className="blog">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>

        <Link
          href={blog.url}
          target="_blank"
          rel="noopener"
          display="block"
          sx={{ mb: 1 }}
        >
          {blog.url}
        </Link>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Added by {blog.user.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography variant="body1">{blog.likes} likes</Typography>
          {currentUser && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => addLike(blog)}
            >
              like
            </Button>
          )}
          {canBeRemoved() && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => setConfirmOpen(true)}
            >
              remove
            </Button>
          )}
        </Box>

        <Typography sx={{ my: 2 }} variant="h6" gutterBottom>
          comments
        </Typography>
        {currentUser && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              id="comment-field"
              label="add a comment"
              {...comment.inputProps}
            />
            <Button
              variant="contained"
              onClick={() => {
                addComment({ blog, comment:comment.inputProps.value })
                comment.reset()
              }}
            >
              add comment
            </Button>
          </Box>
        )}
        <Box component="ul" sx={{ m: 0, pl: 2, py: 2 }}>
          {blog.comments?.map((val, i) => (
            <Typography
              key={i}
              variant="body2"
              sx={{ m: 0, listStylePosition: 'inside', pl: 3 }}
              component="li"
            >
              {val}
            </Typography>
          ))}
        </Box>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Remove blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove blog <strong>{blog.title}</strong> by {blog.author}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>cancel</Button>
          <Button onClick={handleRemove} color="error" variant="contained">
            remove
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default Blog
