import { ME, ALL_BOOKS } from '../queries'
import { useQuery } from '@apollo/client/react'
const Recommend = (props) => {
  const result = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS, {
    fetchPolicy: 'cache-first',
  })

  if (!props.show) {
    return null
  }

  if (result.loading || booksResult.loading) {
    return <div>Loading ... </div>
  }

  const userFavoriteGenre = result.data.me.favoriteGenre
  const books = booksResult.data.allBooks
  const filteredBooks = books.filter((book) => {
    return book.genres.includes(userFavoriteGenre)
  })
  return (
    <div>
      <h2>recommendations</h2>
      <div> books in your favorite genre {userFavoriteGenre}</div>
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
    </div>
  )
}
export default Recommend
