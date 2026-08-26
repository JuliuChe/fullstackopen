const { GraphQLError } = require('graphql')
const Person = require('./models/person')



const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: () => {
      if (!args.phone) {
        return Person.find({})
      }

      return Person.find({phone:{$exists:args.phone === 'YES'}})
    },
    findPerson: async (root, args) => Person.findOne({name:args.nameToSearch}),
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
    addPerson: async (root, args) => {
      const nameExists = await  Person.exists({name:args.name})
      if (nameExists) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }
      const newPerson = new Person({...args})
      try {
        await newPerson.save()
      } catch (error) {
         throw new GraphQLError(`Saving person failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          },
        })
      }

      return newPerson
    },
    editNumber: async (root, args) => {
      // return Person.findOneAndUpdate({ name: args.name}, 
      //   {phone: args.phone},
      // {new:true, runValidators:true})
      const person = Person.findOne({name: args.name})

      if(!person) return null

      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
         throw new GraphQLError(`Saving number failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          },
        })
      }
    },
  },
}