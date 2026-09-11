const typeDefs = /* GraphQL */ `
  type Author {
    name: String!
    bookCount: Int
    id: ID!
    born: Int
  }

  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    # friends:[User!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String]!
    ): Book
    editAuthor(name: String!, setBornTo: Int): Author
    createUser(
      username: String!
      favoriteGenre: String!
      # friends:[ID]
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

module.exports = typeDefs
