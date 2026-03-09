# Walkthrough — Automated Testing in DevOps CI/CD Pipeline

## What Was Built

A complete Node.js project implementing automated testing across four layers, integrated into a GitHub Actions CI/CD pipeline with quality gates.

### Files Created

| File | Purpose |
|---|---|
| [package.json](file:///f:/FileNif/Automated%20Test%20Pipeline/package.json) | Project manifest — deps & semua npm scripts |
| [src/app.js](file:///f:/FileNif/Automated%20Test%20Pipeline/src/app.js) | Express app (API routes + static file serving) |
| [src/server.js](file:///f:/FileNif/Automated%20Test%20Pipeline/src/server.js) | Server entry point |
| [src/utils/calculator.js](file:///f:/FileNif/Automated%20Test%20Pipeline/src/utils/calculator.js) | Calculator utility (unit test target) |
| [src/public/index.html](file:///f:/FileNif/Automated%20Test%20Pipeline/src/public/index.html) | Calculator UI (E2E test target) |
| [tests/unit/calculator.test.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/unit/calculator.test.js) | Jest unit tests |
| [tests/api/api.test.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/api/api.test.js) | Supertest API tests |
| [tests/e2e/playwright/app.spec.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/e2e/playwright/app.spec.js) | Playwright E2E tests |
| [tests/e2e/selenium/app.test.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/e2e/selenium/app.test.js) | Selenium E2E tests |
| [playwright.config.js](file:///f:/FileNif/Automated%20Test%20Pipeline/playwright.config.js) | Playwright config (local: Chromium only, CI: multi-browser) |
| [.github/workflows/ci.yml](file:///f:/FileNif/Automated%20Test%20Pipeline/.github/workflows/ci.yml) | GitHub Actions CI/CD pipeline |
| [README.md](file:///f:/FileNif/Automated%20Test%20Pipeline/README.md) | Project documentation |

---

### CI/CD Pipeline Flow

```
push/PR to main
       │
       ▼
 Unit & API Tests (Node 18 + 20)      ← Quality Gate #1
       │
       ├──────────────┐
       ▼              ▼
 Playwright E2E   Selenium E2E        ← Quality Gate #2
 (3 browsers)    (Chrome headless)
       │              │
       └──────┬───────┘
              ▼
         Deploy 🚀
```

- **Unit & API tests** block E2E tests (dependency gate)
- **All E2E tests** must pass before deploy (quality gate)
- **Deploy** only runs on `main` branch pushes

---

### Test Coverage Summary

| Layer | Framework | Test Count | What's Covered |
|---|---|---|---|
| Unit | Jest | 15 | add, subtract, multiply, divide + error handling |
| API | Supertest | 10 | health endpoint, all operations, validation errors |
| E2E | Playwright | 8 | page load, UI elements, all operations, error display |
| E2E | Selenium | 4 | page title, heading, addition, division-by-zero |
| **Total** | | **37** | |

---

## Local Setup & Verification

> [!NOTE]
> ✅ **Semua 37 test berhasil dijalankan secara lokal** pada Node.js v25.8.0 (2026-03-09).

### Langkah Setup Pertama Kali

**Prasyarat:** Node.js 18+ ([download](https://nodejs.org/))

**1. Install dependencies**

```bash
cd "f:\FileNif\Automated Test Pipeline"
npm install
```

**2. Install Playwright browser**

```bash
npx playwright install chromium
```

> [!TIP]
> Cukup install `chromium` saja untuk local dev. Firefox & WebKit otomatis digunakan di CI.

**3. Jalankan semua test**

```bash
npm test
```

---

### Troubleshooting: PowerShell Execution Policy (Windows)

> [!WARNING]
> Jika muncul error **"running scripts is disabled on this system"** saat menjalankan `npm`, jalankan perintah berikut sekali di PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Setelah itu jalankan `npm install` kembali seperti biasa.

---

### Hasil Test Lokal (2026-03-09)

| Layer | Framework | Tests | Status |
|---|---|---|---|
| Unit | Jest | 15 passed | ✅ PASS |
| API | Supertest | 10 passed | ✅ PASS |
| E2E | Playwright (Chromium) | 8 passed | ✅ PASS |
| E2E | Selenium | 4 passed | ✅ PASS |
| **Total** | | **37 tests** | **✅ ALL PASS** |

---

## Konfigurasi Browser: Local vs CI

File [playwright.config.js](file:///f:/FileNif/Automated%20Test%20Pipeline/playwright.config.js) dikonfigurasi agar:
- **Local** → hanya Chromium (ringan, tidak perlu download Firefox & WebKit)
- **CI (GitHub Actions)** → Chromium + Firefox + WebKit (multi-browser full coverage)

Deteksi dilakukan otomatis via environment variable `CI`:

```js
projects: process.env.CI
  ? [chromium, firefox, webkit]   // CI: 3 browser
  : [chromium],                   // Local: Chromium saja
```

---

## Preview Mode — Melihat Browser Saat Test Berjalan

Semua script tersedia di `package.json`. Gunakan sesuai kebutuhan:

### Playwright

| Perintah | Deskripsi |
|---|---|
| `npm run test:e2e:playwright` | Headless (cepat, tanpa tampilan) |
| `npm run test:e2e:playwright:headed` | Browser terbuka, test berjalan 1 per 1 secara visible |
| `npm run test:e2e:playwright:ui` | **UI Mode interaktif** (direkomendasikan untuk debugging) |

#### 🌟 Playwright UI Mode (Terbaik untuk Debugging)

```bash
npm run test:e2e:playwright:ui
```

Fitur UI Mode:
- Pilih test mana yang ingin dijalankan
- Lihat setiap step aksi secara detail
- Screenshot otomatis saat test gagal
- Timeline lengkap interaksi di browser
- Re-run test individual dengan satu klik

#### Playwright Headed Mode

```bash
npm run test:e2e:playwright:headed
```

Browser Chrome terbuka secara visible, test berjalan satu per satu (`--workers=1`) agar mudah diamati.

---

### Selenium

| Perintah | Deskripsi |
|---|---|
| `npm run test:e2e:selenium` | Headless (default, untuk CI) |
| `npm run test:e2e:selenium:headed` | Browser Chrome terbuka, klik form terlihat langsung |

#### Selenium Headed Mode

```bash
npm run test:e2e:selenium:headed
```

Diimplementasikan via environment variable `SELENIUM_HEADED=true`. Kode di [app.test.js](file:///f:/FileNif/Automated%20Test%20Pipeline/tests/e2e/selenium/app.test.js) mendeteksi ini secara otomatis:

```js
const isHeaded = process.env.SELENIUM_HEADED === 'true';

if (isHeaded) {
  options.addArguments('--start-maximized', '--no-sandbox', '--disable-gpu');
} else {
  options.addArguments('--headless=new', '--no-sandbox', ...);
}
```

---

### Jalankan Keduanya Sekaligus (Preview Mode)

```bash
npm run test:preview
```

Menjalankan Playwright headed → lalu Selenium headed secara berurutan.

---

## Semua npm Scripts

| Script | Perintah | Kegunaan |
|---|---|---|
| `npm start` | `node src/server.js` | Jalankan app di port 3000 |
| `npm test` | (semua test, headless) | Full test suite untuk CI |
| `npm run test:unit` | Jest unit | Test unit saja |
| `npm run test:api` | Jest API | Test API saja |
| `npm run test:e2e:playwright` | Playwright headless | E2E Playwright (CI mode) |
| `npm run test:e2e:playwright:headed` | Playwright headed | Lihat browser bergerak |
| `npm run test:e2e:playwright:ui` | Playwright UI Mode | Debug interaktif ⭐ |
| `npm run test:e2e:selenium` | Selenium headless | E2E Selenium (CI mode) |
| `npm run test:e2e:selenium:headed` | Selenium headed | Lihat browser bergerak |
| `npm run test:preview` | Playwright + Selenium headed | Preview keduanya |

---

## Verifikasi via CI

Push project ke GitHub repository — GitHub Actions workflow akan otomatis berjalan:

```bash
git init
git add .
git commit -m "feat: automated testing pipeline"
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

Pipeline CI tersedia di [.github/workflows/ci.yml](file:///f:/FileNif/Automated%20Test%20Pipeline/.github/workflows/ci.yml).
