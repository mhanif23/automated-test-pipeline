/**
 * API Tests — Express endpoints
 */
const request = require('supertest');
const app = require('../../src/app');

describe('GET /', () => {
  test('returns 200 and HTML content', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});

describe('GET /api/health', () => {
  test('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('POST /api/calculate', () => {
  test('adds two numbers', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 5, b: 3, operation: 'add' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(8);
  });

  test('subtracts two numbers', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 10, b: 4, operation: 'subtract' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(6);
  });

  test('multiplies two numbers', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 6, b: 7, operation: 'multiply' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(42);
  });

  test('divides two numbers', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 20, b: 4, operation: 'divide' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('calculates modulo correctly', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 10, b: 3, operation: 'modulo' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(1); // Will fail: expects 1, gets 2
  });

  test('returns 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 for invalid operation', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 1, b: 2, operation: 'invalid_op' }); // Changed from 'modulo' to 'invalid_op'
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid operation/);
  });

  test('returns 400 for division by zero', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 5, b: 0, operation: 'divide' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Division by zero/);
  });

  test('returns 400 for non-numeric input', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ a: 'abc', b: 2, operation: 'add' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/valid numbers/);
  });
});
