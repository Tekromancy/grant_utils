#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  buildWebResearchQueries,
  buildGrantsGovSearchUrl,
  buildProPublicaSearchUrl,
  analyzeRfpText,
  evaluateGrantFit,
  generateGrantResearchDossier,
  type GrantOpportunity,
  type ApplicantProfile,
  type ResearchQuery
} from './index.js';

function printHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║   🌟 @tekromancy/grant_utils — Universal Grant Research CLI       ║
╚═══════════════════════════════════════════════════════════════════╝

Usage:
  grant-research <command> [arguments] [flags]

Commands:
  dorks <topic> [--org-type <type>] [--location <loc>]
      Generate laser-targeted search queries to uncover RFPs, NOFOs,
      and 990-PF grant files on the web.

  analyze-rfp <rfpTextFilePath>
      Extract deadlines, funding ranges, matching requirements,
      required attachments, and scoring rubrics from raw RFP text.

  assess <oppJsonPath> <profileJsonPath>
      Evaluate mission fit, eligibility, and competitive alignment
      between an opportunity and an applicant profile.

  create-dossier <oppJsonPath> [--out <filePath>]
      Generate a publication-ready Markdown Grant Dossier with
      complete YAML frontmatter.

Examples:
  grant-research dorks "clean energy workforce" --location "Texas"
  grant-research analyze-rfp ./solicitation.txt
  grant-research assess ./opportunity.json ./profile.json
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    process.exit(0);
  }

  if (command === 'dorks') {
    const topic = args[1];
    if (!topic) {
      console.error('Error: Please specify a research topic. Example: grant-research dorks "youth STEM"');
      process.exit(1);
    }
    const orgTypeIdx = args.indexOf('--org-type');
    const orgType = orgTypeIdx !== -1 ? args[orgTypeIdx + 1] : 'nonprofit';
    const locIdx = args.indexOf('--location');
    const location = locIdx !== -1 ? args[locIdx + 1] : undefined;

    console.log(`\n🔍 Generating targeted web research queries for: "${topic}"\n`);
    const queries = buildWebResearchQueries(topic, orgType, location);
    queries.forEach((q, i) => {
      console.log(`[${i + 1}] ${q}`);
    });
    console.log('\nCopy and paste these queries into Google, Bing, or your research browser.');
    return;
  }

  if (command === 'analyze-rfp') {
    const filePath = args[1];
    if (!filePath || !fs.existsSync(filePath)) {
      console.error(`Error: File not found at path: ${filePath}`);
      process.exit(1);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const analysis = analyzeRfpText(content);
    console.log('\n📋 RFP / NOFO Deconstruction Results:');
    console.log(JSON.stringify(analysis, null, 2));
    return;
  }

  if (command === 'assess') {
    const oppPath = args[1];
    const profilePath = args[2];
    if (!oppPath || !fs.existsSync(oppPath)) {
      console.error(`Error: Opportunity JSON file not found: ${oppPath}`);
      process.exit(1);
    }
    if (!profilePath || !fs.existsSync(profilePath)) {
      console.error(`Error: Applicant profile JSON file not found: ${profilePath}`);
      process.exit(1);
    }
    const opp: GrantOpportunity = JSON.parse(fs.readFileSync(oppPath, 'utf8'));
    const profile: ApplicantProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

    const assessment = evaluateGrantFit(opp, profile);
    console.log(`\n🎯 Fit Assessment for ${opp.title} vs ${profile.name}:`);
    console.log(`   Overall Score:  ${assessment.overallScore}/100 (Grade: ${assessment.fitGrade})`);
    console.log(`   Recommendation: ${assessment.recommendation}`);
    console.log(`   Eligible:       ${assessment.eligibilityCheck.isEligible ? 'YES' : 'NO'}`);
    console.log('\nStrengths:');
    assessment.strengths.forEach(s => console.log(`  • ${s}`));
    if (assessment.redFlags.length > 0) {
      console.log('\nRed Flags:');
      assessment.redFlags.forEach(r => console.log(`  ⚠️ ${r}`));
    }
    return;
  }

  if (command === 'create-dossier') {
    const oppPath = args[1];
    if (!oppPath || !fs.existsSync(oppPath)) {
      console.error(`Error: Opportunity JSON file not found: ${oppPath}`);
      process.exit(1);
    }
    const opp: GrantOpportunity = JSON.parse(fs.readFileSync(oppPath, 'utf8'));
    const dossier = generateGrantResearchDossier(opp);

    const outIdx = args.indexOf('--out');
    if (outIdx !== -1 && args[outIdx + 1]) {
      const outPath = args[outIdx + 1];
      fs.writeFileSync(outPath, dossier, 'utf8');
      console.log(`✅ Saved grant dossier to ${outPath}`);
    } else {
      console.log(dossier);
    }
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

main().catch(err => {
  console.error('Fatal CLI Error:', err.message);
  process.exit(1);
});
