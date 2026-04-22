// import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardActions, Typography, Button, Box , Link } from '@mui/material'

const Blog = ({ blog, handleLike, handleRemove }) => {
  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5
  // }
  // const [details, setDetails] = useState(false)

  // const highlightVisible = { display:details ? 'none': '' }
  // const detailVisible = { display:details ? '' : 'none' }
  // const toggleDetails = () => {
  //   setDetails(!details)
  // }
  const navigate = useNavigate()

  const onRemove = (id) => {
    handleRemove(id)
    navigate('/')
  }

  if (!blog) {
    return <div>Loading...</div>
  }

  const currentUser = () => {
    const loggedUsrJson = window.localStorage.getItem('loggedBlogappUser')
    return loggedUsrJson?JSON.parse(loggedUsrJson).username:null
  }

  const addRemoveBtn = (blog, currentUser) => {
    return currentUser === blog.user.username ? <Button color="error" variant="outlined"
      sx={{
        borderWidth: 2,
        '&:hover': { borderWidth: 2,  bgcolor: 'rgba(170, 104, 88, 0.3)' }  // garde 2px au survol
      }}
      onClick={() => onRemove(blog.id)}>remove</Button> : null
  }
  console.log(blog)
  return (
    <Card sx={{ width:'90%', marginTop:'25px', pb:2 }}>
      <CardContent sx={{ marginTop:'20px', '&:last-child': { pb: 1 } }} className='details'>
        <Typography variant="h5" component="div" data-testid="title_det" sx={{ marginBottom:'15px' }}>{blog.title}</Typography>
        <Typography variant="body2" component="div" data-testid="author_det" sx={{ marginBottom:'12px', fontSize: '1.1rem', color: 'grey.700' }}>by {blog.author}</Typography>
        <Link href={blog.url} data-testid="url" sx={{ fontSize: '1.05rem' }}>{blog.url}</Link>
        <Typography variant="body2" component="div" sx={{ marginTop:'10px', fontSize: '0.93rem', color: 'grey.700' }}>Added by {blog.user.name}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-start',px:2 }}>
        <Typography variant="body2" data-testid="likes" sx={{ fontSize: '1rem' }}>{blog.likes} likes</Typography>
        {currentUser() ? <Button color="primary" variant="outlined"
          sx={{
            borderWidth: 2,
            '&:hover': { borderWidth: 2,  bgcolor: 'rgba(49, 70, 148, 0.2)' }  // garde 2px au survol
          }} onClick={() => handleLike(blog)}>like</Button> : <>likes</>}
        {addRemoveBtn(blog, currentUser())}
      </CardActions>
    </Card>

  )
}

{/* <div>
  <div style={{ ...blogStyle }} className='details'>
    <div>
      <h3> <span data-testid="title_det">{blog.title}</span> by <span data-testid="author_det">{blog.author}</span> </h3>
      <span data-testid="url"><Link to={`${blog.url}`}>{blog.url}</Link></span><br/>
      <span data-testid="likes"> {blog.likes} </span>
      {currentUser()?<button type="button" onClick={ () => handleLike(blog)}>like</button> : <>likes</>}<br/>
      {blog.user.name}<br />
      {addRemoveBtn(blog, currentUser())}
    </div>
  </div>

</div> */}

// <button type="button" onClick={toggleDetails}>hide</button><br/>
// <div style={{ ...blogStyle, ...highlightVisible }} className='highlights'>
//   <div>
//     <span data-testid="title_base">{blog.title}</span> by <span data-testid="author_base">{blog.author}</span>
//     <button type="button" onClick={toggleDetails}>view</button>
//   </div>
// </div>

export default Blog