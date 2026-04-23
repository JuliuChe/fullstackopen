import { useNotesActions } from '../store'
// import noteService from '../service/notes'
const NoteForm = () => { 
  const { add } = useNotesActions()
  
  const addNote = async (e) => { 
    e.preventDefault()
    const content = e.target.note.value
    // const newNote =  await noteService.create(content)
    await add(content) 
    e.target.reset()
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
    
  )     
}

export default NoteForm