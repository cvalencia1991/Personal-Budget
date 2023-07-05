const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");

// middleware
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
app.use(express.json());
app.use(morgan("dev"));

let envelopes = [
  {
    id: 1,
    name: "Food",
    budget: 100,
  },
  {
    id: 2,
    name: "Rent",
    budget: 500,
  },
  {
    id: 3,
    name: "Entertainment",
    budget: 50,
  },
];

app.all("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/envelopes/:id", (req, res) => {
  const id = req.params.id;
  const envelope = envelopes.find((envelope) => envelope.id === Number(id));
  if (!envelope) {
    return res.status(404).send("Envelope not found");
  }
  res.json(envelope);
});

app.post("/envelopes", (req, res) => {
  const name = req.body.name;
  const budget = req.body.budget;
  const id = envelopes.length + 1;
  if (!name || !budget) {
    return res.status(400).send("Missing name or budget");
  } else {
    const newEnvelope = {
      id,
      name,
      budget,
    };
    envelopes.push(newEnvelope);
    res.status(201).send("Envelope created");
  }
});

app.put("/envelopes/:id", (req, res) => {
  const id = req.params.id;
  const newdata = req.body;
  const envelope = envelopes.find((envelope) => envelope.id === Number(id));
  if (!envelope) {
    return res.status(404).send("Envelope not found");
  } else {
    envelopes = envelopes.map((e) =>
      e.id === Number(id) ? { ...e, ...newdata } : e
    );
    console.log(envelopes)
    res.status(200).send("Envelope updated");
  }
});

app.delete("/envelopes/:id", (req, res) => {
  const id = req.params.id;
  const envelope = envelopes.find((envelope) => envelope.id === Number(id));
  if (!envelope) {
    return res.status(404).send("Envelope not found");
  } else {
    envelopes = envelopes.filter((e) => e.id !== Number(id));
    res.status(200).send("Envelope deleted");
  }
});

app.get("/envelopes/transfer/:from/:to", (req, res) => {
  const from = req.params.from;
  const to = req.params.to;
  const amount = req.body.amount;
  const fromEnvelope = envelopes.find((envelope) => envelope.id === Number(from));
  const toEnvelope = envelopes.find((envelope) => envelope.id === Number(to));
  if (!fromEnvelope || !toEnvelope) {
    return res.status(404).send("Envelope not found");
  } else {
    if (fromEnvelope.budget < amount) {
      return res.status(400).send("Insufficient funds");
    } else {
      envelopes = envelopes.map((e) =>
        e.id === Number(from) ? { ...e, budget: e.budget - amount } : e
      );
      envelopes = envelopes.map((e) =>
        e.id === Number(to) ? { ...e, budget: e.budget + amount } : e
      );
      res.status(200).send("Transfer successful");
    }
  }
});