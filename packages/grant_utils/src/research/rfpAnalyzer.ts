import type { RfpAnalysis } from '../types.js';

/**
 * Parses raw text from a Request for Proposals (RFP) or Notice of Funding Opportunity (NOFO)
 * to extract critical intelligence, deadlines, budget parameters, and scoring rubrics.
 */
export function analyzeRfpText(rfpText: string): RfpAnalysis {
  // 1. Extract Title & Agency
  let title = 'Grant Opportunity / Request for Proposals';
  let agencyOrFunder = 'Funding Agency / Philanthropic Foundation';

  const titleMatch = rfpText.match(/(?:title|notice of funding opportunity|request for proposals)[:\s]+([^\n\r]+)/i);
  if (titleMatch) title = titleMatch[1].trim();

  const funderMatch = rfpText.match(/(?:agency|awarding agency|funder|sponsored by)[:\s]+([^\n\r]+)/i);
  if (funderMatch) agencyOrFunder = funderMatch[1].trim();

  // 2. Extract Funding Parameters
  let totalProgramFunding: number | undefined;
  let awardFloor: number | undefined;
  let awardCeiling: number | undefined;
  let matchRequiredPercent: number | undefined;

  const totalMatch = rfpText.match(/(?:total program funding|estimated total program funding|total funding available)[:\s]+\$?([0-9,]+)/i);
  if (totalMatch) totalProgramFunding = parseInt(totalMatch[1].replace(/,/g, ''), 10);

  const ceilingMatch = rfpText.match(/(?:award ceiling|maximum award|up to)[:\s]+\$?([0-9,]+)/i);
  if (ceilingMatch) awardCeiling = parseInt(ceilingMatch[1].replace(/,/g, ''), 10);

  const floorMatch = rfpText.match(/(?:award floor|minimum award)[:\s]+\$?([0-9,]+)/i);
  if (floorMatch) awardFloor = parseInt(floorMatch[1].replace(/,/g, ''), 10);

  const matchPctRegex = /(?:cost[\s-]share|cost[\s-]sharing|matching funds|non-federal match|match requirement|match)[^0-9\n\r]*?([0-9]{1,2})%/i;
  const matchPctMatch = rfpText.match(matchPctRegex);
  if (matchPctMatch) {
    matchRequiredPercent = parseInt(matchPctMatch[1], 10);
  } else if (/cost sharing[:\s]+no|matching[:\s]+not required|0% match/i.test(rfpText)) {
    matchRequiredPercent = 0;
  }

  // 3. Extract Critical Deadlines (supporting multiple dates!)
  const criticalDeadlines: Array<{ milestone: string; date: string; time?: string; timezone?: string }> = [];
  const deadlineRegex = /(?:deadline|closing date|due date|application due|submitted by)[:\s]+([A-Za-z]+ \d{1,2},? \d{4}|\d{4}-\d{2}-\d{2})(?:\s+at\s+([0-9:]+\s*(?:am|pm|ET|CT|PT|EST|CST|PST)?))?/gi;
  let dMatch: RegExpExecArray | null;
  while ((dMatch = deadlineRegex.exec(rfpText)) !== null) {
    criticalDeadlines.push({
      milestone: 'Application Submission Deadline',
      date: dMatch[1],
      time: dMatch[2] || '11:59 PM',
      timezone: 'Funder Local Time'
    });
  }

  if (criticalDeadlines.length === 0) {
    criticalDeadlines.push({
      milestone: 'Submission Deadline (Rolling / TBD)',
      date: 'Rolling Basis'
    });
  }

  // 4. Extract Required Attachments
  const requiredAttachments: Array<{ name: string; description: string; mandatory: boolean }> = [];
  const attachmentKeywords = [
    { name: 'SF-424 Application for Federal Assistance', pattern: /SF-?424/i, mandatory: true, desc: 'Standard federal application face sheet and executive assurances.' },
    { name: 'SF-424A Budget Information', pattern: /SF-?424A/i, mandatory: true, desc: 'Object-class line item budget categories breakdown.' },
    { name: 'Project Narrative', pattern: /project narrative|narrative statement/i, mandatory: true, desc: 'Core narrative statement of need, work plan, and capacity.' },
    { name: 'Budget Narrative & Justification', pattern: /budget narrative|budget justification/i, mandatory: true, desc: 'Detailed mathematical narrative explaining all costs.' },
    { name: 'IRS 501(c)(3) Letter of Determination', pattern: /501\(c\)\(3\)|tax-exempt determination/i, mandatory: true, desc: 'Official IRS tax-exempt ruling letter.' },
    { name: 'Board of Directors Roster', pattern: /board of directors|board roster/i, mandatory: true, desc: 'Active director list with affiliations.' },
    { name: 'Key Personnel Resumes / CVs', pattern: /resume|curriculum vitae|cvs/i, mandatory: true, desc: 'Professional resumes for Project Director and key staff.' },
    { name: 'Letters of Support / Partner MOUs', pattern: /letters of support|commitment letters|mou/i, mandatory: false, desc: 'Signed stakeholder testimonials and partner agreements.' },
    { name: 'SAM.gov Active UEI Registration', pattern: /sam\.gov|unique entity identifier|uei/i, mandatory: true, desc: 'Active federal registration without exclusions.' }
  ];

  for (const item of attachmentKeywords) {
    if (item.pattern.test(rfpText)) {
      requiredAttachments.push({
        name: item.name,
        description: item.desc,
        mandatory: item.mandatory
      });
    }
  }

  if (requiredAttachments.length === 0) {
    requiredAttachments.push(
      { name: 'Proposal Narrative', description: 'Comprehensive project scope and objectives.', mandatory: true },
      { name: 'Itemized Project Budget', description: 'Detailed revenues and expenses breakdown.', mandatory: true },
      { name: '501(c)(3) Tax Status Documentation', description: 'Official non-profit determination.', mandatory: true }
    );
  }

  // 5. Extract Scoring Rubric Sections
  const scoringRubric: Array<{ section: string; maxPoints: number; criteria: string }> = [];
  const rubricRegex = /(?:section|criterion|criteria)[\s\d]*:?\s*([A-Za-z\s]+?)\s*(?:\((\d{1,3})\s*(?:points|pts)\)|:\s*(\d{1,3})\s*(?:points|pts))/gi;
  let rMatch: RegExpExecArray | null;
  while ((rMatch = rubricRegex.exec(rfpText)) !== null) {
    const points = parseInt(rMatch[2] || rMatch[3], 10);
    scoringRubric.push({
      section: rMatch[1].trim(),
      maxPoints: points,
      criteria: 'Evaluation standards described in solicitation.'
    });
  }

  if (scoringRubric.length === 0) {
    scoringRubric.push(
      { section: 'Statement of Need & Target Population', maxPoints: 25, criteria: 'Urgency of problem, demographic data, and community alignment.' },
      { section: 'Project Design & Implementation Plan', maxPoints: 35, criteria: 'Actionable work plan, realistic timeline, and clear deliverables.' },
      { section: 'Organizational Capacity & Key Personnel', maxPoints: 20, criteria: 'Track record, team qualifications, and fiscal oversight.' },
      { section: 'Budget Reasonableness & Cost-Effectiveness', maxPoints: 20, criteria: 'Justified expenses aligned with proposed activities.' }
    );
  }

  // 6. Submission Requirements & Strategic Advice
  let portal = 'Online Funder Portal';
  if (/grants\.gov/i.test(rfpText)) portal = 'Grants.gov (Workspace)';
  else if (/proposalcentral/i.test(rfpText)) portal = 'ProposalCentral';
  else if (/fluxx/i.test(rfpText)) portal = 'Fluxx Grantmaker Portal';
  else if (/submittable/i.test(rfpText)) portal = 'Submittable';
  else if (/email/i.test(rfpText)) portal = 'Direct Email Submission';

  return {
    title,
    agencyOrFunder,
    keyObjectives: [
      'Advance targeted programmatic community impact aligned with solicitation goals.',
      'Demonstrate measurable outcomes and sustainable organizational stewardship.'
    ],
    eligibilitySummary: 'Review eligibility guidelines for qualifying entity criteria and geographic limitations.',
    fundingOverview: {
      totalProgramFunding,
      awardFloor,
      awardCeiling,
      matchRequiredPercent
    },
    criticalDeadlines,
    requiredAttachments,
    scoringRubric,
    submissionRequirements: {
      portal,
      formatInstructions: 'PDF format, 1-inch margins, minimum 11pt font, consecutively numbered pages.'
    },
    strategicAdvice: [
      'Adhere to the 24-Hour Rule: finalize electronic portal submission at least 1 day prior to deadline.',
      'Explicitly map section headings to the funder’s published scoring rubric to maximize evaluator scoring points.',
      'Verify non-federal matching commitment letters if cost sharing is mandatory.'
    ]
  };
}
