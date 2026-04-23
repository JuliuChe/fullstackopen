import { useAnecdoteActions } from "../store";

const Anecdote = ({ anecdote }) => { 
  const {vote, remove} = useAnecdoteActions()
  return (
        <div>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes 
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes === 0 && <button onClick={() => remove(anecdote.id)}>remove</button>}
          </div>
        </div>
  )
}

export default Anecdote
