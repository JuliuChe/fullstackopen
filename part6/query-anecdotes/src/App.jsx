import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdote'

const App = () => {
  const {anecdotes, isPending, isError, addVote} = useAnecdotes()
  

   
    if (isPending) {
      console.log('loading data...')
      return <div>loading data...</div>
    }
  
    if (isError) {
      console.log('loading data...')
      return <div>anecdote service not available due to problems in server</div>
    }


  const handleVote = (anecdote) => {
    console.log(`vote for ${anecdote.id}`)
    addVote(anecdote)
  }

  // const anecdotes = [
  //   {
  //     content: 'If it hurts, do it often',
  //     id: '47145',
  //     votes: 0,
  //   },
  // ]

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App