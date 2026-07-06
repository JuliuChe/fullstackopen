const getUser = () =>{
    const userJSON = window.localStorage.getItem('loggedBlogappUser')
    const user = JSON.parse(userJSON)
    return user
}
const removeUser = () =>{
  window.localStorage.removeItem('loggedBlogappUser')
}
const saveUser = (user) =>{
  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
}



export default {getUser, saveUser, removeUser}