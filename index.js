const express = require("express")
const morgan = require("morgan")

const app = express()

app.use(express.json())

morgan.token('body', (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
});

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/api/persons", (request, response) => {
  response.json(phonebook)
})

app.get("/info", (request, response) => {
  response.send(`Phonebook has info for ${phonebook.length} people ${new Date()}`)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const entry = phonebook.find(e => e.id === id)
  if (entry) {
    response.json(entry)
  }
  else {
    response.status(404).end()
  }
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

// POST request

app.post("/api/persons", (request, response) => {
  const body = request.body

  // Check for a non-empty unique name and non-empty number
  if (!body.name) {
    return response.status(400).json({ error: 'Name was not provided'})
  }
  else if (!body.number) {
    return response.status(400).json({ error: 'Number was not provided'})
  }
  else if (phonebook.filter(n => n.name === body.name).length > 0) {
    return response.status(400).json({ error: 'Name already exists in the phonebook'})
  }

  const entry = {
    "id": generateId(),
    "name": body.name,
    "number": body.number
  }

  phonebook = phonebook.concat(entry)

  response.json(phonebook)
})

// DELETE request

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(e => e.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})

