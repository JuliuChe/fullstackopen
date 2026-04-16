import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [details, setDetails] = useState(false)

  const highlightVisible = { display:details ? 'none': '' }
  const detailVisible = { display:details ? '' : 'none' }
  const toggleDetails = () => {
    setDetails(!details)
  }
  const navigate = useNavigate()
  const onRemove = (id) => {
    handleRemove(id)
    navigate('/')
   }

  const currentUser = () => {
    const loggedUsrJson = window.localStorage.getItem('loggedBlogappUser')
    return loggedUsrJson?JSON.parse(loggedUsrJson).username:null
  }

  const addRemoveBtn = (blog, currentUser, handleRemove) => {
    return currentUser === blog.user.username ? <> <button type="button" onClick={() => onRemove(blog.id)}>remove</button><br/></> :null
  }

  return (
    <div>
      <div style={{ ...blogStyle}} className='details'>
        <div>
          <h3> <span data-testid="title_det">{blog.title}</span> by <span data-testid="author_det">{blog.author}</span> </h3>
          <span data-testid="url"><Link to={`${blog.url}`}>{blog.url}</Link></span><br/>
          <span data-testid="likes"> {blog.likes} </span>
          {currentUser()?<button type="button" onClick={ () => handleLike(blog)}>like</button> : <>likes</>}<br/>
          {blog.user.name}<br />
          {addRemoveBtn(blog, currentUser(), handleRemove)}
        </div>
      </div>

    </div>
  )
}

          // <button type="button" onClick={toggleDetails}>hide</button><br/>
      // <div style={{ ...blogStyle, ...highlightVisible }} className='highlights'>
      //   <div>
      //     <span data-testid="title_base">{blog.title}</span> by <span data-testid="author_base">{blog.author}</span>
      //     <button type="button" onClick={toggleDetails}>view</button>
      //   </div>
      // </div>

export default Blog