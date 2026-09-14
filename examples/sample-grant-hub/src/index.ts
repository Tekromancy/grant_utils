import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseIcsContent,
  getKPISummary,
  calculateDaysRemaining,
  calculateMatchFunding,
  getGrantComplianceChecklist,
  computeDiff,
  formatUnifiedDiff,
  suggestBranchName,
  generatePrTemplate,
  splitFrontmatter,
  registerProject,
  getProjectConfig,
  type ProjectConfig,
  type GrantRecord
} from '@grantwriting/grant_utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hubRoot = path.resolve(__dirname, '..');

console.log('===============================================================');
console.log('  🌟 Sample Grant Hub: Powered by @grantwriting/grant_utils');
console.log('===============================================================\n');

// 1. Organization & Project Registration
const sampleProjectConfig: ProjectConfig = {
  id: 'sample-coop-hub',
  name: 'Community Resilience & Enterprise Hub',
  shortName: 'CREH',
  tagline: 'Grassroots wealth-building, clean energy, and cooperative governance',
  taxStatus: '501(c)(3)',
  dataDir: 'data',
  grantsSubdir: 'grants',
  calendarPath: 'calendar.ics',
  financialTargets: {
    targetYear: 2027,
    confirmedRevenue: 120000,
    bareMinimum: 350000,
    steadyState: 600000,
    stretch: 1000000
  },
  categories: ['Federal', 'Regional Foundation', 'Corporate Giving'],
  tiers: ['Immediate Fall Federal', 'Core Winter Regional', 'Major Spring Federal'],
  gitConfig: {
    owner: 'CommunityResilienceHub',
    repo: 'grantwriting-hub',
    defaultBranch: 'main',
    provider: 'github'
  }
};

registerProject(sampleProjectConfig);
const activeProject = getProjectConfig('sample-coop-hub');
console.log(`[1] Registered Project: ${activeProject?.name} (${activeProject?.shortName})`);
console.log(`    Tax Status: ${activeProject?.taxStatus} | Target Year: ${activeProject?.financialTargets?.targetYear}`);
console.log(`    Targets: Bare Minimum: $${activeProject?.financialTargets?.bareMinimum.toLocaleString()} | Steady State: $${activeProject?.financialTargets?.steadyState.toLocaleString()}\n`);

// 2. Parse RFC 5545 Calendar Feed
const calendarFile = path.join(hubRoot, 'calendar.ics');
const rawIcs = fs.readFileSync(calendarFile, 'utf8');
const events = parseIcsContent(rawIcs);

console.log(`[2] Calendar Engine: Parsed ${events.length} upcoming deadlines from calendar.ics:`);
events.forEach(evt => {
  const daysLeft = calculateDaysRemaining(evt.startDate, '2026-09-15');
  const urgency = daysLeft < 30 ? '🔥 URGENT' : '⏳ PLANNED';
  console.log(`    • [${evt.startDate}] (${daysLeft} days remaining - ${urgency}): ${evt.title}`);
});
console.log('');

// 3. Mock Grants Dataset for Demo
const sampleGrants: GrantRecord[] = [
  {
    id: 'coop_revolving_loan_fund',
    title: 'Cooperative Capitalization & Revolving Debt Pool',
    funder: 'U.S. Economic Development Administration (EDA)',
    program: 'Build to Scale Venture Challenge',
    amount: 300000,
    amountFormatted: '$300,000',
    deadline: '2027-04-15',
    deadlineFormatted: 'April 15, 2027',
    tier: 'Major Spring Federal',
    category: 'Federal',
    matchPercentage: 50,
    grantType: 'Competitive Federal Challenge',
    portalUrl: 'https://grants.gov',
    strategicPriority: 'Revolving Loan Capital',
    status: 'Drafting',
    fileName: '01_coop_revolving_loan_fund.md',
    filePath: 'data/grants/01_coop_revolving_loan_fund.md',
    summary: 'Revolving debt pool for worker-owned cooperatives.',
    content: '# Narrative Content',
    wordCount: 350
  },
  {
    id: 'community_solar_infrastructure',
    title: 'Community Solar & Resilient Microgrid Infrastructure',
    funder: 'U.S. Environmental Protection Agency (EPA)',
    program: 'Solar for All',
    amount: 250000,
    amountFormatted: '$250,000',
    deadline: '2026-11-30',
    deadlineFormatted: 'November 30, 2026',
    tier: 'Immediate Fall Federal',
    category: 'Federal',
    matchPercentage: 0,
    grantType: 'Federal Environmental Grant',
    portalUrl: 'https://grants.gov',
    strategicPriority: 'Clean Energy Transition',
    status: 'Planned',
    fileName: '02_community_solar_infrastructure.md',
    filePath: 'data/grants/02_community_solar_infrastructure.md',
    summary: 'Rooftop photovoltaic arrays on community facilities.',
    content: '# Narrative Content',
    wordCount: 280
  },
  {
    id: 'workforce_leadership_academy',
    title: 'Bilingual Worker-Owner Leadership Academy',
    funder: 'Regional Community Foundation',
    program: 'Economic Mobility & Workforce Equity',
    amount: 200000,
    amountFormatted: '$200,000',
    deadline: '2027-01-15',
    deadlineFormatted: 'January 15, 2027',
    tier: 'Core Winter Regional',
    category: 'Regional Foundation',
    matchPercentage: 0,
    grantType: 'Programmatic Foundation Grant',
    portalUrl: 'https://example-foundation.org',
    strategicPriority: 'Bilingual Governance',
    status: 'Ready to Submit',
    fileName: '03_workforce_leadership_academy.md',
    filePath: 'data/grants/03_workforce_leadership_academy.md',
    summary: 'Cooperative leadership curriculum for 50 frontline workers.',
    content: '# Narrative Content',
    wordCount: 420
  }
];

// 4. Financial KPI Summary
const kpiSummary = getKPISummary(sampleProjectConfig, sampleGrants);
console.log('[3] Financial KPI Analytics:');
console.log(`    • Total Pipeline: $${kpiSummary.totalPipelineAmount.toLocaleString()} (${kpiSummary.totalGrantsCount} proposals)`);
console.log(`    • Target Year: ${kpiSummary.targetYear}`);
console.log(`    • Pipeline Progress vs. Steady State ($${kpiSummary.steadyStateTarget?.toLocaleString()}): ${Math.round((kpiSummary.totalPipelineAmount / (kpiSummary.steadyStateTarget || 1)) * 100)}%`);
console.log('    • Category Breakdown:', kpiSummary.categoryTotals);
console.log('');

// 5. Statutory Match Funding Calculator
const edaGrant = sampleGrants[0];
const matchResult = calculateMatchFunding(edaGrant.amount, edaGrant.matchPercentage);
console.log(`[4] Statutory Match Funding Engine for "${edaGrant.title}":`);
console.log(`    • Grant Request Amount: $${edaGrant.amount.toLocaleString()} (${edaGrant.matchPercentage}% statutory match)`);
console.log(`    • Non-Federal Match Required: $${matchResult.matchRequired.toLocaleString()}`);
console.log(`    • Total Project Budget: $${matchResult.totalProjectBudget.toLocaleString()}`);
console.log(`    • Recommended Cash/In-Kind Match Sources: ${matchResult.recommendedSources.length} matched`);
console.log('');

// 6. Compliance Checklist Engine
const complianceChecklist = getGrantComplianceChecklist(edaGrant);
console.log(`[5] Pre-Submission Compliance Checklist for "${edaGrant.title}":`);
complianceChecklist.forEach(item => {
  const req = item.required ? '[REQUIRED]' : '[OPTIONAL]';
  console.log(`    ☑ ${req} (${item.category}): ${item.label}`);
});
console.log('');

// 7. Visual Diff Engine
const originalProposal = `# Project Summary\nRequested funding: $250,000.\nScope of work: Initial pilot in Austin.`;
const updatedProposal = `# Project Summary\nRequested funding: $300,000.\nScope of work: Scaled deployment across Central Texas.\nMatching funds: 50% non-federal cash.`;

const diffResult = computeDiff(originalProposal, updatedProposal);
const unifiedDiff = formatUnifiedDiff(diffResult, 'data/grants/01_coop_revolving_loan_fund.md');
console.log('[6] Visual Diff Engine (Unified Red/Green Diff Output):');
console.log(unifiedDiff);
console.log('');

// 8. Automated Git Collaboration & PR Generator
const suggestedBranch = suggestBranchName('data/grants/01_coop_revolving_loan_fund.md', 'dev');
const prTemplate = generatePrTemplate(
  'Update EDA Build to Scale Budget and Match Sources',
  'Aligns capital pool request with revised $300k underwriting guidelines.',
  ['data/grants/01_coop_revolving_loan_fund.md']
);
console.log('[7] Git Collaboration Engine:');
console.log(`    • Suggested Branch Name: ${suggestedBranch}`);
console.log(`    • Target Repository: ${activeProject?.gitConfig?.owner}/${activeProject?.gitConfig?.repo} (${activeProject?.gitConfig?.provider})`);
console.log(`    • Generated PR Title: ${prTemplate.title}\n`);

console.log('===============================================================');
console.log('✅ Demonstration completed successfully with @grantwriting/grant_utils!');
console.log('===============================================================');
