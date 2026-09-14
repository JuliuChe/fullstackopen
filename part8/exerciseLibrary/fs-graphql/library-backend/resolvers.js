const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

require('dotenv').config()

const resolvers = {
  // Book: {
  //   author: (root) => root.author.name,
  //   id: (root) => root._id.toString(),
  // },
  Author: {
    id: (root) => root._id.toString(),
  },
  User: {
    id: (root) => root._id.toString(),
    // friends:async (root) => {
    //   return User.find({_id: {$in: root.friends}})
    // }
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
    me: async (_, __, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      console.log("In ADDbook  resolver")
      if (!currentUser) {
        console.log(currentUser)
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
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
          }
          throw new GraphQLError('Internal error', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            },
          })
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
                invalidArgs: Object.keys(err.errors),
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
      const createdBook = await newBook.populate('author')
      console.log(createdBook)
      return createdBook
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
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
    login: async (root, args) => {
      const allUsers = await User.find({})
      const user = await User.findOne({ username: args.username })
      if (!user || args.password != 'secret') {
        console.log(allUsers)
        throw new GraphQLError('Wrong credentials: Bad username or password', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    createUser: async (root, args) => {
      const userExists = await User.findOne({ username: args.username })
      if (userExists) {
        throw new GraphQLError('Username already taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
          },
        })
      }
      const user = new User({ ...args })
      try {
        await user.save()
        // await User.updateMany({_id : { $in : user.friends }}, {$push: {friends: user._id}})
      } catch (error) {
        throw new GraphQLError(`Saving the new user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      }
      //return user.populate('friends')
      return user
    },
    _resetDatabase: async (root, args) => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }

      await Author.deleteMany({})

      await Book.deleteMany({})

      await User.deleteMany({})

      return true
    },
  },
}

module.exports = resolvers
