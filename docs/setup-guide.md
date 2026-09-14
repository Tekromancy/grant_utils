# Setting Up Your Own Grantwriting Repository: A Complete Guide

This comprehensive guide walks you through setting up a modern, Git-powered grantwriting, pipeline tracking, and compliance repository for your non-profit, cooperative, foundation, or enterprise using [`@tekromancy/grant_utils`](https://github.com/Tekromancy/grant_utils).

---

## 🧭 Architecture Overview

A Git-powered grantwriting repository treats your funding proposals and strategy documents as **code**:
- **Single Source of Truth:** Every grant application is a Markdown document with a YAML frontmatter header containing metadata (amount, deadline, funder, match requirements, portal URL).
- **Automated Scheduling:** Deadlines and compliance milestones are encoded into an RFC 5545 `calendar.ics` feed that synchronizes with Google Calendar, Apple Calendar, and Outlook.
- **Collaborative Review via Pull Requests:** Team members and grantwriters draft edits on feature branches. The system computes visual unified red/green diffs before submitting PRs to GitHub, GitLab, or Codeberg.
- **Dynamic KPI Analytics:** Mathematical engines compute pipeline sums, target attainment percentages, and required cost-shares automatically.

---

## 🚀 Step-by-Step Repository Setup

### Step 1: Initialize Your Project Directory
Create a new directory and initialize Git:

```bash
mkdir my-org-grantwriting
cd my-org-grantwriting
git init -b main
```

### Step 2: Initialize `package.json`
Install `@tekromancy/grant_utils`:

```bash
pnpm init
pnpm add @tekromancy/grant_utils
pnpm add -D typescript @types/node
```

### Step 3: Establish the Directory Layout
Create the recommended folder structure:

```bash
mkdir -p data/grants
```

```
my-org-grantwriting/
├── data/
│   ├── grants/                 # Individual grant proposals (*.md)
│   │   ├── 01_usda_rfp_2027.md
│   │   └── 02_city_initiative.md
│   ├── bylaws.md               # Legal bylaws & 501(c)(3) determination
│   └── strategy2027.md         # Financial targets & board priorities
├── calendar.ics                # Master RFC 5545 calendar feed
├── package.json
└── tsconfig.json
```

---

## 📝 Step 4: Authoring Your First Grant Proposal

Create a new file in `data/grants/01_first_opportunity.md`. Every proposal must begin with a YAML block demarcated by triple dashes (`---`):

```markdown
---
id: usda_sdgg_2027
title: "USDA Socially Disadvantaged Groups Grant"
funder: "USDA Rural Development"
program: "Socially Disadvantaged Groups Grant (SDGG)"
amount: 175000
amountFormatted: "$175,000"
deadline: "2027-06-15"
deadlineFormatted: "June 15, 2027"
tier: "Summer Federal Major"
category: "Federal"
matchPercentage: 0
grantType: "Federal Technical Assistance"
portalUrl: "https://grants.gov"
strategicPriority: "Cooperative Enterprise Technical Assistance"
status: "Drafting"
---

# USDA Socially Disadvantaged Groups Grant

## 1. Executive Summary & Organizational Fit
Explain your organization's mission, governance structure, and community track record...

## 2. Statement of Need
Provide demographic data, economic disparities, and geographic census tract evidence...

## 3. Scope of Work & Milestones
- **Q1 2027:** Client intake and cooperative development training.
- **Q2 2027:** Direct business consulting and legal governance formalization.
- **Q3–Q4 2027:** Quarterly reporting and job creation metrics tracking.

## 4. Comprehensive Line-Item Budget
| Budget Line Item | Requested Amount | Match (Cash/In-Kind) | Total Budget |
| :--- | :--- | :--- | :--- |
| **Personnel (1.0 FTE)** | $120,000 | $0 | $120,000 |
| **Fringe Benefits (22%)** | $26,400 | $0 | $26,400 |
| **Travel & Training** | $8,600 | $0 | $8,600 |
| **Supplies & Operating** | $20,000 | $0 | $20,000 |
| **Total Project Budget**| **$175,000** | **$0** | **$175,000** |
```

---

## 📅 Step 5: Creating Your Master `calendar.ics` Feed

Create `calendar.ics` in the root of your project:

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Organization//Grantwriting Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Grantwriting Deadlines & Milestones
X-WR-TIMEZONE:America/Chicago
BEGIN:VEVENT
UID:grant-usda-sdgg-2027@myorg.org
DTSTAMP:20260914T120000Z
DTSTART;VALUE=DATE:20270615
DTEND;VALUE=DATE:20270615
SUMMARY:DEADLINE: USDA Socially Disadvantaged Groups Grant ($175,000)
DESCRIPTION:Technical assistance for worker cooperatives.\\nPackage: data/grants/01_first_opportunity.md
LOCATION:https://grants.gov
CATEGORIES:Federal,Summer Federal Major
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P14D
ACTION:DISPLAY
DESCRIPTION:REMINDER: 14 Days until USDA SDGG submission deadline
END:VALARM
BEGIN:VALARM
TRIGGER:-P3D
ACTION:DISPLAY
DESCRIPTION:FINAL WARNING: 3 Days until USDA SDGG submission deadline
END:VALARM
END:VEVENT
END:VCALENDAR
```

---

## 💻 Step 6: Using `@tekromancy/grant_utils` in Your Scripts

Create a simple script `check-pipeline.js` to inspect your portfolio:

```javascript
import fs from 'node:fs';
import { 
  parseIcsContent, 
  calculateDaysRemaining, 
  calculateMatchFunding, 
  getKPISummary 
} from '@tekromancy/grant_utils';

// Read and parse your calendar feed
const rawIcs = fs.readFileSync('calendar.ics', 'utf8');
const events = parseIcsContent(rawIcs);

console.log(`Found ${events.length} calendar events.`);
events.forEach(evt => {
  const days = calculateDaysRemaining(evt.startDate);
  console.log(`• [${evt.startDate}] (${days} days left): ${evt.title}`);
});
```

---

## 🤝 Step 7: Setting Up Git Collaboration & PR Workflows

1. **Host on GitHub, Codeberg, or GitLab:**
   - Push your repository to your organization's remote:
     ```bash
     git remote add origin git@github.com:MyOrg/grantwriting.git
     git push -u origin main
     ```
2. **Branching Model:**
   - Writers create branches named `<org>/update-<grant_name>-<timestamp>`.
   - Edits are previewed using the visual diff engine before making a PR.
   - Merging to `main` deploys updated data feeds automatically.
