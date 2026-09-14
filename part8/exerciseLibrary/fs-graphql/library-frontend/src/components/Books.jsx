import { ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client/react'
import { useState } from 'react'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [selectedGenres, setGenreSelection] = useState([])

  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  const addGenre = (id) => {
    if (selectedGenres.includes(id)) {
      setGenreSelection(selectedGenres.filter((g) => g !== id))
    } else {
      setGenreSelection(selectedGenres.concat(id))
    }
  }

  const books = result.data.allBooks
  const genres = [...new Set(books.flatMap((b) => b.genres)), 'all genres']
  console.log(selectedGenres)

  const filteredBooks =
    selectedGenres.length === 0 || selectedGenres.includes('all genres')
      ? books
      : books.filter((book) =>
          book.genres.some((genre) => selectedGenres.includes(genre)),
        )

  return (
    <div>
      <h2>books</h2>
      <div>
        {' '}
        in {selectedGenres.length > 0 ? '' : 'all'} genres{' '}
        {selectedGenres.length > 0 ? selectedGenres.join(', ') : ''}
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => {
            return (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )
          })}

          {/* // }
          // )} */}
        </tbody>
      </table>
      <div>
        {genres.map((g) => {
          const isSelected = selectedGenres.includes(g)
          return (
            <button
              key={g}
              onClick={() => addGenre(g)}
              style={{
                border: isSelected ? '3px solid #2388cc' : '1px solid #86888a',
              }}
            >
              {g}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Books
