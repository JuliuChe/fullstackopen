import { useEffect } from 'react'

import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import VisibilityFilter from './components/VisibilityFilter'
import { useAnecdoteActions, useNotification } from './store'

import Notification from './components/Notification'
const App = () => {

  const { initialize } = useAnecdoteActions()
  const notification = useNotification()
  useEffect(() => { initialize() }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification message={notification} />
      <VisibilityFilter />
      <AnecdoteList />
      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  )
}

export default App