import { useState, useEffect } from 'react'
import { Note } from './Note'
import Notification from './Notification'
import LoginForm from './LoginForm'

import Toggable from './Toggable'
import loginService from '../services/login'
import noteService from '../services/notes'

import { Link } from 'react-router-dom'

const NoteList = ({ notes }) => {

  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })


  useEffect(() => {
    if (user?.token) {
      noteService.setToken(user.token)
    }
  }, [user])

  console.log('render', notes.length, 'notes')




  const handleLogin = async (username, pwd) => {
    try {
      const user = await loginService.login({ username, password:pwd })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUser(user)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important === true)

  const loginForm = () => {
    return (
      <Toggable buttonLabel='log in'>
        <LoginForm
          handleSubmit={handleLogin}
        />
      </Toggable>
    )
  }


  console.log(notesToShow)
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content} </Link>
          </li>)
        )}
      </ul>
    </div>
  )
  /* {notesToShow.map((note) =>
          <Note  key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )} */
}


export default NoteList