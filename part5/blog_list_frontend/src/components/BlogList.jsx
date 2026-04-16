import Blog from './Blog'

const BlogList = ({ blogs, handleLike, handleRemove }) => {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} />
      )}
    </div>)
}
export default BlogList