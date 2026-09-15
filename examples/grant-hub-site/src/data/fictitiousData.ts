import type { 
  GrantRecord, 
  CalendarEvent, 
  MarkdownDoc, 
  GrantOpportunity, 
  FunderProfile, 
  ApplicantProfile 
} from '@tekromancy/grant_utils';

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
    id: 'cascade_watershed_ecology',
    title: 'Cascade Watershed & River Ecology Stewardship Grant',
    funder: 'Cascade River Ecological Foundation',
    program: 'Riparian Habitat Restoration & Clean Water Challenge',
    amount: 225000,
    amountFormatted: '$225,000',
    deadline: '2027-03-15',
    deadlineFormatted: 'March 15, 2027',
    tier: 'Tier 3 (Spring Major)',
    category: 'Regional Foundation',
    matchPercentage: 0,
    grantType: 'Conservation Grant',
    portalUrl: 'https://cascaderiverfoundation.org',
    strategicPriority: 'Watershed & Riverbank Biodiversity',
    status: 'Planned',
    fileName: '06_cascade_watershed_ecology.md',
    filePath: 'data/example/grants/06_cascade_watershed_ecology.md',
    summary: 'Restoring critical urban riverbank corridors, native willow buffers, and water-quality bioswales.',
    content: `---
id: cascade_watershed_ecology
title: "Cascade Watershed & River Ecology Stewardship Grant"
funder: "Cascade River Ecological Foundation"
program: "Riparian Habitat Restoration & Clean Water Challenge"
amount: 225000
amountFormatted: "$225,000"
deadline: "2027-03-15"
deadlineFormatted: "March 15, 2027"
tier: "Tier 3 (Spring Major)"
category: "Regional Foundation"
matchPercentage: 0
grantType: "Conservation Grant"
portalUrl: "https://cascaderiverfoundation.org"
strategicPriority: "Watershed & Riverbank Biodiversity"
status: "Planned"
---

# Cascade Watershed & River Ecology Stewardship Grant

**Funder:** Cascade River Ecological Foundation  
**Request:** $225,000  
**Focus:** Riparian Bio-Filtration & Native Wetland Restoration  
`,
    wordCount: 115
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
    fileName: '07_summit_enterprise_seed_fund.md',
    filePath: 'data/example/grants/07_summit_enterprise_seed_fund.md',
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
    id: 'urban_canopy_forestry_initiative',
    title: 'Metropolitan Urban Canopy & Heat Island Mitigation',
    funder: 'Urban Green Canopy Trust',
    program: 'Neighborhood Tree Planting & Climate Adaptation',
    amount: 160000,
    amountFormatted: '$160,000',
    deadline: '2027-04-30',
    deadlineFormatted: 'April 30, 2027',
    tier: 'Tier 3 (Spring Major)',
    category: 'Regional Foundation',
    matchPercentage: 0,
    grantType: 'Urban Forestry Grant',
    portalUrl: 'https://urbangreencanopy.org',
    strategicPriority: 'Urban Shade Canopies & Ambient Cooling',
    status: 'Planned',
    fileName: '08_urban_canopy_forestry_initiative.md',
    filePath: 'data/example/grants/08_urban_canopy_forestry_initiative.md',
    summary: 'Planting 2,000 native shade trees along pedestrian transit corridors in heat-vulnerable zones.',
    content: `---
id: urban_canopy_forestry_initiative
title: "Metropolitan Urban Canopy & Heat Island Mitigation"
funder: "Urban Green Canopy Trust"
program: "Neighborhood Tree Planting & Climate Adaptation"
amount: 160000
amountFormatted: "$160,000"
deadline: "2027-04-30"
deadlineFormatted: "April 30, 2027"
tier: "Tier 3 (Spring Major)"
category: "Regional Foundation"
matchPercentage: 0
grantType: "Urban Forestry Grant"
portalUrl: "https://urbangreencanopy.org"
strategicPriority: "Urban Shade Canopies & Ambient Cooling"
status: "Planned"
---

# Metropolitan Urban Canopy & Heat Island Mitigation
`,
    wordCount: 105
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
    fileName: '09_pioneer_open_science.md',
    filePath: 'data/example/grants/09_pioneer_open_science.md',
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
    fileName: '10_federal_resilient_infrastructure.md',
    filePath: 'data/example/grants/10_federal_resilient_infrastructure.md',
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
  },
  {
    id: 'community_arts_media_archive',
    title: 'Civic Storytelling & Open Cultural Media Archive',
    funder: 'Luminary Cultural Arts Trust',
    program: 'Digital Humanities & Living History Archive',
    amount: 140000,
    amountFormatted: '$140,000',
    deadline: '2027-07-15',
    deadlineFormatted: 'July 15, 2027',
    tier: 'Tier 4 (Summer Major)',
    category: 'Regional Foundation',
    matchPercentage: 0,
    grantType: 'Arts & Culture Grant',
    portalUrl: 'https://luminaryarts.org',
    strategicPriority: 'Oral History & Open Access Digital Archiving',
    status: 'Planned',
    fileName: '11_community_arts_media_archive.md',
    filePath: 'data/example/grants/11_community_arts_media_archive.md',
    summary: 'Documenting local community narratives, preserving historic audio-visual assets, and training youth archivists.',
    content: `---
id: community_arts_media_archive
title: "Civic Storytelling & Open Cultural Media Archive"
funder: "Luminary Cultural Arts Trust"
program: "Digital Humanities & Living History Archive"
amount: 140000
amountFormatted: "$140,000"
deadline: "2027-07-15"
deadlineFormatted: "July 15, 2027"
tier: "Tier 4 (Summer Major)"
category: "Regional Foundation"
matchPercentage: 0
grantType: "Arts & Culture Grant"
portalUrl: "https://luminaryarts.org"
strategicPriority: "Oral History & Open Access Digital Archiving"
status: "Planned"
---

# Civic Storytelling & Open Cultural Media Archive
`,
    wordCount: 100
  },
  {
    id: 'disaster_mutual_aid_network',
    title: 'Community Emergency Preparedness & Mutual Aid Resilience',
    funder: 'National Resilient Communities Fund',
    program: 'Grassroots Disaster Readiness & Mesh Comms',
    amount: 400000,
    amountFormatted: '$400,000',
    deadline: '2027-08-30',
    deadlineFormatted: 'August 30, 2027',
    tier: 'Tier 4 (Summer Major)',
    category: 'National Foundation',
    matchPercentage: 0,
    grantType: 'Disaster Relief Grant',
    portalUrl: 'https://resilientcommunitiesfund.org',
    strategicPriority: 'Off-Grid Mesh Communications & Emergency Supply Caches',
    status: 'Planned',
    fileName: '12_disaster_mutual_aid_network.md',
    filePath: 'data/example/grants/12_disaster_mutual_aid_network.md',
    summary: 'Deploying off-grid LoRa radio networks, emergency solar chargers, and neighborhood mutual aid logistics hubs.',
    content: `---
id: disaster_mutual_aid_network
title: "Community Emergency Preparedness & Mutual Aid Resilience"
funder: "National Resilient Communities Fund"
program: "Grassroots Disaster Readiness & Mesh Comms"
amount: 400000
amountFormatted: "$400,000"
deadline: "2027-08-30"
deadlineFormatted: "August 30, 2027"
tier: "Tier 4 (Summer Major)"
category: "National Foundation"
matchPercentage: 0
grantType: "Disaster Relief Grant"
portalUrl: "https://resilientcommunitiesfund.org"
strategicPriority: "Off-Grid Mesh Communications & Emergency Supply Caches"
status: "Planned"
---

# Community Emergency Preparedness & Mutual Aid Resilience
`,
    wordCount: 125
  }
];

export const SAMPLE_FICTITIOUS_EVENTS: CalendarEvent[] = [
  // --- INSTITUTIONAL GOVERNANCE & AUDITS ---
  {
    uid: 'inst-sam-gov-renewal-2026@example.org',
    title: '[COMPLIANCE] Annual SAM.gov & UEI Entity Registration Renewal',
    description: 'Annual verification and renewal of organization SAM.gov Unique Entity Identifier (UEI) and notarized administrator letters.\nPortal: https://sam.gov',
    startDate: '2026-09-30',
    endDate: '2026-09-30',
    location: 'SAM.gov System for Award Management',
    categories: ['COMPLIANCE', 'FEDERAL', 'ANNUAL_RENEWAL'],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P14D', description: '2-Week Warning: SAM.gov Entity Registration Renewal' }
    ]
  },
  {
    uid: 'inst-fed-sf425-q3-2026@example.org',
    title: '[REPORTING] Semi-Annual Federal SF-425 Financial & Milestone Report',
    description: 'Submission of semi-annual federal cash transactions and programmatic milestone metrics for active public awards.',
    startDate: '2026-10-30',
    endDate: '2026-10-30',
    location: 'Payment Management System (PMS)',
    categories: ['REPORTING', 'FEDERAL', 'FINANCIAL'],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P7D', description: '1-Week Reminder: Federal SF-425 Report Due' }
    ]
  },
  {
    uid: 'inst-irs-form990-2026@example.org',
    title: '[GOVERNANCE] Annual IRS Form 990-PF Public Filing & Board Review',
    description: 'Fiscal year informational tax return public disclosure and Trustee Governance Committee sign-off.',
    startDate: '2026-11-15',
    endDate: '2026-11-15',
    location: 'IRS / Internal Audit Committee',
    categories: ['GOVERNANCE', 'TAX', 'COMPLIANCE'],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P14D', description: 'Board Review: Form 990 Package' }
    ]
  },
  {
    uid: 'inst-capitalization-workshop-2026@example.org',
    title: '[STRATEGY] Master Capitalization Strategy & 2027 Pipeline Workshop',
    description: 'Annual leadership retreat to assess pipeline pacing, secured multi-year revenue, and 2027 grant submission targets.',
    startDate: '2026-12-10',
    endDate: '2026-12-10',
    location: 'Community Foundation Innovation Lab',
    categories: ['STRATEGY', 'GOVERNANCE'],
    status: 'CONFIRMED',
    alarms: []
  },
  {
    uid: 'inst-funder-briefing-2027@example.org',
    title: '[COMMUNITY] Annual Funder Briefing & Community Impact Town Hall',
    description: 'Public briefing for philanthropic partners, civic leaders, and community stakeholders showcasing project outcomes.',
    startDate: '2027-01-20',
    endDate: '2027-01-20',
    location: 'Civic Auditorium & Livestream',
    categories: ['COMMUNITY', 'PHILANTHROPY'],
    status: 'CONFIRMED',
    alarms: []
  },
  {
    uid: 'inst-midyear-board-2027@example.org',
    title: '[GOVERNANCE] Mid-Year Board of Trustees Grant Appropriations Review',
    description: 'Review of secured foundation grants, matching fund allocations, and capital campaign milestones.',
    startDate: '2027-02-15',
    endDate: '2027-02-15',
    location: 'Boardroom / Video Conference',
    categories: ['GOVERNANCE', 'BOARD'],
    status: 'CONFIRMED',
    alarms: []
  },
  {
    uid: 'inst-spring-research-sprint-2027@example.org',
    title: '[STRATEGY] Spring Grant Research Sprint & Federal NOFO Scan Kickoff',
    description: 'Comprehensive research scan of newly posted Notices of Funding Opportunity on Grants.gov and state agency portals.',
    startDate: '2027-03-01',
    endDate: '2027-03-01',
    location: 'Grant Research Office',
    categories: ['STRATEGY', 'RESEARCH'],
    status: 'CONFIRMED',
    alarms: []
  },
  {
    uid: 'inst-grantsgov-audit-2027@example.org',
    title: '[COMPLIANCE] Grants.gov Workspace & E-Authentication Credential Audit',
    description: 'Annual audit of Authorized Organization Representative (AOR) credentials, Login.gov access, and Workspace roles.',
    startDate: '2027-04-01',
    endDate: '2027-04-01',
    location: 'Grants.gov Organization Portal',
    categories: ['COMPLIANCE', 'FEDERAL'],
    status: 'CONFIRMED',
    alarms: []
  },
  {
    uid: 'inst-closeout-stewardship-2027@example.org',
    title: '[REPORTING] Annual Grant Closeout & Foundation Stewardship Report',
    description: 'Delivery of narrative impact reports, certified budget reconciliations, and photo documentation to foundation funders.',
    startDate: '2027-06-15',
    endDate: '2027-06-15',
    location: 'Philanthropy Operations Office',
    categories: ['REPORTING', 'STEWARDSHIP'],
    status: 'CONFIRMED',
    alarms: []
  },

  // --- GRANT 01: APEX CLEAN ENERGY MICROGRID ($350,000) ---
  {
    uid: 'apex-draft-review@sample.org',
    title: '[DRAFT] Narrative Peer Review: Apex Clean Energy Microgrid',
    description: 'Complete internal review of technical microgrid engineering narrative, battery storage specs, and energy savings models.',
    startDate: '2026-09-15',
    endDate: '2026-09-15',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'ENERGY'],
    status: 'CONFIRMED',
    grantFile: '01_apex_clean_energy_microgrid.md',
    amount: 350000,
    alarms: []
  },
  {
    uid: 'apex-budget-approval@sample.org',
    title: '[BUDGET] Cost Breakdown Approval: Apex Clean Energy Microgrid',
    description: 'Detailed equipment quote reconciliation for solar PV arrays, lithium iron phosphate battery racks, and inverter interconnects.',
    startDate: '2026-10-01',
    endDate: '2026-10-01',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'ENERGY'],
    status: 'CONFIRMED',
    grantFile: '01_apex_clean_energy_microgrid.md',
    amount: 350000,
    alarms: []
  },
  {
    uid: 'apex-compliance-attachments@sample.org',
    title: '[COMPLIANCE] Final Attachment Assembly: Apex Clean Energy',
    description: 'Assemble 501(c)(3) tax status letter, board roster, site landlord access agreements, and electrical engineering sign-offs.',
    startDate: '2026-10-08',
    endDate: '2026-10-08',
    location: 'Apex Grants Portal',
    categories: ['COMPLIANCE', 'FOUNDATION'],
    status: 'CONFIRMED',
    grantFile: '01_apex_clean_energy_microgrid.md',
    amount: 350000,
    alarms: []
  },
  {
    uid: 'apex-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Apex Clean Energy',
    description: 'Execute final electronic submission 24 hours in advance to guarantee receipt and avoid portal server bottlenecks.',
    startDate: '2026-10-14',
    endDate: '2026-10-14',
    location: 'Apex Grants Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '01_apex_clean_energy_microgrid.md',
    amount: 350000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Apex Proposal Today' }]
  },
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

  // --- GRANT 02: HORIZON STEM ROBOTICS ACADEMY ($250,000) ---
  {
    uid: 'horizon-draft-review@sample.org',
    title: '[DRAFT] Narrative Review: Horizon Robotics Academy',
    description: 'Finalize robotics curriculum module descriptions, open-source hardware kit lists, and educator training pathways.',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'STEM'],
    status: 'CONFIRMED',
    grantFile: '02_horizon_stem_robotics_academy.md',
    amount: 250000,
    alarms: []
  },
  {
    uid: 'horizon-budget-review@sample.org',
    title: '[BUDGET] Equipment & Lab Budget: Horizon Robotics Academy',
    description: 'Finalize line-item quotes for 3D printers, microcontroller kits, soldering benches, and youth stipends.',
    startDate: '2026-11-06',
    endDate: '2026-11-06',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'STEM'],
    status: 'CONFIRMED',
    grantFile: '02_horizon_stem_robotics_academy.md',
    amount: 250000,
    alarms: []
  },
  {
    uid: 'horizon-compliance-letters@sample.org',
    title: '[COMPLIANCE] School District MOUs & Partner Letters: Horizon Robotics',
    description: 'Obtain signed partnership MOUs from participating high schools and community maker spaces.',
    startDate: '2026-11-13',
    endDate: '2026-11-13',
    location: 'Internal Grant Office',
    categories: ['COMPLIANCE', 'CORPORATE'],
    status: 'CONFIRMED',
    grantFile: '02_horizon_stem_robotics_academy.md',
    amount: 250000,
    alarms: []
  },
  {
    uid: 'horizon-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Horizon Robotics',
    description: 'Execute final portal electronic submission for Horizon Technology Fund.',
    startDate: '2026-11-19',
    endDate: '2026-11-19',
    location: 'Horizon Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '02_horizon_stem_robotics_academy.md',
    amount: 250000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Horizon Robotics Proposal Today' }]
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

  // --- GRANT 03: EVERGREEN URBAN AGROECOLOGY ($180,000) ---
  {
    uid: 'evergreen-draft-review@sample.org',
    title: '[DRAFT] Agroecology Work Plan Review: Evergreen Trust',
    description: 'Review compost hub engineering diagrams, urban farm yield projections, and community food sovereignty metrics.',
    startDate: '2026-11-15',
    endDate: '2026-11-15',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'AGRICULTURE'],
    status: 'CONFIRMED',
    grantFile: '03_evergreen_urban_agroecology.md',
    amount: 180000,
    alarms: []
  },
  {
    uid: 'evergreen-budget-review@sample.org',
    title: '[BUDGET] Soil & Nursery Supply Line-Items: Evergreen Trust',
    description: 'Reconcile organic soil amendment bulk pricing, rainwater catchment cistern quotes, and greenhouse supplies.',
    startDate: '2026-12-01',
    endDate: '2026-12-01',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'AGRICULTURE'],
    status: 'CONFIRMED',
    grantFile: '03_evergreen_urban_agroecology.md',
    amount: 180000,
    alarms: []
  },
  {
    uid: 'evergreen-compliance-land@sample.org',
    title: '[COMPLIANCE] Land Access MOU & Soil Testing Reports: Evergreen Trust',
    description: 'Attach heavy metals soil testing clearance and municipal community garden lease agreements.',
    startDate: '2026-12-08',
    endDate: '2026-12-08',
    location: 'Internal Grant Office',
    categories: ['COMPLIANCE', 'REGIONAL'],
    status: 'CONFIRMED',
    grantFile: '03_evergreen_urban_agroecology.md',
    amount: 180000,
    alarms: []
  },
  {
    uid: 'evergreen-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Evergreen Agroecology',
    description: 'Submit completed proposal package to Evergreen Ecological Trust portal.',
    startDate: '2026-12-14',
    endDate: '2026-12-14',
    location: 'Evergreen Online Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '03_evergreen_urban_agroecology.md',
    amount: 180000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Evergreen Agroecology Proposal Today' }]
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

  // --- GRANT 04: METROPOLIS DIGITAL EQUITY ($120,000) ---
  {
    uid: 'metropolis-draft-review@sample.org',
    title: '[DRAFT] Proposal Review: Metropolis Digital Equity Challenge',
    description: 'Review public WiFi mesh architecture, refurbished computer distribution plan, and digital literacy syllabus.',
    startDate: '2027-01-05',
    endDate: '2027-01-05',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'MUNICIPAL'],
    status: 'CONFIRMED',
    grantFile: '04_metropolis_digital_equity.md',
    amount: 120000,
    alarms: []
  },
  {
    uid: 'metropolis-budget-review@sample.org',
    title: '[BUDGET] Hardware Procurement Budget: Metropolis Digital Equity',
    description: 'Finalize pricing on 150 refurbished laptops, wireless access points, and multilingual digital instructor fees.',
    startDate: '2027-01-16',
    endDate: '2027-01-16',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'MUNICIPAL'],
    status: 'CONFIRMED',
    grantFile: '04_metropolis_digital_equity.md',
    amount: 120000,
    alarms: []
  },
  {
    uid: 'metropolis-compliance-vendor@sample.org',
    title: '[COMPLIANCE] Municipal Vendor Certification & Compliance Package',
    description: 'Upload municipal vendor compliance forms, non-discrimination disclosures, and local insurance certificates.',
    startDate: '2027-01-23',
    endDate: '2027-01-23',
    location: 'Metropolis City Portal',
    categories: ['COMPLIANCE', 'MUNICIPAL'],
    status: 'CONFIRMED',
    grantFile: '04_metropolis_digital_equity.md',
    amount: 120000,
    alarms: []
  },
  {
    uid: 'metropolis-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Metropolis Digital Equity',
    description: 'Electronic submission on Metropolis Municipal Innovation Office portal.',
    startDate: '2027-01-29',
    endDate: '2027-01-29',
    location: 'Metropolis City Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '04_metropolis_digital_equity.md',
    amount: 120000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Metropolis Digital Proposal Today' }]
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

  // --- GRANT 05: BEACON HEALTH MOBILE WELLNESS CLINIC ($200,000) ---
  {
    uid: 'beacon-draft-review@sample.org',
    title: '[DRAFT] Clinical Protocol & Outreach Plan: Beacon Mobile Health',
    description: 'Review preventative health screening protocols, clinical nurse staffing model, and mobile van route schedules.',
    startDate: '2027-01-28',
    endDate: '2027-01-28',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'HEALTH'],
    status: 'CONFIRMED',
    grantFile: '05_beacon_health_mobile_clinic.md',
    amount: 200000,
    alarms: []
  },
  {
    uid: 'beacon-budget-review@sample.org',
    title: '[BUDGET] Medical Mobile Van Budget: Beacon Health',
    description: 'Reconcile van lease, medical diagnostic kits, refrigeration for vaccines, and clinical staff hourly compensation.',
    startDate: '2027-02-14',
    endDate: '2027-02-14',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'HEALTH'],
    status: 'CONFIRMED',
    grantFile: '05_beacon_health_mobile_clinic.md',
    amount: 200000,
    alarms: []
  },
  {
    uid: 'beacon-compliance-license@sample.org',
    title: '[COMPLIANCE] Clinical Licensure & Malpractice Verification: Beacon Health',
    description: 'Assemble healthcare provider board certifications, HIPAA compliance protocols, and liability insurance.',
    startDate: '2027-02-21',
    endDate: '2027-02-21',
    location: 'Beacon Health Portal',
    categories: ['COMPLIANCE', 'REGIONAL'],
    status: 'CONFIRMED',
    grantFile: '05_beacon_health_mobile_clinic.md',
    amount: 200000,
    alarms: []
  },
  {
    uid: 'beacon-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Beacon Health Clinic',
    description: 'Execute final electronic submission on Beacon Health Philanthropy portal.',
    startDate: '2027-02-27',
    endDate: '2027-02-27',
    location: 'Beacon Health Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '05_beacon_health_mobile_clinic.md',
    amount: 200000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Beacon Health Proposal Today' }]
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

  // --- GRANT 06: CASCADE WATERSHED ECOLOGY ($225,000) ---
  {
    uid: 'cascade-draft-review@sample.org',
    title: '[DRAFT] Riparian Ecology Work Plan: Cascade River Foundation',
    description: 'Review wetland bio-filtration design, native willow planting schedules, and community stream clean-up metrics.',
    startDate: '2027-02-15',
    endDate: '2027-02-15',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'CONSERVATION'],
    status: 'CONFIRMED',
    grantFile: '06_cascade_watershed_ecology.md',
    amount: 225000,
    alarms: []
  },
  {
    uid: 'cascade-budget-review@sample.org',
    title: '[BUDGET] Habitat Engineering Line-Items: Cascade River Foundation',
    description: 'Finalize native plant nursery procurement, water testing sensor telemetry units, and field team gear.',
    startDate: '2027-03-01',
    endDate: '2027-03-01',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'CONSERVATION'],
    status: 'CONFIRMED',
    grantFile: '06_cascade_watershed_ecology.md',
    amount: 225000,
    alarms: []
  },
  {
    uid: 'cascade-compliance-water@sample.org',
    title: '[COMPLIANCE] Environmental Permitting & Watershed Agency MOUs',
    description: 'Attach river corridor restoration permits and state clean water quality authority endorsements.',
    startDate: '2027-03-08',
    endDate: '2027-03-08',
    location: 'Cascade Online Portal',
    categories: ['COMPLIANCE', 'REGIONAL'],
    status: 'CONFIRMED',
    grantFile: '06_cascade_watershed_ecology.md',
    amount: 225000,
    alarms: []
  },
  {
    uid: 'cascade-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Cascade Watershed',
    description: 'Electronic submission on Cascade River Ecological Foundation portal.',
    startDate: '2027-03-14',
    endDate: '2027-03-14',
    location: 'Cascade Online Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '06_cascade_watershed_ecology.md',
    amount: 225000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Cascade Watershed Proposal Today' }]
  },
  {
    uid: 'cascade-watershed-deadline@sample.org',
    title: '[DEADLINE] Cascade River Foundation: Watershed Ecology Grant',
    description: 'Submission deadline for Cascade Watershed Stewardship ($225,000).\nFunder: Cascade River Ecological Foundation.\nPackage: data/example/grants/06_cascade_watershed_ecology.md',
    startDate: '2027-03-15',
    endDate: '2027-03-15',
    location: 'Cascade Online Portal',
    categories: ['DEADLINE', 'CONSERVATION', 'REGIONAL'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '06_cascade_watershed_ecology.md',
    amount: 225000
  },

  // --- GRANT 07: SUMMIT COOPERATIVE SEED FUND ($300,000) ---
  {
    uid: 'summit-draft-review@sample.org',
    title: '[DRAFT] Loan Fund Underwriting Policy: Summit Economic Fund',
    description: 'Review revolving loan fund investment policy, democratic governance rubric, and default reserve model.',
    startDate: '2027-03-15',
    endDate: '2027-03-15',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'ECONOMIC'],
    status: 'CONFIRMED',
    grantFile: '07_summit_enterprise_seed_fund.md',
    amount: 300000,
    alarms: []
  },
  {
    uid: 'summit-budget-match@sample.org',
    title: '[BUDGET] 25% Statutory Match Commitment Reconciliation ($75,000)',
    description: 'Certify and attach letters of commitment for 25% non-federal matching funds from local CDFI partners.',
    startDate: '2027-04-01',
    endDate: '2027-04-01',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'MATCH_FUNDING'],
    status: 'CONFIRMED',
    grantFile: '07_summit_enterprise_seed_fund.md',
    amount: 300000,
    alarms: []
  },
  {
    uid: 'summit-compliance-board@sample.org',
    title: '[COMPLIANCE] Board Lending Authority Resolution & CDFI Certification',
    description: 'Attach Board of Trustees authorization resolution for loan fund management and CDFI partner credentials.',
    startDate: '2027-04-08',
    endDate: '2027-04-08',
    location: 'Summit Grants Portal',
    categories: ['COMPLIANCE', 'FOUNDATION'],
    status: 'CONFIRMED',
    grantFile: '07_summit_enterprise_seed_fund.md',
    amount: 300000,
    alarms: []
  },
  {
    uid: 'summit-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Summit Capital Fund',
    description: 'Submit completed loan fund proposal to Summit Community Economic Fund portal.',
    startDate: '2027-04-14',
    endDate: '2027-04-14',
    location: 'Summit Grants Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '07_summit_enterprise_seed_fund.md',
    amount: 300000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Summit Fund Proposal Today' }]
  },
  {
    uid: 'summit-seed-deadline@sample.org',
    title: '[DEADLINE] Summit Fund: Democratic Enterprise Capital',
    description: 'Submission deadline for Summit Cooperative Capital Fund ($300,000).\nFunder: Summit Community Economic Fund.\nPackage: data/example/grants/07_summit_enterprise_seed_fund.md',
    startDate: '2027-04-15',
    endDate: '2027-04-15',
    location: 'Summit Grants Portal',
    categories: ['DEADLINE', 'FOUNDATION', 'ECONOMIC'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '07_summit_enterprise_seed_fund.md',
    amount: 300000
  },

  // --- GRANT 08: URBAN CANOPY & HEAT ISLAND ($160,000) ---
  {
    uid: 'urban-draft-review@sample.org',
    title: '[DRAFT] Forestry Species Selection & Heat Mapping: Urban Green Canopy',
    description: 'Review climate-adapted native tree species matrix, pedestrian canopy GIS heat maps, and watering maintenance plan.',
    startDate: '2027-03-30',
    endDate: '2027-03-30',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'FORESTRY'],
    status: 'CONFIRMED',
    grantFile: '08_urban_canopy_forestry_initiative.md',
    amount: 160000,
    alarms: []
  },
  {
    uid: 'urban-budget-review@sample.org',
    title: '[BUDGET] 2,000 Sapling Procurement & Tree Spade Equipment Budget',
    description: 'Finalize native sapling nursery contracts, root barrier supplies, and seasonal watering vehicle rentals.',
    startDate: '2027-04-15',
    endDate: '2027-04-15',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'FORESTRY'],
    status: 'CONFIRMED',
    grantFile: '08_urban_canopy_forestry_initiative.md',
    amount: 160000,
    alarms: []
  },
  {
    uid: 'urban-compliance-permits@sample.org',
    title: '[COMPLIANCE] Parks & Recreation Right-of-Way Planting Permits',
    description: 'Upload municipal street tree permits, utility line clearance approvals, and neighborhood association letters.',
    startDate: '2027-04-23',
    endDate: '2027-04-23',
    location: 'Green Canopy Portal',
    categories: ['COMPLIANCE', 'REGIONAL'],
    status: 'CONFIRMED',
    grantFile: '08_urban_canopy_forestry_initiative.md',
    amount: 160000,
    alarms: []
  },
  {
    uid: 'urban-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Urban Green Canopy',
    description: 'Execute final electronic submission on Urban Green Canopy Trust portal.',
    startDate: '2027-04-29',
    endDate: '2027-04-29',
    location: 'Green Canopy Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '08_urban_canopy_forestry_initiative.md',
    amount: 160000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Urban Canopy Proposal Today' }]
  },
  {
    uid: 'urban-canopy-deadline@sample.org',
    title: '[DEADLINE] Urban Green Canopy: Heat Island Mitigation Grant',
    description: 'Submission deadline for Metropolitan Urban Canopy Initiative ($160,000).\nFunder: Urban Green Canopy Trust.\nPackage: data/example/grants/08_urban_canopy_forestry_initiative.md',
    startDate: '2027-04-30',
    endDate: '2027-04-30',
    location: 'Green Canopy Portal',
    categories: ['DEADLINE', 'FORESTRY', 'ENVIRONMENT'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '08_urban_canopy_forestry_initiative.md',
    amount: 160000
  },

  // --- GRANT 09: PIONEER OPEN SCIENCE LAB ($500,000) ---
  {
    uid: 'pioneer-draft-review@sample.org',
    title: '[DRAFT] Open Science Software Architecture & Governance Plan',
    description: 'Review open dataset schema specifications, reproducible lab container environments, and peer governance protocols.',
    startDate: '2027-04-30',
    endDate: '2027-04-30',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'OPEN_SCIENCE'],
    status: 'CONFIRMED',
    grantFile: '09_pioneer_open_science.md',
    amount: 500000,
    alarms: []
  },
  {
    uid: 'pioneer-budget-review@sample.org',
    title: '[BUDGET] Compute Infrastructure & Open Source Lab Fellowships',
    description: 'Reconcile cloud compute allocations, open data repository storage costs, and researcher stipends.',
    startDate: '2027-05-15',
    endDate: '2027-05-15',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'RESEARCH'],
    status: 'CONFIRMED',
    grantFile: '09_pioneer_open_science.md',
    amount: 500000,
    alarms: []
  },
  {
    uid: 'pioneer-compliance-ip@sample.org',
    title: '[COMPLIANCE] Open Access Data Sharing & MIT / Apache 2.0 IP Policy',
    description: 'Attach institutional open access publication commitment and permissive open-source software license declarations.',
    startDate: '2027-05-23',
    endDate: '2027-05-23',
    location: 'Pioneer Portal',
    categories: ['COMPLIANCE', 'FOUNDATION'],
    status: 'CONFIRMED',
    grantFile: '09_pioneer_open_science.md',
    amount: 500000,
    alarms: []
  },
  {
    uid: 'pioneer-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Pioneer Open Science',
    description: 'Electronic submission on Pioneer Global Research Foundation portal.',
    startDate: '2027-05-29',
    endDate: '2027-05-29',
    location: 'Pioneer Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '09_pioneer_open_science.md',
    amount: 500000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Pioneer Science Proposal Today' }]
  },
  {
    uid: 'pioneer-science-deadline@sample.org',
    title: '[DEADLINE] Pioneer Foundation: Open Science Lab',
    description: 'Submission deadline for Pioneer Open Science Grant ($500,000).\nFunder: Pioneer Global Research Foundation.\nPackage: data/example/grants/09_pioneer_open_science.md',
    startDate: '2027-05-30',
    endDate: '2027-05-30',
    location: 'Pioneer Portal',
    categories: ['DEADLINE', 'RESEARCH', 'OPEN_SCIENCE'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '09_pioneer_open_science.md',
    amount: 500000
  },

  // --- GRANT 10: FEDERAL EDA REGIONAL INNOVATION CHALLENGE ($750,000) ---
  {
    uid: 'eda-draft-review@sample.org',
    title: '[DRAFT] EDA Regional Work Plan & Economic Impact Projections',
    description: 'Review advanced manufacturing shared equipment facility design, job creation economic models, and regional consortium agreements.',
    startDate: '2027-05-30',
    endDate: '2027-05-30',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'FEDERAL'],
    status: 'CONFIRMED',
    grantFile: '10_federal_resilient_infrastructure.md',
    amount: 750000,
    alarms: []
  },
  {
    uid: 'eda-budget-match@sample.org',
    title: '[BUDGET] SF-424A Form & 20% Non-Federal Match ($150,000)',
    description: 'Finalize federal standard form SF-424A line items and certify $150,000 non-federal cost-share matching contributions.',
    startDate: '2027-06-15',
    endDate: '2027-06-15',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'MATCH_FUNDING', 'FEDERAL'],
    status: 'CONFIRMED',
    grantFile: '10_federal_resilient_infrastructure.md',
    amount: 750000,
    alarms: []
  },
  {
    uid: 'eda-compliance-aor@sample.org',
    title: '[COMPLIANCE] SAM.gov UEI Check & Authorized Representative Sign-Off',
    description: 'Perform SAM.gov active status verification, attach Lobbying Disclosure (SF-LLL), and obtain CEO signature.',
    startDate: '2027-06-23',
    endDate: '2027-06-23',
    location: 'Grants.gov Workspace',
    categories: ['COMPLIANCE', 'FEDERAL'],
    status: 'CONFIRMED',
    grantFile: '10_federal_resilient_infrastructure.md',
    amount: 750000,
    alarms: []
  },
  {
    uid: 'eda-early-submit@sample.org',
    title: '[SUBMIT] Early Grants.gov Submission (24-Hour Buffer Rule)',
    description: 'Execute final Grants.gov Workspace package submission with confirmation tracking ID.',
    startDate: '2027-06-29',
    endDate: '2027-06-29',
    location: 'Grants.gov',
    categories: ['SUBMISSION', 'BUFFER', 'FEDERAL'],
    status: 'CONFIRMED',
    grantFile: '10_federal_resilient_infrastructure.md',
    amount: 750000,
    alarms: [{ trigger: '-PT4H', description: 'Submit EDA Federal Workspace Today' }]
  },
  {
    uid: 'federal-infrastructure-deadline@sample.org',
    title: '[DEADLINE] EDA: Regional Resilient Infrastructure Challenge',
    description: 'Submission deadline for Federal Regional Innovation & Resilient Infrastructure ($750,000).\nFunder: Federal Economic Development Administration.\nPackage: data/example/grants/10_federal_resilient_infrastructure.md',
    startDate: '2027-06-30',
    endDate: '2027-06-30',
    location: 'Grants.gov',
    categories: ['DEADLINE', 'FEDERAL', 'INFRASTRUCTURE'],
    status: 'CONFIRMED',
    alarms: [
      { trigger: '-P14D', description: '2-Week Federal Deadline Warning: EDA Challenge' }
    ],
    grantFile: '10_federal_resilient_infrastructure.md',
    amount: 750000
  },

  // --- GRANT 11: CIVIC STORYTELLING & CULTURAL ARCHIVE ($140,000) ---
  {
    uid: 'arts-draft-review@sample.org',
    title: '[DRAFT] Oral History Curriculum & Digital Humanities Work Plan',
    description: 'Review oral history interview guide, community elder recording schedules, and open access digital catalog specs.',
    startDate: '2027-06-15',
    endDate: '2027-06-15',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'ARTS'],
    status: 'CONFIRMED',
    grantFile: '11_community_arts_media_archive.md',
    amount: 140000,
    alarms: []
  },
  {
    uid: 'arts-budget-review@sample.org',
    title: '[BUDGET] Audio-Visual Archival Gear & Youth Archivist Stipends',
    description: 'Reconcile studio microphone pricing, digital storage arrays, and youth oral history apprentice compensation.',
    startDate: '2027-07-01',
    endDate: '2027-07-01',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'ARTS'],
    status: 'CONFIRMED',
    grantFile: '11_community_arts_media_archive.md',
    amount: 140000,
    alarms: []
  },
  {
    uid: 'arts-compliance-releases@sample.org',
    title: '[COMPLIANCE] Participant Media Releases & Creative Commons Terms',
    description: 'Attach institutional media consent releases and Creative Commons Attribution (CC-BY) archival agreements.',
    startDate: '2027-07-08',
    endDate: '2027-07-08',
    location: 'Luminary Online Portal',
    categories: ['COMPLIANCE', 'REGIONAL'],
    status: 'CONFIRMED',
    grantFile: '11_community_arts_media_archive.md',
    amount: 140000,
    alarms: []
  },
  {
    uid: 'arts-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Civic Storytelling Archive',
    description: 'Submit completed package to Luminary Cultural Arts Trust portal.',
    startDate: '2027-07-14',
    endDate: '2027-07-14',
    location: 'Luminary Online Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '11_community_arts_media_archive.md',
    amount: 140000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Civic Storytelling Proposal Today' }]
  },
  {
    uid: 'community-arts-deadline@sample.org',
    title: '[DEADLINE] Luminary Cultural Trust: Civic Storytelling Archive',
    description: 'Submission deadline for Civic Storytelling & Open Cultural Media Archive ($140,000).\nFunder: Luminary Cultural Arts Trust.\nPackage: data/example/grants/11_community_arts_media_archive.md',
    startDate: '2027-07-15',
    endDate: '2027-07-15',
    location: 'Luminary Online Portal',
    categories: ['DEADLINE', 'ARTS', 'CULTURE'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '11_community_arts_media_archive.md',
    amount: 140000
  },

  // --- GRANT 12: COMMUNITY EMERGENCY MUTUAL AID ($400,000) ---
  {
    uid: 'mutualaid-draft-review@sample.org',
    title: '[DRAFT] Mesh Network Architecture & Emergency Logistics Plan',
    description: 'Review off-grid LoRa radio repeater map, emergency solar battery cache specifications, and mutual aid dispatch SOPs.',
    startDate: '2027-07-30',
    endDate: '2027-07-30',
    location: 'Internal Grant Office',
    categories: ['DRAFT', 'MUTUAL_AID'],
    status: 'CONFIRMED',
    grantFile: '12_disaster_mutual_aid_network.md',
    amount: 400000,
    alarms: []
  },
  {
    uid: 'mutualaid-budget-review@sample.org',
    title: '[BUDGET] Radio Equipment & Solar Emergency Supply Caches',
    description: 'Finalize quotes for 500 emergency solar radios, water purification units, and neighborhood hub supply containers.',
    startDate: '2027-08-15',
    endDate: '2027-08-15',
    location: 'Internal Grant Office',
    categories: ['BUDGET', 'DISASTER'],
    status: 'CONFIRMED',
    grantFile: '12_disaster_mutual_aid_network.md',
    amount: 400000,
    alarms: []
  },
  {
    uid: 'mutualaid-compliance-fcc@sample.org',
    title: '[COMPLIANCE] FCC Frequency Compliance & First Responder Coordination',
    description: 'Upload ISM 915MHz unlicensed frequency engineering report and local emergency management coordination letters.',
    startDate: '2027-08-23',
    endDate: '2027-08-23',
    location: 'Resilient Communities Grants Portal',
    categories: ['COMPLIANCE', 'FOUNDATION'],
    status: 'CONFIRMED',
    grantFile: '12_disaster_mutual_aid_network.md',
    amount: 400000,
    alarms: []
  },
  {
    uid: 'mutualaid-early-submit@sample.org',
    title: '[SUBMIT] Early Submission Buffer (T-24h): Emergency Mutual Aid',
    description: 'Execute final electronic submission on Resilient Communities Fund portal.',
    startDate: '2027-08-29',
    endDate: '2027-08-29',
    location: 'Resilient Communities Grants Portal',
    categories: ['SUBMISSION', 'BUFFER'],
    status: 'CONFIRMED',
    grantFile: '12_disaster_mutual_aid_network.md',
    amount: 400000,
    alarms: [{ trigger: '-PT4H', description: 'Submit Emergency Mutual Aid Proposal Today' }]
  },
  {
    uid: 'disaster-mutual-aid-deadline@sample.org',
    title: '[DEADLINE] Resilient Communities Fund: Emergency Mutual Aid',
    description: 'Submission deadline for Community Emergency Preparedness & Mutual Aid ($400,000).\nFunder: National Resilient Communities Fund.\nPackage: data/example/grants/12_disaster_mutual_aid_network.md',
    startDate: '2027-08-30',
    endDate: '2027-08-30',
    location: 'Resilient Communities Grants Portal',
    categories: ['DEADLINE', 'MUTUAL_AID', 'DISASTER'],
    status: 'CONFIRMED',
    alarms: [],
    grantFile: '12_disaster_mutual_aid_network.md',
    amount: 400000
  }
];

export const SAMPLE_FICTITIOUS_RESEARCH_OPPORTUNITIES: GrantOpportunity[] = [
  {
    id: 'opp_clean_energy_innovators_2027',
    title: 'Clean Energy Community Innovators Challenge',
    funder: 'Federal Clean Energy & Grid Modernization Office',
    funderType: 'Federal',
    opportunityNumber: 'DOE-CE-2027-009',
    cfdaNumber: '81.086',
    programUrl: 'https://energy.gov/clean-energy-challenge',
    portalUrl: 'https://grants.gov',
    description: 'Funding innovative community-led microgrids, storage pilots, and local clean energy generation hubs.',
    fundingAmountMin: 200000,
    fundingAmountMax: 500000,
    estimatedTotalFunding: 15000000,
    expectedAwardsCount: 30,
    costSharePercentage: 20,
    deadline: '2027-07-15',
    status: 'Open',
    eligibleApplicantTypes: ['501(c)(3)', 'Municipality', 'Higher Education', 'Cooperative', 'Tribal Nation'],
    focusAreas: ['Clean Energy', 'Microgrids', 'Battery Storage', 'Community Resilience', 'Workforce Training'],
    submissionMethod: 'Grants.gov',
    source: 'grants.gov'
  },
  {
    id: 'opp_horizon_open_robotics_fellowship',
    title: 'Horizon Open Hardware & Robotics Innovation Grants',
    funder: 'Horizon Technology & Innovation Fund',
    funderType: 'Corporate',
    programUrl: 'https://horizonfund.org/robotics-rfp',
    portalUrl: 'https://horizonfund.org/apply',
    description: 'Grants to develop accessible open-source robotics educational curricula, maker spaces, and student workforce programs.',
    fundingAmountMin: 100000,
    fundingAmountMax: 300000,
    estimatedTotalFunding: 2500000,
    expectedAwardsCount: 10,
    costSharePercentage: 0,
    deadline: '2027-03-31',
    status: 'Open',
    eligibleApplicantTypes: ['501(c)(3)', 'Higher Education', 'Public Charity'],
    focusAreas: ['Robotics', 'STEM', 'Open Source', 'Workforce Development', 'Youth Tech'],
    submissionMethod: 'Online Portal',
    source: 'web-research'
  },
  {
    id: 'opp_evergreen_soil_health_fund',
    title: 'Regenerative Agriculture & Urban Soil Recovery Grant',
    funder: 'Evergreen Ecological Trust',
    funderType: 'Private Foundation',
    programUrl: 'https://evergreentrust.org/soil-grants',
    portalUrl: 'https://evergreentrust.org/apply',
    description: 'Empowering urban farming hubs, biochar soil conditioning, and community composting networks.',
    fundingAmountMin: 75000,
    fundingAmountMax: 200000,
    estimatedTotalFunding: 1800000,
    expectedAwardsCount: 12,
    costSharePercentage: 0,
    deadline: '2027-05-15',
    status: 'Open',
    eligibleApplicantTypes: ['501(c)(3)', 'Cooperative', 'Community Foundation'],
    focusAreas: ['Agroecology', 'Soil Health', 'Urban Farming', 'Composting', 'Food Sovereignty'],
    submissionMethod: 'Submittable',
    source: 'web-research'
  },
  {
    id: 'opp_civic_mesh_emergency_network',
    title: 'Civic Resilience & Off-Grid Telecommunications Grant',
    funder: 'Metropolitan Digital Infrastructure Alliance',
    funderType: 'Municipal',
    opportunityNumber: 'MUN-DIGI-2027-04',
    programUrl: 'https://metropolis.gov/civic-mesh',
    portalUrl: 'https://metropolis.gov/rfp',
    description: 'Grants for neighborhood groups to construct decentralized LoRa mesh emergency communication systems.',
    fundingAmountMin: 50000,
    fundingAmountMax: 150000,
    estimatedTotalFunding: 800000,
    expectedAwardsCount: 8,
    costSharePercentage: 0,
    deadline: '2027-04-20',
    status: 'Open',
    eligibleApplicantTypes: ['501(c)(3)', 'Cooperative', 'Municipality'],
    focusAreas: ['Digital Inclusion', 'Emergency Comms', 'Mesh Networking', 'Disaster Preparedness'],
    submissionMethod: 'Online Portal',
    source: 'web-research'
  }
];

export const SAMPLE_FICTITIOUS_FUNDERS_990: FunderProfile[] = [
  {
    name: 'Apex Climate & Energy Foundation',
    ein: '98-7654321',
    type: 'Private Foundation',
    city: 'San Francisco',
    state: 'CA',
    totalAssets: 450000000,
    annualGiving: 22500000,
    grantRange: { min: 50000, max: 1000000, median: 350000 },
    topFocusAreas: ['Clean Energy Transition', 'Community Resiliency', 'Electrification', 'Climate Justice'],
    topRecipients: [
      { name: 'Grid Resilience Institute', amount: 800000, purpose: 'Decentralized Microgrid Demonstrations' },
      { name: 'Clean Energy Workforce Lab', amount: 500000, purpose: 'Solar Installer Apprenticeships' },
      { name: 'Community Solar Coalition', amount: 350000, purpose: 'Low-Income Solar Subsidies' }
    ],
    officersAndTrustees: ['Eleanor Vance (President)', 'Marcus Thorne (Treasurer)', 'Dr. Sunita Patel (Trustee)'],
    sourceUrl: 'https://projects.propublica.org/nonprofits/organizations/987654321',
    filingYearsAvailable: [2024, 2023, 2022]
  },
  {
    name: 'Evergreen Ecological Trust',
    ein: '87-6543210',
    type: 'Private Foundation',
    city: 'Seattle',
    state: 'WA',
    totalAssets: 185000000,
    annualGiving: 9500000,
    grantRange: { min: 25000, max: 250000, median: 150000 },
    topFocusAreas: ['Urban Agriculture', 'Riparian Ecology', 'Soil Health', 'Indigenous Land Stewardship'],
    topRecipients: [
      { name: 'Pacific Watershed Alliance', amount: 250000, purpose: 'Salmon Habitat Restoration' },
      { name: 'Urban Food Commons', amount: 180000, purpose: 'Community Orchard Network' }
    ],
    officersAndTrustees: ['Arthur Green (Executive Director)', 'Chloe Dubois (Program Officer)'],
    sourceUrl: 'https://projects.propublica.org/nonprofits/organizations/876543210',
    filingYearsAvailable: [2024, 2023, 2022]
  },
  {
    name: 'Summit Community Economic Fund',
    ein: '76-5432109',
    type: 'Public Charity',
    city: 'Chicago',
    state: 'IL',
    totalAssets: 95000000,
    annualGiving: 6200000,
    grantRange: { min: 50000, max: 500000, median: 250000 },
    topFocusAreas: ['Cooperative Economics', 'Worker Ownership', 'Non-Extractive Finance', 'Community Wealth'],
    topRecipients: [
      { name: 'Worker Co-op Loan Network', amount: 400000, purpose: 'Revolving Capital Fund' },
      { name: 'Democratic Enterprise Incubator', amount: 300000, purpose: 'Technical Assistance' }
    ],
    officersAndTrustees: ['David Morales (President)', 'Keisha Washington (Chair)'],
    sourceUrl: 'https://projects.propublica.org/nonprofits/organizations/765432109',
    filingYearsAvailable: [2024, 2023]
  }
];

export const SAMPLE_APPLICANT_PROFILES: ApplicantProfile[] = [
  {
    name: 'Example Community Foundation',
    taxStatus: '501(c)(3)',
    ein: '00-0000000',
    uei: 'EXAMP1234567',
    mission: 'Building resilient local communities through clean energy, digital equity, and economic self-determination.',
    focusAreas: ['Clean Energy', 'Workforce Training', 'Digital Equity', 'Community Resilience', 'Cooperative Enterprise'],
    annualOperatingBudget: 550000,
    targetFundingMin: 100000,
    targetFundingMax: 750000,
    primaryLocation: { city: 'Austin', state: 'TX', isRural: false },
    canProvideMatch: true,
    maxMatchPercentage: 25,
    yearsActive: 7,
    pastGrantExperience: true
  },
  {
    name: 'Cascadia Watershed Stewardship',
    taxStatus: '501(c)(3)',
    ein: '11-1111111',
    mission: 'Protecting freshwater river systems, restoring urban riparian corridors, and educating youth naturalists.',
    focusAreas: ['Watershed Ecology', 'Riparian Restoration', 'Clean Water', 'Environmental Education', 'Agroecology'],
    annualOperatingBudget: 350000,
    targetFundingMin: 50000,
    targetFundingMax: 300000,
    primaryLocation: { city: 'Portland', state: 'OR', isRural: false },
    canProvideMatch: false,
    maxMatchPercentage: 0,
    yearsActive: 4,
    pastGrantExperience: true
  }
];

export const SAMPLE_RAW_RFP_TEXT = `FEDERAL NOTICE OF FUNDING OPPORTUNITY (NOFO)
Opportunity Title: Community Clean Energy Resiliency & Microgrid Deployment Challenge
Funding Opportunity Number: DOE-CE-2027-009
Assistance Listing / CFDA: 81.086
Issuing Agency: Department of Energy Innovation & Grid Modernization Office

I. PROGRAM DESCRIPTION
The Department of Energy Innovation is announcing up to $15,000,000 in competitive federal grants for community-driven microgrid deployments, local battery energy storage systems, and renewable generation installations that protect critical facilities from severe weather outages and build local energy independence.

Key Program Objectives:
1. Islandable community solar microgrid systems with at least 48 hours continuous off-grid capability.
2. Direct technical workforce training and job creation for local electrical apprentices.
3. Quantifiable utility bill reductions for low-income residents in the designated project zone.

II. AWARD INFORMATION
- Estimated Total Program Funding: $15,000,000
- Award Ceiling: $500,000
- Award Floor: $200,000
- Expected Number of Awards: 30 grants
- Project Period: 24 to 36 Months

III. ELIGIBILITY INFORMATION
Eligible applicants include:
- 501(c)(3) Nonprofit Organizations and Public Charities
- Municipalities, County Governments, and Public Housing Authorities
- Cooperative Associations and Worker-Owned Enterprises
- Native American Tribal Governments and Tribal Organizations
- Accredited Institutions of Higher Education

Cost-Sharing / Matching Requirement:
A non-federal cost match of 20% of total project costs is required for all applications. Match may be cash or verified third-party in-kind contributions.

IV. APPLICATION & SUBMISSION DEADLINES
- Target Application Submission Deadline: July 15, 2027 at 11:59 PM Eastern Time.
- Applications must be submitted electronically through Grants.gov.

V. APPLICATION REVIEW & SCORING RUBRIC (100 Points Total)
1. Technical Approach & Microgrid Engineering Design: 35 Points
2. Community Impact, Energy Burden Reduction & Equity: 25 Points
3. Organizational Capacity & Key Personnel Experience: 20 Points
4. Budget Narrative & 20% Cost-Share Verification: 20 Points
`;

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
- **Total Drafted Pipeline Value:** $3,375,000 (12 Active Proposals)
- **Secured / Awarded Grants:** $100,000
- **Statutory Cost-Share Matching Sourced:** $175,000

---

### 2. Sprints & Strategic Allocation
1. **Fall Immediate Sprints:** Apex Clean Energy Microgrid ($350k) and Horizon Robotics Academy ($250k).
2. **Winter Core Sprints:** Evergreen Urban Agroecology ($180k), Metropolis Digital Equity ($120k), Beacon Health Mobile Clinic ($200k), and Cascade Watershed Ecology ($225k).
3. **Spring Major Sprints:** Summit Small Enterprise Capital Fund ($300k), Urban Green Canopy ($160k), and Pioneer Open Science Lab ($500k).
4. **Summer Major / Federal:** Federal EDA Regional Innovation Infrastructure ($750k), Civic Storytelling Archive ($140k), and Community Emergency Mutual Aid ($400k).
`,
    lineCount: 30,
    wordCount: 170
  },
  ...SAMPLE_FICTITIOUS_GRANTS.map(g => ({
    id: g.id,
    fileName: g.fileName,
    relativePath: g.filePath,
    title: g.title,
    category: 'grant' as const,
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
