# Publishing `@grantwriting/grant_utils` to npmjs

This document provides step-by-step instructions for publishing `@grantwriting/grant_utils` to the public [npm Registry](https://www.npmjs.com/).

---

## 🔍 Pre-Publish Checklist

Before releasing a new version to npmjs, ensure the following checks pass:

1. **Clean Monorepo Build:**
   ```bash
   pnpm run build
   ```
2. **All Unit Tests Green:**
   ```bash
   pnpm run test
   ```
3. **Type Definitions & Distribution Verification:**
   Inspect `packages/grant_utils/dist/` to verify that `index.d.ts`, `index.js`, and maps are freshly built:
   ```bash
   ls -la packages/grant_utils/dist
   ```

---

## 🔑 Manual Publishing Workflow

### 1. Authenticate with npm
Log in to your npm account with publishing permissions:

```bash
npm login
```

Verify your active identity:
```bash
npm whoami
```

### 2. Version Bump
From the package directory (`packages/grant_utils`):
```bash
cd packages/grant_utils
npm version patch # or minor / major
```

### 3. Publish to npmjs
Publish with public access (required for scoped packages):

```bash
npm publish --access public
```

---

## 🤖 Automated Publishing via GitHub Actions

This repository includes an automated publishing workflow in [`.github/workflows/publish.yml`](../.github/workflows/publish.yml).

### Workflow Triggers:
The automated publish job triggers whenever a new Git tag matching `v*` (e.g. `v0.1.1`) is pushed to GitHub:

```bash
git tag v0.1.1
git push origin v0.1.1
```

### GitHub Secret Configuration:
Ensure the following secret is added to the GitHub repository settings (**Settings** ➔ **Secrets and variables** ➔ **Actions**):
- `NPM_TOKEN`: A granular automation token generated from [npmjs.com](https://www.npmjs.com/) with write permissions.
