import { memo, useRef, useEffect } from 'react'

const NoteList = memo(({ onDelete, notes }) => {
  const renderCount = useRef(0)
  useEffect(() => {
    renderCount.current += 1        // écrit le ref APRÈS le rendu → autorisé
    console.log(`NoteList renders is at ${renderCount.current}`)
  })
  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>
          {note.content}
          <button onClick={() => onDelete(note.id)}>delete</button>
        </li>
      ))}
    </ul>
  )
})

export default NoteList