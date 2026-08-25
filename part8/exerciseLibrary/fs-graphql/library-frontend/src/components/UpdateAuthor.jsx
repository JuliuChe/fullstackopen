import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { UPDATE_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const UpdateAuthor = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')


  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }] //refetch queries is a way to update the CACHE
  })
    //   onError: (error) => {
    //   setError(error.message)
    // },
  if (!props.show) {
    return null
  }
  const submit = async (event) => {
    event.preventDefault()

    console.log('update author...')
    updateAuthor({ variables: { name, setBornTo:born } })

    setName('')
    setBorn('')
  }


  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input
            label="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            label="born"
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default UpdateAuthor