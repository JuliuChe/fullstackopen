import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'

const useBlogStore = create((set, get) => ({
  blogs: [],
  currentUser: null,
  actions: {
    initializeBlogs: async () => {
      const blogs = await blogService.getAll()
      set({ blogs: blogs })
    },
    initializeUser: () => {
      const userJSON = window.localStorage.getItem('loggedBlogappUser')
      const user = JSON.parse(userJSON)
      
      if (user) {
        blogService.setToken(user.token)
        set(({ currentUser: user }))
      }

    },
    userLogin: async ({ username, password }) => { 
      try {
            const user = await loginService.login({ username, password })
      
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            set(({ currentUser: user }))
            return ({isError:false, message:`Logged in as ${user.username}` })
          } catch (error) {
            return ({ isError: true, message: `wrong username or password ${error}` })
          }
    },
    userLogout: async () => {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken('')
      set(({currentUser:null}))
    },
    addBlog: async (blogObject) => {
      try {
        const createdBlog = await blogService.create(blogObject)
        set((state) => ({ blogs: state.blogs.concat(createdBlog) }))
        return {
          isError: false,
          message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        }
      } catch (error) {
        return { isError: true, message: `Creating new blog failed: ${error}` }
      }
    },
    findBlog: (id) => {
      const blog = get().blogs.find((b) => b.id === id)
      return blog
    },
    addLike: async (blog) => {
      const newBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
      try {
        const updatedBlog = await blogService.update(newBlog)
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === blog.id ? updatedBlog : b)),
        }))
      } catch (error) {
        console.log('Error while trying to like a blog:', error)
      }
    },
    removeBlog: async (blog) => {
      try {
        await blogService.remove(blog.id)
        set((state) => ({ blogs: state.blogs.filter((b) => b.id !== blog.id) }))
        return {
          isError: false,
          message: `Blog ${blog.title} by ${blog.author} removed`,
        }
        // launchSuccess(`Blog ${blog.title} by ${blog.author} removed`)
        // navigation('/')
      } catch (error) {
        return {
          isError: true,
          message: `Error while trying to delete a blog ${error}`,
        }
      }
    },
  },
}))

// the hook functions that are used elsewhere in app
export const useBlogStoreBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogStoreUser = () => useBlogStore( (state) => state.currentUser)
export const useBlogStoreActions = () => useBlogStore((state) => state.actions)
