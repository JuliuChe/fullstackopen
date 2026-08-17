import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'
import Notify from './components/Notify'
import { ALL_PERSONS } from './queries'
import { useState } from 'react'

const App = () => {
  //In order to add polling of the below query, add : , {pollInterval:2000} to useQuery
  const result = useQuery(ALL_PERSONS)
  const [errorMsg, setErrorMsg] = useState(null)

  if (result.loading) {
    return <div>loading...</div>
  }
  const notify = (message) => {
    setErrorMsg(message)
    setTimeout(() => {
      setErrorMsg(null)
    }, 5000)
  }

  return (
    <div>
      <Notify errorMessage={errorMsg} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App
