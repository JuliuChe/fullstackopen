import { useState, useEffect } from 'react'
import {Note} from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes]=useState([])
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  const [showAll, setShowAll]=useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    console.log('effect')
    noteService
      .getAll()
      .then( currentNotes =>{
        console.log("promise fulfilled")  
        setNotes(currentNotes)
        })
  }
  useEffect(hook,[])

  console.log('render', notes.length, 'notes')

  const notesToShow = showAll?notes:notes.filter((note) => note.important===true)
  const handleNoteChange=(event)=>{
    setNewNote(event.target.value)
  }
  const toggleImportanceOf=(id) => {

    console.log("note with id "+id+" needs to be toggled")
    const noteToToggle = notes.find(n => n.id===id)
    const toggledNote = {...noteToToggle, "important":!noteToToggle.important}
    noteService
      .update(id, toggledNote)
      .then(returnedNote => {
        setNotes(notes.map((note) => note.id==id?returnedNote:note))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${noteToToggle.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // alert(
        //   `the note '${noteToToggle.content}'  was already deleted from server`
        // )
        setNotes(notes.filter(n => n.id !== id))
      })

    console.log(toggledNote)
    // note.important== !note.important
  }
  const addNote=(event) => {
    event.preventDefault()
    const noteObject={content:newNote, important:Math.random()<0.5 }
//     setNotes(notes.concat(noteObject))
//     setNewNote("")
    console.log(notes)
    noteService
      .create(noteObject)
      .then(newNote => {
        console.log(newNote)
        setNotes(notes.concat(newNote))
        setNewNote("")
      })

}

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={()=>setShowAll(!showAll)}>show {showAll?"important":"all"}</button>
      </div>
      <ul>
        {notesToShow.map((note)=> 
          <Note  key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}


export default App