import { useState, useEffect } from 'react'
import { Note } from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Notification from './components/Notification'
import { Container, AppBar, Toolbar, Button } from '@mui/material'

const App = () => {
  const [notes, setNotes] = useState([])
  const [notif, setNotif] = useState(null)
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null
  const navigate=useNavigate()

  const hook = () => {
    console.log('effect')
    noteService
      .getAll()
      .then(currentNotes => {
        console.log('rendering current notes from App', currentNotes)
        setNotes(currentNotes)
      })
  }
  useEffect(hook, [])

  useEffect(() => {
    if (user?.token) {
      noteService.setToken(user.token)
    }
  }, [user])

  console.log('render', notes.length, 'notes')


  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(newNote => {
        setNotes(notes.concat(newNote))
        setNotif({ text: `Note '${newNote.content}' added!`, type: 'success' })
        setTimeout(() => {
          setNotif(null)
        }, 5000)
      })
      .catch(error => {
        setNotif({ text: `Impossible to add note: ${error}`, type: 'error' })
        setTimeout(() => {
          setNotif(null)
        }, 5000)
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
        setNotif(
          { text: `Note '${noteToToggle.content}' was already removed from server`, type: 'error' }
        )
        setTimeout(() => {
          setNotif(null)
        }, 5000)
        throw error
      })

    // console.log(toggledNote)
    // note.important== !note.important
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const handleLogin = async (username, pwd) => {
    try {
      const user = await loginService.login({ username, password:pwd })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUser(user)
      navigate('/notes')
    } catch {
      setNotif({ text: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotif(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      window.localStorage.removeItem('loggedNoteappUser')
      setUser(null)
      noteService.setToken(null)
      navigate('/notes')
    }
  }

const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={style}>home</Button>
          <Button color="inherit" component={Link} to="/notes" sx={style}>notes</Button>
          <Button color="inherit"component={Link} to="/create" sx={style}>new note</Button>
          {user ? <Button color="inherit" onClick={handleLogout} sx={style}>logout</Button> : <Button color="inherit"component={Link} to="/login" sx={style}>login</Button>}
        </Toolbar>
      </AppBar>
      <div>
        {user && (
          <p>{user.name} logged in</p>
        )}
        <Notification message={notif} />
      </div>
      <Routes>
        <Route path="/notes/:id" element={
          <Note note={note} toggleImportance={toggleImportanceOf} deleteNote = {deleteNote} />
        } />
        <Route path="/notes" element={<NoteList notes={notes} user={user} onLogin={handleLogin} onLogout={handleLogout} /> } />
        <Route path="/create" element={<NoteForm createNote={addNote} />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={ <LoginForm handleSubmit={handleLogin} />
        } />
      </Routes>
      <Footer />
    </Container>
  )
}

//   const padding = {
//     padding: 5
//   }

// <Link style={padding} to="/">home</Link>
//         <Link style={padding} to="/notes">notes</Link>
//         <Link style={padding} to="/create">new note</Link>
//         {user ? <button onClick={handleLogout}>logout</button> : <Link style={padding} to="/login">login</Link>}
//       </div>

export default App