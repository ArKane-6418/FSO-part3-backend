const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://ArKane:${password}@cluster0.ry4bo.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Entry = mongoose.model('Entry', phonebookSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  })
}

else if (process.argv.length === 5) {
  const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4]
  })

  entry.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to the phonebook`)
    mongoose.connection.close()
  })

}

