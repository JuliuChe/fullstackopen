import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import VisibilityFilter from './components/VisibilityFilter'
import { useEffect } from 'react'
import { useNotesActions } from './store'

const App = () => {
  const { initialize } = useNotesActions()
  useEffect(() => {
    initialize()
  }, [initialize])
  
  return (
    <div>
      <NoteForm /> 
      <VisibilityFilter />
      <NoteList />
    </div>
  )
}
export default App