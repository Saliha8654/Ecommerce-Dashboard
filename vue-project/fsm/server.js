// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { interpret } = require('xstate');
const ecommerceMachine = require('./stateMachine');
const db = require('./db');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const fsmService = interpret(ecommerceMachine).start();

const DB_JSON_PATH = path.join(__dirname, '../db.json');
const readJsonData = () => JSON.parse(fs.readFileSync(DB_JSON_PATH));
const writeJsonData = (data) => fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));

// FSM transition endpoint
app.post('/fsm/machine', (req, res) => {
  const { key, transition, data } = req.body;

  try {
    if (!transition) {
      return res.status(400).json({ error: 'Missing transition event' });
    }

    console.log(`FSM Transition Request: ${transition}`, data);

    const query = 'INSERT INTO fsm_logs (transition_event, state) VALUES (?, ?)';
    db.query(query, [transition, fsmService.state.value], (err) => {
      if (err) console.error('MySQL Error during log insert:', err);
    });

    fsmService.send(transition);

    return res.json({
      state: fsmService.state.value,
      context: fsmService.state.context
    });
  } catch (error) {
    console.error('FSM Error:', error);
    return res.status(500).json({ error: 'FSM transition failed' });
  }
});

// FSM state getter
app.get('/fsm/state', (req, res) => {
  try {
    return res.json({
      state: fsmService.state.value,
      context: fsmService.state.context
    });
  } catch (error) {
    console.error('Error fetching FSM state:', error);
    return res.status(500).json({ error: 'Failed to fetch FSM state' });
  }
});

// Get all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(results);
  });
});

// Get all products
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// Add product – saves to MySQL + db.json
app.post('/products', (req, res) => {
  const { name, category, price, image, description } = req.body;

  const sql = 'INSERT INTO products (name, category, price, image, description) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, category, price, image, description], (err, result) => {
    if (err) {
      console.error('Error adding product to MySQL:', err);
      return res.status(500).json({ error: 'Failed to add product to MySQL' });
    }

    try {
      const dbData = readJsonData();
      const newProduct = {
        id: String(result.insertId),
        name,
        category,
        price,
        image,
        description
      };
      dbData.products.push(newProduct);
      writeJsonData(dbData);

      res.json({ message: 'Product added to MySQL & JSON', productId: result.insertId });
    } catch (jsonErr) {
      console.error('Error updating db.json:', jsonErr);
      res.status(500).json({ error: 'MySQL success, but failed to update db.json' });
    }
  });
});

app.listen(port, () => {
  console.log(`FSM Server with MySQL is running at http://localhost:${port}`);
});
