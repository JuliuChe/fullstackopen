import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_PERSON, ALL_PERSONS } from '../queries'

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }], //refetch queries is a way to update the CACHE
    onError: (error) => {
      setError(error.message)
    },
  })

  const submit = (event) => {
    event.preventDefault()

    createPerson({ variables: { name, street, city, phone } })

    setName('')
    setStreet('')
    setCity('')
    setPhone('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={submit}>
        <div>
          name{' '}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone{' '}
          <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street{' '}
          <input
            value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city{' '}
          <input
            value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default PersonForm
