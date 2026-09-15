import { describe, it, expect } from 'vitest';
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
  getDeadlineStatus
} from '../src/grantsUtils.js';

describe('grantsUtils', () => {
  it('should return all grant records across projects', () => {
    const grants = getAllGrants();
    expect(grants.length).toBe(40);

    const acbfGrants = getAllGrants('acbf');
    expect(acbfGrants.length).toBe(27);

    const vamosGrants = getAllGrants('vamos');
    expect(vamosGrants.length).toBe(13);
  });

  it('should find a grant by ID or file name', () => {
    const byId = getGrantById('usda_sdgg_ta');
    expect(byId).toBeDefined();
    expect(byId?.program).toContain('Socially Disadvantaged Groups');
    expect(byId?.amount).toBe(175000);

    const byFileName = getGrantById('usda_sdgg_ta.md');
    expect(byFileName).toBeDefined();
    expect(byFileName?.id).toBe('usda_sdgg_ta');
  });

  it('should filter grants by category accurately', () => {
    const federal = getGrantsByCategory('Federal');
    expect(federal.length).toBeGreaterThan(0);
    expect(federal.every(g => g.category === 'Federal')).toBe(true);

    const regional = getGrantsByCategory('Regional Foundation');
    expect(regional.length).toBeGreaterThan(0);
    expect(regional.every(g => g.category === 'Regional Foundation')).toBe(true);
  });

  it('should filter grants by tier', () => {
    const fallImmediate = getGrantsByTier('Fall');
    expect(fallImmediate.length).toBeGreaterThan(0);
    expect(fallImmediate.some(g => g.id === 'austin_edd_coop_coaching')).toBe(true);
  });

  it('should search grants by keyword across title, funder, program, and category', () => {
    const searchResult = searchGrants('kellogg');
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].funder).toContain('Kellogg');

    const foodSearch = searchGrants('food');
    expect(foodSearch.length).toBeGreaterThan(0);
  });

  it('should compute KPI summary with correct pipeline math and target metrics', () => {
    const kpis = getKPISummary();
    expect(kpis.totalGrantsCount).toBe(27);
    expect(kpis.totalPipelineAmount).toBeGreaterThan(3500000);
    expect(kpis.confirmedRevenue2027).toBe(65000);
    expect(kpis.bareMinimumTarget2027).toBe(300000);
    expect(kpis.steadyStateTarget2027).toBe(500000);
    expect(kpis.stretchTarget2027).toBe(700000);
    expect(kpis.categoryTotals['Federal']).toBeGreaterThan(2000000);
  });

  it('should calculate days remaining correctly relative to a reference date', () => {
    const days = calculateDaysRemaining('2026-09-20', '2026-09-10');
    expect(days).toBe(10);

    const pastDays = calculateDaysRemaining('2026-09-01', '2026-09-10');
    expect(pastDays).toBe(-9);
  });

  it('should verify single-source-of-truth frontmatter integrity across all grants', () => {
    const grants = getAllGrants();
    expect(grants.length).toBe(40);
    for (const g of grants) {
      expect(g.id).toBeTruthy();
      expect(g.funder).toBeTruthy();
      expect(g.program).toBeTruthy();
      expect(g.amount).toBeGreaterThan(0);
      expect(g.amountFormatted).toContain('$');
      expect(g.deadline).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(g.filePath).toMatch(/^(?:data\/)?(?:acbf|vamos|example)\/grants\/.+\.md$/);
      expect(g.content).toContain('---');
    }
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

  it('should generate compliance checklists tailored to grant category and specific funder rules', () => {
    const federalGrant = getGrantById('usda_sdgg_ta')!;
    const fedList = getGrantComplianceChecklist(federalGrant);
    expect(fedList.some(item => item.id === 'sam_gov')).toBe(true);
    expect(fedList.some(item => item.id === 'sf_424')).toBe(true);

    const cchdGrant = getGrantById('cchd_economic_development')!;
    const cchdList = getGrantComplianceChecklist(cchdGrant);
    expect(cchdList.some(item => item.id === 'cchd_low_income')).toBe(true);

    const matchGrant = getGrantById('usda_lfpp_supply_chain')!;
    const matchList = getGrantComplianceChecklist(matchGrant);
    expect(matchList.some(item => item.id === 'match_letters')).toBe(true);
  });

  it('should calculate pipeline totals, secured funding, and match requirements across datasets', () => {
    const pipeline = calculateTotalPipeline();
    expect(pipeline).toBeGreaterThan(0);

    const matchReqs = calculateMatchRequirements();
    expect(matchReqs.totalMatchRequired).toBeGreaterThan(0);
    expect(matchReqs.grantsRequiringMatch.length).toBeGreaterThan(0);

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
