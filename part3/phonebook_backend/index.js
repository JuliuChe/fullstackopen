require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')

const morgan = require('morgan')
const Person = require('./models/person')
const app = express()


// let persons =[
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
    //   "name": "Mary Poppendieck", 
    //   "number": "39-23-6423122"
//     }
// ]
//Midllewares
morgan.token('body', function getBody (req, resp) {
    const response=req.body?JSON.stringify(req.body):" "
    
    return response
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json()) // for parsing application/json
app.use(express.static('dist'))

//Routes
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(person => {
            response.json(person)
        })
        .catch(err => next(err))
})

app.get('/api/persons/:id', (request, response,next) =>{
    Person.findById(request.params.id)
    .then(person => {
        response.json(person)
    })
    .catch( error => next(error)
        // response.statusMessage=`Person with id ${request.params.id} does not exist, error : ${error}`
        // response.status(404).end()
    ) 
        
})

app.delete('/api/persons/:id', (request, response, next) =>{
    // const id = request.params.id
    // persons = persons.filter(p => p.id!==id)
    // response.status(204).end()

    //with deleteOne
    // Person.deleteOne(new mongoose.Types.ObjectId(request.params.id)).then(count => {
    //     console.log("count is ", count)
    //     if (count.deletedCount===1){
    //     response.json({"delete count":count})
    //     } else {
    //     response.status(404).end()
    //     }
    // })
    Person.findByIdAndDelete(request.params.id)
        .then(result =>{
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateId=()=>{
    const maxId=persons.length>0?Math.max(...persons.map(p => Number(p.id))):0
    return String(maxId+1)
}
app.post('/api/persons', (request, response, next) =>{
    const body = request.body

    if(!body.name || !body.number){
        const error = new Error('Name or number missing')
        error.status = 400
        return next(error)
    }
    // const alreadyExist=persons.find(person => person.name.toLowerCase()==body.name.toLowerCase())
    // if(alreadyExist){
    //     return response.status(400).json({error:'Person already in the phonebook'})
    // }
    //console.log(body)

    const person = new Person({...body})
    person.save()
        .then( saveNote => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number}=request.body
    Person.findById(request.params.id)
        .then((person) =>{
            if(!person){
                return response.status(404).end()
            }
            person.name=name
            person.number=number

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(err => next(err))
})

app.get('/info', (request, response, next) =>{
    const now = new Date()
    Person.countDocuments({})
        .then(count => {
            const resp =`Phonebook has info for ${count} people <br/><br/> ${now}`
            response.send(resp)
        })
        .catch(err => next(err))
    // const resp =`Phonebook has info for ${persons.length} people <br/><br/> ${now}`
    // response.send(resp)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === "CastError"){
    return response.status(400).send({error:'malformatted id'})
  }
}
app.use(errorHandler)


//Start server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})