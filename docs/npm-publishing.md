# Publishing `@tekromancy/grant_utils` to npmjs

This document provides step-by-step instructions for publishing `@tekromancy/grant_utils` to the public [npm Registry](https://www.npmjs.com/) and configuring GitHub Actions authorization.

---

## 🔐 Authorizing GitHub for npmjs

To allow GitHub Actions to publish under the `@tekromancy` scope, you need an npm Access Token stored as a GitHub Actions Secret:

### Step 1: Verify Scope / Organization Ownership on npmjs
1. Go to [npmjs.com](https://www.npmjs.com/) and sign in.
2. Ensure you have created the **`@tekromancy`** organization (or your username is `tekromancy`).
   - If `@tekromancy` is an organization, ensure your npm user account is an **Owner** or **Admin** with write/publish permissions.

### Step 2: Generate an npm Access Token
1. Click on your profile avatar in the upper-right corner of npmjs.com and select **Access Tokens**.
2. Click **Generate New Token**:
   - **Classic Token (Recommended for CI simplicity):** Choose **Automation**. Automation tokens bypass two-factor authentication (2FA) prompts during CI/CD publishing runs.
   - **Granular Access Token (Recommended for least-privilege security):**
     - Token name: `github-actions-grant_utils`
     - Expiration: Select desired duration (e.g., 90 days, 1 year).
     - Permissions: Select **Read and write**.
     - Packages and scopes: Select **Only selected packages and scopes**, then select scope `@tekromancy`.
3. Copy the generated token string immediately.

### Step 3: Add the Token to GitHub Actions Secrets
1. Navigate to the GitHub repository: `https://github.com/Tekromancy/grant_utils`.
2. Click **Settings** (top navigation).
3. In the left sidebar, click **Secrets and variables** ➔ **Actions**.
4. Click **New repository secret**:
   - **Name:** `NPM_TOKEN`
   - **Secret:** Paste your npm token.
5. Click **Add secret**.

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

## 🤖 Automated Publishing via GitHub Actions

This repository includes an automated publishing workflow in [`.github/workflows/publish.yml`](../.github/workflows/publish.yml).

### Workflow Triggers:
The automated publish job triggers whenever a new Git tag matching `v*` (e.g. `v0.1.0` or `v0.1.1`) is pushed to GitHub:

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions will automatically check out the code, install dependencies, run the test suite, compile TypeScript, and publish `@tekromancy/grant_utils` with `--access public` and provenance attestation.

---

## 🔑 Manual Publishing Workflow (Alternative)

If you prefer publishing directly from your local terminal:

```bash
# 1. Authenticate with npm
npm login

# 2. Verify identity
npm whoami

# 3. Navigate to package directory
cd packages/grant_utils

# 4. Publish with public access
npm publish --access public
```
