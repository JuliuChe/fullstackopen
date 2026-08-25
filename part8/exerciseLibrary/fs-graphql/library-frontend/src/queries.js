import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
      id
    }
}`


export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $genres: [String]!
    $published: Int
  ) {
    addBook(
      title: $title, 
      author: $author, 
      genres: $genres, 
      published: $published) {
        title
        author
        genres
        published
        id
    }
  }
`

export const UPDATE_AUTHOR = gql`
mutation updateAuthor(
  $name: String!, 
  $setBornTo: Int!
  ) {
    editAuthor(
      name: $name, 
      setBornTo: $setBornTo
    ) {
    id
    born
    name
    
  }
}`