const RenderAllPeople=({filter, persons, okDeleteHandler}) =>{

  return( <ul>
         {persons
          .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
          .map((person)=> <RenderPerson key={person.id} person={person} deleteHandler={()=>okDeleteHandler(person.id, person.name)}/> )}
        </ul>)
}

const RenderPerson=({person, deleteHandler}) => {
  return (
    <li> 
      {person.name} {person.number} 
      <button onClick={deleteHandler}>{"delete"}</button>
    </li>
  )
    
}
export default RenderAllPeople