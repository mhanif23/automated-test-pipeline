# Automated Testing in DevOps CI/CD Pipeline — Implementation Plan

## Overview

Build a complete automated testing pipeline from scratch inside an empty workspace. The deliverable is a Node.js project containing:
- A **sample Express.js web application** (with API endpoints and a simple UI) as the system under test
- **Unit tests** (Jest), **API tests** (Supertest), and **UI/E2E tests** (Playwright + Selenium)
- A **GitHub Actions CI/CD workflow** with quality gates that runs all tests automatically on every push/PR

---

## Proposed Changes

### 1. Project Scaffolding

#### [NEW] [package.json](file:///f:/FileNif/Automated%20Test%20Pipeline/package.json)
Node.js project manifest. Dependencies:
- `express` — web framework
- `jest` / `supertest` — unit + API testing
- `@playwright/test` — Playwright E2E
- `selenium-webdriver` — Selenium E2E
- npm scripts: `start`, `test`, `test:unit`, `test:api`, `test:e2e:playwright`, `test:e2e:selenium`

#### [NEW] [src/app.js](file:///f:/FileNif/Automated%20Test%20Pipeline/src/app.js)
Express app module (no listen — exported for Supertest).

#### [NEW] [src/server.js](file:///f:/FileNif/Automated%20Test%20Pipeline/src/server.js)
Entry point that starts the Express server on a configurable port.

#### [NEW] [src/utils/calculator.js](file:///f:/FileNif/Automated%20Test%20Pipeline/src/utils/calculator.js)
Simple utility module (add, subtract, multiply, divide) — target for unit tests.

#### [NEW] [src/public/index.html](file:///f:/FileNif/Automated%20Test%20Pipeline/src/public/index.html)
Minimal HTML page with a form and result display — target for UI/E2E tests.

---

### 2. Unit Tests (Jest)

#### [NEW] [tests/unit/calculator.test.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/unit/calculator.test.js)
Tests for `calculator.js`: covers add, subtract, multiply, divide, and division-by-zero error handling.

---

### 3. API Tests (Supertest)

#### [NEW] [tests/api/api.test.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/api/api.test.js)
Tests for Express API endpoints:
- `GET /` — returns 200
- `GET /api/health` — health-check returns JSON `{ status: "ok" }`
- `POST /api/calculate` — validates request body and returns correct results

---

### 4. UI / E2E Tests — Playwright

#### [NEW] [playwright.config.js](file:///f:/FileNif/Automated%20Test%20Pipeline/playwright.config.js)
Playwright configuration (base URL, projects for Chromium/Firefox/WebKit, web server auto-start).

#### [NEW] [tests/e2e/playwright/app.spec.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/e2e/playwright/app.spec.js)
E2E tests:
- Page loads with correct title
- Calculator form submits and displays result
- Navigation and UI element visibility

---

### 5. UI / E2E Tests — Selenium

#### [NEW] [tests/e2e/selenium/app.test.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/e2e/selenium/app.test.js)
Cross-browser Selenium tests:
- Open the app in Chrome (headless)
- Verify page title
- Interact with calculator form and assert result

---

### 6. CI/CD Pipeline (GitHub Actions)

#### [NEW] [.github/workflows/ci.yml](file:///f:/FileNif/Automated%20Test%20Pipeline/.github/workflows/ci.yml)
Pipeline stages:

| Stage | Description |
|---|---|
| **Checkout** | `actions/checkout@v4` |
| **Setup Node** | `actions/setup-node@v4` with Node 20 |
| **Install** | `npm ci` |
| **Unit Tests** | `npm run test:unit` — **quality gate** (blocks next stages) |
| **API Tests** | `npm run test:api` |
| **Playwright E2E** | Install browsers → `npm run test:e2e:playwright` |
| **Selenium E2E** | `npm run test:e2e:selenium` (Chrome headless) |
| **Artifacts** | Upload test reports on failure |
| **Deploy** | Placeholder deploy step (runs only if all tests pass) |

Triggers: `push` and `pull_request` to `main`.

---

### 7. Documentation

#### [NEW] [README.md](file:///f:/FileNif/Automated%20Test%20Pipeline/README.md)
Project overview, setup instructions, how to run each test suite, pipeline diagram.

---

## User Review Required

> [!IMPORTANT]
> 1. **CI/CD Platform**: This plan uses **GitHub Actions**. If you prefer Azure DevOps or GitLab CI, let me know and I'll adjust.
> 2. **Application language**: The sample app uses **Node.js / Express**. Confirm this is acceptable, or specify a different stack.
> 3. **Selenium browser**: Selenium tests are configured for **Chrome (headless)**. Specify if you need Firefox/Edge too.

---

## Verification Plan

### Automated Tests (run locally)

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm run test:unit

# 3. Run API tests
npm run test:api

# 4. Install Playwright browsers
npx playwright install --with-deps chromium

# 5. Run Playwright E2E tests
npm run test:e2e:playwright

# 6. Run Selenium E2E tests (requires Chrome installed)
npm run test:e2e:selenium

# 7. Run ALL tests in one shot
npm test
```

Each command must exit with code 0 (all tests passing).

### Manual Verification
- Push the project to a GitHub repository and verify the Actions workflow runs and passes.
- This step is left to the user since it requires a remote GitHub repo.
