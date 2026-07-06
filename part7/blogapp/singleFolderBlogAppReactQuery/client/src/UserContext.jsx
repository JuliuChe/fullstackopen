import {createContext, useState} from 'react'

import blogService from './services/blogs'
import persistentUser from './services/persistentUser'
import loginService from './services/login'
import {useNotify}  from './hooks/useNotification'

const UserContext = createContext()


export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null)
  const notify  = useNotify()


  const changeUser = (user) =>{
    blogService.setToken(user? user.token:null)
    setUser(user)
  }

  const login = async ({username, password}) => {
    try {
      const user = await loginService.login({ username, password })
      persistentUser.saveUser(user)
      changeUser(user)
      notify(`Logged in with ${username}`)
      return {login:true}
      
    } catch {
      notify('wrong username or password', true)
      console.log('wrong credentials')
      return {login:false}
    }
  }

  const logout = async () =>{
    persistentUser.removeUser()
    changeUser(null)
  }

  const load = () =>{
    const user = persistentUser.getUser()
    if (user) changeUser(user)
  }

  return (
    <UserContext.Provider value={{user, load, logout, login}}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext