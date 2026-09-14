# Grantwriting Utils Monorepo (`grant_utils`)

> The open-source infrastructure and toolkit for Git-powered grantwriting, pipeline tracking, cost-share accounting, RFC 5545 iCalendar synchronization, and collaborative PR review.

[![CI](https://github.com/Tekromancy/grant_utils/actions/workflows/ci.yml/badge.svg)](https://github.com/Tekromancy/grant_utils/actions/workflows/ci.yml)
[![Pages Deployment](https://github.com/Tekromancy/grant_utils/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Tekromancy/grant_utils/actions/workflows/deploy-pages.yml)
[![Live Demo Hub](https://img.shields.io/badge/Demo_Hub-tekromancy.github.io%2Fgrant__utils-emerald.svg)](https://tekromancy.github.io/grant_utils/)
[![npm version](https://img.shields.io/npm/v/@tekromancy/grant_utils.svg)](https://www.npmjs.com/package/@tekromancy/grant_utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-orange.svg)](https://pnpm.io/)

---

## 🌐 Live Interactive Demonstration & Documentation

Explore the live web application and interactive developer documentation hosted on GitHub Pages:
👉 **[tekromancy.github.io/grant_utils](https://tekromancy.github.io/grant_utils/)**

- **Executive KPI Dashboard:** Real-time metrics, pipeline summaries, match funding calculation, and countdown clocks.
- **Grants Explorer:** Filter and search active opportunities, view compliance checklists and requirements.
- **Interactive Calendar:** Month matrix view and instant `.ics` feed downloads.
- **Proposal Editor & Visual Diff:** WYSIWYG & Markdown editing with real-time Git red/green diff calculation.
- **Interactive Documentation:** Setup guides, RFC 5545 specifications, and a live YAML frontmatter validator playground.
- **Multi-Tenant Organization Switcher:** Switch between Austin Cooperative Business Foundation, Go Austin / Vamos Austin, or Starter presets.

---

## 🏛️ Monorepo Architecture

This monorepo houses the core `@tekromancy/grant_utils` TypeScript engine, end-to-end documentation, and reference applications demonstrating how any organization, cooperative, or non-profit can structure their own grantwriting repository.

```
grant_utils/
├── packages/
│   └── grant_utils/            # Core library (@tekromancy/grant_utils)
│       ├── src/                # Models, parsers, KPI engines, diff calculators
│       ├── scripts/            # Code-generation scripts (grants, calendar, docs)
│       ├── tests/              # Vitest test suite
│       └── package.json
├── examples/
│   ├── grant-hub-site/         # Next.js interactive web showcase & documentation site (GitHub Pages)
│   └── sample-grant-hub/       # Complete reference grantwriting repository (CLI demo)
│       ├── data/               # Markdown proposals with YAML frontmatter
│       ├── calendar.ics        # Master RFC 5545 calendar feed
│       ├── strategic_plan.md   # Organizational targets & priorities
│       ├── src/index.ts        # Interactive demo CLI
│       └── tests/              # Integration tests
├── docs/                       # Complete guides & technical specifications
│   ├── setup-guide.md          # 15-minute guide to setting up your own repo
│   ├── frontmatter-spec.md     # Proposal metadata standard
│   ├── calendar-spec.md        # RFC 5545 calendar integration standard
│   └── npm-publishing.md       # Release and publishing workflow
└── .github/workflows/          # CI/CD, GitHub Pages deployment, and automated npm publishing
```

---

## 🚀 Quick Start: Building & Testing the Monorepo

Prerequisites:
- [Node.js](https://nodejs.org/) (v20+ recommended, v24 supported)
- [pnpm](https://pnpm.io/) (v9+)

```bash
# 1. Clone the repository
git clone git@github.com:Tekromancy/grant_utils.git
cd grant_utils

# 2. Install dependencies across all packages
pnpm install

# 3. Build the core library and example application
pnpm run build

# 4. Run test suites across the monorepo
pnpm run test

# 5. Execute the sample grant hub demo CLI
pnpm run example

# 6. Launch the interactive Grant Hub web showcase locally
pnpm run site
```

---

## 📦 Packages in this Monorepo

| Package | Directory | Description | Status |
| :--- | :--- | :--- | :--- |
| **`@tekromancy/grant_utils`** | [`packages/grant_utils`](./packages/grant_utils) | Core computational engine, YAML parser, RFC 5545 calendar generator, KPI aggregator, unified diff, and Git PR tooling. | [![npm](https://img.shields.io/npm/v/@tekromancy/grant_utils.svg)](https://www.npmjs.com/package/@tekromancy/grant_utils) |
| **`@tekromancy/grant-hub-site`** | [`examples/grant-hub-site`](./examples/grant-hub-site) | Next.js interactive web demonstration and documentation portal hosted on GitHub Pages. | [![Pages](https://img.shields.io/badge/Live-Demo_Hub-emerald.svg)](https://tekromancy.github.io/grant_utils/) |
| **`sample-grant-hub`** | [`examples/sample-grant-hub`](./examples/sample-grant-hub) | Full reference implementation showcasing how to consume the library, manage a \$750k pipeline, and validate grants via CLI. | Reference |

---

## 🎯 What Problem Does This Solve?

Traditional grantwriting workflows suffer from:
1. **Scattered Documents:** Proposals locked in proprietary document suites, leading to version drift and lost edits.
2. **Untracked Deadlines:** Submissions missed because dates are buried in email threads rather than subscribed calendar feeds.
3. **Manual Financial Aggregation:** Spreadsheet errors calculating pipeline totals, win rates, and match funding (cost-share) requirements.
4. **Opaque Review Processes:** Stakeholder comments and edits made without clean visual diffs or audit trails.

### The Git-First Grantwriting Solution:
```mermaid
flowchart LR
    A["Markdown Proposals\n(+ YAML Frontmatter)"] --> B["@tekromancy/grant_utils\nParser & KPI Engine"]
    C["RFC 5545 calendar.ics"] --> B
    B --> D["Automated Calendar Feeds\n(Google/Apple/Outlook)"]
    B --> E["Real-Time Financial Dashboard\n(Pacing, Match, Pipeline)"]
    B --> F["Collaborative Git PR Review\n(Unified Line Diffs)"]
```

---

## 💡 How to Set Up Your Own Grantwriting Hub

Setting up a repository for your organization takes less than 15 minutes:

### 1. Initialize your project
```bash
mkdir my-org-grantwriting && cd my-org-grantwriting
git init -b main
pnpm init
pnpm add @tekromancy/grant_utils
```

### 2. Create your folder structure
```bash
mkdir -p data/grants
```

### 3. Author a proposal (`data/grants/01_example_grant.md`)
```markdown
---
id: usda_sdgg_2027
title: "USDA Socially Disadvantaged Groups Grant"
funder: "USDA Rural Development"
amount: 175000
amountFormatted: "$175,000"
deadline: "2027-06-15"
deadlineFormatted: "June 15, 2027"
matchPercentage: 0
portalUrl: "https://grants.gov"
status: "Drafting"
---

# Project Narrative & Line-Item Budget...
```

### 4. Consume in your code
```typescript
import { parseGrantMarkdown, calculateTotalPipeline } from '@tekromancy/grant_utils';
import { readLocalMarkdownFile } from '@tekromancy/grant_utils/node';

const raw = readLocalMarkdownFile(process.cwd(), 'data/grants/01_example_grant.md');
const { metadata } = parseGrantMarkdown(raw);

console.log(`Grant: ${metadata.title} | Amount: ${metadata.amountFormatted}`);
```

👉 **Read the full tutorial in [docs/setup-guide.md](./docs/setup-guide.md).**

---

## 📖 Complete Documentation Index

- **[Architecture & Setup Guide](./docs/setup-guide.md)**: End-to-end tutorial covering directory structure, authoring proposals, calendar synchronization, and CI/CD.
- **[YAML Frontmatter Specification](./docs/frontmatter-spec.md)**: Formal schema for proposal metadata, match percentages, funding tiers, and lifecycle statuses.
- **[RFC 5545 iCalendar Specification](./docs/calendar-spec.md)**: Complete guide to calendar feed fields, alarms, and multi-client subscription instructions.
- **[NPM Publishing & Release Guide](./docs/npm-publishing.md)**: Automated CI/CD release workflow via GitHub Actions and npm provenance.

---

## 🧪 Testing & Verification

The monorepo contains comprehensive unit and integration test coverage:
```bash
# Run all tests
pnpm run test

# Run tests in watch mode during development
pnpm --filter @tekromancy/grant_utils test:watch
```

Tests cover:
- YAML frontmatter parser edge cases and unicode handling.
- RFC 5545 iCalendar feed generator and VEVENT parser.
- Financial arithmetic, match funding calculations, and deadline pacing.
- Unified line diff engine.
- Git branch name and PR body formatting.

---

## 🚢 Publishing to NPM

Automated publishing is configured in [`.github/workflows/publish.yml`](./.github/workflows/publish.yml).

To release a new version:
1. Bump the version in `packages/grant_utils/package.json`.
2. Push changes to `main`.
3. Create and push a git tag:
   ```bash
   git tag v0.1.1
   git push origin v0.1.1
   ```
4. GitHub Actions will run tests, build the package, and publish to npm with `--access public`.

---

## 🤝 Contributing & Community

Contributions are welcomed from non-profits, cooperatives, open-source maintainers, and grant professionals.
- File issues and feature suggestions in [GitHub Issues](https://github.com/Tekromancy/grant_utils/issues).
- Submit pull requests following standard Git feature-branch workflows.

---

## 📄 License

Released under the [MIT License](./LICENSE).  
Copyright © 2026 [Tekromancy](https://github.com/Tekromancy) & [Austin Cooperative Business Foundation](https://github.com/AustinCooperativeBusinessFoundation).
