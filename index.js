const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info of ${persons.length} people </p>
                  <p> ${new Date()} </p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    var person = persons.find(person => person.id === Number(id))
    if (person) {
        response.json(person)
    } else {
        response.status('404').end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const initLength = persons.length;
    persons = persons.filter(person => person.id != id)
    const postLength = persons.length;
    if (initLength > postLength) {
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(100 * Math.random())
}

app.post('/api/persons', (request, response) => {
    body = request.body
    if (!body) {
        response.status(404).json({
            error: 'contents missing'
        })
    }
    else {
        if (!(body.number && body.name)) {
            response.status(200).json({
                error: 'malformed request: missing number or name'
            })
        } else if (persons.find(person => person.name == body.name)) {
            response.status(200).json({
                error: 'malformed request: name already in database (must be unique)'
            })
        } else {
            const newPerson = {
                name: body.name,
                number: body.number,
                id: generateId()
            }
            persons = persons.concat(newPerson)
            response.json(newPerson)
        }
    }
})
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Running this jawn on ${PORT}`)
})