const baseUrl = 'http://localhost:3005/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

export const createNote = async (newNote) => { 
  const request = new Request(baseUrl, {
    method: 'POST',
    headers: {
    "Content-Type": "application/json",
    },
    body:JSON.stringify(newNote)
  })

  const response = await fetch(request)

  if (!response.ok) { 
    throw new Error('Failed to create note')
  }

  return await response.json()

}

export const updateNote = async (updateNote) => { 
  const request = new Request(`${baseUrl}/${updateNote.id}`, {
    method: 'PUT',
    headers: {
    "Content-Type": "application/json",
    },
    body:JSON.stringify(updateNote)
  })

  const response = await fetch(request)

  if (!response.ok) { 
    throw new Error('Failed to create note')
  }

  return await response.json() 
}