import { describe, it, expect } from 'vitest';
import {
  buildGrantsGovSearchUrl,
  buildProPublicaSearchUrl,
  buildWebResearchQueries,
  parseProPublicaOrgResponse,
  parseGrantsGovSynopsis,
  evaluateGrantFit,
  analyzeRfpText,
  convertOpportunityToGrantRecord,
  convertOpportunityToCalendarEvents,
  generateGrantResearchDossier,
  GrantResearchCatalog,
  getResearchCatalog,
  registerResearchOpportunity,
  getAllResearchOpportunities,
  clearResearchCatalog
} from '../src/grantResearchUtils.js';
import { parseGrantMarkdown } from '../src/markdownUtils.js';
import type { GrantOpportunity, ApplicantProfile } from '../src/types.js';

const MOCK_OPPORTUNITY: GrantOpportunity = {
  id: 'usda_food_insecurity_2027',
  title: 'Community Food Insecurity & Nutrition Incentive Program',
  funder: 'USDA Food and Nutrition Service',
  funderType: 'Federal',
  opportunityNumber: 'USDA-FNS-GUSNIP-2027',
  cfdaNumber: '10.551',
  programUrl: 'https://www.grants.gov/search-results-detail/123456',
  portalUrl: 'https://grants.gov',
  description: 'Funding point-of-sale produce incentives and SNAP produce matching for low-income families and community food markets.',
  fundingAmountMin: 50000,
  fundingAmountMax: 300000,
  estimatedTotalFunding: 5000000,
  expectedAwardsCount: 20,
  costSharePercentage: 25,
  deadline: '2027-04-30',
  closeDate: '2027-04-30',
  eligibleApplicantTypes: ['501(c)(3) Nonprofits', 'Cooperatives', 'Municipalities'],
  geographicRestrictions: ['United States'],
  focusAreas: ['Food Security', 'Nutrition', 'Agriculture', 'Public Health'],
  status: 'Open',
  submissionMethod: 'Grants.gov',
  source: 'grants.gov'
};

const QUALIFIED_PROFILE: ApplicantProfile = {
  name: 'Community Food Co-op Initiative',
  taxStatus: '501(c)(3)',
  mission: 'Expanding community nutrition, food security, and worker cooperative retail in underserved neighborhoods.',
  focusAreas: ['Food Security', 'Nutrition', 'Community Agriculture'],
  annualOperatingBudget: 400000,
  targetFundingMin: 100000,
  targetFundingMax: 300000,
  primaryLocation: { city: 'Austin', state: 'Texas', country: 'USA' },
  canProvideMatch: true,
  maxMatchPercentage: 30,
  yearsActive: 4,
  pastGrantExperience: true
};

const INELIGIBLE_PROFILE: ApplicantProfile = {
  name: 'Individual Researcher',
  taxStatus: 'Individual',
  mission: 'Independent food research.',
  focusAreas: ['Agriculture'],
  annualOperatingBudget: 50000,
  canProvideMatch: false
};

describe('grantResearchUtils', () => {
  describe('Query Constructors & Web Research Dorks', () => {
    it('should build a valid Grants.gov search URL', () => {
      const url = buildGrantsGovSearchUrl({ keywords: ['clean energy', 'workforce'], status: 'Open' });
      expect(url).toContain('https://www.grants.gov/search-grants');
      expect(url).toContain('clean+energy');
      expect(url).toContain('status=open');
    });

    it('should build a valid ProPublica search URL', () => {
      const url = buildProPublicaSearchUrl('Horizon Foundation', 'TX');
      expect(url).toContain('https://projects.propublica.org/nonprofits/api/v2/search.json');
      expect(url).toContain('q=Horizon+Foundation');
      expect(url).toContain('state%5Bid%5D=TX');
    });

    it('should generate targeted search queries across multiple discovery angles', () => {
      const dorks = buildWebResearchQueries('youth robotics', 'nonprofit', 'California');
      expect(dorks.length).toBeGreaterThanOrEqual(6);
      expect(dorks.some(d => d.includes('Notice of Funding Opportunity'))).toBe(true);
      expect(dorks.some(d => d.includes('site:.gov'))).toBe(true);
      expect(dorks.some(d => d.includes('Form 990-PF'))).toBe(true);
      expect(dorks.some(d => d.includes('"California"'))).toBe(true);
    });
  });

  describe('Funder & Opportunity Parsers', () => {
    it('should parse raw ProPublica 990 organization responses', () => {
      const raw = {
        name: 'Horizon Technology and Innovation Foundation',
        ein: 999999999,
        subsection_code: 3,
        city: 'Austin',
        state: 'TX',
        assets: 1800000000,
        totrevenue: 95000000,
        ntee_code: 'T'
      };

      const parsed = parseProPublicaOrgResponse(raw);
      expect(parsed.name).toBe('Horizon Technology and Innovation Foundation');
      expect(parsed.ein).toBe('999999999');
      expect(parsed.type).toBe('Public Charity');
      expect(parsed.city).toBe('Austin');
      expect(parsed.state).toBe('TX');
      expect(parsed.totalAssets).toBe(1800000000);
      expect(parsed.sourceUrl).toContain('999999999');
    });

    it('should parse raw Grants.gov synopsis responses', () => {
      const raw = {
        opportunityId: '345678',
        opportunityNumber: 'HHS-2027-CED-01',
        opportunityTitle: 'Community Economic Development Projects',
        agencyName: 'Department of Health and Human Services',
        awardCeiling: '800000',
        awardFloor: '200000',
        closeDate: '2027-06-25T23:59:59',
        costSharingOrMatchingRequirement: 'No',
        eligibleApplicants: ['Nonprofits having a 501(c)(3) status'],
        synopsisDesc: 'CED grants fund community development corporations to create commercial business and jobs.'
      };

      const parsed = parseGrantsGovSynopsis(raw);
      expect(parsed.id).toBe('345678');
      expect(parsed.title).toBe('Community Economic Development Projects');
      expect(parsed.funder).toBe('Department of Health and Human Services');
      expect(parsed.fundingAmountMax).toBe(800000);
      expect(parsed.fundingAmountMin).toBe(200000);
      expect(parsed.deadline).toBe('2027-06-25');
      expect(parsed.costSharePercentage).toBe(0);
      expect(parsed.submissionMethod).toBe('Grants.gov');
    });
  });

  describe('Fit & Eligibility Assessment Engine', () => {
    it('should assess a highly qualified applicant as Strong Pursue with high score', () => {
      const assessment = evaluateGrantFit(MOCK_OPPORTUNITY, QUALIFIED_PROFILE);
      expect(assessment.overallScore).toBeGreaterThanOrEqual(80);
      expect(assessment.fitGrade).toMatch(/A\+?|A/);
      expect(assessment.recommendation).toBe('Strong Pursue');
      expect(assessment.eligibilityCheck.isEligible).toBe(true);
      expect(assessment.strengths.length).toBeGreaterThan(0);
      expect(assessment.dimensionScores.missionAlignment).toBeGreaterThanOrEqual(80);
      expect(assessment.dimensionScores.matchFeasibility).toBeGreaterThanOrEqual(80);
    });

    it('should correctly flag an ineligible applicant', () => {
      const assessment = evaluateGrantFit(MOCK_OPPORTUNITY, INELIGIBLE_PROFILE);
      expect(assessment.eligibilityCheck.isEligible).toBe(false);
      expect(assessment.recommendation).toBe('Ineligible');
      expect(assessment.redFlags.some(r => r.includes('Eligibility concern'))).toBe(true);
    });

    it('should flag match shortfall if applicant cannot provide required cost share', () => {
      const noMatchProfile: ApplicantProfile = {
        ...QUALIFIED_PROFILE,
        canProvideMatch: false
      };
      const assessment = evaluateGrantFit(MOCK_OPPORTUNITY, noMatchProfile);
      expect(assessment.dimensionScores.matchFeasibility).toBeLessThan(50);
      expect(assessment.redFlags.some(r => r.includes('match'))).toBe(true);
    });
  });

  describe('RFP / NOFO Deconstruction & Text Analyzer', () => {
    it('should extract amounts, match requirements, deadlines, attachments, and scoring rubrics from raw text', () => {
      const rfp = `
Notice of Funding Opportunity: USDA Local Food Promotion Program
Awarding Agency: USDA Agricultural Marketing Service
Total Program Funding: $15,000,000
Award Ceiling: $250,000
Award Floor: $50,000
Cost-Sharing Requirement: 25% non-federal match required.
Application Due Date: May 20, 2027 at 11:59 PM ET
Submission Portal: Grants.gov Workspace

Mandatory Forms:
- SF-424 Application for Federal Assistance
- SF-424A Budget Information
- Project Narrative (15 pages max)
- Resumes of Key Personnel

Scoring Criteria:
Section 1: Statement of Need (20 points)
Section 2: Work Plan and Timeline (35 points)
Section 3: Organizational Capacity (25 points)
Section 4: Budget Justification (20 points)
`;

      const analysis = analyzeRfpText(rfp);
      expect(analysis.agencyOrFunder).toContain('USDA Agricultural Marketing Service');
      expect(analysis.fundingOverview.totalProgramFunding).toBe(15000000);
      expect(analysis.fundingOverview.awardCeiling).toBe(250000);
      expect(analysis.fundingOverview.awardFloor).toBe(50000);
      expect(analysis.fundingOverview.matchRequiredPercent).toBe(25);
      expect(analysis.criticalDeadlines[0].date).toContain('May 20, 2027');
      expect(analysis.submissionRequirements.portal).toContain('Grants.gov');
      expect(analysis.requiredAttachments.some(a => a.name.includes('SF-424'))).toBe(true);
      expect(analysis.scoringRubric.length).toBeGreaterThanOrEqual(4);
      expect(analysis.scoringRubric.reduce((s, r) => s + r.maxPoints, 0)).toBe(100);
    });
  });

  describe('Dossier Generation & Conversion', () => {
    it('should generate a markdown dossier with valid frontmatter that roundtrips through parseGrantMarkdown', () => {
      const assessment = evaluateGrantFit(MOCK_OPPORTUNITY, QUALIFIED_PROFILE);
      const dossier = generateGrantResearchDossier(MOCK_OPPORTUNITY, assessment);

      expect(dossier).toContain('---');
      expect(dossier).toContain('funder: "USDA Food and Nutrition Service"');
      expect(dossier).toContain('fitScore:');

      const parsed = parseGrantMarkdown(dossier);
      expect(parsed.metadata.id).toBe('usda_food_insecurity_2027');
      expect(parsed.metadata.funder).toBe('USDA Food and Nutrition Service');
      expect(parsed.metadata.amount).toBe(300000);
      expect(parsed.content).toContain('# Grant Opportunity Research Dossier');
    });

    it('should convert opportunity to typed GrantRecord', () => {
      const record = convertOpportunityToGrantRecord(MOCK_OPPORTUNITY);
      expect(record.id).toBe('usda_food_insecurity_2027');
      expect(record.amount).toBe(300000);
      expect(record.amountFormatted).toBe('$300,000');
      expect(record.deadline).toBe('2027-04-30');
      expect(record.tier).toBe('Tier 3 (Spring Major)');
      expect(record.matchPercentage).toBe(25);
    });

    it('should convert opportunity into milestone calendar events with 24-hour buffer', () => {
      const events = convertOpportunityToCalendarEvents(MOCK_OPPORTUNITY);
      expect(events.length).toBeGreaterThanOrEqual(4);
      
      const deadlineEvt = events.find(e => e.categories.includes('DEADLINE'));
      expect(deadlineEvt).toBeDefined();
      expect(deadlineEvt?.startDate).toBe('2027-04-30');

      const submitEvt = events.find(e => e.categories.includes('SUBMISSION'));
      expect(submitEvt).toBeDefined();
      expect(submitEvt?.startDate).toBe('2027-04-29'); // T-1 day
    });
  });

  describe('GrantResearchCatalog', () => {
    it('should manage opportunities, support filtering, and export to GrantRecords and CalendarEvents', () => {
      const catalog = new GrantResearchCatalog();
      catalog.add(MOCK_OPPORTUNITY);
      expect(catalog.getAll().length).toBe(1);

      const found = catalog.getById('usda_food_insecurity_2027');
      expect(found).toBeDefined();

      const filtered = catalog.filter({ keywords: ['Nutrition'], minAmount: 100000 });
      expect(filtered.length).toBe(1);

      const records = catalog.toGrantRecords(QUALIFIED_PROFILE);
      expect(records.length).toBe(1);
      expect(records[0].amount).toBe(300000);

      const events = catalog.toCalendarEvents();
      expect(events.length).toBeGreaterThanOrEqual(4);

      catalog.clear();
      expect(catalog.getAll().length).toBe(0);
    });

    it('should support singleton catalog operations', () => {
      clearResearchCatalog();
      expect(getAllResearchOpportunities().length).toBe(0);

      registerResearchOpportunity(MOCK_OPPORTUNITY);
      expect(getAllResearchOpportunities().length).toBe(1);
      expect(getResearchCatalog().getById('usda_food_insecurity_2027')).toBeDefined();

      clearResearchCatalog();
      expect(getAllResearchOpportunities().length).toBe(0);
    });
  });
});
