import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_BOOK, ALL_AUTHORS, FILTERED_BOOKS } from '../queries'

const NewBook = ({show, selectedGenres}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const variables = {genres:selectedGenres}
  const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, {data}) => {
      const newBook = data?.addBook
  
      if (!newBook){
        return
      }

      const matchesFilter = selectedGenres.length === 0 ||
      newBook.genres?.some(genre => selectedGenres.includes(genre))

      if(!matchesFilter){
        return
      }
      cache.updateQuery({ 
        query: FILTERED_BOOKS,
        variables,  
      }, cachedQueryResult => {
        if(!cachedQueryResult) {
          return cachedQueryResult
        }

        const books = cachedQueryResult.allBooks
        const bookAlreadyExist = books.some(book => book.id === newBook.id)

        if(bookAlreadyExist){
          return cachedQueryResult
        }

      return {
        ...cachedQueryResult,
          allBooks:books.concat(newBook),
        }
      })
    },
    refetchQueries: [{ query: ALL_AUTHORS }], //refetch queries is a way to update the CACHE
    awaitRefetchQueries:true,
  })
  //   onError: (error) => {
  //   setError(error.message)
  // },
  if (!show) {
    return null
  }
  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    createBook({ variables: { title, author, genres, published } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            label="published"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            label="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
