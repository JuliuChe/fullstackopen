
import { useParams, useNavigate } from 'react-router-dom'


export const Note = ({ note, toggleImportance, deleteNote }) => {
  const noteId = useParams().id
  const navigate = useNavigate()
  if(!note) {
    return null
  }

  const label = note.important ? 'make not important' : 'make important'
  const handleDelete = () => {
    if (window.confirm(`Delete note "${note.content}"?`)) {
      deleteNote(noteId)
      navigate('/notes')
    }
  }
  const handleToggle = () => {
    toggleImportance(noteId).catch(() => {
      navigate('/notes')
    })
  }

  return (
    <li className='note'>
      <button onClick={handleToggle}>{label}</button>
      <button onClick={handleDelete}>delete</button>
      <span> { '--' } </span>
      <span> {note.content}  </span> {note.important?'!!!':''}
    </li>
  )
}

// export default Note