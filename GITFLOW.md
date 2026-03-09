# Git Flow - Automated Test Pipeline

## Branch Structure

```
main        ← Production-ready code (stable)
develop     ← Integration branch (next release)
feature/*   ← New features
bugfix/*    ← Bug fixes in develop
release/*   ← Release preparation
hotfix/*    ← Critical fixes langsung dari main
```

---

## Branch Naming Convention

| Prefix       | Tujuan                          | Contoh                         |
|--------------|---------------------------------|--------------------------------|
| `feature/`   | Fitur baru                      | `feature/add-login-test`       |
| `bugfix/`    | Bug fix di develop              | `bugfix/fix-api-timeout`       |
| `release/`   | Persiapan release               | `release/v1.0.0`               |
| `hotfix/`    | Fix kritis di production        | `hotfix/fix-critical-crash`    |
| `support/`   | Support versi lama              | `support/v0.x`                 |

---

## Workflow Commands

> ⚠️ Gunakan path Git lengkap jika `git` tidak dikenali di PATH:
> `$git = "C:\Program Files\Git\bin\git.exe"`

### 🚀 Mulai Feature Baru

```bash
# 1. Pastikan develop up-to-date
git checkout develop
git pull origin develop   # (jika ada remote)

# 2. Buat branch feature dari develop
git checkout -b feature/nama-fitur develop

# 3. Kerjakan perubahan, lalu commit
git add .
git commit -m "feat: deskripsi fitur"

# 4. Selesai → merge ke develop
git checkout develop
git merge --no-ff feature/nama-fitur -m "Merge feature/nama-fitur into develop"
git branch -d feature/nama-fitur
```

---

### 🐛 Fix Bug di Develop

```bash
git checkout -b bugfix/nama-bug develop

# ... fix & commit ...

git checkout develop
git merge --no-ff bugfix/nama-bug -m "Merge bugfix/nama-bug into develop"
git branch -d bugfix/nama-bug
```

---

### 📦 Membuat Release

```bash
# 1. Buat branch release dari develop
git checkout -b release/v1.0.0 develop

# 2. Update versi, changelog, dll.
# ... bump version in package.json ...

git commit -m "chore: bump version to v1.0.0"

# 3. Merge ke main (production)
git checkout main
git merge --no-ff release/v1.0.0 -m "Merge release/v1.0.0 into main"
git tag -a v1.0.0 -m "Release v1.0.0"

# 4. Merge balik ke develop
git checkout develop
git merge --no-ff release/v1.0.0 -m "Merge release/v1.0.0 into develop"

# 5. Hapus branch release
git branch -d release/v1.0.0
```

---

### 🔥 Hotfix (Critical Bug di Production)

```bash
# 1. Buat hotfix dari main
git checkout -b hotfix/fix-critical-bug main

# ... fix & commit ...
git commit -m "fix: perbaiki bug kritis X"

# 2. Merge ke main & tag
git checkout main
git merge --no-ff hotfix/fix-critical-bug -m "Merge hotfix/fix-critical-bug into main"
git tag -a v1.0.1 -m "Hotfix v1.0.1"

# 3. Merge ke develop juga
git checkout develop
git merge --no-ff hotfix/fix-critical-bug -m "Merge hotfix/fix-critical-bug into develop"

# 4. Hapus branch hotfix
git branch -d hotfix/fix-critical-bug
```

---

## Commit Message Convention (Conventional Commits)

```
feat:     Fitur baru
fix:      Bug fix
chore:    Maintenance (update deps, config)
test:     Tambah/update tests
docs:     Update dokumentasi
ci:       Perubahan CI/CD pipeline
refactor: Refactoring kode
```

---

## Status Saat Ini

- ✅ Git repository sudah diinisialisasi
- ✅ Branch `main` → production
- ✅ Branch `develop` → integration (HEAD saat ini)
- ✅ Git Flow prefix sudah dikonfigurasi
