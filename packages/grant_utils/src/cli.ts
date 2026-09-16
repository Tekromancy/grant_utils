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
  searchGrantsGov,
  getKPISummary,
  getUpcomingEvents,
  type GrantOpportunity,
  type ApplicantProfile,
  type ResearchQuery,
  type GrantRecord,
  type CalendarEvent
} from './index.js';
import {
  loadGrantsFromDirectory,
  loadCalendarFromFile
} from './nodeFs.js';

function printHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║   🌟 @tekromancy/grant_utils — Universal Grant Research CLI       ║
╚═══════════════════════════════════════════════════════════════════╝

Usage:
  grant-research <command> [arguments] [flags]

Commands:
  search <keywords> [--limit <n>] [--format json|table|csv]
      Search open and forecasted federal grant opportunities on Grants.gov.

  load <directory> [--format json|table|csv]
      Load and parse all markdown grant proposals in a directory and print
      executive KPI pipeline summaries.

  calendar <fileOrDir> [--limit <n>] [--format json|table|csv]
      Parse an RFC 5545 .ics file and list upcoming submission deadlines
      and review milestones.

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
  grant-research search "clean energy workforce" --limit 5
  grant-research load ./data/grants --format table
  grant-research calendar ./calendar.ics --limit 10
  grant-research dorks "workforce development" --location "Texas"
  grant-research analyze-rfp ./solicitation.txt
  grant-research assess ./opportunity.json ./profile.json
`);
}

function getFlag(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

function outputFormatted<T>(data: T[], format: string = 'table', headers: Array<keyof T & string>) {
  if (format === 'json') {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (format === 'csv') {
    console.log(headers.join(','));
    for (const item of data) {
      const row = headers.map(h => {
        const val = String((item as any)[h] ?? '');
        return `"${val.replace(/"/g, '""')}"`;
      });
      console.log(row.join(','));
    }
    return;
  }

  // Default table
  console.table(data, headers as string[]);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    process.exit(0);
  }

  const format = getFlag(args, '--format') || 'table';

  if (command === 'search') {
    const keywords = args[1];
    if (!keywords) {
      console.error('Error: Please specify search keywords. Example: grant-research search "climate resilience"');
      process.exit(1);
    }
    const limitStr = getFlag(args, '--limit');
    const limit = limitStr ? parseInt(limitStr, 10) : 10;

    console.log(`\n🔍 Searching Grants.gov for: "${keywords}" (limit: ${limit})...\n`);
    const opps = await searchGrantsGov(keywords, { limit });

    if (opps.length === 0) {
      console.log('No matching opportunities found (or network unavailable).');
      return;
    }

    const rows = opps.map(o => ({
      id: o.id,
      title: o.title.slice(0, 40),
      funder: o.funder.slice(0, 30),
      deadline: o.deadline,
      amount: o.fundingAmountMax ? `$${o.fundingAmountMax.toLocaleString()}` : 'Varies',
      status: o.status
    }));

    outputFormatted(rows, format, ['id', 'title', 'funder', 'deadline', 'amount', 'status']);
    return;
  }

  if (command === 'load') {
    const dir = args[1];
    if (!dir) {
      console.error('Error: Please specify directory to load. Example: grant-research load ./data/grants');
      process.exit(1);
    }
    const fullDir = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(fullDir)) {
      console.error(`Error: Directory not found: ${fullDir}`);
      process.exit(1);
    }

    const grants = loadGrantsFromDirectory(fullDir);
    const kpis = getKPISummary(undefined, grants);

    console.log(`\n📊 Loaded ${grants.length} grants from ${dir}`);
    console.log(`   Total Active Pipeline: $${kpis.totalPipelineAmount.toLocaleString()}`);
    console.log(`   Proposals Count:       ${kpis.totalGrantsCount}`);

    const rows = grants.map(g => ({
      id: g.id,
      title: g.title.slice(0, 35),
      funder: g.funder.slice(0, 25),
      amount: `$${g.amount.toLocaleString()}`,
      deadline: g.deadline,
      tier: g.tier,
      category: g.category,
      status: g.status
    }));

    console.log('\nGrants Overview:');
    outputFormatted(rows, format, ['id', 'title', 'funder', 'amount', 'deadline', 'category', 'status']);
    return;
  }

  if (command === 'calendar') {
    const target = args[1];
    if (!target) {
      console.error('Error: Please specify calendar file (.ics). Example: grant-research calendar ./calendar.ics');
      process.exit(1);
    }
    const fullPath = path.resolve(process.cwd(), target);
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: File not found: ${fullPath}`);
      process.exit(1);
    }

    const events = loadCalendarFromFile(fullPath);
    const limitStr = getFlag(args, '--limit');
    const limit = limitStr ? parseInt(limitStr, 10) : 15;
    const upcoming = getUpcomingEvents(undefined, limit, events);

    console.log(`\n📅 Upcoming Deadlines & Milestones (${upcoming.length} events):`);
    const rows = upcoming.map(e => ({
      date: e.startDate,
      title: e.title.slice(0, 45),
      category: e.categories.join(', '),
      amount: e.amount ? `$${e.amount.toLocaleString()}` : '-',
      grantFile: e.grantFile || '-'
    }));

    outputFormatted(rows, format, ['date', 'title', 'category', 'amount', 'grantFile']);
    return;
  }

  if (command === 'dorks') {
    const topic = args[1];
    if (!topic) {
      console.error('Error: Please specify a research topic. Example: grant-research dorks "youth STEM"');
      process.exit(1);
    }
    const orgType = getFlag(args, '--org-type') || 'nonprofit';
    const location = getFlag(args, '--location');

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

    const outPath = getFlag(args, '--out');
    if (outPath) {
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
