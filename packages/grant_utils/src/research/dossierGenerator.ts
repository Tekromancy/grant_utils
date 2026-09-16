import type {
  GrantOpportunity,
  GrantFitAssessment,
  RfpAnalysis,
  GrantResearchDossierOptions
} from '../types.js';

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
