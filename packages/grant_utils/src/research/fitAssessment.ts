import type {
  GrantOpportunity,
  ApplicantProfile,
  GrantFitAssessment
} from '../types.js';

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
