import {  useParams } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import NotFound from './NotFound'

const User = () =>{
  const params = useParams()
  const { users, isPending } = useUsers()
  if (isPending) { 
    return(
    <div> 
      user loading...
    </div>)
  }

  const user = users.find((user) => user.id === params.id)

  if (!user) return <NotFound />

  return (
    <div>
      <h2> {user.name} </h2>
      <h3> added blogs </h3>
      <ul>
        {user.blogs.map((blog) => (<li key={blog.id}>{blog.title}</li>))}
      </ul>
    </div>
  )
}

export default User