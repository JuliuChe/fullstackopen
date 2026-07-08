import { getUser } from './persistentUser'
const baseUrl = '/api/users'

const users = async () => {
  
  const options = {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${getUser()?.token}` } ,
  }

  
  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const data = await response.json()
  return data
}


const createUser = (newUser) => {
  //TODO Create a signup page - off scope of exercises... for later use
  console.log(newUser)

}

export default { users, createUser }
