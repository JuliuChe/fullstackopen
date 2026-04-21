import { useState } from 'react'
import LoginForm from './LoginForm'
import Toggable from './Toggable'

import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const NoteList = ({ notes, user, onLogin, onLogout }) => {

  const [showAll, setShowAll] = useState(true)

  console.log('render', notes.length, 'notes')


  const notesToShow = showAll ? notes : notes.filter((note) => note.important === true)

  const loginForm = () => {
    return (
      <Toggable buttonLabel='log in'>
        <LoginForm
          handleSubmit={onLogin}
        />
      </Toggable>
    )
  }


  return (
    <div>
      <h1>Notes</h1>
      {!user && loginForm()}
      {user && (
        <div>
          <button onClick={onLogout}>logout</button>
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>content</TableCell>
              <TableCell>user</TableCell>
              <TableCell>important</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notesToShow.map((note) => (
              <TableRow key={note.id}>
                <TableCell>
                  <Link to={`/notes/${note.id}`}>
                    {note.content}
                  </Link>
                </TableCell>
                <TableCell>
                  {note.user.name}
                </TableCell>
                <TableCell>
                  {note.important?'true':'false'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
  /* {notesToShow.map((note) =>
          <Note  key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )} */
}


export default NoteList