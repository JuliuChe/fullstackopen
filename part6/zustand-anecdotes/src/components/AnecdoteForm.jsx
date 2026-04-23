import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => { 
  const { add } = useAnecdoteActions()
  // const generateId = () => (Number(Math.random() * 1000000).toFixed(0))
  
  const addAnecdote = (e) => { 
    e.preventDefault()
    const content = e.target.anecdote.value
    add(content)
    e.target.reset()
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
    
  )     
}

export default AnecdoteForm