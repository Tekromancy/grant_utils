import type { GrantRecord, GrantCategory, KPISummary, ProjectConfig } from './types.js';
import { GRANTS_DATA, TOTAL_PIPELINE_AMOUNT, TOTAL_GRANTS_COUNT } from './data/generatedGrants.js';
import { getProjectConfig, getDefaultProject, filterGrantsByProject } from './projectUtils.js';

export function getAllGrants(projectId?: string): GrantRecord[] {
  if (projectId) {
    return filterGrantsByProject(GRANTS_DATA, projectId);
  }
  return [...GRANTS_DATA];
}

export function getGrantById(id: string): GrantRecord | undefined {
  return GRANTS_DATA.find(g => g.id === id || g.fileName === id || g.fileName === `${id}.md`);
}

export function getGrantsByCategory(category: GrantCategory): GrantRecord[] {
  return GRANTS_DATA.filter(g => g.category === category);
}

export function getGrantsByTier(tier: string): GrantRecord[] {
  return GRANTS_DATA.filter(g => g.tier.toLowerCase().includes(tier.toLowerCase()));
}

export function searchGrants(query: string): GrantRecord[] {
  if (!query || !query.trim()) return getAllGrants();
  const q = query.toLowerCase();
  return GRANTS_DATA.filter(g => 
    g.title.toLowerCase().includes(q) ||
    g.funder.toLowerCase().includes(q) ||
    g.program.toLowerCase().includes(q) ||
    g.category.toLowerCase().includes(q) ||
    g.strategicPriority.toLowerCase().includes(q) ||
    g.summary.toLowerCase().includes(q)
  );
}

export function getKPISummary(project?: string | ProjectConfig, customGrants?: GrantRecord[]): KPISummary {
  let config: ProjectConfig | undefined;
  if (typeof project === 'string') {
    config = getProjectConfig(project);
  } else if (project) {
    config = project;
  }
  
  if (!config) {
    config = getDefaultProject();
  }

  const grants = customGrants || (config.id ? filterGrantsByProject(GRANTS_DATA, config.id) : GRANTS_DATA);
  const effectiveGrants = grants.length > 0 ? grants : GRANTS_DATA;

  const categoryTotals: Record<string, number> = {};
  const tierTotals: Record<string, number> = {};

  let totalPipeline = 0;
  for (const grant of effectiveGrants) {
    totalPipeline += grant.amount;
    categoryTotals[grant.category] = (categoryTotals[grant.category] || 0) + grant.amount;
    tierTotals[grant.tier] = (tierTotals[grant.tier] || 0) + grant.amount;
  }

  const targets = config.financialTargets || {
    targetYear: 2027,
    confirmedRevenue: 65000,
    bareMinimum: 300000,
    steadyState: 500000,
    stretch: 700000
  };

  return {
    totalPipelineAmount: totalPipeline > 0 ? totalPipeline : TOTAL_PIPELINE_AMOUNT,
    totalGrantsCount: effectiveGrants.length,
    targetYear: targets.targetYear,
    confirmedRevenue: targets.confirmedRevenue,
    bareMinimumTarget: targets.bareMinimum,
    steadyStateTarget: targets.steadyState,
    stretchTarget: targets.stretch,
    confirmedRevenue2027: targets.confirmedRevenue,
    bareMinimumTarget2027: targets.bareMinimum,
    steadyStateTarget2027: targets.steadyState,
    stretchTarget2027: targets.stretch,
    categoryTotals,
    tierTotals
  };
}

export function calculateDaysRemaining(deadlineDateStr: string, referenceDateStr: string = '2026-09-10'): number {
  const deadline = new Date(deadlineDateStr).getTime();
  const ref = new Date(referenceDateStr).getTime();
  const diffTime = deadline - ref;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTotalPipeline(grants: GrantRecord[] = getAllGrants()): number {
  return grants.reduce((sum, g) => sum + (g.amount || 0), 0);
}

export function calculateSecuredFunding(grants: GrantRecord[] = getAllGrants()): number {
  return grants
    .filter(g => g.status === 'Awarded')
    .reduce((sum, g) => sum + (g.amount || 0), 0);
}

export function calculateMatchRequirements(grants: GrantRecord[] = getAllGrants()): {
  totalMatchRequired: number;
  grantsRequiringMatch: Array<{ id: string; title: string; matchAmount: number; matchPercentage: number }>;
} {
  let totalMatchRequired = 0;
  const grantsRequiringMatch: Array<{ id: string; title: string; matchAmount: number; matchPercentage: number }> = [];

  for (const grant of grants) {
    if (grant.matchPercentage && grant.matchPercentage > 0) {
      const matchAmt = Math.round((grant.amount * grant.matchPercentage) / 100);
      totalMatchRequired += matchAmt;
      grantsRequiringMatch.push({
        id: grant.id,
        title: grant.title,
        matchAmount: matchAmt,
        matchPercentage: grant.matchPercentage
      });
    }
  }

  return { totalMatchRequired, grantsRequiringMatch };
}

export function calculatePipelinePacing(pipelineTotal: number, targetAmount: number): {
  pipelineTotal: number;
  targetAmount: number;
  percentageOfTarget: number;
  difference: number;
  status: 'below' | 'met' | 'exceeded';
} {
  const percentageOfTarget = targetAmount > 0 ? (pipelineTotal / targetAmount) * 100 : 0;
  const difference = pipelineTotal - targetAmount;
  let status: 'below' | 'met' | 'exceeded' = 'below';
  if (percentageOfTarget >= 100) status = 'exceeded';
  else if (percentageOfTarget >= 95) status = 'met';

  return {
    pipelineTotal,
    targetAmount,
    percentageOfTarget,
    difference,
    status
  };
}

export function getDeadlineStatus(deadlineDateStr: string, referenceDateStr: string = '2026-09-10'): {
  daysRemaining: number;
  isOverdue: boolean;
  isUpcoming: boolean;
  statusLabel: string;
} {
  const daysRemaining = calculateDaysRemaining(deadlineDateStr, referenceDateStr);
  const isOverdue = daysRemaining < 0;
  const isUpcoming = daysRemaining >= 0 && daysRemaining <= 30;
  let statusLabel = `${daysRemaining} days remaining`;
  if (isOverdue) statusLabel = `Overdue by ${Math.abs(daysRemaining)} days`;
  else if (daysRemaining === 0) statusLabel = 'Due today';

  return {
    daysRemaining,
    isOverdue,
    isUpcoming,
    statusLabel
  };
}

export type LifecycleStage = 
  | 'Drafting'
  | 'Internal Review'
  | 'Board Approval'
  | 'Submitted'
  | 'Awarded'
  | 'Declined';

export interface MatchCalculation {
  requestAmount: number;
  matchPercentage: number;
  matchRequired: number;
  totalProjectBudget: number;
  funderSharePercentage: number;
  applicantSharePercentage: number;
  recommendedSources: Array<{ name: string; amount: number; description: string }>;
}

export interface ComplianceChecklistItem {
  id: string;
  label: string;
  required: boolean;
  category: 'Mandatory Legal' | 'Financial' | 'Federal Compliance' | 'Community Evidence';
  description: string;
}

export function calculateMatchFunding(requestAmount: number, matchPercentage: number): MatchCalculation {
  const matchRequired = Math.round((requestAmount * matchPercentage) / 100);
  const totalProjectBudget = requestAmount + matchRequired;
  const funderSharePercentage = totalProjectBudget > 0 ? Math.round((requestAmount / totalProjectBudget) * 100) : 100;
  const applicantSharePercentage = totalProjectBudget > 0 ? Math.round((matchRequired / totalProjectBudget) * 100) : 0;

  const recommendedSources = [
    {
      name: 'City of Austin EDD ACCT Fee-for-Service Contract',
      amount: 85000,
      description: 'Municipal non-federal cash contract dedicated to co-op technical assistance'
    },
    {
      name: 'Love, Tito’s Community Giving Grant',
      amount: 25000,
      description: 'Unrestricted private corporate foundation donation (valid non-federal cash match)'
    },
    {
      name: 'Commercial Bank CRA Operating Grants (Frost / Texas Capital)',
      amount: 35000,
      description: 'Private financial institution Community Reinvestment Act cash support'
    },
    {
      name: 'Pro Bono Legal & Developer Technical Assistance (In-Kind)',
      amount: 20000,
      description: 'Documented pro bono legal clinics (Texas Bar Foundation partner network)'
    }
  ];

  return {
    requestAmount,
    matchPercentage,
    matchRequired,
    totalProjectBudget,
    funderSharePercentage,
    applicantSharePercentage,
    recommendedSources
  };
}

export function getGrantComplianceChecklist(grant: GrantRecord): ComplianceChecklistItem[] {
  const checklist: ComplianceChecklistItem[] = [
    {
      id: 'irs_501c3',
      label: 'IRS 501(c)(3) Tax-Exempt Determination Letter',
      required: true,
      category: 'Mandatory Legal',
      description: 'Austin Member-Owned Business Foundation (EIN: 81-2782668) public charity ruling letter.'
    },
    {
      id: 'fy_budget',
      label: 'Current Fiscal Year Operating Budget (Approved)',
      required: true,
      category: 'Financial',
      description: 'Official Board-approved organizational budget detailing projected revenues and expenses.'
    },
    {
      id: 'form_990',
      label: 'Most Recent IRS Form 990 / 990-EZ Filing',
      required: true,
      category: 'Financial',
      description: 'Certified federal tax return demonstrating charitable status compliance and public transparency.'
    },
    {
      id: 'board_roster',
      label: 'Board of Directors Roster & Governance Roster',
      required: true,
      category: 'Mandatory Legal',
      description: 'Active list of 7 board members with professional affiliations and demographic parity representation.'
    }
  ];

  if (grant.category === 'Federal' || grant.category.toLowerCase().includes('federal')) {
    checklist.push(
      {
        id: 'sam_gov',
        label: 'SAM.gov Active UEI & CAGE Code Verification',
        required: true,
        category: 'Federal Compliance',
        description: 'Active entity registration on System for Award Management (SAM.gov) without exclusions.'
      },
      {
        id: 'sf_424',
        label: 'Grants.gov SF-424 & Budget Form SF-424A',
        required: true,
        category: 'Federal Compliance',
        description: 'Standard federal application for assistance package with object-class line-item budget narrative.'
      },
      {
        id: 'resumes_personnel',
        label: 'Key Personnel Resumes & Job Descriptions',
        required: true,
        category: 'Federal Compliance',
        description: 'Detailed CVs for Executive Director, Bilingual Co-op Developer, and sub-tier mentors.'
      }
    );
  }

  if (grant.matchPercentage > 0) {
    checklist.push({
      id: 'match_letters',
      label: `${grant.matchPercentage}% Non-Federal Cost Share Commitment Letters`,
      required: true,
      category: 'Financial',
      description: 'Signed institutional commitment letters certifying cash or in-kind non-federal matching funds.'
    });
  }

  if (grant.id === 'cchd_economic_development') {
    checklist.push({
      id: 'cchd_low_income',
      label: 'Low-Income Governance Verification (>33% Democratic Control)',
      required: true,
      category: 'Community Evidence',
      description: 'Mandatory CCHD proof that >33% of worker-owners/board members meet federal low-income guidelines.'
    });
  }

  checklist.push({
    id: 'support_letters',
    label: 'Community Support & Partner Letters (GAVA, Seed Commons)',
    required: false,
    category: 'Community Evidence',
    description: 'Signed testimonials from grassroots partners and incubated cooperative worker-owners.'
  });

  return checklist;
}

