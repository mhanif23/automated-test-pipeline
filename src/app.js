const express = require('express');
const path = require('path');
const { add, subtract, multiply, divide, modulo } = require('./utils/calculator');

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---

/** Health-check endpoint */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/** Calculate endpoint — accepts { a, b, operation } */
app.post('/api/calculate', (req, res) => {
  const { a, b, operation } = req.body;

  if (a === undefined || b === undefined || !operation) {
    return res.status(400).json({ error: 'Missing required fields: a, b, operation' });
  }

  const numA = Number(a);
  const numB = Number(b);

  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({ error: 'a and b must be valid numbers' });
  }

  const operations = { add, subtract, multiply, divide, modulo };
  const fn = operations[operation];

  if (!fn) {
    return res.status(400).json({
      error: `Invalid operation: "${operation}". Allowed: add, subtract, multiply, divide, modulo`,
    });
  }

  try {
    const result = fn(numA, numB);
    res.json({ result, operation, a: numA, b: numB });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** Serve the UI for any non-API route */
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
