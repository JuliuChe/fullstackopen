import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { UPDATE_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const UpdateAuthor = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')


  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }] //refetch queries is a way to update the CACHE
  })

  const result = useQuery(ALL_AUTHORS)

  const authors = result.data.allAuthors
  console.log(authors)
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
          <label>
            name:
            <select name="AuthorSelected" onChange={({target})=>setName(target.value)}>
              {authors.map( (a) => (<option key={a.name} value={a.name}>{a.name}</option>))}
            </select>
          </label>
          {/* <input
            label="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          /> */}
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