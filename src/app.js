const express = require('express')
const app = express()
const port = 3000


// middleware
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
app.use(express.json())

let envelopes = [
  {
    id: 1,
    name: 'Food',
    budget: 100
  },
  {
    id: 2,
    name: 'Rent',
    budget: 500
  },
  {
    id: 3,
    name: 'Entertainment',
    budget: 50
  }
]

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.post('/envelopes', (req, res) => {
  const name = req.body.name
  const budget = req.body.budget
  const id = envelopes.length + 1
  if(!name || !budget) {
    return res.status(400).send('Missing name or budget')
  }else{
  const newEnvelope = {
    id,
    name,
    budget
  }
  envelopes.push(newEnvelope)
  res.status(201).send("Envelope created")
  }

})