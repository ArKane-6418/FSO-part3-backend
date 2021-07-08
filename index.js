require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))


app.get('/api/persons', (request, response) => {
  Entry.find({}).then(phonebook => {
    response.json(phonebook)
  })
})

app.get('/api/info', (request, response) => {
  Entry.find({}).then(entries => {
    response.send(`Phonebook has info for ${entries.length} people <br /> ${Date()}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Entry.findById(request.params.id).then(entry => {
    response.json(entry)
  })
})

// POST request

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Check for a non-empty unique name and non-empty number
  if (!body.name) {
    return response.status(400).json({ error: 'Name was not provided' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'Number was not provided' })
  }

  const entry = new Entry({
    'name': body.name,
    'number': body.number
  })

  entry.save()
    .then(savedEntry => {
      response.json(savedEntry)
    })
    .catch(error => next(error))
})

// PUT request

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const entry = {
    name: body.name,
    number: body.number
  }

  Entry.findByIdAndUpdate(request.params.id, entry, { new: true })
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})

// DELETE request

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
  // const id = Number(request.params.id)
  // phonebook = phonebook.filter(e => e.id !== id)
  // response.status(204).end()
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})

