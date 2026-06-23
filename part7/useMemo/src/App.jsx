import { useState, useRef, useEffect, useCallback } from 'react'

// import FilteredList from './components/filteredList'
import NoteList from './components/noteList'
import ManualCounter from './components/manualCounter'
import LeftRightCounter from './components/leftRigthCounter'
import FormFieldsWithHook from './components/formFieldsWithHook'
import PersistentStateWithHook from './components/persistentStateWithHook'

function App() {
  

  const renderCount = useRef(0)
  useEffect(() => {
    renderCount.current += 1        // écrit le ref APRÈS le rendu → autorisé
    console.log(`App renders is at ${renderCount.current}`)
  })
  const [notes, setNotes] = useState([
    { id: 1, content: 'Learn React' },
    { id: 2, content: 'Learn hooks' },
    { id: 3, content: 'Learn useMemo' },
    { id: 4, content: 'Learn useCallback' },
    { id: 5, content: 'Build something cool' },
  ])
  const [newNote, setNewNote] = useState('')

  const handleDelete = useCallback((id) => {
    setNotes(notes => notes.filter(note => note.id !== id))
  },[])

  const handleAdd = () => {
    setNotes(notes => [...notes, { id: Date.now(), content: newNote }])
    setNewNote('')
  }
  
  return (
    <div>
      {/* <FilteredList /> */}
      <input id = "noteField" name="fieldForANote" value={newNote} onChange={e => setNewNote(e.target.value)} />
      <button onClick={handleAdd}>add</button>
      <NoteList notes={notes} onDelete={handleDelete} renderCount={renderCount}/>
      <div>
        <ManualCounter />
      </div>
      <div>
        <LeftRightCounter />
      </div>
      <div>
        <FormFieldsWithHook />
      </div>
      <PersistentStateWithHook />
      
    </div>
  )
}

export default App
