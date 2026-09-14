const { GraphQLError } = require('graphql')
const Person = require('./models/person')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
require('dotenv').config()

console.log('RESOLVERS FILE LOADED')
const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return await Person.find({})
      }

      return Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) =>
      Person.findOne({ name: args.nameToSearch }),
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Person: {
    address: ({ street: strt, city }) => {
      return {
        street: strt,
        city: city,
      }
    },
  },
  Mutation: {
    // createUser(username:String!):User
    createUser: async (root, args) => {
      const user = new User({ username: args.username })
      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    // login(username:String!, password:String!):Token
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError(`Wrong credentials`, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addPerson: async (root, args, context) => {
      console.log('ARGS:', args)
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      const nameExists = await Person.exists({ name: args.name })
      if (nameExists) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }
      const newPerson = new Person({ ...args })
      try {
        await newPerson.save()
        currentUser.friends = currentUser.friends.concat(newPerson)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError(`Saving person failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return newPerson
    },
    editNumber: async (root, args) => {
      // return Person.findOneAndUpdate({ name: args.name},
      //   {phone: args.phone},
      // {new:true, runValidators:true})
      const person = await Person.findOne({ name: args.name })

      if (!person) return null

      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError(`Saving number failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      const nonFriendAlready = (person) =>
        !currentUser.friends
          .map((f) => f._id.toSring())
          .includes(person._id.toString())

      const userToBeAdded = User.findOne({ name: args.name })

      if (!userToBeAdded) {
        throw new GraphQLError('The name was not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      if (nonFriendAlready(userToBeAdded)) {
        currentUser.friends = currentUser.friends.concat(userToBeAdded)
      }

      await currentUser.save()

      return currentUser
    },
  },
}
module.exports = resolvers
