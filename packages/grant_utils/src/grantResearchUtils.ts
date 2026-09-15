import type {
  GrantOpportunity,
  ApplicantProfile,
  GrantFitAssessment,
  FunderProfile,
  RfpAnalysis,
  ResearchQuery,
  GrantResearchDossierOptions,
  GrantRecord,
  CalendarEvent,
  GrantTier,
  GrantCategory
} from './types.js';

// ============================================================================
// 1. QUERY CONSTRUCTORS & WEB RESEARCH BUILDERS
// ============================================================================

/**
 * Builds standard Grants.gov search URL with query parameters.
 */
export function buildGrantsGovSearchUrl(query: ResearchQuery): string {
  const base = 'https://www.grants.gov/search-grants';
  const params = new URLSearchParams();
  if (query.keywords.length > 0) {
    params.set('keywords', query.keywords.join(' '));
  }
  if (query.status && query.status !== 'All') {
    params.set('status', query.status.toLowerCase());
  }
  return `${base}?${params.toString()}`;
}

/**
 * Builds ProPublica Nonprofit Explorer search URL for researching foundation funders and 990s.
 */
export function buildProPublicaSearchUrl(query: string, state?: string): string {
  const base = 'https://projects.propublica.org/nonprofits/api/v2/search.json';
  const params = new URLSearchParams();
  params.set('q', query);
  if (state) {
    params.set('state[id]', state.toUpperCase());
  }
  return `${base}?${params.toString()}`;
}

/**
 * Generates targeted search engine queries ("Google Dorks") to find hidden RFPs,
 * NOFOs, foundation guidelines, and public funding announcements across the web.
 */
export function buildWebResearchQueries(topic: string, orgType: string = 'nonprofit', location?: string): string[] {
  const locTerm = location ? ` "${location}"` : '';
  const cleanTopic = topic.trim();

  return [
    // 1. Direct NOFO / RFP queries
    `"${cleanTopic}" ("Request for Proposals" OR "Notice of Funding Opportunity" OR "NOFO" OR "RFP" OR "Funding Opportunity Announcement")${locTerm}`,
    
    // 2. Federal / Municipal government solicitations
    `site:.gov "${cleanTopic}" ("grant opportunity" OR "grant application" OR "solicitation" OR "awards")${locTerm}`,
    
    // 3. Philanthropic foundations & giving priorities
    `"${cleanTopic}" ("foundation directory" OR "grant guidelines" OR "funding priorities" OR "letters of inquiry")${locTerm}`,
    
    // 4. IRS Form 990-PF research to discover who funds this topic
    `filetype:pdf "Form 990-PF" "${cleanTopic}" "Part XV" "Grants and Contributions Paid During the Year"`,
    
    // 5. Corporate philanthropy and CSR grant programs
    `"${cleanTopic}" ("corporate foundation" OR "community giving" OR "corporate grant program" OR "grant cycle")${locTerm}`,
    
    // 6. Organization-type specific eligibility search
    `"${cleanTopic}" ("eligible applicants" OR "who may apply") ("${orgType}" OR "community-based organization")${locTerm}`,

    // 7. Recent award recipients (competitor / partner benchmarking)
    `"${cleanTopic}" ("grant awarded" OR "announces recipients" OR "funded projects" OR "grantee cohort") (2025 OR 2026 OR 2027)${locTerm}`
  ];
}

// ============================================================================
// 2. FUNDER & OPPORTUNITY PARSING (PROPUBLICA & GRANTS.GOV)
// ============================================================================

/**
 * Parses raw ProPublica Nonprofit Explorer search result item into a typed FunderProfile.
 */
export function parseProPublicaOrgResponse(item: any): FunderProfile {
  return {
    name: item.name || 'Unknown Organization',
    ein: item.ein ? String(item.ein).padStart(9, '0') : undefined,
    type: item.subsection_code === 3 ? 'Public Charity' : (item.subsection_code ? `501(c)(${item.subsection_code})` : 'Private Foundation'),
    city: item.city || '',
    state: item.state || '',
    totalAssets: Number(item.assets) || 0,
    annualGiving: Number(item.totrevenue) || 0,
    topFocusAreas: item.ntee_code ? [item.ntee_code] : [],
    sourceUrl: item.ein ? `https://projects.propublica.org/nonprofits/organizations/${item.ein}` : undefined
  };
}

/**
 * Searches ProPublica Nonprofit Explorer API for foundations, funders, and Form 990 tax records.
 */
export function asyncSearchFunder990(
  query: string, 
  state?: string, 
  options?: { fetchFn?: typeof fetch }
): Promise<FunderProfile[]> {
  const fetcher = options?.fetchFn || (typeof fetch !== 'undefined' ? fetch : undefined);
  if (!fetcher) {
    throw new Error('No fetch implementation available in current environment.');
  }

  const url = buildProPublicaSearchUrl(query, state);
  return fetcher(url)
    .then(res => {
      if (!res.ok) throw new Error(`ProPublica search failed: ${res.statusText}`);
      return res.json();
    })
    .then((data: any) => {
      const orgs = Array.isArray(data.organizations) ? data.organizations : [];
      return orgs.map(parseProPublicaOrgResponse);
    });
}

export const searchFunder990 = asyncSearchFunder990;

/**
 * Parses raw Grants.gov API or search synopsis record into a typed GrantOpportunity.
 */
export function parseGrantsGovSynopsis(raw: any): GrantOpportunity {
  const id = raw.id || raw.opportunityId || raw.opportunityNumber || `grant_${Math.random().toString(36).slice(2, 9)}`;
  const title = raw.title || raw.opportunityTitle || 'Untitled Grant Opportunity';
  const funder = raw.agencyName || raw.agency || raw.funder || 'Federal Agency';
  const amountMax = Number(raw.awardCeiling) || Number(raw.fundingAmountMax) || Number(raw.estimatedTotalFunding) || 0;
  const amountMin = Number(raw.awardFloor) || Number(raw.fundingAmountMin) || 0;
  const deadline = raw.closeDate || raw.deadline || raw.responseDate || '';
  const postDate = raw.postDate || raw.postedDate || '';
  const matchPct = Number(raw.costSharingOrMatchingRequirement === 'Yes' ? (raw.costSharePercentage || 25) : 0);

  const eligibleApplicants: string[] = [];
  if (Array.isArray(raw.eligibleApplicants)) {
    eligibleApplicants.push(...raw.eligibleApplicants);
  } else if (typeof raw.eligibleApplicants === 'string') {
    eligibleApplicants.push(raw.eligibleApplicants);
  } else if (raw.eligibility) {
    eligibleApplicants.push(String(raw.eligibility));
  }

  return {
    id: String(id),
    title,
    funder,
    funderType: 'Federal',
    opportunityNumber: raw.opportunityNumber || raw.cfdaNumber,
    cfdaNumber: raw.cfdaNumber || raw.assistanceListingNumber,
    programUrl: raw.programUrl || (raw.opportunityId ? `https://www.grants.gov/search-results-detail/${raw.opportunityId}` : undefined),
    portalUrl: 'https://www.grants.gov',
    description: raw.description || raw.synopsisDesc || '',
    fundingAmountMin: amountMin > 0 ? amountMin : undefined,
    fundingAmountMax: amountMax > 0 ? amountMax : undefined,
    estimatedTotalFunding: Number(raw.estimatedTotalFunding) || undefined,
    expectedAwardsCount: Number(raw.expectedNumberOfAwards) || undefined,
    costSharePercentage: matchPct,
    deadline: deadline ? String(deadline).split('T')[0] : 'Rolling',
    closeDate: deadline,
    postDate,
    eligibleApplicantTypes: eligibleApplicants.length > 0 ? eligibleApplicants : ['501(c)(3) Nonprofits', 'Small Businesses'],
    focusAreas: Array.isArray(raw.focusAreas) ? raw.focusAreas : [raw.fundingActivityCategory || 'Community Development'],
    status: raw.opportunityStatus === 'Forecasted' ? 'Forecasted' : 'Open',
    submissionMethod: 'Grants.gov',
    source: 'grants.gov',
    rawSourceData: raw
  };
}

/**
 * Searches Grants.gov for open or forecasted federal opportunities.
 */
export function searchGrantsGov(
  query: ResearchQuery | string,
  options?: { fetchFn?: typeof fetch; limit?: number }
): Promise<GrantOpportunity[]> {
  const fetcher = options?.fetchFn || (typeof fetch !== 'undefined' ? fetch : undefined);
  const qObj: ResearchQuery = typeof query === 'string' ? { keywords: [query] } : query;
  const limit = options?.limit || qObj.limit || 10;

  if (!fetcher) {
    // If no network fetcher is provided (e.g. offline unit testing), return mockable empty list
    return Promise.resolve([]);
  }

  const payload = {
    keyword: qObj.keywords.join(' '),
    oppStatuses: qObj.status && qObj.status !== 'All' ? qObj.status.toLowerCase() : 'forecasted|posted',
    rows: limit
  };

  return fetcher('https://api.grants.gov/v1/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error(`Grants.gov search API returned ${res.status}`);
      return res.json();
    })
    .then((data: any) => {
      const hits = Array.isArray(data?.oppHits) ? data.oppHits : (Array.isArray(data?.data) ? data.data : []);
      return hits.map(parseGrantsGovSynopsis);
    })
    .catch(() => {
      // Return empty array on network failure/rate limiting
      return [];
    });
}

// ============================================================================
// 3. FIT & ELIGIBILITY ASSESSMENT ENGINE
// ============================================================================

/**
 * Rigorously evaluates fit, eligibility, and competitive alignment between a
 * researched GrantOpportunity and an ApplicantProfile.
 */
export function evaluateGrantFit(
  opportunity: GrantOpportunity,
  profile: ApplicantProfile
): GrantFitAssessment {
  const strengths: string[] = [];
  const redFlags: string[] = [];
  const suggestedActionItems: string[] = [];
  const passCriteria: string[] = [];
  const failCriteria: string[] = [];

  // 1. Mission Alignment (35%)
  let missionScore = 50; // Baseline neutral
  const oppText = `${opportunity.title} ${opportunity.description} ${opportunity.focusAreas.join(' ')}`.toLowerCase();
  const profileKeywords = [
    ...profile.focusAreas,
    ...profile.mission.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  ];

  let matchedKeywords = 0;
  for (const kw of profileKeywords) {
    if (oppText.includes(kw.toLowerCase())) {
      matchedKeywords++;
    }
  }

  if (matchedKeywords >= 4) {
    missionScore = 95;
    strengths.push(`High thematic alignment: matched ${matchedKeywords} priority keywords across opportunity narrative.`);
  } else if (matchedKeywords >= 2) {
    missionScore = 80;
    strengths.push(`Solid programmatic overlap with ${profile.name}'s mission focus.`);
  } else if (matchedKeywords === 1) {
    missionScore = 65;
    suggestedActionItems.push('Position proposal to explicitly emphasize target focus areas in the narrative statement of need.');
  } else {
    missionScore = 40;
    redFlags.push('Limited programmatic keyword overlap; proposal narrative will require heavy adaptation.');
  }

  // 2. Eligibility Check (25%)
  let eligibilityScore = 100;
  let isEligible = true;

  if (opportunity.eligibleApplicantTypes.length > 0) {
    const normTax = profile.taxStatus.toLowerCase();
    const matchesTax = opportunity.eligibleApplicantTypes.some(type => {
      const t = type.toLowerCase();
      if (normTax.includes('501(c)(3)') && (t.includes('501(c)(3)') || t.includes('nonprofit') || t.includes('public charity'))) return true;
      if (normTax.includes('cooperative') && (t.includes('cooperative') || t.includes('coop') || t.includes('nonprofit') || t.includes('business'))) return true;
      if (normTax.includes('small business') && (t.includes('small business') || t.includes('for-profit') || t.includes('commercial'))) return true;
      if (normTax.includes('higher education') && (t.includes('education') || t.includes('university') || t.includes('college'))) return true;
      if (normTax.includes('municipality') && (t.includes('government') || t.includes('municipality') || t.includes('city') || t.includes('county'))) return true;
      return t.includes(normTax);
    });

    if (matchesTax) {
      passCriteria.push(`Applicant tax status (${profile.taxStatus}) qualifies under eligible applicant categories.`);
      strengths.push(`Eligible applicant entity status verified.`);
    } else {
      isEligible = false;
      eligibilityScore = 20;
      failCriteria.push(`Applicant tax status (${profile.taxStatus}) is not explicitly listed in eligible entity types.`);
      redFlags.push(`Eligibility concern: confirm whether fiscal sponsorship or partner co-application is permitted.`);
      suggestedActionItems.push('Explore joint venture or fiscal sponsorship with an eligible entity.');
    }
  } else {
    passCriteria.push('No restrictive applicant entity limitations identified in synopsis.');
  }

  // Geographic match
  if (opportunity.geographicRestrictions && opportunity.geographicRestrictions.length > 0 && profile.primaryLocation) {
    const locState = profile.primaryLocation.state?.toLowerCase();
    const matchesGeo = opportunity.geographicRestrictions.some(g => {
      const gl = g.toLowerCase();
      return gl.includes('national') || gl.includes('united states') || (locState && gl.includes(locState));
    });
    if (!matchesGeo) {
      redFlags.push(`Geographic restriction may exclude applicant location: ${opportunity.geographicRestrictions.join(', ')}`);
      eligibilityScore = Math.max(0, eligibilityScore - 30);
    } else {
      passCriteria.push('Location conforms with geographic scope.');
    }
  }

  // 3. Funding Fit & Operating Budget Scale (15%)
  let fundingFitScore = 80;
  const oppMax = opportunity.fundingAmountMax || opportunity.estimatedTotalFunding || 0;
  if (oppMax > 0 && profile.annualOperatingBudget && profile.annualOperatingBudget > 0) {
    const ratio = oppMax / profile.annualOperatingBudget;
    if (ratio > 5.0) {
      fundingFitScore = 50;
      redFlags.push(`Request amount ($${oppMax.toLocaleString()}) exceeds 5x annual budget ($${profile.annualOperatingBudget.toLocaleString()}), creating capacity / audit scrutiny.`);
      suggestedActionItems.push('Consider requesting a smaller sub-tier amount or forming a consortium to distribute fiscal responsibility.');
    } else if (ratio >= 0.1 && ratio <= 2.0) {
      fundingFitScore = 100;
      strengths.push(`Optimal funding scale: grant request fits smoothly into existing organizational capacity.`);
    } else {
      fundingFitScore = 85;
    }
  }

  // 4. Match Feasibility (15%)
  let matchScore = 100;
  const requiredMatchPct = opportunity.costSharePercentage || 0;
  if (requiredMatchPct > 0) {
    if (!profile.canProvideMatch) {
      matchScore = 30;
      redFlags.push(`Grant requires ${requiredMatchPct}% non-federal match, but applicant indicates no matching funds available.`);
      suggestedActionItems.push(`Secure non-federal matching commitment letters or partner in-kind pledges for ${requiredMatchPct}% cost-share.`);
    } else if (profile.maxMatchPercentage !== undefined && profile.maxMatchPercentage < requiredMatchPct) {
      matchScore = 55;
      redFlags.push(`Required match (${requiredMatchPct}%) exceeds applicant match threshold (${profile.maxMatchPercentage}%).`);
    } else {
      matchScore = 95;
      strengths.push(`Applicant has capacity to meet required ${requiredMatchPct}% cost share.`);
    }
  } else {
    strengths.push('Zero statutory cost share (0% match requirement).');
  }

  // 5. Competitiveness & Past Track Record (10%)
  let competitivenessScore = 75;
  if (profile.pastGrantExperience) {
    competitivenessScore += 15;
    strengths.push('Prior institutional grant track record strengthens scoring potential.');
  }
  if (profile.yearsActive && profile.yearsActive >= 3) {
    competitivenessScore += 10;
  } else if (profile.yearsActive && profile.yearsActive < 2) {
    competitivenessScore -= 15;
    suggestedActionItems.push('Highlight executive team and board qualifications to offset early-stage organizational age.');
  }
  competitivenessScore = Math.min(100, Math.max(0, competitivenessScore));

  // Compute Overall Weighted Score
  const overallScore = Math.round(
    missionScore * 0.35 +
    eligibilityScore * 0.25 +
    fundingFitScore * 0.15 +
    matchScore * 0.15 +
    competitivenessScore * 0.10
  );

  // Determine Letter Grade
  let fitGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (overallScore >= 93) fitGrade = 'A+';
  else if (overallScore >= 85) fitGrade = 'A';
  else if (overallScore >= 75) fitGrade = 'B';
  else if (overallScore >= 65) fitGrade = 'C';
  else if (overallScore >= 50) fitGrade = 'D';

  // Determine Recommendation
  let recommendation: 'Strong Pursue' | 'Moderate Match' | 'Conditional Match' | 'High Risk / Long Shot' | 'Ineligible';
  if (!isEligible) {
    recommendation = 'Ineligible';
  } else if (overallScore >= 82) {
    recommendation = 'Strong Pursue';
  } else if (overallScore >= 68) {
    recommendation = 'Moderate Match';
  } else if (overallScore >= 52) {
    recommendation = 'Conditional Match';
  } else {
    recommendation = 'High Risk / Long Shot';
  }

  if (suggestedActionItems.length === 0) {
    suggestedActionItems.push('Initiate proposal drafting sprint and compile required organizational attachments.');
    suggestedActionItems.push('Add key submission deadlines and review milestones to master grant calendar.');
  }

  return {
    overallScore,
    fitGrade,
    recommendation,
    eligibilityCheck: {
      isEligible,
      passCriteria,
      failCriteria
    },
    dimensionScores: {
      missionAlignment: missionScore,
      eligibility: eligibilityScore,
      fundingFit: fundingFitScore,
      matchFeasibility: matchScore,
      competitiveness: competitivenessScore
    },
    strengths,
    redFlags,
    suggestedActionItems
  };
}

// ============================================================================
// 4. RFP / NOFO DECONSTRUCTION & TEXT ANALYZER
// ============================================================================

/**
 * Parses raw text from a Request for Proposals (RFP) or Notice of Funding Opportunity (NOFO)
 * to extract critical intelligence, deadlines, budget parameters, and scoring rubrics.
 */
export function analyzeRfpText(rfpText: string): RfpAnalysis {
  const lines = rfpText.split(/\r?\n/);
  
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

  // 3. Extract Critical Deadlines
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

  // Default essentials if none detected
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
      criteria: `Evaluation standards described in solicitation.`
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

// ============================================================================
// 5. OPPORTUNITY CONVERSION & CALENDAR MILESTONES
// ============================================================================

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

  return {
    id: cleanId,
    funder: opportunity.funder,
    program: opportunity.title,
    amount,
    amountFormatted: `$${amount.toLocaleString('en-US')}`,
    deadline,
    deadlineFormatted: deadline,
    tier,
    category: (opportunity.funderType || 'Private Foundation') as GrantCategory,
    matchPercentage: opportunity.costSharePercentage || 0,
    grantType: opportunity.opportunityNumber || 'Institutional Grant',
    portalUrl: opportunity.portalUrl || opportunity.programUrl || '',
    strategicPriority: strategic,
    status: opportunity.status === 'Forecasted' ? 'Forecasted' : 'Planned',
    fileName,
    filePath: `data/grants/${fileName}`,
    title: opportunity.title,
    summary: opportunity.description.slice(0, 300),
    content: generateGrantResearchDossier(opportunity, assessment),
    wordCount: opportunity.description.split(/\s+/).filter(Boolean).length + 200
  };
}

/**
 * Automatically calculates and generates standard RFC 5545 backwards-scheduled
 * milestone events (T-30d, T-14d, T-7d, T-2d, T-1d) for a grant opportunity.
 */
export function convertOpportunityToCalendarEvents(
  opportunity: GrantOpportunity,
  referenceDate: string = '2026-09-15'
): CalendarEvent[] {
  const deadlineStr = opportunity.deadline;
  if (!deadlineStr || deadlineStr === 'Rolling' || !/^\d{4}-\d{2}-\d{2}$/.test(deadlineStr)) {
    // Return single milestone for rolling or unscheduled grants
    return [
      {
        uid: `${opportunity.id}-rolling@grant-utils`,
        title: `[ROLLING] ${opportunity.funder}: ${opportunity.title}`,
        description: `Rolling proposal opportunity for ${opportunity.funder}.\nPortal: ${opportunity.portalUrl || 'N/A'}`,
        startDate: referenceDate,
        endDate: referenceDate,
        location: opportunity.portalUrl || 'Online Funder Portal',
        categories: ['ROLLING', opportunity.funderType.toUpperCase()],
        status: 'CONFIRMED',
        alarms: [],
        grantFile: `${opportunity.id}.md`,
        amount: opportunity.fundingAmountMax
      }
    ];
  }

  const d = new Date(deadlineStr);
  const events: CalendarEvent[] = [];

  function subtractDays(date: Date, days: number): string {
    const res = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
    return res.toISOString().split('T')[0];
  }

  // 1. Master Deadline Event
  events.push({
    uid: `${opportunity.id}-deadline@grant-utils`,
    title: `[DEADLINE] ${opportunity.funder}: ${opportunity.title}`,
    description: `Submission deadline for ${opportunity.title} ($${(opportunity.fundingAmountMax || 0).toLocaleString()}).\nFunder: ${opportunity.funder}.\nPortal: ${opportunity.portalUrl || 'Grants.gov'}`,
    startDate: deadlineStr,
    endDate: deadlineStr,
    location: opportunity.portalUrl || 'Grants Portal',
    categories: ['DEADLINE', opportunity.funderType.toUpperCase()],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P7D', description: `1-Week Deadline Reminder: ${opportunity.title}` },
      { trigger: '-P1D', description: `FINAL DEADLINE TOMORROW: ${opportunity.title}` }
    ],
    grantFile: `${opportunity.id}.md`,
    amount: opportunity.fundingAmountMax
  });

  // 2. T-1 Day Early Submission (24-Hour Buffer Rule)
  const t1 = subtractDays(d, 1);
  events.push({
    uid: `${opportunity.id}-t1-early-submit@grant-utils`,
    title: `[SUBMIT] Early Submission (24h Buffer): ${opportunity.title}`,
    description: `Final portal electronic submission at least 24 hours prior to deadline to prevent traffic congestion.`,
    startDate: t1,
    endDate: t1,
    location: opportunity.portalUrl || 'Grants Portal',
    categories: ['SUBMISSION', 'MILESTONE'],
    status: 'CONFIRMED',
    alarms: [{ trigger: '-PT4H', description: `Execute final portal submission today.` }]
  });

  // 3. T-7 Days Form Assembly & Sign-Off
  const t7 = subtractDays(d, 7);
  events.push({
    uid: `${opportunity.id}-t7-attachments@grant-utils`,
    title: `[COMPLIANCE] Final Attachment Assembly & AOR Review: ${opportunity.title}`,
    description: `Assemble all institutional attachments (501c3, Form 990, Budget Justification, Letters of Support) into portal.`,
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

// ============================================================================
// 6. RESEARCH DOSSIER GENERATION (MARKDOWN + YAML FRONTMATTER)
// ============================================================================

/**
 * Generates an end-to-end, publication-ready Grant Research Dossier in Markdown
 * with valid YAML frontmatter that seamlessly integrates with parseGrantMarkdown.
 */
export function generateGrantResearchDossier(
  opportunity: GrantOpportunity,
  assessment?: GrantFitAssessment,
  rfpAnalysis?: RfpAnalysis,
  options?: GrantResearchDossierOptions
): string {
  const amount = opportunity.fundingAmountMax || opportunity.estimatedTotalFunding || opportunity.fundingAmountMin || 0;
  const deadline = opportunity.deadline || 'Rolling';
  const cleanId = opportunity.id.toLowerCase().replace(/[^a-z0-9_-]/g, '_');

  const frontmatterObj: Record<string, any> = {
    id: cleanId,
    title: opportunity.title,
    funder: opportunity.funder,
    program: opportunity.title,
    amount,
    amountFormatted: `$${amount.toLocaleString('en-US')}`,
    deadline,
    deadlineFormatted: deadline,
    tier: options?.targetTier || (deadline === 'Rolling' ? 'Rolling' : 'Tier 1 (Fall Immediate)'),
    category: opportunity.funderType || 'Federal',
    matchPercentage: opportunity.costSharePercentage || 0,
    grantType: opportunity.opportunityNumber || 'Competitive Grant',
    portalUrl: opportunity.portalUrl || opportunity.programUrl || '',
    strategicPriority: opportunity.focusAreas[0] || 'Core Mission',
    status: opportunity.status === 'Forecasted' ? 'Forecasted' : 'Drafting'
  };

  if (assessment) {
    frontmatterObj.fitScore = assessment.overallScore;
    frontmatterObj.fitGrade = assessment.fitGrade;
    frontmatterObj.recommendation = assessment.recommendation;
  }

  // Build Frontmatter YAML block
  const yamlLines = ['---'];
  for (const [key, val] of Object.entries(frontmatterObj)) {
    if (typeof val === 'string') {
      yamlLines.push(`${key}: "${val.replace(/"/g, '\\"')}"`);
    } else {
      yamlLines.push(`${key}: ${val}`);
    }
  }
  yamlLines.push('---');

  // Build Markdown Document Body
  const mdLines = [
    yamlLines.join('\n'),
    '',
    `# Grant Opportunity Research Dossier: ${opportunity.title}`,
    '',
    `**Awarding Agency / Funder:** ${opportunity.funder}  `,
    `**Opportunity ID / CFDA:** ${opportunity.opportunityNumber || opportunity.cfdaNumber || 'N/A'}  `,
    `**Funding Scale:** Up to $${amount.toLocaleString('en-US')}  `,
    `**Submission Deadline:** ${deadline}  `,
    `**Statutory Cost Share:** ${opportunity.costSharePercentage || 0}%  `,
    options?.applicantName ? `**Applicant Organization:** ${options.applicantName}  ` : '',
    '',
    '---',
    '',
    '## 1. Executive Briefing & Program Overview',
    opportunity.description || 'No detailed synopsis provided in initial announcement.',
    '',
    '## 2. Fit Evaluation & Alignment Verdict'
  ];

  if (assessment) {
    mdLines.push(
      `- **Overall Fit Score:** ${assessment.overallScore}/100 (Grade: ${assessment.fitGrade})`,
      `- **Pursuit Recommendation:** **${assessment.recommendation.toUpperCase()}**`,
      `- **Eligibility Determination:** ${assessment.eligibilityCheck.isEligible ? '✅ Fully Eligible' : '⚠️ Eligibility Verification Required'}`,
      '',
      '### Core Strengths & Advantages',
      ...assessment.strengths.map(s => `- ${s}`),
      '',
      '### Red Flags & Risks to Address',
      ...(assessment.redFlags.length > 0 ? assessment.redFlags.map(r => `- ⚠️ ${r}`) : ['- Zero major red flags identified.']),
      '',
      '### High-Priority Action Items',
      ...assessment.suggestedActionItems.map(a => `- [ ] ${a}`)
    );
  } else {
    mdLines.push(
      'Fit assessment pending initial organizational review.',
      `- **Eligible Entities:** ${opportunity.eligibleApplicantTypes.join(', ')}`,
      `- **Focus Areas:** ${opportunity.focusAreas.join(', ')}`
    );
  }

  if (rfpAnalysis) {
    mdLines.push(
      '',
      '## 3. RFP / NOFO Technical Specifications',
      `**Submission Portal:** ${rfpAnalysis.submissionRequirements.portal}  `,
      `**Formatting:** ${rfpAnalysis.submissionRequirements.formatInstructions}  `,
      '',
      '### Required Forms & Mandatory Attachments'
    );
    rfpAnalysis.requiredAttachments.forEach(att => {
      mdLines.push(`- **${att.name}:** ${att.description} (${att.mandatory ? 'Mandatory' : 'Optional'})`);
    });

    mdLines.push('', '### Published Scoring Rubric');
    rfpAnalysis.scoringRubric.forEach(s => {
      mdLines.push(`- **${s.section} (${s.maxPoints} pts):** ${s.criteria}`);
    });
  }

  mdLines.push(
    '',
    '## 4. Execution Roadmap & 24-Hour Pre-Submission Protocol',
    '1. **T-30 Days:** Finalize draft proposal narrative and program design.',
    '2. **T-14 Days:** Reconcile line-item budget justification and secure cost-share commitment letters.',
    '3. **T-7 Days:** Pre-populate online portal fields and assemble all supporting PDF attachments.',
    '4. **T-1 Day (24-Hour Rule):** Execute final electronic submission at least 24 hours prior to deadline.',
    '',
    '---',
    `*Generated via @tekromancy/grant_utils research engine.*`
  );

  return mdLines.join('\n');
}

// ============================================================================
// 7. GRANT RESEARCH CATALOG & REGISTRY
// ============================================================================

export class GrantResearchCatalog {
  private opportunities = new Map<string, GrantOpportunity>();

  constructor(initialOpportunities: GrantOpportunity[] = []) {
    this.addMany(initialOpportunities);
  }

  public add(opp: GrantOpportunity): void {
    this.opportunities.set(opp.id, opp);
  }

  public addMany(opps: GrantOpportunity[]): void {
    for (const opp of opps) {
      this.add(opp);
    }
  }

  public getById(id: string): GrantOpportunity | undefined {
    return this.opportunities.get(id);
  }

  public getAll(): GrantOpportunity[] {
    return Array.from(this.opportunities.values());
  }

  public filter(query: ResearchQuery): GrantOpportunity[] {
    let results = this.getAll();

    if (query.keywords && query.keywords.length > 0) {
      const q = query.keywords.join(' ').toLowerCase();
      results = results.filter(opp =>
        opp.title.toLowerCase().includes(q) ||
        opp.funder.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.focusAreas.some(fa => fa.toLowerCase().includes(q))
      );
    }

    if (query.funderType) {
      results = results.filter(opp => opp.funderType.toLowerCase() === query.funderType!.toLowerCase());
    }

    if (query.status && query.status !== 'All') {
      results = results.filter(opp => opp.status.toLowerCase() === query.status!.toLowerCase());
    }

    if (query.minAmount !== undefined) {
      results = results.filter(opp => (opp.fundingAmountMax || 0) >= query.minAmount!);
    }

    if (query.maxAmount !== undefined) {
      results = results.filter(opp => (opp.fundingAmountMax || 0) <= query.maxAmount!);
    }

    if (query.requiresMatch !== undefined) {
      results = results.filter(opp => query.requiresMatch ? (opp.costSharePercentage || 0) > 0 : (opp.costSharePercentage || 0) === 0);
    }

    if (query.limit && query.limit > 0) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  public evaluateAll(profile: ApplicantProfile): Array<{ opportunity: GrantOpportunity; assessment: GrantFitAssessment }> {
    return this.getAll().map(opp => ({
      opportunity: opp,
      assessment: evaluateGrantFit(opp, profile)
    }));
  }

  public toGrantRecords(profile?: ApplicantProfile): GrantRecord[] {
    return this.getAll().map(opp => {
      const assessment = profile ? evaluateGrantFit(opp, profile) : undefined;
      return convertOpportunityToGrantRecord(opp, assessment);
    });
  }

  public toCalendarEvents(referenceDate?: string): CalendarEvent[] {
    return this.getAll().flatMap(opp => convertOpportunityToCalendarEvents(opp, referenceDate));
  }

  public clear(): void {
    this.opportunities.clear();
  }
}

// Global catalog singleton
const GLOBAL_RESEARCH_CATALOG = new GrantResearchCatalog();

export function getResearchCatalog(): GrantResearchCatalog {
  return GLOBAL_RESEARCH_CATALOG;
}

export function registerResearchOpportunity(opp: GrantOpportunity): void {
  GLOBAL_RESEARCH_CATALOG.add(opp);
}

export function getAllResearchOpportunities(): GrantOpportunity[] {
  return GLOBAL_RESEARCH_CATALOG.getAll();
}

export function clearResearchCatalog(): void {
  GLOBAL_RESEARCH_CATALOG.clear();
}
