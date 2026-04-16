import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  console.log(config)
  const response = await axios.post(baseUrl, newBlog, config)
  console.log(response.data)
  return  response.data
}

const updateBlog = async (id, updatedBlog) => {
  const myUrl = `${baseUrl}/${id}`
  const response = await axios.put(myUrl, updatedBlog)
  return response.data
}

const deleteBlog = async (id) => {
  const myUrl = `${baseUrl}/${id}`
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(myUrl, config)
  console.log(response.data)
  return response.data
}

export default { getAll, setToken, create, updateBlog, deleteBlog }