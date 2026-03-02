import { useState } from 'react'
function generateRandomInt(present, max) {
  const randomInt = Math.floor(Math.random() * max)
  if (present == randomInt) {
    console.log('Same anecdote generated, generating again...')
    return generateRandomInt(present, max)
  }
  return randomInt
}

const BestAnecdote = (props) => {
  const anecdotes = props.anecdotes
  const votes = props.votes
  const maxVotes = Math.max(...votes)
  const bestIndex = votes.indexOf(maxVotes)

  if (maxVotes === 0) {
    return (
      <div>
        <h1>Anecdote with most votes</h1>
        <p>No votes given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Anecdote with most votes</h1>
      {anecdotes[bestIndex]}
      <br/>
      has {maxVotes} votes
    </div>
  )
}

const DayAnecdote = (props) => {
      return(
        <div>
          <h1>Anecdote of the day</h1>
          {props.anecdotes}
          <br/>
          Votes:{props.votes}
          <br/>
        </div>
      )  
  }

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.']
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleVote = () => {
    setVotes(v=>v.map((vote, index) => index === selected ? vote + 1 : vote))
  }

  return (
    <div>
      <DayAnecdote anecdotes={anecdotes[selected]} votes={votes[selected]}/>
      <button onClick={() => setSelected(generateRandomInt(selected, anecdotes.length))}>next anecdote</button>
      <button onClick={handleVote}>vote</button>
      <BestAnecdote anecdotes={anecdotes} votes={votes}/>
    </div>
  )
}


export default App