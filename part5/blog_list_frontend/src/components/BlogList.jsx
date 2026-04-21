import Blog from './Blog'

import { Link } from 'react-router-dom'

const BlogList = ({ blogs, user }) => {

  // const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))?.name ?? null

  return (
    <div>
      { user && <p>logged in as {user.name}</p> }
      <h2>blogs</h2>
      <ul aria-label="blog list">
        {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author} </Link>
          </li>
        )}
      </ul>
    </div>)
}
//        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} />

export default BlogList