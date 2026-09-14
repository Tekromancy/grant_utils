# @tekromancy/grant_utils

> Enterprise-grade TypeScript models, parsers, KPI calculators, RFC 5545 iCalendar generators, and Git/PR collaboration workflows for institutional grantwriting, non-profits, and cooperatives.

[![npm version](https://img.shields.io/npm/v/@tekromancy/grant_utils.svg)](https://www.npmjs.com/package/@tekromancy/grant_utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue)](https://www.typescriptlang.org/)

---

## 🌟 Overview

`@tekromancy/grant_utils` provides the computational and schema foundation for building Git-first grantwriting hubs, applications, and dashboards.

By treating funding opportunities as structured code (Markdown with YAML frontmatter + RFC 5545 iCalendar), organizations can version control their applications, compute pipeline KPIs in real time, audit match-funding requirements, and submit proposed edits via unified Git pull requests.

---

## 📦 Installation

```bash
# Using pnpm (recommended)
pnpm add @tekromancy/grant_utils

# Using npm
npm install @tekromancy/grant_utils

# Using yarn
yarn add @tekromancy/grant_utils
```

---

## 🚀 Key Modules & Features

### 1. Markdown Frontmatter Parsing & Verification
Parse and serialize grant opportunities with strict typing:
```typescript
import { parseGrantMarkdown, serializeGrantMarkdown } from '@tekromancy/grant_utils';

const fileContent = `---
id: usda_rbdg_2027
title: "USDA Rural Business Development Grant"
funder: "USDA Rural Development"
amount: 150000
amountFormatted: "$150,000"
deadline: "2027-04-30"
matchPercentage: 0
status: "Drafting"
---

# Scope of Work
Executive summary and project milestones...
`;

const { metadata, content } = parseGrantMarkdown(fileContent);
console.log(metadata.title); // "USDA Rural Business Development Grant"
console.log(metadata.amount); // 150000
```

### 2. RFC 5545 iCalendar Parsing & Generation
Generate standards-compliant calendar files compatible with Google Calendar, Apple Calendar, and Outlook:
```typescript
import { generateIcsString, parseIcsEvents, GrantCalendarEvent } from '@tekromancy/grant_utils';

const events: GrantCalendarEvent[] = [
  {
    uid: 'grant-usda-2027@myorg.org',
    title: 'DEADLINE: USDA RBDG Proposal Submission',
    summary: 'DEADLINE: USDA RBDG Proposal Submission',
    description: 'Submit final application via grants.gov portal.',
    date: '2027-04-30',
    category: 'Federal',
    amount: '$150,000'
  }
];

const icsOutput = generateIcsString(events);
// Produces valid VCALENDAR / VEVENT blocks with alarms and formatting
```

### 3. Pipeline KPIs & Financial Aggregation
Calculate pipeline totals, target attainment, cost-share burdens, and deadline status:
```typescript
import {
  calculateTotalPipeline,
  calculateSecuredFunding,
  calculateMatchRequirements,
  calculatePipelinePacing,
  getDeadlineStatus
} from '@tekromancy/grant_utils';

const grants = [ /* Array of GrantOpportunity objects */ ];

const totalPipeline = calculateTotalPipeline(grants);
const pacing = calculatePipelinePacing(totalPipeline, 1000000); // Target: $1M
console.log(`Pipeline: $${pacing.pipelineTotal.toLocaleString()} (${pacing.percentageOfTarget.toFixed(1)}% of target)`);

const matchSummary = calculateMatchRequirements(grants);
console.log(`Total match funding required: $${matchSummary.totalMatchRequired.toLocaleString()}`);
```

### 4. Unified Red/Green Diff Engine
Compute precise line diffs for grant applications and markdown documentation:
```typescript
import { computeLineDiff } from '@tekromancy/grant_utils';

const originalText = "Requesting $100,000 for equipment purchase.";
const modifiedText = "Requesting $120,000 for equipment purchase and contractor fees.";

const diff = computeLineDiff(originalText, modifiedText);
console.log(`Changes: +${diff.addedCount} / -${diff.removedCount}`);
```

### 5. Git & Pull Request Automation
Automate multi-platform PR workflows across GitHub, GitLab, and Codeberg:
```typescript
import {
  generateBranchName,
  generatePrTitle,
  generatePrBody,
  createGitHubPullRequest
} from '@tekromancy/grant_utils';

const branch = generateBranchName('USDA RBDG 2027', 'budget-update');
// "grants/usda-rbdg-2027-budget-update"

const prBody = generatePrBody({
  grantTitle: 'USDA RBDG 2027',
  summary: 'Updated contractor line-item budget to reflect prevailing wage rates',
  author: 'Jane Doe <jane@myorg.org>',
  changes: ['Added contractor line item', 'Updated match narrative']
});
```

### 6. Node.js Local File System Helpers
For CLI utilities, build scripts, and local desktop runners:
```typescript
import { readLocalMarkdownFile, saveLocalMarkdownFile, getLocalAuthToken } from '@tekromancy/grant_utils/node';

const rawContent = readLocalMarkdownFile(process.cwd(), 'data/grants/01_grant.md');
```

---

## 📚 Documentation

- [Complete Setup Guide](https://github.com/Tekromancy/grant_utils/blob/main/docs/setup-guide.md)
- [YAML Frontmatter Specification](https://github.com/Tekromancy/grant_utils/blob/main/docs/frontmatter-spec.md)
- [iCalendar Sync Specification](https://github.com/Tekromancy/grant_utils/blob/main/docs/calendar-spec.md)
- [NPM Publishing Guide](https://github.com/Tekromancy/grant_utils/blob/main/docs/npm-publishing.md)

---

## 🛠️ Contributing & Development

```bash
# Clone the repository
git clone git@github.com:Tekromancy/grant_utils.git
cd grant_utils

# Install dependencies
pnpm install

# Build all packages and run tests
pnpm run build
pnpm run test

# Run example grant hub demo CLI
pnpm run example
```

---

## 📄 License

MIT © [Tekromancy](https://github.com/Tekromancy) & [Austin Cooperative Business Foundation](https://github.com/AustinCooperativeBusinessFoundation)
