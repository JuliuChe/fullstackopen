const { GraphQLError } = require('graphql')
const Book = require('./models/books')
const jwt = require('jsonwebtoken')
const Author = require('./models/authors')
require('dotenv').config()

const resolvers = {
  Book: {
    author: (root) => root.author.name,
    id: (root) => root._id.toString(),
  },
  Author: {
    id: (root) => root._id.toString(),
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre)
        return await Book.find({}).populate('author')
      let filtBooks = await Book.find({}).populate('author')
      console.log(filtBooks)

      if (args.genre) {
        filtBooks = await Book.find({ genres: args.genre }).populate('author')
      }

      if (args.author) {
        const author = Author.find({ name: args.author })
        if (!author) {
          throw new GraphQLError(`Name : ${args.author} does not exist`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
            },
          })
        }
        filtBooks = filtBooks.filter((book) => book.author.name === args.author)
      }
      return filtBooks.map((book) => {
        return { ...book.toObject() }
      })
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const authorsBooks = authors.map(async (author) => {
        const nbBooksByAuthor = await Book.collection.countDocuments({
          author: author._id,
        })
        return { ...author.toObject(), bookCount: nbBooksByAuthor }
      })
      return authorsBooks
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const bookExistAlready = await Book.findOne({ title: args.title })
      if (bookExistAlready) {
        console.log(bookExistAlready)
        throw new GraphQLError(`Title must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }
      const author = await Author.findOne({ name: args.author })

      const newAuthor = new Author({ name: args.author })

      if (!author) {
        try {
          console.log('Just after newAuthor')
          await newAuthor.save()
        } catch (err) {
          if (err.name === 'ValidationError') {
            throw new GraphQLError(
              'Author name has invalid value : min length is 4',
              {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  invalideArgs: Object.keys(err.errors),
                },
              },
            )
            throw new GraphQLError('Internal error', {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
              },
            })
          }
        }
      }

      const newBook = new Book({
        ...args,
        author: author ? author : newAuthor,
      })
      try {
        await newBook.save()
      } catch (err) {
        if (err.name === 'ValidationError') {
          throw new GraphQLError(
            'Title is required and has invalid value : min length is 5',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalideArgs: Object.keys(err.errors),
              },
            },
          )
        }
        throw new GraphQLError('Internal error', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        })
      }

      return newBook.populate('author')
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      const AuthorBooks = await Book.collection.countDocuments({
        author: author._id,
      })

      if (args.setBornTo) {
        author.born = args.setBornTo
        await author.save()
        console.log(AuthorBooks)
        return { ...author.toObject(), bookCount: AuthorBooks }
      }
      return { ...author.toObject(), bookCount: AuthorBooks }
    },
  },
}

module.exports = resolvers
