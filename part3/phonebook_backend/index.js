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
app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response) =>{
    Person.findById(request.params.id)
    .then(person => {
        response.json(person)
    })
    .catch( error =>{
        response.statusMessage=`Person with id ${request.params.id} does not exist, error : ${error}`
        response.status(404).end()
    }) 
        
})

app.delete('/api/persons/:id', (request, response) =>{
    // const id = request.params.id
    // persons = persons.filter(p => p.id!==id)
    // response.status(204).end()
    Person.deleteOne(new mongoose.Types.ObjectId(request.params.id)).then(count => {
        console.log("count is ", count)
        if (count.deletedCount===1){
        response.json({"delete count":count})
        } else {
        response.status(404).end()
        }
    })
})

const generateId=()=>{
    const maxId=persons.length>0?Math.max(...persons.map(p => Number(p.id))):0
    return String(maxId+1)
}
app.post('/api/persons', (request, response) =>{
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({error:'Name or number misssing'})
    }
    // const alreadyExist=persons.find(person => person.name.toLowerCase()==body.name.toLowerCase())
    // if(alreadyExist){
    //     return response.status(400).json({error:'Person already in the phonebook'})
    // }
    //console.log(body)

    const person = new Person({...body})
    person.save().then( saveNote => {
            response.json(person)
    })
})

app.get('/info', (request, response) =>{
    const now = new Date()
    const resp =`Phonebook has info for ${persons.length} people <br/><br/> ${now}`
    response.send(resp)
})
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})