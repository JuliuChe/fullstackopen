const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
try {
  const response = await fetch(baseUrl)
  
  if (!response.ok) {
    // Le serveur a répondu, mais avec une erreur (404, 500...)
    throw new Error(`HTTP error: ${response.status}`)
  }
  
  return await response.json()
} catch (error) {
  // Attrape les deux : erreurs réseau ET les throw du if
  console.error('Fetch failed:', error.message)
  throw error
}
}

export const createAnecdote = async (newAnecdote) => {
    const request = new Request(baseUrl, {
    method: 'POST',
    headers: {
    "Content-Type": "application/json",
    },
    body:JSON.stringify(newAnecdote)
  })

  const response = await fetch(request)

  if (!response.ok) { 
    throw new Error('Failed to create anecdote')
  }

  return await response.json()
}

export const updateAnecdote = async (anecdote) => {
   const request = new Request(`${baseUrl}/${anecdote.id}`, {
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
