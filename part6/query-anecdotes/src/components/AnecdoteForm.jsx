import { useAnecdotes } from '../hooks/useAnecdote'
import useNotify from '../hooks/useNotify'

const AnecdoteForm = () => {
  const { addAnecdote: addAnecdoteToServer } = useAnecdotes()
  const { setNotification } = useNotify()
  
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    addAnecdoteToServer(content)
    console.log('new anecdote')
    setNotification(`${content} added`)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm