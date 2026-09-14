# Sample Grantwriting Hub Example

This reference application demonstrates how any organization, cooperative, or non-profit can set up their own grantwriting repository using the [`@tekromancy/grant_utils`](https://github.com/Tekromancy/grant_utils) package.

---

## 🚀 Running the Example

### 1. Build and Run the CLI Dashboard
From the root of this monorepo:
```bash
pnpm --filter sample-grant-hub run start
```

Or from within this directory:
```bash
pnpm install
pnpm start
```

### 2. Output Walkthrough
When executed, this example demonstrates:
1. **`registerProject` & `getProjectConfig`**: Registers organization metadata, financial targets, and Git repository parameters.
2. **`parseIcsContent`**: Parses the local `calendar.ics` feed into structured `CalendarEvent` objects with alarms and urgency indicators.
3. **`getKPISummary`**: Dynamically computes aggregate pipeline amount, win-rate projections, and category breakdowns.
4. **`calculateMatchFunding`**: Calculates required non-federal matching funds (e.g. 50% match on a $300k federal ask) and lists match candidate sources.
5. **`getGrantComplianceChecklist`**: Generates mandatory legal, financial, and federal SAM.gov compliance verification checklists.
6. **`computeDiff` & `formatUnifiedDiff`**: Generates unified red/green diffs between proposal revisions.
7. **`suggestBranchName` & `generatePrTemplate`**: Automatically prepares GitHub / Codeberg pull request payloads.

---

## 📁 Repository Blueprint for Your Organization

To set up your own grant repository using this structure:

```
my-grant-hub/
├── data/
│   ├── grants/                 # Individual Markdown proposals with YAML frontmatter
│   │   ├── 01_usda_grant.md
│   │   └── 02_city_grant.md
│   └── strategic_plan.md       # Organizational strategies & bylaws
├── calendar.ics                # RFC 5545 calendar feed with submission alarms
├── package.json                # Dependencies including @tekromancy/grant_utils
└── tsconfig.json
```
