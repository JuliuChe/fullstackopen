const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const create = async (content) => {
  const request = new Request(baseUrl, {
    method: 'POST',
    headers: {
    "Content-Type": "application/json",
    },
    body:JSON.stringify({content, important:false})
  })

  const response = await fetch(request)

  if (!response.ok) { 
    throw new Error('Failed to create note')
  }

  return await response.json()
}
 
const update = async (id, note) => { 
  const request = new Request(`${baseUrl}/${id}`, {
        method: 'PUT',
    headers: {
    "Content-Type": "application/json",
    },
    body:JSON.stringify(note)
  })
  const response = await fetch(request)

  if (!response.ok) { 
    throw new Error('Failed to create note')
  }

  return await response.json()
}

export default { getAll, create, update }