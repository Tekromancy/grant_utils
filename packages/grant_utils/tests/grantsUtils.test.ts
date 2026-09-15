import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getAllGrants, 
  getGrantById, 
  getGrantsByCategory, 
  getGrantsByTier, 
  searchGrants, 
  getKPISummary, 
  calculateDaysRemaining,
  calculateMatchFunding,
  getGrantComplianceChecklist,
  calculateTotalPipeline,
  calculateSecuredFunding,
  calculateMatchRequirements,
  calculatePipelinePacing,
  getDeadlineStatus,
  registerGrants,
  clearGrants
} from '../src/grantsUtils.js';
import type { GrantRecord } from '../src/types.js';

const SAMPLE_TEST_GRANTS: GrantRecord[] = [
  {
    id: 'federal_clean_energy_tech',
    funder: 'Department of Energy Innovation',
    program: 'Clean Energy Communities Grant',
    amount: 175000,
    amountFormatted: '$175,000',
    deadline: '2027-06-15',
    deadlineFormatted: 'June 15, 2027',
    tier: 'Tier 4 (Summer Federal)',
    category: 'Federal',
    matchPercentage: 0,
    grantType: 'Competitive Federal Grant',
    portalUrl: 'https://grants.gov',
    strategicPriority: 'Technical Assistance',
    status: 'Planned',
    fileName: 'federal_clean_energy_tech.md',
    filePath: 'data/grants/federal_clean_energy_tech.md',
    title: 'Clean Energy Communities Grant',
    summary: 'Technical assistance for community solar deployments.',
    content: '---\nid: federal_clean_energy_tech\namount: 175000\n---\n# Clean Energy Narrative',
    wordCount: 300
  },
  {
    id: 'horizon_foundation_loi',
    funder: 'Horizon Technology & Innovation Fund',
    program: 'Workforce & Open Source Robotics',
    amount: 250000,
    amountFormatted: '$250,000',
    deadline: '2026-10-31',
    deadlineFormatted: 'October 31, 2026',
    tier: 'Tier 1 (Fall Immediate)',
    category: 'National Foundation',
    matchPercentage: 0,
    grantType: 'Letter of Inquiry (LOI)',
    portalUrl: 'https://horizonfund.org',
    strategicPriority: 'Robotics Workforce',
    status: 'Drafting',
    fileName: 'horizon_foundation_loi.md',
    filePath: 'data/grants/horizon_foundation_loi.md',
    title: 'Horizon Workforce LOI',
    summary: 'Catalyzing technical education and workforce pathways.',
    content: '---\nid: horizon_foundation_loi\namount: 250000\n---\n# Horizon Narrative',
    wordCount: 250
  },
  {
    id: 'metropolis_digital_coaching',
    funder: 'Metropolis Municipal Innovation Office',
    program: 'Small Business & Tech Coaching',
    amount: 85000,
    amountFormatted: '$85,000',
    deadline: '2026-09-30',
    deadlineFormatted: 'September 30, 2026',
    tier: 'Tier 1 (Fall Immediate)',
    category: 'Municipal',
    matchPercentage: 0,
    grantType: 'Municipal Contract',
    portalUrl: 'https://metropolis.gov',
    strategicPriority: 'Coaching',
    status: 'Awarded',
    fileName: 'metropolis_digital_coaching.md',
    filePath: 'data/grants/metropolis_digital_coaching.md',
    title: 'Metropolis Tech Coaching',
    summary: 'Technical coaching contract.',
    content: '---\nid: metropolis_digital_coaching\namount: 85000\n---\n# Municipal Coaching',
    wordCount: 200
  },
  {
    id: 'evergreen_agroecology_supply_chain',
    funder: 'Federal Food & Agriculture Office',
    program: 'Local Agroecology Promotion Program',
    amount: 250000,
    amountFormatted: '$250,000',
    deadline: '2027-05-20',
    deadlineFormatted: 'May 20, 2027',
    tier: 'Tier 3 (Spring Major)',
    category: 'Federal',
    matchPercentage: 25,
    grantType: 'Federal Matching Grant',
    portalUrl: 'https://grants.gov',
    strategicPriority: 'Local Food Systems',
    status: 'Planned',
    fileName: 'evergreen_agroecology_supply_chain.md',
    filePath: 'data/grants/evergreen_agroecology_supply_chain.md',
    title: 'Agroecology Supply Chain Expansion',
    summary: 'Local food promotion and food supply chain resilience.',
    content: '---\nid: evergreen_agroecology_supply_chain\namount: 250000\n---\n# Agroecology Narrative',
    wordCount: 400
  }
];

describe('grantsUtils', () => {
  beforeEach(() => {
    clearGrants();
  });

  it('should return empty array by default when no grants are loaded', () => {
    const grants = getAllGrants();
    expect(grants).toEqual([]);
  });

  it('should support dynamic registration of grant records', () => {
    registerGrants(SAMPLE_TEST_GRANTS);
    const grants = getAllGrants();
    expect(grants.length).toBe(4);
  });

  it('should find a grant by ID or file name', () => {
    registerGrants(SAMPLE_TEST_GRANTS);
    const byId = getGrantById('federal_clean_energy_tech');
    expect(byId).toBeDefined();
    expect(byId?.program).toContain('Clean Energy Communities');
    expect(byId?.amount).toBe(175000);

    const byFileName = getGrantById('federal_clean_energy_tech.md');
    expect(byFileName).toBeDefined();
    expect(byFileName?.id).toBe('federal_clean_energy_tech');
  });

  it('should filter grants by category accurately', () => {
    registerGrants(SAMPLE_TEST_GRANTS);
    const federal = getGrantsByCategory('Federal');
    expect(federal.length).toBe(2);
    expect(federal.every(g => g.category === 'Federal')).toBe(true);

    const municipal = getGrantsByCategory('Municipal');
    expect(municipal.length).toBe(1);
    expect(municipal[0].id).toBe('metropolis_digital_coaching');
  });

  it('should filter grants by tier', () => {
    registerGrants(SAMPLE_TEST_GRANTS);
    const fallImmediate = getGrantsByTier('Fall');
    expect(fallImmediate.length).toBe(2);
    expect(fallImmediate.some(g => g.id === 'metropolis_digital_coaching')).toBe(true);
  });

  it('should search grants by keyword across title, funder, program, and category', () => {
    registerGrants(SAMPLE_TEST_GRANTS);
    const searchResult = searchGrants('horizon');
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].funder).toContain('Horizon');

    const foodSearch = searchGrants('food');
    expect(foodSearch.length).toBe(1);
    expect(foodSearch[0].id).toBe('evergreen_agroecology_supply_chain');
  });

  it('should compute KPI summary with correct pipeline math and target metrics', () => {
    registerGrants(SAMPLE_TEST_GRANTS);
    const kpis = getKPISummary();
    expect(kpis.totalGrantsCount).toBe(4);
    expect(kpis.totalPipelineAmount).toBe(175000 + 250000 + 85000 + 250000);
    expect(kpis.categoryTotals['Federal']).toBe(425000);
    expect(kpis.categoryTotals['Municipal']).toBe(85000);
  });

  it('should calculate days remaining correctly relative to a reference date', () => {
    const days = calculateDaysRemaining('2026-09-20', '2026-09-10');
    expect(days).toBe(10);

    const pastDays = calculateDaysRemaining('2026-09-01', '2026-09-10');
    expect(pastDays).toBe(-9);
  });

  it('should compute non-federal cost-share match requirements accurately', () => {
    const usdaRcdg = calculateMatchFunding(200000, 25);
    expect(usdaRcdg.matchRequired).toBe(50000);
    expect(usdaRcdg.totalProjectBudget).toBe(250000);
    expect(usdaRcdg.recommendedSources.length).toBeGreaterThan(0);

    const sbaPrime = calculateMatchFunding(150000, 50);
    expect(sbaPrime.matchRequired).toBe(75000);
    expect(sbaPrime.totalProjectBudget).toBe(225000);
  });

  it('should generate compliance checklists tailored to grant category and match rules', () => {
    registerGrants(SAMPLE_TEST_GRANTS);
    const federalGrant = getGrantById('federal_clean_energy_tech')!;
    const fedList = getGrantComplianceChecklist(federalGrant);
    expect(fedList.some(item => item.id === 'sam_gov')).toBe(true);
    expect(fedList.some(item => item.id === 'sf_424')).toBe(true);
    expect(fedList.some(item => item.id === 'tax_exempt_status')).toBe(true);

    const matchGrant = getGrantById('evergreen_agroecology_supply_chain')!;
    const matchList = getGrantComplianceChecklist(matchGrant);
    expect(matchList.some(item => item.id === 'match_letters')).toBe(true);
  });

  it('should calculate pipeline totals, secured funding, and match requirements across datasets', () => {
    registerGrants(SAMPLE_TEST_GRANTS);
    const pipeline = calculateTotalPipeline();
    expect(pipeline).toBe(760000);

    const secured = calculateSecuredFunding();
    expect(secured).toBe(85000);

    const matchReqs = calculateMatchRequirements();
    expect(matchReqs.totalMatchRequired).toBe(62500);
    expect(matchReqs.grantsRequiringMatch.length).toBe(1);

    const pacing = calculatePipelinePacing(500000, 500000);
    expect(pacing.percentageOfTarget).toBe(100);
    expect(pacing.status).toBe('exceeded');

    const pacingBelow = calculatePipelinePacing(250000, 500000);
    expect(pacingBelow.percentageOfTarget).toBe(50);
    expect(pacingBelow.status).toBe('below');
  });

  it('should compute deadline status with appropriate labels', () => {
    const statusFuture = getDeadlineStatus('2026-10-10', '2026-09-10');
    expect(statusFuture.daysRemaining).toBe(30);
    expect(statusFuture.isUpcoming).toBe(true);
    expect(statusFuture.isOverdue).toBe(false);

    const statusPast = getDeadlineStatus('2026-09-01', '2026-09-10');
    expect(statusPast.daysRemaining).toBe(-9);
    expect(statusPast.isOverdue).toBe(true);
    expect(statusPast.statusLabel).toContain('Overdue');

    const statusToday = getDeadlineStatus('2026-09-10', '2026-09-10');
    expect(statusToday.daysRemaining).toBe(0);
    expect(statusToday.statusLabel).toBe('Due today');
  });
});
