import { gql } from '@apollo/client'
import { useQuery, useApolloClient } from '@apollo/client/react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { ALL_PERSONS } from './queries'
import { useState } from 'react'

const App = () => {
  
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token'),
  )
  const [errorMsg, setErrorMsg] = useState(null)
  //In order to add polling of the below query, add : , {pollInterval:2000} to useQuery
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()


  if (result.loading) {
    return <div>loading...</div>
  }

  const onLogout = () => {
    setToken(null)
    localStorage.removeItem('phonebook-user-token')
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMsg(message)
    setTimeout(() => {
      setErrorMsg(null)
    }, 5000)
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMsg} />
        <LoginForm setError={notify} setToken={setToken} />
      </div>
    )
  }
  return (
    <div>
      <Notify errorMessage={errorMsg} />
      <button onClick={onLogout}> Logout </button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />

    </div>
  )
}

export default App
