
require('dotenv').config()
const express = require('express')
// const cors=require('cors')

const Note = require('./models/note')

// let notes = [
//     {
//         id: "1",
//         content: "HTML is easy",
//         important: true
//     },
//     {
//         id: "2",
//         content: "Browser can execute only JavaScript",
//         important: false
//     },
//     {
//         id: "3",
//         content: "GET and POST are the most important methods of HTTP protocol",
//         important: true
//     },
//     {
//         id: "4",
//         content: "PUT, PATCH and DELETE are secondary methods of HTTP protocol",
//         important: true
//     }
// ]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}



const app = express()
app.use(express.static('dist'))
// app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  console.log(request.baseUrl)
  // const id = request.params.id
  // const note=notes.find(note => note.id === id)
  // if (note){
  //     response.json(note)
  // } else {
  //     response.statusMessage = `Note with id ${id} does not exist`
  //     response.status(404).end()
  // }
  Note.findById(request.params.id)
    .then(note => {
      if(note){
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
      // console.log(error)
      // response.status(400).send({error:"malformatted id"})
    })
})

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => Number(n.id)))
//     : 0
//   return String(maxId+1)
// }

app.post('/api/notes', (request, response, next) => {
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
  // if(!body.content){
  //     return response.status(400).json({error:'content misssing'})
  // }

  // const note = {
  //     content: body.content,
  //     important: body.important || false,
  //     id: generateId(),
  // }
  // notes = notes.concat(note)
  // response.json(note)
  const note = new Note ({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(saveNote => {
      response.json(saveNote)
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  // const id = request.params.id
  // notes = notes.filter(note => note.id!==id)
  // response.status(204).end()

  //USING deleteOne()
  // Note.deleteOne({_id:request.params.id}).then(count => {
  //   console.log("count is ", count)
  //   if (count.deletedCount===1){
  //     response.json({"delete count":count})
  //   } else {
  //     response.status(404).end()
  //   }
  // })

  //USING findByIdAndDelete
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  // const id=request.params.id
  // const updatedNote = request.body
  // console.log(updatedNote)
  // notes=notes.map(note => note.id==id?updatedNote:note)
  // response.json(updatedNote)

  //USING findOneAndUpdate() - (async (request,response) must be used instead)
  // const _id = new mongoose.Types.ObjectId(request.params.id);
  // const filter = {content:request.body.content, important:request.body.important}
  // const update = {important:request.body.important}
  // const doc = await Note.findOneAndUpdate(_id, update,{returnDocument:'after'})
  // console.log(doc)
  // response.json(doc)

  const { content, important }=request.body
  Note.findById(request.params.id)
    .then(note => {
      if(!note){
        return response.status(404).end()
      }

      note.content = content
      note.important=important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).send({ error:'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({ error:error.message })
  }
  next(error)
}
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})