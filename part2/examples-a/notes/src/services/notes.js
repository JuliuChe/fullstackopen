    
import axios from 'axios'
const baseUrl="http://localhost:3001/api/notes"


const getAll=() =>{
    const request=axios.get(baseUrl)
    const nonExisting = {
    id: "10000",
    content: 'This note is not saved to server',
    important: true,
  }
//   return request.then(response => response.data.concat(nonExisting))
    return axios.get(baseUrl).then(response => response.data)
}

const create=newObject =>{
    console.log(newObject)
    return axios.post(baseUrl, newObject).then(response => response.data)
}

const update=(id, newObject)=>{
    const myUrl=`${baseUrl}/${id}`
    return axios.put(myUrl, newObject).then(response => response.data)
}

export default{ getAll, create, update}