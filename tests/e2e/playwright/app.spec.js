/**
 * Playwright E2E Tests — Calculator UI
 */
const { test, expect } = require('@playwright/test');

test.describe('Calculator App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Calculator — Automated Test Pipeline');
  });

  test('displays the heading', async ({ page }) => {
    const heading = page.locator('#app-title');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Calculator');
  });

  test('all form elements are visible', async ({ page }) => {
    await expect(page.locator('#num-a')).toBeVisible();
    await expect(page.locator('#num-b')).toBeVisible();
    await expect(page.locator('#operation')).toBeVisible();
    await expect(page.locator('#calculate-btn')).toBeVisible();
  });

  test('performs addition and shows result', async ({ page }) => {
    await page.fill('#num-a', '12');
    await page.fill('#num-b', '8');
    await page.selectOption('#operation', 'add');
    await page.click('#calculate-btn');

    const result = page.locator('#result');
    await expect(result).toHaveText('Result: 20');
  });

  test('performs subtraction', async ({ page }) => {
    await page.fill('#num-a', '15');
    await page.fill('#num-b', '6');
    await page.selectOption('#operation', 'subtract');
    await page.click('#calculate-btn');

    await expect(page.locator('#result')).toHaveText('Result: 9');
  });

  test('performs multiplication', async ({ page }) => {
    await page.fill('#num-a', '7');
    await page.fill('#num-b', '6');
    await page.selectOption('#operation', 'multiply');
    await page.click('#calculate-btn');

    await expect(page.locator('#result')).toHaveText('Result: 42');
  });

  test('performs division', async ({ page }) => {
    await page.fill('#num-a', '100');
    await page.fill('#num-b', '4');
    await page.selectOption('#operation', 'divide');
    await page.click('#calculate-btn');

    await expect(page.locator('#result')).toHaveText('Result: 25');
  });

  test('shows error on division by zero', async ({ page }) => {
    await page.fill('#num-a', '10');
    await page.fill('#num-b', '0');
    await page.selectOption('#operation', 'divide');
    await page.click('#calculate-btn');

    const result = page.locator('#result');
    await expect(result).toHaveText('Division by zero is not allowed');
    await expect(result).toHaveClass(/error/);
  });
});
  test('performs modulo operation', async ({ page }) => {
    await page.goto('/'); // Add navigation
    await page.fill('#num-a', '10');
    await page.fill('#num-b', '3');
    await page.selectOption('#operation', 'modulo');
    await page.click('#calculate-btn');

    await expect(page.locator('#result')).toHaveText('Result: 1'); // Will fail: expects 1, gets 2
  });

  test('shows error on modulo by zero', async ({ page }) => {
    await page.goto('/'); // Add navigation
    await page.fill('#num-a', '10');
    await page.fill('#num-b', '0');
    await page.selectOption('#operation', 'modulo');
    await page.click('#calculate-btn');

    const result = page.locator('#result');
    await expect(result).toHaveText('Modulo by zero is not allowed');
    await expect(result).toHaveClass(/error/);
  });