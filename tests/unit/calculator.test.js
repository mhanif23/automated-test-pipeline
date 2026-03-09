/**
 * Unit Tests — Calculator utility
 */
const { add, subtract, multiply, divide } = require('../../src/utils/calculator');

describe('Calculator — add()', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(add(-1, -4)).toBe(-5);
  });

  test('adds zero', () => {
    expect(add(7, 0)).toBe(7);
  });

  test('throws on non-number input', () => {
    expect(() => add('a', 1)).toThrow(TypeError);
  });
});

describe('Calculator — subtract()', () => {
  test('subtracts two numbers', () => {
    expect(subtract(10, 4)).toBe(6);
  });

  test('returns negative when result is negative', () => {
    expect(subtract(3, 8)).toBe(-5);
  });

  test('throws on non-number input', () => {
    expect(() => subtract(null, 1)).toThrow(TypeError);
  });
});

describe('Calculator — multiply()', () => {
  test('multiplies two positive numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });

  test('multiplies by zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });

  test('multiplies negative numbers', () => {
    expect(multiply(-2, -3)).toBe(6);
  });

  test('throws on non-number input', () => {
    expect(() => multiply(undefined, 2)).toThrow(TypeError);
  });
});

describe('Calculator — divide()', () => {
  test('divides two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('returns decimal result', () => {
    expect(divide(7, 2)).toBe(3.5);
  });

  test('throws on division by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero');
  });

  test('throws on non-number input', () => {
    expect(() => divide('x', 2)).toThrow(TypeError);
  });
});
