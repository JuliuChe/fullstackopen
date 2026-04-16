import { useState, useEffect } from 'react'
import { Note } from './components/Note'
import noteService from './services/notes'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import Home from './components/Home'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([{
    id: '1',
    content: 'HTML is easy',
    important: true
  },
  {
    id: '2',
    content: 'Browser can execute only JavaScript',
    important: false
  }])
  const [errorMessage, setErrorMessage] = useState(null)
  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null


  const hook = () => {
    console.log('effect')
    noteService
      .getAll()
      .then(currentNotes => {
        console.log('promise fulfilled')
        setNotes(currentNotes)
      })
  }
  useEffect(hook, [])


  console.log('render', notes.length, 'notes')


  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(newNote => {
        setNotes(notes.concat(newNote))
      })
  }

  const toggleImportanceOf = (id) => {
    console.log('note with id ', id, ' needs to be toggled')
    const noteToToggle = notes.find(n => n.id === id)
    const toggledNote = { ...noteToToggle, 'important': !noteToToggle.important }
    return noteService
      .update(id, toggledNote)
      .then(returnedNote => {
        setNotes(notes.map((note) => note.id === id ? returnedNote : note))
        return returnedNote
      })
      .catch(error => {
        setNotes(notes.filter(n => n.id !== id))
        setErrorMessage(
          `Note '${noteToToggle.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        throw error
      })

    // console.log(toggledNote)
    // note.important== !note.important
  }
  const padding = {
    padding: 5
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(n => n.id !== id))
    })
  }


  return (
    <div>
      <div>
        <Notification message={errorMessage} />

        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </div>
      <Routes>
        <Route path="/notes/:id" element={
          <Note note={note} toggleImportance={toggleImportanceOf} deleteNote = {deleteNote} />
        } />
        <Route path="/notes" element={ <NoteList notes={notes} /> } />
        <Route path="/create" element={<NoteForm createNote={addNote} />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </div>

  )
}


export default App