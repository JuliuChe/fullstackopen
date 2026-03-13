import { useEffect } from 'react'
import { useState } from 'react'
import entryService from './services/entry'
import Filter from './components/Filter'
import RenderAllPeople from './components/RenderAllPeople'
import PersonsForm from './components/PersonsForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([ 
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name:"Dan Abramov", number:"12-43-234345", id:3},
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber]=useState('')
  const [newFilter, setNewFilter]=useState('')
  const [notification, setNotification]=useState({message:null, type:'info'})
  
  const hook = () => {
    entryService
    .getAll()
    .then(servedPersons => {
      setPersons(servedPersons)
    })
  }
  useEffect(hook, [])
  
  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleAddEntry=(event) => {
    event.preventDefault()
    const newNamePrep=newName.trim()
    const newPersonObj={name:newNamePrep, number:newNumber,id:persons.slice(-1).id+1}
    const alreadyExists = persons.find((name) => name.name === newNamePrep)?true:false;
    if (!alreadyExists){
      entryService
        .create(newPersonObj)
        .then(newEntry =>{
            setPersons(persons.concat(newEntry))
            setNotification(
             {message:`Added ${newEntry.name}`, type:'info'}
            )
            setTimeout(() => {
              setNotification({...notification, message:null})
              }, 5000)
          })
        .catch(error => {
          console.log(error.response.data.error)
          setNotification(
             {message:error.response.data.error, type:'error'}
            )
          setTimeout(() => {
            setNotification({...notification, message:null})
          }, 5000)

        }) 

      setNewName("")
      setNewNumber("")
    } else {
      if(confirm((`${newNamePrep} is already added to phonebook, replace the old number with a new one ?`))){
        const id=persons.find((name) => name.name === newNamePrep).id
        const updatePersonObj={name:newNamePrep, number:newNumber,id:id}
        entryService
          .updateEntry(id, updatePersonObj)
          .then(updatedEntry =>{
            
            console.log(persons)
            setNotification({
              message:
              `Number of  ${updatedEntry.name} was changed from ${persons.find((person) => person.id==id).number} to ${updatedEntry.number}`, 
              type:'info'
              })
              setTimeout(() => {
                setNotification({...notification, message:null})
                }, 5000)
                setPersons(persons.map((person) => person.id===id?updatedEntry:person))
            })
            .catch(error => {
              setNotification({message:error.response.data.error, type:'error'})
              // setPersons(persons.filter((person) => person.id!==id))
              setTimeout(() => {
                setNotification({...notification, message:null})
                }, 5000)

            })
        }
      }
    }

  const handleFilter=(event) => {
    setNewFilter(event.target.value)
  }

  const handleDeletePerson=(id, name)=>{
    if (confirm(`Delete ${name} ? `)){
      console.log(`Person to delete with id ${id}`)
      entryService
        .deleteId(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id!==id ))
        })
        .catch(error => {
          alert("The person could not be deleted")
          console.error(error)
        })
    } else{
      console.log("Not deleted")
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notification.message} type={notification.type} />
        <Filter filter={newFilter} handler={handleFilter}/>
      <h2> add a new </h2>
        <PersonsForm addHandler={handleAddEntry} name={newName} nameHandler={handleNewName} number={newNumber} numberHandler={handleNewNumber} />
      <h2>Numbers</h2>
        <RenderAllPeople filter={newFilter} persons={persons} okDeleteHandler={handleDeletePerson}/>
    </div>
  )
}








export default App
