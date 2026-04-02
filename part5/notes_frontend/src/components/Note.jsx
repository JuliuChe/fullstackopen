
export const Note = ({note, toggleImportance}) => {
  const label = note.important?'make not important':'make important'
  return (
      <li className='note'>
        <button  onClick={toggleImportance}>{label}</button>
        <span> {"--"} </span>
        {note.content} {note.important?'!!!':''}        
      </li>
  ) 
}

// export default Note