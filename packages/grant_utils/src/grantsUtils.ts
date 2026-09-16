import type { 
  GrantRecord, 
  GrantCategory, 
  GrantStatus, 
  KPISummary, 
  ProjectConfig,
  SearchGrantsOptions,
  PaginatedResult,
  BudgetTemplate,
  BudgetItem,
  BudgetObjectCategory,
  GrantValidationResult
} from './types.js';
import { GRANTS_DATA, TOTAL_PIPELINE_AMOUNT, TOTAL_GRANTS_COUNT } from './data/generatedGrants.js';
import { getProjectConfig, getDefaultProject, filterGrantsByProject } from './projectUtils.js';

let customGrantsData: GrantRecord[] | null = null;

export function getTodayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Registers or sets a custom in-memory grant dataset.
 */
export function registerGrants(grants: GrantRecord[]): void {
  customGrantsData = [...grants];
}

/**
 * Clears custom registered grants, reverting to base dataset.
 */
export function clearGrants(): void {
  customGrantsData = null;
}

export function getAllGrants(projectId?: string, dataset?: GrantRecord[]): GrantRecord[] {
  const source = dataset || customGrantsData || GRANTS_DATA;
  if (projectId) {
    return filterGrantsByProject(source, projectId);
  }
  return [...source];
}

export function getGrantById(id: string, dataset?: GrantRecord[]): GrantRecord | undefined {
  const source = dataset || customGrantsData || GRANTS_DATA;
  return source.find(g => g.id === id || g.fileName === id || g.fileName === `${id}.md`);
}

export function getGrantsByCategory(category: GrantCategory, dataset?: GrantRecord[]): GrantRecord[] {
  const source = dataset || customGrantsData || GRANTS_DATA;
  return source.filter(g => g.category === category);
}

export function getGrantsByTier(tier: string, dataset?: GrantRecord[]): GrantRecord[] {
  const source = dataset || customGrantsData || GRANTS_DATA;
  return source.filter(g => g.tier.toLowerCase().includes(tier.toLowerCase()));
}

export function paginate<T>(items: T[], page: number = 1, pageSize: number = 10): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.ceil(total / safePageSize) || 1;
  const start = (safePage - 1) * safePageSize;
  const pagedItems = items.slice(start, start + safePageSize);

  return {
    items: pagedItems,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages
  };
}

export function searchGrants(
  query: string, 
  dataset?: GrantRecord[],
  options?: SearchGrantsOptions
): GrantRecord[] {
  const source = dataset || customGrantsData || GRANTS_DATA;
  let results: GrantRecord[];
  if (!query || !query.trim()) {
    results = [...source];
  } else {
    const q = query.toLowerCase();
    results = source.filter(g => 
      g.title.toLowerCase().includes(q) ||
      g.funder.toLowerCase().includes(q) ||
      g.program.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.strategicPriority.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q) ||
      (g.tags && g.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (options?.sortBy) {
    const dir = options.sortDir === 'desc' ? -1 : 1;
    results.sort((a, b) => {
      if (options.sortBy === 'amount') {
        return ((a.amount || 0) - (b.amount || 0)) * dir;
      }
      if (options.sortBy === 'matchPercentage') {
        return ((a.matchPercentage || 0) - (b.matchPercentage || 0)) * dir;
      }
      if (options.sortBy === 'deadline') {
        return (a.deadline || '').localeCompare(b.deadline || '') * dir;
      }
      if (options.sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '') * dir;
      }
      return 0;
    });
  }

  if (options?.page !== undefined && options?.pageSize !== undefined) {
    return paginate(results, options.page, options.pageSize).items;
  }

  return results;
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

  const baseGrants = customGrants || customGrantsData || GRANTS_DATA;
  const grants = (project && config.id && !customGrants) ? filterGrantsByProject(baseGrants, config.id) : baseGrants;
  const effectiveGrants = grants;

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
    totalPipelineAmount: totalPipeline,
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

export function calculateDaysRemaining(deadlineDateStr: string, referenceDateStr: string = getTodayDateStr()): number {
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

export function getDeadlineStatus(deadlineDateStr: string, referenceDateStr: string = getTodayDateStr()): {
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

export function calculateMatchFunding(
  requestAmount: number, 
  matchPercentage: number,
  customSources?: Array<{ name: string; amount: number; description: string }>
): MatchCalculation {
  const matchRequired = Math.round((requestAmount * matchPercentage) / 100);
  const totalProjectBudget = requestAmount + matchRequired;
  const funderSharePercentage = totalProjectBudget > 0 ? Math.round((requestAmount / totalProjectBudget) * 100) : 100;
  const applicantSharePercentage = totalProjectBudget > 0 ? Math.round((matchRequired / totalProjectBudget) * 100) : 0;

  const defaultSources = [
    {
      name: 'Municipal or Local Government Fee-for-Service Contract',
      amount: Math.round(matchRequired * 0.45),
      description: 'Municipal non-federal cash contract dedicated to technical assistance or program delivery'
    },
    {
      name: 'Philanthropic Foundation or Corporate Giving Grant',
      amount: Math.round(matchRequired * 0.25),
      description: 'Unrestricted private corporate foundation donation (valid non-federal cash match)'
    },
    {
      name: 'Commercial Bank CRA / Institutional Support',
      amount: Math.round(matchRequired * 0.20),
      description: 'Private financial institution Community Reinvestment Act cash support'
    },
    {
      name: 'Documented In-Kind Technical Assistance / Professional Services',
      amount: Math.round(matchRequired * 0.10),
      description: 'Documented pro bono legal, accounting, engineering, or developer assistance clinics'
    }
  ];

  return {
    requestAmount,
    matchPercentage,
    matchRequired,
    totalProjectBudget,
    funderSharePercentage,
    applicantSharePercentage,
    recommendedSources: customSources || defaultSources
  };
}

export function getGrantComplianceChecklist(grant: GrantRecord): ComplianceChecklistItem[] {
  const checklist: ComplianceChecklistItem[] = [
    {
      id: 'tax_exempt_status',
      label: 'IRS 501(c)(3) Tax-Exempt Determination Letter or Legal Charter',
      required: true,
      category: 'Mandatory Legal',
      description: 'Official IRS determination letter confirming tax-exempt public charity status or state corporate charter.'
    },
    {
      id: 'fy_budget',
      label: 'Current Fiscal Year Operating Budget (Approved)',
      required: true,
      category: 'Financial',
      description: 'Official Board-approved organizational budget detailing projected revenues and expenditures.'
    },
    {
      id: 'form_990',
      label: 'Most Recent IRS Form 990 / 990-EZ Filing or Financial Review',
      required: true,
      category: 'Financial',
      description: 'Certified federal tax return demonstrating charitable status compliance and public transparency.'
    },
    {
      id: 'board_roster',
      label: 'Board of Directors Roster & Governance Information',
      required: true,
      category: 'Mandatory Legal',
      description: 'Active list of board members with professional affiliations, terms, and governance roles.'
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
        description: 'Detailed CVs and resumes for Project Director, Key Personnel, and external consultants.'
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

  checklist.push({
    id: 'support_letters',
    label: 'Community Support & Partner Letters of Commitment',
    required: false,
    category: 'Community Evidence',
    description: 'Signed testimonials and commitment letters from grassroots partners and community stakeholders.'
  });

  return checklist;
}

/**
 * Updates grant status and records status transition in audit history.
 */
export function updateGrantStatus(
  grant: GrantRecord,
  newStatus: GrantStatus,
  note?: string,
  dateStr: string = getTodayDateStr()
): GrantRecord {
  const history = [...(grant.statusHistory || [])];
  history.push({
    status: newStatus,
    date: dateStr,
    note
  });
  return {
    ...grant,
    status: newStatus,
    statusHistory: history
  };
}

/**
 * Generates an SF-424A compatible object-class budget template for a grant.
 */
export function generateBudgetTemplate(
  grant: GrantRecord,
  matchCalc?: MatchCalculation
): BudgetTemplate {
  const match = matchCalc || calculateMatchFunding(grant.amount, grant.matchPercentage);
  const totalCost = match.totalProjectBudget;
  const fedTotal = match.requestAmount;
  const matchTotal = match.matchRequired;
  const matchRatio = totalCost > 0 ? matchTotal / totalCost : 0;
  const fedRatio = 1 - matchRatio;

  const allocations: Array<{ cat: BudgetObjectCategory; pct: number; desc: string }> = [
    { cat: 'Personnel', pct: 0.45, desc: 'Project Director, Technical Specialists, and Core Coordinators' },
    { cat: 'Fringe Benefits', pct: 0.12, desc: 'FICA, health, retirement and statutory payroll taxes' },
    { cat: 'Travel', pct: 0.05, desc: 'Site visits, regional coalition gatherings, and training convenings' },
    { cat: 'Equipment', pct: 0.08, desc: 'Capital deployment assets and specialized hardware' },
    { cat: 'Supplies', pct: 0.05, desc: 'Operational tooling, office collateral, and participant toolkits' },
    { cat: 'Contractual', pct: 0.15, desc: 'Third-party evaluator, accounting audit, and legal counsel' },
    { cat: 'Other', pct: 0.03, desc: 'Participant stipends, communications, and workshop catering' },
    { cat: 'Indirect Charges', pct: 0.07, desc: 'De minimis 10% modified total direct cost overhead allocation' }
  ];

  const lineItems: BudgetItem[] = [];
  const categoryTotals: Record<string, { federal: number; nonFederal: number; total: number }> = {};
  let directCostTotal = 0;
  let indirectCostTotal = 0;

  allocations.forEach((a, idx) => {
    const itemTotal = Math.round(totalCost * a.pct);
    const itemFed = Math.round(itemTotal * fedRatio);
    const itemMatch = itemTotal - itemFed;

    if (a.cat === 'Indirect Charges') {
      indirectCostTotal += itemTotal;
    } else {
      directCostTotal += itemTotal;
    }

    categoryTotals[a.cat] = {
      federal: itemFed,
      nonFederal: itemMatch,
      total: itemTotal
    };

    lineItems.push({
      id: `budget-${idx + 1}-${a.cat.toLowerCase().replace(/\s+/g, '-')}`,
      category: a.cat,
      description: a.desc,
      totalCost: itemTotal,
      federalShare: itemFed,
      nonFederalShare: itemMatch,
      matchSource: itemMatch > 0 ? 'Cash Match / Local Contribution' : undefined
    });
  });

  return {
    grantId: grant.id,
    grantTitle: grant.title,
    funder: grant.funder,
    totalProjectCost: totalCost,
    directCostTotal,
    indirectCostTotal,
    federalShareTotal: fedTotal,
    nonFederalMatchTotal: matchTotal,
    matchPercentage: grant.matchPercentage,
    lineItems,
    categoryTotals
  };
}

/**
 * Validates grant records during data ingestion or deserialization.
 */
export function validateGrantRecord(record: any): GrantValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!record || typeof record !== 'object') {
    return { valid: false, errors: ['Grant record must be a non-null object'], warnings: [] };
  }

  if (!record.id || typeof record.id !== 'string') {
    errors.push('Missing or invalid required field: "id" (string)');
  }
  if (!record.title || typeof record.title !== 'string') {
    errors.push('Missing or invalid required field: "title" (string)');
  }
  if (record.amount === undefined || typeof record.amount !== 'number' || isNaN(record.amount) || record.amount < 0) {
    errors.push('Missing or invalid required field: "amount" (non-negative number)');
  }
  if (!record.deadline || typeof record.deadline !== 'string') {
    warnings.push('Missing "deadline" field; defaulting to "Rolling"');
  } else if (record.deadline !== 'Rolling' && !/^\d{4}-\d{2}-\d{2}/.test(record.deadline)) {
    warnings.push(`Deadline "${record.deadline}" is not in standard YYYY-MM-DD or Rolling format`);
  }
  if (!record.funder || typeof record.funder !== 'string') {
    warnings.push('Missing "funder" field');
  }
  if (!record.category || typeof record.category !== 'string') {
    warnings.push('Missing "category" field; defaulting to "Other"');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

