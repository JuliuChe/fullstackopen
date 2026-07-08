import {
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'



import {useBlogs} from './hooks/useBlogs'
import useUser from './hooks/useUser'
import BlogList from './components/BlogList'
import Login from './components/Login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import UsersList from './components/UsersList'
import User from './components/User'
import ErrorBoundary from './components/ErrorBoundary'
import Notification from './components/Notification'
import NotFound from './components/NotFound'

const App = () => {
  const {blogs, isPending, addBlog, addLike, addComment, removeBlog} = useBlogs()

  const {user, login, logout} = useUser()

  const location = useLocation()
  const navigation = useNavigate()


  const doLogin = async ({ username, password }) => {
    const {login:userLogin}= await login({username, password})
    if(userLogin) navigation('/')
  }

  const handleLogout = async () => {
    logout()
    navigation('/')
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            blogs
          </Button>
          {!user ? (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
              login
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/users"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                users
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                new blog
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Notification />

      <Routes>
        <Route
          path="/"
          element={isPending ? 
            <div>Loading data...</div>:
            <ErrorBoundary>
              <BlogList blogs={blogs} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blogs/:id"
          element={isPending ? 
            (<div>Loading data...</div>):
            (<ErrorBoundary key={location.pathname}>
              {blog ? (
                <Blog
                  blog={blog}
                  addLike={addLike}
                  currentUser={user}
                  removeBlog={removeBlog}
                  addComment={addComment}
                />
              ) : (
                <NotFound />
              )}
            </ErrorBoundary>
          )}
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary key={location.pathname}>
              <Login doLogin={doLogin} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/create"
          element={
            <ErrorBoundary key={location.pathname}>
              <BlogForm createBlog={addBlog} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/users"
          element={
            <ErrorBoundary key={location.pathname}>
              <UsersList />
            </ErrorBoundary>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ErrorBoundary key={location.pathname}>
              <User />
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  )
}

export default App
