

const express = require('express')
const cors=require('cors')

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    },
    {
        id: "4",
        content: "PUT, PATCH and DELETE are secondary methods of HTTP protocol",
        important: true
    }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(requestLogger)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    console.log(request.baseUrl)
    const id = request.params.id
    const note=notes.find(note => note.id === id)
    if (note){
        response.json(note)
    } else {
        response.statusMessage = `Note with id ${id} does not exist`
        response.status(404).end()
    }
    
})

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id))) 
    : 0
    return String(maxId+1)
}

app.post('/api/notes', (request, response) => {
    // if(request.body.id && !notes.find(note => note.id==request.body.id )){
    //     const newNote = request.body
    //     notes.push(newNote)
    //     response.json(newNote)
    // } else {
    //     const newId = String(Number(notes[notes.length-1].id)+1)
    //     console.log(newId)
    //     const newNote={...request.body, id:newId}
    //     notes.push(newNote)
    //     response.json(newNote)

    const body = request.body
    if(!body.content){
        return response.status(400).json({error:'content misssing'})
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
    })

app.delete('/api/notes/:id', (request, response) =>{
    const id = request.params.id
    notes = notes.filter(note => note.id!==id)
    response.status(204).end()
})

app.put('/api/notes/:id', (request, response) =>{
    const id=request.params.id
    const updatedNote = request.body
    notes=notes.map(note => note.id==id?updatedNote:note)
    response.json(updatedNote)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})