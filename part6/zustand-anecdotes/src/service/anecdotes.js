const baseUrl = 'http://localhost:3002/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  return await response.json()
}

const create = async (content) => {
  const request = new Request(baseUrl, {
    method: 'POST',
    headers: {
    "Content-Type": "application/json",
    },
    body:JSON.stringify({content, votes:0})
  })

  const response = await fetch(request)

  if (!response.ok) { 
    throw new Error('Failed to create an anecdote')
  }

  return await response.json()
}
 
const update = async (id, anecdote) => { 
  const request = new Request(`${baseUrl}/${id}`, {
        method: 'PUT',
    headers: {
    "Content-Type": "application/json",
    },
    body:JSON.stringify(anecdote)
  })
  const response = await fetch(request)

  if (!response.ok) { 
    throw new Error('Failed to edit anecdote', anecdote.content)
  }

  return await response.json()
}

const remove = async (id) => {
  const request = new Request(`${baseUrl}/${id}`, {
    method: 'DELETE'
  })
  const response = await fetch(request)
  console.log(response.json())
  if (!response.ok) {
    throw new Error('Failed to delete anecdote with id: ', id)
  }
}

export default { getAll, create, update, remove }