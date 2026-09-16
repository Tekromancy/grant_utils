import type {
  GrantOpportunity,
  GrantFitAssessment,
  GrantRecord,
  CalendarEvent,
  GrantTier,
  GrantCategory
} from '../types.js';

/**
 * Converts a researched GrantOpportunity into a full GrantRecord compatible with
 * grantsUtils, financial pipeline KPI calculators, and portfolio dashboards.
 */
export function convertOpportunityToGrantRecord(
  opportunity: GrantOpportunity,
  assessment?: GrantFitAssessment
): GrantRecord {
  const amount = opportunity.fundingAmountMax || opportunity.estimatedTotalFunding || opportunity.fundingAmountMin || 0;
  const deadline = opportunity.deadline || 'Rolling';

  let tier: GrantTier = 'Rolling';
  if (deadline !== 'Rolling') {
    const month = parseInt(deadline.split('-')[1], 10);
    if (month >= 9 && month <= 11) tier = 'Tier 1 (Fall Immediate)';
    else if (month === 12 || month <= 2) tier = 'Tier 2 (Winter Core)';
    else if (month >= 3 && month <= 5) tier = 'Tier 3 (Spring Major)';
    else if (month >= 6 && month <= 8) tier = opportunity.funderType === 'Federal' ? 'Tier 4 (Summer Federal)' : 'Tier 4 (Summer Major)';
  }

  const strategic = opportunity.focusAreas.length > 0 ? opportunity.focusAreas[0] : 'Capacity & Operations';
  const cleanId = opportunity.id.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const fileName = `${cleanId}.md`;

  const categoryMap: Record<string, GrantCategory> = {
    'Federal': 'Federal',
    'State': 'Regional Foundation',
    'Municipal': 'Municipal',
    'Private Foundation': 'National Foundation',
    'Corporate': 'Corporate/CRA',
    'Community Foundation': 'Regional Foundation',
    'Movement/CDF': 'Movement/CDF'
  };
  const category: GrantCategory = categoryMap[opportunity.funderType] || 'National Foundation';

  const bodyContent = [
    `# ${opportunity.title}`,
    '',
    `**Funder:** ${opportunity.funder}  `,
    `**Amount:** $${amount.toLocaleString('en-US')}  `,
    `**Deadline:** ${deadline}  `,
    `**Match Required:** ${opportunity.costSharePercentage || 0}%  `,
    '',
    '## Executive Summary',
    opportunity.description || 'Researched funding opportunity.',
    '',
    assessment ? `## Fit & Alignment Assessment (${assessment.overallScore}/100 - Grade ${assessment.fitGrade})\nRecommendation: ${assessment.recommendation}\n` : ''
  ].join('\n');

  return {
    id: cleanId,
    funder: opportunity.funder,
    program: opportunity.title,
    amount,
    amountFormatted: `$${amount.toLocaleString('en-US')}`,
    deadline,
    deadlineFormatted: deadline,
    tier,
    category,
    matchPercentage: opportunity.costSharePercentage || 0,
    grantType: opportunity.opportunityNumber || 'Project Grant',
    portalUrl: opportunity.portalUrl || opportunity.programUrl || '',
    strategicPriority: strategic,
    status: opportunity.status === 'Forecasted' ? 'Forecasted' : 'Drafting',
    fileName,
    filePath: `data/grants/${fileName}`,
    title: opportunity.title,
    summary: opportunity.description ? opportunity.description.slice(0, 300) : 'Researched grant opportunity.',
    content: bodyContent,
    wordCount: bodyContent.split(/\s+/).filter(Boolean).length
  };
}

/**
 * Automatically calculates standard pre-submission milestones and compliance checkpoints
 * leading up to a grant's deadline (T-30, T-14, T-7, T-1 24h rule, and Deadline).
 */
export function convertOpportunityToCalendarEvents(
  opportunity: GrantOpportunity,
  referenceDate?: string
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const deadlineStr = opportunity.deadline;

  if (!deadlineStr || deadlineStr === 'Rolling' || !/^\d{4}-\d{2}-\d{2}/.test(deadlineStr)) {
    // Rolling or unannounced deadline — generate a single milestone
    const today = referenceDate || new Date().toISOString().slice(0, 10);
    events.push({
      uid: `${opportunity.id}-rolling@grant-utils`,
      title: `[ROLLING] Quarterly Evaluation: ${opportunity.title}`,
      description: `Rolling opportunity quarterly review for ${opportunity.funder}.`,
      startDate: today,
      endDate: today,
      location: opportunity.portalUrl || 'Online Portal',
      categories: ['DEADLINE', 'ROLLING'],
      status: 'CONFIRMED',
      alarms: [{ trigger: '-P14D', description: 'Review rolling submission progress.' }],
      amount: opportunity.fundingAmountMax
    });
    return events;
  }

  const d = new Date(deadlineStr);
  const subtractDays = (date: Date, days: number): string => {
    const res = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
    return res.toISOString().split('T')[0];
  };

  // 1. Final Statutory Deadline
  events.push({
    uid: `${opportunity.id}-deadline@grant-utils`,
    title: `[DEADLINE] Final Submission: ${opportunity.title}`,
    description: `Hard cutoff deadline for ${opportunity.funder}.\nPortal: ${opportunity.portalUrl || 'Online Portal'}`,
    startDate: deadlineStr,
    endDate: deadlineStr,
    location: opportunity.portalUrl || 'Online Portal',
    categories: ['DEADLINE', (opportunity.funderType || 'FEDERAL').toUpperCase()],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P7D', description: 'One week until final grant deadline.' },
      { trigger: '-P1D', description: 'Tomorrow is the deadline! Verify electronic submission confirmation.' }
    ],
    amount: opportunity.fundingAmountMax
  });

  // 2. T-1 Day (24-Hour Pre-Submission Golden Rule)
  const t1 = subtractDays(d, 1);
  events.push({
    uid: `${opportunity.id}-t1-sub@grant-utils`,
    title: `[SUBMISSION] 24-Hour Rule Portal Upload: ${opportunity.title}`,
    description: `Execute portal upload and receive timestamped tracking receipt at least 24 hours prior to deadline to prevent electronic glitches.`,
    startDate: t1,
    endDate: t1,
    location: opportunity.portalUrl || 'Online Portal',
    categories: ['SUBMISSION', 'MILESTONE'],
    status: 'CONFIRMED',
    alarms: [{ trigger: '-PT4H', description: 'Execute final package upload today.' }]
  });

  // 3. T-7 Days Executive & Legal Compliance Signoff
  const t7 = subtractDays(d, 7);
  events.push({
    uid: `${opportunity.id}-t7-comp@grant-utils`,
    title: `[COMPLIANCE] Final Review & Board/Legal Signoff: ${opportunity.title}`,
    description: `Complete internal administrative check, SAM.gov UEI active check, and executive authorizations.`,
    startDate: t7,
    endDate: t7,
    location: 'Internal Grant Office',
    categories: ['COMPLIANCE', 'MILESTONE'],
    status: 'CONFIRMED',
    alarms: []
  });

  // 4. T-14 Days Budget & Match Approval
  const t14 = subtractDays(d, 14);
  events.push({
    uid: `${opportunity.id}-t14-budget@grant-utils`,
    title: `[BUDGET] Itemized Budget Narrative & Cost Share Approval: ${opportunity.title}`,
    description: `Reconcile itemized SF-424A line-item budget and certify non-federal cost share commitments.`,
    startDate: t14,
    endDate: t14,
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'MILESTONE'],
    status: 'CONFIRMED',
    alarms: []
  });

  return events;
}
