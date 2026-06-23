const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const createNew = async (object) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  const result = await response.json()
  return result
}

const deleteEntry = async (id) => { 
  const response = await fetch(baseUrl+'/'+id, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete note')
  }
  const result = await response.json()
  console.log(result);
  return result
}

export default { getAll, createNew, deleteEntry }