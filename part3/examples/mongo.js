const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack_part3:${password}@cluster0.txpq0hp.mongodb.net/noteApp?appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Mongoose is a silly goose that makes things easy',
  important: false,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

Note.find({important:true}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})