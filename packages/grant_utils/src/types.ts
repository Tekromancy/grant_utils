export type GrantTier = 
  | 'Tier 1 (Fall Immediate)'
  | 'Tier 2 (Winter Core)'
  | 'Tier 3 (Spring Major)'
  | 'Tier 4 (Summer Major)'
  | 'Tier 4 (Summer Federal)'
  | 'Rolling'
  | (string & {});

export type GrantCategory = 
  | 'Federal'
  | 'Regional Foundation'
  | 'National Foundation'
  | 'Municipal'
  | 'Corporate/CRA'
  | 'Movement/CDF'
  | (string & {});

export interface GrantRecord {
  id: string;
  funder: string;
  program: string;
  amount: number;
  amountFormatted: string;
  deadline: string;
  deadlineFormatted: string;
  tier: GrantTier;
  category: GrantCategory;
  matchPercentage: number;
  grantType: string;
  portalUrl: string;
  strategicPriority: string;
  status: string;
  fileName: string;
  filePath: string;
  title: string;
  summary: string;
  content: string;
  wordCount: number;
}

export interface CalendarAlarm {
  trigger: string;
  description: string;
}

export interface CalendarEvent {
  uid: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD or ISO
  endDate: string;   // YYYY-MM-DD or ISO
  location: string;
  categories: string[];
  status: string;
  alarms: CalendarAlarm[];
  grantFile?: string;
  amount?: number;
}

export interface MarkdownDoc {
  id: string;
  fileName: string;
  relativePath: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  lineCount: number;
  wordCount: number;
  frontmatter?: Record<string, any>;
}

export interface AuthTokenConfig {
  provider: 'github' | 'gitlab' | 'codeberg' | 'forgejo';
  token: string;
  instanceUrl?: string; // default https://codeberg.org for codeberg/forgejo
  username?: string;
  name?: string;
  avatarUrl?: string;
  scopes?: string[];
  createdAt: string;
  isValid: boolean;
}

export interface PRFileChange {
  path: string; // relative to repo root, e.g. "acbf/CallToAction.md"
  content: string;
}

export interface PullRequestPayload {
  provider: 'github' | 'gitlab' | 'codeberg' | 'forgejo';
  token: string;
  instanceUrl?: string; // for Codeberg/Forgejo or self-hosted Git
  owner: string;      // e.g. "AustinCooperativeBusinessFoundation"
  repo: string;       // e.g. "grantwriting"
  branchName: string; // e.g. "update-impact-austin-grant"
  baseBranch?: string;// default "main"
  title: string;
  body: string;
  files: PRFileChange[];
  gitlabProjectId?: string | number; // optional for GitLab
  gitlabBaseUrl?: string;            // default "https://gitlab.com"
}

export interface PRResult {
  success: boolean;
  url?: string;
  number?: number | string;
  branch?: string;
  error?: string;
}

export interface FinancialTargets {
  targetYear: number;
  bareMinimum: number;
  steadyState: number;
  stretch: number;
  confirmedRevenue: number;
}

export interface ProjectGitConfig {
  owner: string;
  repo: string;
  defaultBranch: string;
  provider: 'github' | 'gitlab' | 'codeberg' | 'forgejo';
  instanceUrl?: string;
}

export interface ProjectConfig {
  id: string; // e.g. 'acbf', 'vamos'
  name: string; // e.g. 'Austin Cooperative Business Foundation'
  shortName: string; // e.g. 'ACBF'
  tagline: string;
  taxStatus?: string; // e.g. '501(c)(3)'
  dataDir: string; // relative to repo root, e.g. 'data/acbf'
  grantsSubdir?: string; // e.g. 'grants'
  calendarPath?: string; // e.g. 'calendar.ics' or 'data/vamos/calendar.ics'
  financialTargets?: FinancialTargets;
  categories?: string[];
  tiers?: string[];
  gitConfig?: ProjectGitConfig;
  customChecklist?: Array<{ id: string; label: string; required: boolean; category: string; description: string }>;
}

export interface KPISummary {
  totalPipelineAmount: number;
  totalGrantsCount: number;
  // Dynamic targets
  targetYear?: number;
  confirmedRevenue?: number;
  bareMinimumTarget?: number;
  steadyStateTarget?: number;
  stretchTarget?: number;
  // Backwards compatibility aliases for ACBF 2027
  confirmedRevenue2027: number;
  bareMinimumTarget2027: number;
  steadyStateTarget2027: number;
  stretchTarget2027: number;
  categoryTotals: Record<string, number>;
  tierTotals: Record<string, number>;
}

export type ThemeId = 'obsidian-oled' | 'obsidian-vampire' | 'slate' | 'coop-forest' | 'light';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  badge: string;
  description: string;
  background: string;
  foreground: string;
  accent: string;
  border: string;
  cardBg: string;
}

export const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: 'obsidian-oled',
    name: 'Obsidian OLED',
    badge: 'OLED #000000',
    description: 'Pure pitch black (#000000) & super white (#FFFFFF) for infinite OLED depth',
    background: '#000000',
    foreground: '#FFFFFF',
    accent: '#FFFFFF',
    border: '#2C2C2C',
    cardBg: '#000000',
  },
  {
    id: 'obsidian-vampire',
    name: 'Obsidian Vampire',
    badge: 'Blood #882233',
    description: 'Pitch black (#000000) with deep blood-crimson (#882233) vampire foreground',
    background: '#000000',
    foreground: '#882233',
    accent: '#AA3344',
    border: '#551122',
    cardBg: '#000000',
  },
  {
    id: 'slate',
    name: 'Default Slate',
    badge: 'Navy Slate',
    description: 'Deep navy-slate (#0F172A) with emerald green highlights',
    background: '#0F172A',
    foreground: '#F8FAFC',
    accent: '#10B981',
    border: '#1E293B',
    cardBg: '#0F172A',
  },
  {
    id: 'coop-forest',
    name: 'Cooperative Forest',
    badge: 'Forest Green',
    description: 'Movement deep forest green (#052E16) with emerald accents',
    background: '#052E16',
    foreground: '#ECFDF5',
    accent: '#34D399',
    border: '#064E3B',
    cardBg: '#064E3B',
  },
  {
    id: 'light',
    name: 'Clean Light',
    badge: 'Paper Daylight',
    description: 'High-contrast clean paper daylight theme',
    background: '#F8FAFC',
    foreground: '#0F172A',
    accent: '#059669',
    border: '#E2E8F0',
    cardBg: '#FFFFFF',
  },
];

// ============================================================================
// GRANT RESEARCH & DISCOVERY TYPES
// ============================================================================

export type FunderType = 
  | 'Federal'
  | 'State'
  | 'Municipal'
  | 'Private Foundation'
  | 'Corporate'
  | 'Community Foundation'
  | 'Family Foundation'
  | 'International'
  | 'Movement/CDF'
  | (string & {});

export type GrantOpportunityStatus = 
  | 'Forecasted'
  | 'Open'
  | 'Under Review'
  | 'Closed'
  | 'Rolling';

export interface GrantOpportunity {
  id: string;
  title: string;
  funder: string;
  funderType: FunderType;
  opportunityNumber?: string;
  cfdaNumber?: string;
  programUrl?: string;
  portalUrl?: string;
  description: string;
  fundingAmountMin?: number;
  fundingAmountMax?: number;
  estimatedTotalFunding?: number;
  expectedAwardsCount?: number;
  costSharePercentage?: number;
  deadline?: string; // YYYY-MM-DD or ISO or 'Rolling'
  closeDate?: string;
  postDate?: string;
  isForecast?: boolean;
  eligibleApplicantTypes: string[];
  geographicRestrictions?: string[];
  focusAreas: string[];
  status: GrantOpportunityStatus;
  submissionMethod?: 'Grants.gov' | 'ProposalCentral' | 'Fluxx' | 'Submittable' | 'Email' | 'Online Portal' | 'Mail' | (string & {});
  source?: 'grants.gov' | 'propublica' | 'sam.gov' | 'manual' | 'web-research' | (string & {});
  rawSourceData?: any;
}

export interface ApplicantProfile {
  name: string;
  taxStatus: 
    | '501(c)(3)' 
    | '501(c)(4)' 
    | '501(c)(6)' 
    | 'Cooperative' 
    | 'Small Business / For-Profit' 
    | 'Higher Education' 
    | 'Municipality' 
    | 'Tribal Nation' 
    | 'Individual' 
    | (string & {});
  ein?: string;
  uei?: string;
  mission: string;
  focusAreas: string[];
  annualOperatingBudget?: number;
  targetFundingMin?: number;
  targetFundingMax?: number;
  primaryLocation?: {
    city?: string;
    state?: string;
    country?: string;
    isRural?: boolean;
    opportunityZone?: boolean;
  };
  canProvideMatch: boolean;
  maxMatchPercentage?: number;
  yearsActive?: number;
  pastGrantExperience?: boolean;
}

export interface GrantFitDimensionScores {
  missionAlignment: number; // 0-100
  eligibility: number;      // 0-100
  fundingFit: number;       // 0-100
  matchFeasibility: number; // 0-100
  competitiveness: number;  // 0-100
}

export interface GrantFitAssessment {
  overallScore: number;     // 0-100
  fitGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  recommendation: 'Strong Pursue' | 'Moderate Match' | 'Conditional Match' | 'High Risk / Long Shot' | 'Ineligible';
  eligibilityCheck: {
    isEligible: boolean;
    passCriteria: string[];
    failCriteria: string[];
  };
  dimensionScores: GrantFitDimensionScores;
  strengths: string[];
  redFlags: string[];
  suggestedActionItems: string[];
}

export interface FunderProfile {
  name: string;
  ein?: string;
  type?: 'Private Foundation' | 'Public Charity' | 'Corporate Foundation' | 'Community Foundation' | 'Federal Agency' | (string & {});
  city?: string;
  state?: string;
  totalAssets?: number;
  annualGiving?: number;
  grantRange?: { min: number; max: number; median: number };
  topFocusAreas?: string[];
  topRecipients?: Array<{ name: string; amount: number; purpose?: string }>;
  officersAndTrustees?: string[];
  sourceUrl?: string;
  filingYearsAvailable?: number[];
}

export interface RfpAnalysis {
  title: string;
  agencyOrFunder: string;
  keyObjectives: string[];
  eligibilitySummary: string;
  fundingOverview: {
    totalProgramFunding?: number;
    awardFloor?: number;
    awardCeiling?: number;
    matchRequiredPercent?: number;
    expectedAwards?: number;
  };
  criticalDeadlines: Array<{
    milestone: string;
    date: string;
    time?: string;
    timezone?: string;
  }>;
  requiredAttachments: Array<{
    name: string;
    description: string;
    mandatory: boolean;
  }>;
  scoringRubric: Array<{
    section: string;
    maxPoints: number;
    criteria: string;
  }>;
  submissionRequirements: {
    portal: string;
    formatInstructions: string;
    pageLimits?: string;
  };
  strategicAdvice: string[];
}

export interface ResearchQuery {
  keywords: string[];
  applicantType?: string;
  funderType?: string;
  state?: string;
  minAmount?: number;
  maxAmount?: number;
  requiresMatch?: boolean;
  status?: 'Open' | 'Forecasted' | 'Closed' | 'All';
  limit?: number;
}

export interface GrantResearchDossierOptions {
  targetTier?: GrantTier;
  assignedLead?: string;
  applicantName?: string;
  notes?: string;
}

