import type { GrantRecord, CalendarEvent, MarkdownDoc } from '@tekromancy/grant_utils';

export const SAMPLE_FICTITIOUS_GRANTS: GrantRecord[] = [
  {
    id: 'apex_clean_energy_microgrid',
    title: 'Apex Clean Energy & Resilient Community Microgrid',
    funder: 'Apex Climate & Energy Foundation',
    program: 'Clean Energy Resiliency Challenge',
    amount: 350000,
    amountFormatted: '$350,000',
    deadline: '2026-10-15',
    deadlineFormatted: 'October 15, 2026',
    tier: 'Tier 1 (Fall Immediate)',
    category: 'National Foundation',
    matchPercentage: 0,
    grantType: 'Foundation Grant',
    portalUrl: 'https://apexclimate.org/grants',
    strategicPriority: 'Decentralized Clean Microgrids',
    status: 'Ready to Submit',
    fileName: '01_apex_clean_energy_microgrid.md',
    filePath: 'data/example/grants/01_apex_clean_energy_microgrid.md',
    summary: 'Deploying community solar microgrids and smart battery storage in energy-burdened districts.',
    content: `---
id: apex_clean_energy_microgrid
title: "Apex Clean Energy & Resilient Community Microgrid"
funder: "Apex Climate & Energy Foundation"
program: "Clean Energy Resiliency Challenge"
amount: 350000
amountFormatted: "$350,000"
deadline: "2026-10-15"
deadlineFormatted: "October 15, 2026"
tier: "Tier 1 (Fall Immediate)"
category: "National Foundation"
matchPercentage: 0
grantType: "Foundation Grant"
portalUrl: "https://apexclimate.org/grants"
strategicPriority: "Decentralized Clean Microgrids"
status: "Ready to Submit"
---

# Apex Clean Energy & Resilient Community Microgrid

**Funder:** Apex Climate & Energy Foundation  
**Request:** $350,000 (24-Month Project)  
**Focus:** Clean Energy Resiliency & Battery Storage  

## 1. Executive Summary
This initiative deploys rooftop solar arrays and smart battery storage systems across community facilities, creating an islandable microgrid that provides continuous power during grid outages while lowering energy bills.

## 2. Work Plan & Milestones
- **Q1 2027:** Site feasibility engineering and electrical audits.
- **Q2 2027:** Procurement of bifacial solar modules and lithium iron phosphate batteries.
- **Q3 2027:** Installation, grid interconnection, and commissioning.
- **Q4 2027:** Community energy monitoring dashboard launch.
`,
    wordCount: 150
  },
  {
    id: 'horizon_stem_robotics_academy',
    title: 'Horizon STEM & Open Robotics Workforce Academy',
    funder: 'Horizon Technology & Innovation Fund',
    program: 'Future Workforce & STEM Equity',
    amount: 250000,
    amountFormatted: '$250,000',
    deadline: '2026-11-20',
    deadlineFormatted: 'November 20, 2026',
    tier: 'Tier 1 (Fall Immediate)',
    category: 'Corporate Giving',
    matchPercentage: 0,
    grantType: 'Corporate Giving Grant',
    portalUrl: 'https://horizonfund.org/stem',
    strategicPriority: 'Open Source Hardware & Robotics',
    status: 'Drafting',
    fileName: '02_horizon_stem_robotics_academy.md',
    filePath: 'data/example/grants/02_horizon_stem_robotics_academy.md',
    summary: 'Hands-on robotics fabrication and open-source coding academy for youth and career switchers.',
    content: `---
id: horizon_stem_robotics_academy
title: "Horizon STEM & Open Robotics Workforce Academy"
funder: "Horizon Technology & Innovation Fund"
program: "Future Workforce & STEM Equity"
amount: 250000
amountFormatted: "$250,000"
deadline: "2026-11-20"
deadlineFormatted: "November 20, 2026"
tier: "Tier 1 (Fall Immediate)"
category: "Corporate Giving"
matchPercentage: 0
grantType: "Corporate Giving Grant"
portalUrl: "https://horizonfund.org/stem"
strategicPriority: "Open Source Hardware & Robotics"
status: "Drafting"
---

# Horizon STEM & Open Robotics Workforce Academy

**Funder:** Horizon Technology & Innovation Fund  
**Request:** $250,000  
**Target Group:** 150 High School & Community College Students  

## 1. Program Scope
Providing accessible technical education in autonomous robotics, embedded microcontrollers, and open-source CAD design to prepare youth for high-demand technical careers.
`,
    wordCount: 120
  },
  {
    id: 'evergreen_urban_agroecology',
    title: 'Evergreen Urban Agroecology & Food Resiliency Grant',
    funder: 'Evergreen Ecological Trust',
    program: 'Urban Agriculture & Soil Health',
    amount: 180000,
    amountFormatted: '$180,000',
    deadline: '2026-12-15',
    deadlineFormatted: 'December 15, 2026',
    tier: 'Tier 2 (Winter Core)',
    category: 'Regional Foundation',
    matchPercentage: 0,
    grantType: 'Regional Grant',
    portalUrl: 'https://evergreentrust.org',
    strategicPriority: 'Regenerative Agriculture & Food Access',
    status: 'Planned',
    fileName: '03_evergreen_urban_agroecology.md',
    filePath: 'data/example/grants/03_evergreen_urban_agroecology.md',
    summary: 'Establishing community-managed urban orchards, compost hubs, and fresh produce distribution.',
    content: `---
id: evergreen_urban_agroecology
title: "Evergreen Urban Agroecology & Food Resiliency Grant"
funder: "Evergreen Ecological Trust"
program: "Urban Agriculture & Soil Health"
amount: 180000
amountFormatted: "$180,000"
deadline: "2026-12-15"
deadlineFormatted: "December 15, 2026"
tier: "Tier 2 (Winter Core)"
category: "Regional Foundation"
matchPercentage: 0
grantType: "Regional Grant"
portalUrl: "https://evergreentrust.org"
strategicPriority: "Regenerative Agriculture & Food Access"
status: "Planned"
---

# Evergreen Urban Agroecology & Food Resiliency Grant

**Funder:** Evergreen Ecological Trust  
**Request:** $180,000  
**Focus:** Urban Agroecology & Soil Regeneration  
`,
    wordCount: 100
  },
  {
    id: 'metropolis_digital_equity',
    title: 'Metropolis Community Fiber & Digital Inclusion Grant',
    funder: 'Metropolis Municipal Innovation Office',
    program: 'Digital Equity & Public Connectivity',
    amount: 120000,
    amountFormatted: '$120,000',
    deadline: '2027-01-30',
    deadlineFormatted: 'January 30, 2027',
    tier: 'Tier 2 (Winter Core)',
    category: 'Municipal',
    matchPercentage: 0,
    grantType: 'Municipal Contract',
    portalUrl: 'https://metropolis.gov/digital-equity',
    strategicPriority: 'High-Speed Broadband & Device Access',
    status: 'Drafting',
    fileName: '04_metropolis_digital_equity.md',
    filePath: 'data/example/grants/04_metropolis_digital_equity.md',
    summary: 'Connecting unserved neighborhoods with open fiber and providing refurbished laptops.',
    content: `---
id: metropolis_digital_equity
title: "Metropolis Community Fiber & Digital Inclusion Grant"
funder: "Metropolis Municipal Innovation Office"
program: "Digital Equity & Public Connectivity"
amount: 120000
amountFormatted: "$120,000"
deadline: "2027-01-30"
deadlineFormatted: "January 30, 2027"
tier: "Tier 2 (Winter Core)"
category: "Municipal"
matchPercentage: 0
grantType: "Municipal Contract"
portalUrl: "https://metropolis.gov/digital-equity"
strategicPriority: "High-Speed Broadband & Device Access"
status: "Drafting"
---

# Metropolis Community Fiber & Digital Inclusion Grant
`,
    wordCount: 90
  },
  {
    id: 'beacon_health_mobile_clinic',
    title: 'Beacon Community Health Outreach & Mobile Wellness',
    funder: 'Beacon Health Philanthropy',
    program: 'Community Preventive Care Initiative',
    amount: 200000,
    amountFormatted: '$200,000',
    deadline: '2027-02-28',
    deadlineFormatted: 'February 28, 2027',
    tier: 'Tier 2 (Winter Core)',
    category: 'Regional Foundation',
    matchPercentage: 0,
    grantType: 'Health Grant',
    portalUrl: 'https://beaconhealth.org',
    strategicPriority: 'Mobile Preventive Healthcare',
    status: 'Planned',
    fileName: '05_beacon_health_mobile_clinic.md',
    filePath: 'data/example/grants/05_beacon_health_mobile_clinic.md',
    summary: 'Operating a fully equipped mobile wellness van providing screenings, vaccinations, and nutrition counseling.',
    content: `---
id: beacon_health_mobile_clinic
title: "Beacon Community Health Outreach & Mobile Wellness"
funder: "Beacon Health Philanthropy"
program: "Community Preventive Care Initiative"
amount: 200000
amountFormatted: "$200,000"
deadline: "2027-02-28"
deadlineFormatted: "February 28, 2027"
tier: "Tier 2 (Winter Core)"
category: "Regional Foundation"
matchPercentage: 0
grantType: "Health Grant"
portalUrl: "https://beaconhealth.org"
strategicPriority: "Mobile Preventive Healthcare"
status: "Planned"
---

# Beacon Community Health Outreach & Mobile Wellness
`,
    wordCount: 95
  },
  {
    id: 'summit_enterprise_seed_fund',
    title: 'Summit Cooperative & Small Enterprise Capital Fund',
    funder: 'Summit Community Economic Fund',
    program: 'Democratic Enterprise & Seed Capital Challenge',
    amount: 300000,
    amountFormatted: '$300,000',
    deadline: '2027-04-15',
    deadlineFormatted: 'April 15, 2027',
    tier: 'Tier 3 (Spring Major)',
    category: 'National Foundation',
    matchPercentage: 25,
    grantType: 'Revolving Capital Grant',
    portalUrl: 'https://summitfund.org',
    strategicPriority: 'Non-Extractive Revolving Debt Pool',
    status: 'Planned',
    fileName: '06_summit_enterprise_seed_fund.md',
    filePath: 'data/example/grants/06_summit_enterprise_seed_fund.md',
    summary: 'Seed capitalization for worker-owned cooperatives and small neighborhood businesses.',
    content: `---
id: summit_enterprise_seed_fund
title: "Summit Cooperative & Small Enterprise Capital Fund"
funder: "Summit Community Economic Fund"
program: "Democratic Enterprise & Seed Capital Challenge"
amount: 300000
amountFormatted: "$300,000"
deadline: "2027-04-15"
deadlineFormatted: "April 15, 2027"
tier: "Tier 3 (Spring Major)"
category: "National Foundation"
matchPercentage: 25
grantType: "Revolving Capital Grant"
portalUrl: "https://summitfund.org"
strategicPriority: "Non-Extractive Revolving Debt Pool"
status: "Planned"
---

# Summit Cooperative & Small Enterprise Capital Fund
`,
    wordCount: 110
  },
  {
    id: 'pioneer_open_science',
    title: 'Pioneer Open Science & Collaborative Research Lab',
    funder: 'Pioneer Global Research Foundation',
    program: 'Open Access Research Infrastructure',
    amount: 500000,
    amountFormatted: '$500,000',
    deadline: '2027-05-30',
    deadlineFormatted: 'May 30, 2027',
    tier: 'Tier 3 (Spring Major)',
    category: 'National Foundation',
    matchPercentage: 0,
    grantType: 'Research Grant',
    portalUrl: 'https://pioneergrants.org',
    strategicPriority: 'Open Data & Community Science',
    status: 'Planned',
    fileName: '07_pioneer_open_science.md',
    filePath: 'data/example/grants/07_pioneer_open_science.md',
    summary: 'Developing open science tools, open dataset repositories, and distributed research protocols.',
    content: `---
id: pioneer_open_science
title: "Pioneer Open Science & Collaborative Research Lab"
funder: "Pioneer Global Research Foundation"
program: "Open Access Research Infrastructure"
amount: 500000
amountFormatted: "$500,000"
deadline: "2027-05-30"
deadlineFormatted: "May 30, 2027"
tier: "Tier 3 (Spring Major)"
category: "National Foundation"
matchPercentage: 0
grantType: "Research Grant"
portalUrl: "https://pioneergrants.org"
strategicPriority: "Open Data & Community Science"
status: "Planned"
---

# Pioneer Open Science & Collaborative Research Lab
`,
    wordCount: 105
  },
  {
    id: 'federal_resilient_infrastructure',
    title: 'Federal Regional Innovation & Resilient Infrastructure',
    funder: 'Federal Economic Development Administration',
    program: 'Regional Technology & Resilient Innovation Challenge',
    amount: 750000,
    amountFormatted: '$750,000',
    deadline: '2027-06-30',
    deadlineFormatted: 'June 30, 2027',
    tier: 'Tier 4 (Summer Federal)',
    category: 'Federal',
    matchPercentage: 20,
    grantType: 'Competitive Federal Challenge',
    portalUrl: 'https://grants.gov',
    strategicPriority: 'Regional Economic Innovation Hub',
    status: 'Planned',
    fileName: '08_federal_resilient_infrastructure.md',
    filePath: 'data/example/grants/08_federal_resilient_infrastructure.md',
    summary: 'Building regional prototyping centers, clean energy testbeds, and advanced manufacturing shared spaces.',
    content: `---
id: federal_resilient_infrastructure
title: "Federal Regional Innovation & Resilient Infrastructure"
funder: "Federal Economic Development Administration"
program: "Regional Technology & Resilient Innovation Challenge"
amount: 750000
amountFormatted: "$750,000"
deadline: "2027-06-30"
deadlineFormatted: "June 30, 2027"
tier: "Tier 4 (Summer Federal)"
category: "Federal"
matchPercentage: 20
grantType: "Competitive Federal Challenge"
portalUrl: "https://grants.gov"
strategicPriority: "Regional Economic Innovation Hub"
status: "Planned"
---

# Federal Regional Innovation & Resilient Infrastructure
`,
    wordCount: 130
  }
];

export const SAMPLE_FICTITIOUS_EVENTS: CalendarEvent[] = [
  {
    uid: 'apex-microgrid-deadline@sample.org',
    title: '[DEADLINE] Apex Climate Foundation: Microgrid Challenge',
    description: 'Submission deadline for Apex Clean Energy & Resilient Community Microgrid ($350,000).\nFunder: Apex Climate & Energy Foundation.\nPackage: data/example/grants/01_apex_clean_energy_microgrid.md',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    location: 'Apex Grants Portal',
    categories: ['DEADLINE', 'FOUNDATION', 'ENERGY'],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P7D', description: 'Upcoming Deadline: Apex Microgrid Grant' },
      { trigger: '-P1D', description: 'FINAL DEADLINE TOMORROW: Apex Microgrid Grant' }
    ],
    grantFile: '01_apex_clean_energy_microgrid.md',
    amount: 350000
  },
  {
    uid: 'horizon-stem-deadline@sample.org',
    title: '[DEADLINE] Horizon Fund: Open Robotics Workforce Academy',
    description: 'Submission deadline for Horizon STEM & Open Robotics Academy ($250,000).\nFunder: Horizon Technology & Innovation Fund.\nPackage: data/example/grants/02_horizon_stem_robotics_academy.md',
    startDate: '2026-11-20',
    endDate: '2026-11-20',
    location: 'Horizon Portal',
    categories: ['DEADLINE', 'CORPORATE', 'STEM'],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P7D', description: 'Upcoming Deadline: Horizon Robotics Academy' }
    ],
    grantFile: '02_horizon_stem_robotics_academy.md',
    amount: 250000
  },
  {
    uid: 'evergreen-agro-deadline@sample.org',
    title: '[DEADLINE] Evergreen Trust: Urban Agroecology Grant',
    description: 'Submission deadline for Evergreen Urban Agroecology Grant ($180,000).\nFunder: Evergreen Ecological Trust.\nPackage: data/example/grants/03_evergreen_urban_agroecology.md',
    startDate: '2026-12-15',
    endDate: '2026-12-15',
    location: 'Evergreen Online Portal',
    categories: ['DEADLINE', 'REGIONAL', 'AGRICULTURE'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '03_evergreen_urban_agroecology.md',
    amount: 180000
  },
  {
    uid: 'metropolis-digital-deadline@sample.org',
    title: '[DEADLINE] Metropolis Innovation: Digital Equity Challenge',
    description: 'Submission deadline for Metropolis Digital Inclusion Grant ($120,000).\nFunder: Metropolis Municipal Innovation Office.\nPackage: data/example/grants/04_metropolis_digital_equity.md',
    startDate: '2027-01-30',
    endDate: '2027-01-30',
    location: 'Metropolis City Portal',
    categories: ['DEADLINE', 'MUNICIPAL', 'BROADBAND'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '04_metropolis_digital_equity.md',
    amount: 120000
  },
  {
    uid: 'beacon-clinic-deadline@sample.org',
    title: '[DEADLINE] Beacon Philanthropy: Mobile Wellness Clinic',
    description: 'Submission deadline for Beacon Community Health Outreach ($200,000).\nFunder: Beacon Health Philanthropy.\nPackage: data/example/grants/05_beacon_health_mobile_clinic.md',
    startDate: '2027-02-28',
    endDate: '2027-02-28',
    location: 'Beacon Health Portal',
    categories: ['DEADLINE', 'HEALTH', 'REGIONAL'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '05_beacon_health_mobile_clinic.md',
    amount: 200000
  },
  {
    uid: 'summit-seed-deadline@sample.org',
    title: '[DEADLINE] Summit Fund: Democratic Enterprise Capital',
    description: 'Submission deadline for Summit Cooperative Capital Fund ($300,000).\nFunder: Summit Community Economic Fund.\nPackage: data/example/grants/06_summit_enterprise_seed_fund.md',
    startDate: '2027-04-15',
    endDate: '2027-04-15',
    location: 'Summit Grants Portal',
    categories: ['DEADLINE', 'FOUNDATION', 'ECONOMIC'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '06_summit_enterprise_seed_fund.md',
    amount: 300000
  },
  {
    uid: 'pioneer-science-deadline@sample.org',
    title: '[DEADLINE] Pioneer Foundation: Open Science Lab',
    description: 'Submission deadline for Pioneer Open Science Grant ($500,000).\nFunder: Pioneer Global Research Foundation.\nPackage: data/example/grants/07_pioneer_open_science.md',
    startDate: '2027-05-30',
    endDate: '2027-05-30',
    location: 'Pioneer Portal',
    categories: ['DEADLINE', 'RESEARCH', 'OPEN_SCIENCE'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '07_pioneer_open_science.md',
    amount: 500000
  },
  {
    uid: 'federal-infrastructure-deadline@sample.org',
    title: '[DEADLINE] EDA: Regional Resilient Infrastructure Challenge',
    description: 'Submission deadline for Federal Regional Innovation & Resilient Infrastructure ($750,000).\nFunder: Federal Economic Development Administration.\nPackage: data/example/grants/08_federal_resilient_infrastructure.md',
    startDate: '2027-06-30',
    endDate: '2027-06-30',
    location: 'Grants.gov',
    categories: ['DEADLINE', 'FEDERAL', 'INFRASTRUCTURE'],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P14D', description: '2-Week Federal Deadline Warning: EDA Challenge' }
    ],
    grantFile: '08_federal_resilient_infrastructure.md',
    amount: 750000
  }
];

export const SAMPLE_FICTITIOUS_DOCS: MarkdownDoc[] = [
  {
    id: 'StrategicBlueprint',
    fileName: 'StrategicBlueprint.md',
    relativePath: 'data/example/StrategicBlueprint.md',
    title: 'Master Grant Execution Blueprint & 52-Week Capitalization Strategy',
    category: 'strategy',
    excerpt: 'Strategic multi-year capitalization roadmap for community initiatives.',
    content: `# Master Grant Execution Blueprint & 52-Week Capitalization Strategy

## Example Community Foundation (Example.org)
*501(c)(3) Public Charity | Universal Grant Research & Capitalization Hub*

---

### 1. Executive Strategy & Pipeline Target
Example.org operates an active multi-tiered funding pipeline across Federal, National Foundation, Municipal, and Corporate philanthropy sources. 

- **Target Annual Operating Budget:** $550,000
- **Total Drafted Pipeline Value:** $2,650,000
- **Statutory Cost-Share Matching Sourced:** $125,000

---

### 2. Quarterly Sprints & Allocation
1. **Q1 (Fall Sprints):** Apex Clean Energy ($350k) and Horizon Robotics ($250k).
2. **Q2 (Winter Core):** Evergreen Urban Agroecology ($180k), Metropolis Digital Equity ($120k), Beacon Health Clinic ($200k).
3. **Q3 (Spring Major):** Summit Capital Fund ($300k) and Pioneer Open Science ($500k).
4. **Q4 (Summer Federal):** Federal EDA Regional Resilient Infrastructure ($750k).
`,
    lineCount: 30,
    wordCount: 150
  },
  ...SAMPLE_FICTITIOUS_GRANTS.map(g => ({
    id: g.id,
    fileName: g.fileName,
    relativePath: g.filePath,
    title: g.title,
    category: 'grant',
    excerpt: g.summary,
    content: g.content,
    lineCount: g.content.split('\n').length,
    wordCount: g.wordCount,
    frontmatter: {
      id: g.id,
      title: g.title,
      funder: g.funder,
      program: g.program,
      amount: g.amount,
      deadline: g.deadline,
      category: g.category,
      tier: g.tier,
      matchPercentage: g.matchPercentage,
      status: g.status
    }
  }))
];
