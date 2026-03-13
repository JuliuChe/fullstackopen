const mongoose = require('mongoose')



if(process.argv.length < 3) {
  console.log('missing arguments')
  process.exit(1)
}


const password = process.argv[2]
const url = `mongodb+srv://fullstack_part3:${password}@cluster0.txpq0hp.mongodb.net/phonebookApp?appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if(process.argv.length === 3){
  showAllEntries()
} else if(process.argv.length >= 5){
  const name = process.argv[3]
  const number = process.argv[4]
  addEntry(name, number)
} else {
  console.log('Not enough arguments')
  process.exit(1)
}

function addEntry(name, number){
  const entry = new Entry({
    name: name,
    number: number,
  })
  entry.save().then( () => {
    const outStr=`added ${entry.name} number ${entry.number} to phonebook`
    console.log(outStr)
    mongoose.connection.close()
  })
}

function showAllEntries(){
  console.log('phonebook:')
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry.name, entry.number)
    })
    mongoose.connection.close()
  })
}



