/**
 * Selenium E2E Tests — Calculator UI (Chrome headless)
 *
 * Uses Jest as the test runner; selenium-webdriver for browser automation.
 */
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const app = require('../../../src/app');

let server;
let driver;
const PORT = 3001; // separate port to avoid clashing with Playwright

beforeAll(async () => {
  // Start Express server
  server = app.listen(PORT);

  // Build Chrome driver — headed jika SELENIUM_HEADED=true
  const options = new chrome.Options();
  const isHeaded = process.env.SELENIUM_HEADED === 'true';

  if (isHeaded) {
    // Mode visible: buka browser agar bisa diamati
    options.addArguments('--start-maximized', '--no-sandbox', '--disable-gpu');
  } else {
    // Mode headless (default untuk CI)
    options.addArguments('--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage');
  }

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
});

afterAll(async () => {
  if (driver) await driver.quit();
  if (server) server.close();
});

const BASE_URL = `http://localhost:${PORT}`;

describe('Selenium — Calculator App', () => {
  test('page loads with correct title', async () => {
    await driver.get(BASE_URL);
    const title = await driver.getTitle();
    expect(title).toBe('Calculator — Automated Test Pipeline');
  });

  test('heading is visible', async () => {
    await driver.get(BASE_URL);
    const heading = await driver.findElement(By.id('app-title'));
    const text = await heading.getText();
    expect(text).toBe('Calculator');
  });

  test('calculates addition correctly', async () => {
    await driver.get(BASE_URL);

    const inputA = await driver.findElement(By.id('num-a'));
    const inputB = await driver.findElement(By.id('num-b'));
    const operationSelect = await driver.findElement(By.id('operation'));
    const submitBtn = await driver.findElement(By.id('calculate-btn'));

    await inputA.clear();
    await inputA.sendKeys('25');
    await inputB.clear();
    await inputB.sendKeys('17');

    // Select "add"
    await operationSelect.sendKeys('Add (+)');

    await submitBtn.click();

    // Wait for result
    const resultEl = await driver.findElement(By.id('result'));
    await driver.wait(until.elementTextContains(resultEl, 'Result'), 5000);

    const resultText = await resultEl.getText();
    expect(resultText).toBe('Result: 42');
  });

  test('shows error for division by zero', async () => {
    await driver.get(BASE_URL);

    const inputA = await driver.findElement(By.id('num-a'));
    const inputB = await driver.findElement(By.id('num-b'));
    const operationSelect = await driver.findElement(By.id('operation'));
    const submitBtn = await driver.findElement(By.id('calculate-btn'));

    await inputA.clear();
    await inputA.sendKeys('10');
    await inputB.clear();
    await inputB.sendKeys('0');

    await operationSelect.sendKeys('Divide');

    await submitBtn.click();

    const resultEl = await driver.findElement(By.id('result'));
    await driver.wait(until.elementTextContains(resultEl, 'Division by zero'), 5000);

    const resultText = await resultEl.getText();
    expect(resultText).toContain('Division by zero');
  });
});
  test('calculates modulo correctly', async () => {
    await driver.get(BASE_URL);

    const inputA = await driver.findElement(By.id('num-a'));
    const inputB = await driver.findElement(By.id('num-b'));
    const operationSelect = await driver.findElement(By.id('operation'));
    const submitBtn = await driver.findElement(By.id('calculate-btn'));

    await inputA.clear();
    await inputA.sendKeys('10');
    await inputB.clear();
    await inputB.sendKeys('3');

    // Select "modulo"
    await operationSelect.sendKeys('Modulo (%)');

    await submitBtn.click();

    // Wait for result
    const resultEl = await driver.findElement(By.id('result'));
    await driver.wait(until.elementTextContains(resultEl, 'Result'), 5000);

    const resultText = await resultEl.getText();
    expect(resultText).toBe('Result: 1'); // Will fail: expects 1, gets 2
  });

  test('shows error for modulo by zero', async () => {
    await driver.get(BASE_URL);

    const inputA = await driver.findElement(By.id('num-a'));
    const inputB = await driver.findElement(By.id('num-b'));
    const operationSelect = await driver.findElement(By.id('operation'));
    const submitBtn = await driver.findElement(By.id('calculate-btn'));

    await inputA.clear();
    await inputA.sendKeys('10');
    await inputB.clear();
    await inputB.sendKeys('0');

    await operationSelect.sendKeys('Modulo');

    await submitBtn.click();

    const resultEl = await driver.findElement(By.id('result'));
    await driver.wait(until.elementTextContains(resultEl, 'Modulo by zero'), 5000);

    const resultText = await resultEl.getText();
    expect(resultText).toContain('Modulo by zero');
  });