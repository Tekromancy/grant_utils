export interface DocSection {
  id: string;
  title: string;
  category: 'getting-started' | 'specifications' | 'workflows' | 'api-reference';
  summary: string;
  badge?: string;
  content: string;
  codeSnippets?: {
    label: string;
    language: string;
    code: string;
  }[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    title: 'Architecture & Overview',
    category: 'getting-started',
    summary: 'The GitOps philosophy for grantwriting: Markdown proposals as code, RFC 5545 calendar automation, and unified diff PR workflows.',
    badge: 'Core Concept',
    content: `A modern grantwriting repository treats funding proposals, compliance milestones, and operational strategy documents as **code**:

- **Single Source of Truth:** Every grant application is a Markdown document with a YAML frontmatter header containing structured metadata (requested amount, deadline, funder, match requirements, portal URL, and status).
- **Automated Scheduling:** Deadlines and compliance milestones are encoded into an RFC 5545 \`calendar.ics\` feed that synchronizes automatically with Google Calendar, Apple Calendar, and Microsoft Outlook.
- **Collaborative Review via Pull Requests:** Team members and grantwriters draft edits on Git branches. The system computes visual unified red/green diffs before submitting PRs to GitHub, GitLab, or Codeberg/Forgejo.
- **Deterministic KPI Analytics:** Mathematical engines compute pipeline sums, target attainment percentages, and required cost-shares automatically across multiple organizations.`,
    codeSnippets: [
      {
        label: 'Install via pnpm / npm',
        language: 'bash',
        code: `pnpm add @tekromancy/grant_utils
# or
npm install @tekromancy/grant_utils`
      },
      {
        label: 'Basic TypeScript Usage',
        language: 'typescript',
        code: `import { 
  getAllGrants, 
  getKPISummary, 
  calculateDaysRemaining,
  calculateMatchFunding 
} from '@tekromancy/grant_utils';

const grants = getAllGrants();
const kpi = getKPISummary(grants, 4500000);

console.log(\`Active Grants: \${kpi.activeGrantsCount}\`);
console.log(\`Pipeline Sum: $\${kpi.totalPipelineValue.toLocaleString()}\`);
console.log(\`Target Attainment: \${kpi.targetAttainmentPercentage.toFixed(1)}%\`);`
      }
    ]
  },
  {
    id: 'setup-guide',
    title: 'Setting Up Your Own Repository',
    category: 'getting-started',
    summary: 'Complete walkthrough to initialize a new grantwriting repository for your non-profit, cooperative, or foundation.',
    badge: 'Walkthrough',
    content: `### Step 1: Initialize Your Project Directory
Create a new directory and initialize Git:
\`\`\`bash
mkdir my-org-grantwriting
cd my-org-grantwriting
git init -b main
\`\`\`

### Step 2: Initialize \`package.json\`
Install \`@tekromancy/grant_utils\` as a dependency:
\`\`\`bash
pnpm init
pnpm add @tekromancy/grant_utils
pnpm add -D typescript @types/node
\`\`\`

### Step 3: Establish the Standard Folder Layout
\`\`\`
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
\`\`\`

### Step 4: Add Calendar & Build Scripts
In your \`package.json\`, add convenience scripts:
\`\`\`json
{
  "scripts": {
    "build": "tsc",
    "calendar:generate": "node scripts/generateCalendar.js"
  }
}
\`\`\``
  },
  {
    id: 'frontmatter-spec',
    title: 'Grant Frontmatter YAML Specification',
    category: 'specifications',
    summary: 'Detailed schema specification for YAML metadata headers required on every grant proposal markdown document.',
    badge: 'Schema Reference',
    content: `Every grant proposal document in your repository must begin with a YAML frontmatter header demarcated by triple dashes (\`---\`).

### Field Reference Table

| Field Name | Type | Required? | Default / Options | Description |
| :--- | :--- | :--- | :--- | :--- |
| **id** | \`string\` | **Yes** | Snake_case string | Unique identifier (e.g. \`usda_sdgg_2027\`) |
| **title** | \`string\` | **Yes** | Text string | Official title of the grant application |
| **funder** | \`string\` | **Yes** | Text string | Grantmaker or federal agency name |
| **program** | \`string\` | **Yes** | Text string | Program or solicitation name |
| **amount** | \`number\` | **Yes** | Positive number | Total dollar amount requested |
| **amountFormatted** | \`string\` | Optional | \`$XXX,XXX\` | Formatted funding display string |
| **deadline** | \`string\` | **Yes** | \`YYYY-MM-DD\` | Submission deadline |
| **deadlineFormatted** | \`string\` | Optional | E.g. \`June 15, 2027\` | Formatted date string |
| **tier** | \`string\` | Optional | Window / Priority | Application window (e.g. \`Summer Federal Major\`) |
| **category** | \`string\` | Optional | \`Federal\`, \`Municipal\`, \`Foundation\` | Funding source category |
| **matchPercentage** | \`number\` | Optional | \`0\`–\`100\` (Default: \`0\`) | Statutory cost-share requirement |
| **portalUrl** | \`string\` | Optional | URL | Application or RFP portal link |
| **status** | \`string\` | Optional | \`Drafting\`, \`Submitted\`, \`Awarded\` | Proposal lifecycle stage |`,
    codeSnippets: [
      {
        label: 'Frontmatter Template',
        language: 'yaml',
        code: `---
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

# USDA Socially Disadvantaged Groups Grant Narrative
...`
      },
      {
        label: 'Parsing Frontmatter with @tekromancy/grant_utils',
        language: 'typescript',
        code: `import { splitFrontmatter } from '@tekromancy/grant_utils';

const rawMarkdown = \`---\\nid: sample\\namount: 50000\\n---\\n# Narrative Body\`;
const { frontmatter, body } = splitFrontmatter(rawMarkdown);

console.log(frontmatter); // "---\\nid: sample\\namount: 50000\\n---"
console.log(body);        // "# Narrative Body"`
      }
    ]
  },
  {
    id: 'calendar-spec',
    title: 'RFC 5545 Calendar Specification',
    category: 'specifications',
    summary: 'Standards compliance for the master calendar.ics feed, automated alarm triggers, and calendar app subscription steps.',
    badge: 'iCal RFC 5545',
    content: `The master \`calendar.ics\` feed adheres strictly to RFC 5545. It acts as the team-wide notification and deadline synchronization backbone.

### Standard Alarm Triggers
Every major submission deadline includes automated alarms:
- **\`-P14D\` (14 Days Prior):** Initial preparation reminder for board approvals, draft finalization, and clerical checklist review.
- **\`-P3D\` (3 Days Prior):** Urgent final warning for SAM.gov validation, Workspace sign-off, and Grants.gov submission.

### Subscribing in Calendar Applications
- **Google Calendar:** In "Other calendars", click **+** ➔ **From URL** and paste your published \`calendar.ics\` raw link.
- **Apple Calendar:** Select **File** ➔ **New Calendar Subscription** and set refresh to hourly or daily.
- **Outlook / Thunderbird:** Click **Add Calendar** ➔ **Subscribe from web**.`,
    codeSnippets: [
      {
        label: 'Sample VEVENT Block',
        language: 'ics',
        code: `BEGIN:VEVENT
UID:usda-sdgg-2027@example.org
DTSTAMP:20260914T120000Z
DTSTART;VALUE=DATE:20270615
DTEND;VALUE=DATE:20270615
SUMMARY:DEADLINE: USDA SDGG ($175,000)
DESCRIPTION:Socially Disadvantaged Groups Grant\\nFunder: USDA\\nPackage: data/grants/01_usda.md
LOCATION:https://grants.gov
CATEGORIES:Federal,Major
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P14D
ACTION:DISPLAY
DESCRIPTION:REMINDER: 14 Days until USDA SDGG deadline
END:VALARM
BEGIN:VALARM
TRIGGER:-P3D
ACTION:DISPLAY
DESCRIPTION:FINAL WARNING: 3 Days until USDA SDGG deadline
END:VALARM
END:VEVENT`
      }
    ]
  },
  {
    id: 'git-pr-workflow',
    title: 'GitOps PR & Multi-Forge Integration',
    category: 'workflows',
    summary: 'How to use visual Git diffs and automated Pull Requests / Merge Requests across GitHub, GitLab, and Codeberg/Forgejo.',
    badge: 'Multi-Forge',
    content: `The library includes multi-forge integration to validate personal access tokens (PATs), generate Git branches, compute red/green visual diffs, and submit Pull Requests directly from web dashboards or TUI CLIs.

### Supported Git Forges
- **GitHub:** Supports fine-grained and classic personal access tokens with \`contents: write\` and \`pull_requests: write\`.
- **GitLab:** Supports project-level and personal access tokens targeting GitLab.com or self-hosted CE/EE instances.
- **Codeberg & Forgejo:** Full support for Forgejo API v1 endpoints with bearer authentication.`,
    codeSnippets: [
      {
        label: 'Computing Diffs with @tekromancy/grant_utils',
        language: 'typescript',
        code: `import { computeDiff, formatUnifiedDiff } from '@tekromancy/grant_utils';

const original = 'status: Drafting\\namount: 150000\\n';
const modified = 'status: Ready to Submit\\namount: 175000\\n';

const changes = computeDiff(original, modified);
const patch = formatUnifiedDiff('data/grants/01_usda.md', original, modified);

console.log(patch);
// --- a/data/grants/01_usda.md
// +++ b/data/grants/01_usda.md
// -status: Drafting
// +status: Ready to Submit
// -amount: 150000
// +amount: 175000`
      },
      {
        label: 'Creating a GitHub Pull Request',
        language: 'typescript',
        code: `import { createGitHubPullRequest } from '@tekromancy/grant_utils';

const prResult = await createGitHubPullRequest({
  token: 'ghp_yourPersonalAccessToken',
  owner: 'AustinCooperativeBusinessFoundation',
  repo: 'grantwriting',
  title: 'Update USDA SDGG proposal budget and narratives',
  body: 'Automated PR submitted from Grantwriting Web Hub',
  branch: 'grant-edit/usda-sdgg-budget-2027',
  filePath: 'data/grants/01_usda.md',
  newContent: updatedContent,
  commitMessage: 'docs(grants): finalize USDA SDGG budget'
});

console.log(\`Created PR #\${prResult.prNumber}: \${prResult.prUrl}\`);`
      }
    ]
  },
  {
    id: 'api-reference',
    title: 'Complete Library API Reference',
    category: 'api-reference',
    summary: 'Comprehensive listing of all functions, models, and type definitions exported by @tekromancy/grant_utils.',
    badge: 'API v0.1.4',
    content: `### Core Functions
- \`getKPISummary(grants: GrantRecord[], targetPipelineGoal?: number): KPISummary\`
  Computes total pipeline value, active grants count, target attainment percentage, required match funding, and upcoming deadlines (< 30 days).
- \`calculateDaysRemaining(deadlineDate: string): number\`
  Calculates integer days remaining until a deadline (negative indicates past deadline).
- \`calculateMatchFunding(amount: number, matchPercentage: number): { matchAmount: number; totalProjectValue: number }\`
  Calculates required cost-share dollar match and total combined project value.
- \`getGrantComplianceChecklist(grant: GrantRecord): ComplianceItem[]\`
  Evaluates 6 core compliance criteria (SAM.gov registration, 501(c)(3) determination, budget match ratio, letter of commitment, board sign-off, file format).
- \`splitFrontmatter(content: string): { frontmatter: string; body: string }\`
  Safely separates YAML metadata header from the Markdown narrative body.
- \`computeDiff(originalText: string, modifiedText: string): DiffLine[]\`
  Generates line-by-line structured diff objects (\`added\`, \`removed\`, \`unchanged\`).
- \`formatUnifiedDiff(filePath: string, original: string, modified: string): string\`
  Generates standard Git patch unified diff format (\`--- a/... +++ b/...\`).

### Node.js Subpath (\`@tekromancy/grant_utils/node\`)
- \`readLocalMarkdownFile(repoRoot: string, relativePath: string): string\`
- \`saveLocalMarkdownFile(repoRoot: string, relativePath: string, content: string): void\`
- \`getLocalAuthToken(): AuthTokenConfig | null\`
- \`saveLocalAuthToken(config: AuthTokenConfig): void\`
- \`clearLocalAuthToken(): void\``,
    codeSnippets: [
      {
        label: 'Node.js Subpath Import',
        language: 'typescript',
        code: `import { getAllGrants } from '@tekromancy/grant_utils';
import { readLocalMarkdownFile, saveLocalMarkdownFile } from '@tekromancy/grant_utils/node';

// Access Node filesystem utilities safely
const content = readLocalMarkdownFile(process.cwd(), 'data/grants/01_usda.md');`
      }
    ]
  }
];
