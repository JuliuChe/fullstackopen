import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import {useNotify} from './useNotification'
import {useNavigate} from 'react-router-dom'

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const useBlogs = () => {
  const queryClient = useQueryClient()
  const notify  = useNotify()
  const navigation = useNavigate()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll, 
    refetchOnWindowFocus:false
  })

  const newBlogMutation = useMutation({
    mutationFn:blogService.create,
    onSuccess:(newBlog) =>{
      notify(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
      navigation('/')
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    },
    onError: (err) =>{
      notify(`Creating new blog failed: ${err}`, true)
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn:blogService.update,
    onSuccess:() =>{
      queryClient.invalidateQueries({queryKey:['blogs']})
    },
    onError: (err) => {
      notify(`Error while trying to like a blog: ${err}`, true)
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn:(blog) => blogService.remove(blog.id),
    onSuccess: (data, blog) => {
      queryClient.invalidateQueries({queryKey:['blogs']})
      navigation('/')
      notify(`Blog ${blog.title} by ${blog.author} removed`)
      
    },
    onError: (err) => {
      notify(`Error while trying to delete a blog: ${err}`, true)
    }
  })

  return {
    blogs:result.data ?? [],
    isPending:result.isPending,
    addBlog: (newBlog) => newBlogMutation.mutate(newBlog),
    addLike: (blog) => updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1, user: blog.user.id }),
    removeBlog: (blog) => removeBlogMutation.mutate(blog)
  }
}