import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import UpdateAuthor from './components/UpdateAuthor'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useApolloClient } from '@apollo/client/react'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()

  const onSetToken = (token) => {
    setToken(token)
    setPage('authors')
  }
  const onLogout = () => {
    onSetToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
  }

  const [selectedGenres, setGenreSelection] = useState([])

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>
        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} selectedGenres={selectedGenres} setGenreSelection={setGenreSelection} />
        <LoginForm show={page === 'login'} setToken={onSetToken} />
      </div>
    )
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('update author')}>update author</button>
        <button onClick={() => setPage('recommendations')}>recommend</button>
        <button onClick={onLogout}>logout</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} selectedGenres={selectedGenres} setGenreSelection={setGenreSelection} />
      <NewBook show={page === 'add'} selectedGenres={selectedGenres}  />

      <UpdateAuthor show={page === 'update author'} />

      <Recommend show={page === 'recommendations'} />
    </div>
  )
}

export default App
