import { Project, Alert, SiteCaptureLog, OCRDocumentResult, User } from "../types";

export const SAMPLE_USERS: User[] = [
  {
    id: "usr-1",
    name: "Er. Rajesh Sharma",
    email: "rajesh.sharma@nhai.gov.in",
    role: "SITE_ENGINEER",
    agency: "National Highways Authority of India (NHAI)",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "usr-2",
    name: "Ananya Deshmukh",
    email: "ananya.d@bmrcl.in",
    role: "PROJECT_MANAGER",
    agency: "Bangalore Metro Rail Corporation Ltd",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "usr-3",
    name: "Dr. Vikramaditya Sen, IAS",
    email: "vikram.sen@morth.nic.in",
    role: "GOVERNMENT_INSPECTOR",
    agency: "Ministry of Road Transport & Highways / NITI Aayog",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "usr-4",
    name: "Karan Singhania",
    email: "karan.s@larsentoubro.com",
    role: "CONTRACTOR_ADMIN",
    agency: "L&T Heavy Civil Infrastructure",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  }
];

export const SAMPLE_SITE_PHOTOS = [
  {
    id: "sample-1",
    title: "Dense Bituminous Macadam (DBM) Highway Paving",
    sector: "Highways & Expressways",
    stage: "Sub-grade Asphalt Paving & Interchange Overpass",
    expectedProgress: 52,
    plannedProgress: 70,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80",
    description: "Multi-lane asphalt paving using heavy sensor pavers, tandem vibratory compactors, and survey level prisms.",
    elements: ["Vögele Asphalt Paver", "12T Vibratory Roller", "Bitumen Sprayer", "Survey Prism", "Safety Cones"],
    notes: "Chainage 132+400 paving behind by 18% due to refinery VG-40 bitumen dispatch lag.",
  },
  {
    id: "sample-2",
    title: "Metro Elevated Viaduct Pier Cap Rebar Binding",
    sector: "Metro Rail & Bridges",
    stage: "Pier Cap Reinforcement & Shuttering Casting",
    expectedProgress: 65,
    plannedProgress: 68,
    imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80",
    description: "High-tensile steel rebar cage fabrication on Pier 104 with modular steel formwork and safety fall arrest nets.",
    elements: ["Fe 500D Rebar Cage", "Steel Shuttering Formwork", "Mobile Crane Lift Hook", "Fall Arrest Netting"],
    notes: "Reinforcement checked against structural drawings; ready for M50 concrete pour.",
  },
  {
    id: "sample-3",
    title: "Precast Concrete Flyover Girder Launching",
    sector: "Smart City & Urban",
    stage: "Prestressed I-Girder Launching & Grouting",
    expectedProgress: 36,
    plannedProgress: 45,
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80",
    description: "Telescopic crawler crane hoisting 32m precast PSC girder onto elastomeric bearings across urban junction.",
    elements: ["150T Crawler Crane", "PSC Girder (32m)", "Neoprene Bearing Pads", "Launching Gantry Frame"],
    notes: "Delay of 5 days recorded due to evening city traffic lane closure permits.",
  },
  {
    id: "sample-4",
    title: "Deep Bored Piling & Foundation Reinforcement",
    sector: "Water & Ports",
    stage: "Marine Piling & Reclamation Breakwater",
    expectedProgress: 24,
    plannedProgress: 40,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80",
    description: "Hydraulic rotary piling rig drilling 1200mm dia bored cast-in-situ piles with bentonite slurry stabilization.",
    elements: ["Bauer BG 28 Piling Rig", "Bentonite Circulation Tank", "Rebar Tremie Pipe", "Excavator CAT 320D"],
    notes: "Rig pump failure and marine tides created 16 days predicted delay.",
  }
];

export const SAMPLE_OCR_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Daily Progress Report (DPR) - NHAI DME PKG-4",
    type: "DAILY_PROGRESS_REPORT",
    date: "24 August 2026",
    contractor: "Larsen & Toubro Infrastructure Ltd",
    rawContent: `NATIONAL HIGHWAYS AUTHORITY OF INDIA (NHAI)
PROJECT: Delhi-Mumbai Expressway Package 4 (Km 132+000 to Km 178+500)
DAILY PROGRESS REPORT (DPR) - #DPR/DME4/2026/08/24
Date: 24-08-2026 | Shift: Day (08:00 - 18:00) | Weather: Clear, 34°C

1. MANPOWER DEPLOYED:
- Resident Engineers & Surveyors: 8
- Skilled Operators & Rebar Fitters: 42
- Unskilled Labor / Helpers: 65
- Heavy Machinery Drivers: 14
- TOTAL MANPOWER: 129 Persons

2. MACHINERY OPERATIONAL:
- Vögele Super 2100-3 Asphalt Paver (2 Units) - 9.5 hrs (ACTIVE)
- Hamm 3411 Heavy Soil Compactor (3 Units) - 8.0 hrs (ACTIVE)
- Tata Prima 2528.K Dumpers (18 Units) - 7.5 hrs (ACTIVE)
- Wirtgen Cold Milling Machine (1 Unit) - 3.5 hrs (IDLE - Maintenance)

3. MATERIALS CONSUMPTION TODAY:
- VG-40 Bulk Bitumen: 48.5 MT (Approved Batch #IOCL-VAD-884)
- Granular Sub-Base Aggregates (40mm-10mm): 820 cum
- Anti-Stripping Agent (Hydrated Lime): 6.2 MT

4. WORK COMPLETED VS TARGET:
- DBM Laying (75mm): Target = 1,200 m | Achieved = 850 m | Status = LAGGING (-29%)
- Sub-base Compaction: Target = 1,500 sqm | Achieved = 1,620 sqm | Status = EXCEEDED (+8%)
- Median Concrete Drain: Target = 300 m | Achieved = 290 m | Status = MET (97%)

5. HINDRANCES & DELAYS:
- 2.5 hrs bottleneck in hot-mix delivery due to highway toll queue at Km 98.
- Extra compaction passes required on lane 2 to meet 97% MDD density.

VERIFIED & SIGNED BY:
Er. Rajesh Sharma (Resident Engineer, NHAI) | Er. K. Singhania (L&T Project Lead)`,
  },
  {
    id: "doc-2",
    title: "Monthly Milestone & Quality Audit Certificate",
    type: "QUALITY_AUDIT",
    date: "20 August 2026",
    contractor: "Afcons Infrastructure Ltd (BMRCL Pink Line)",
    rawContent: `BANGALORE METRO RAIL CORPORATION LIMITED (BMRCL)
INDEPENDENT SAFETY & QUALITY AUDIT REPORT #BMRCL/QA/2026/08
Project: Pink Line Underground & Elevated Section VIA-02

AUDIT SCOPE: Pier Caps P-100 to P-115 & Station Concourse Slab

1. CONCRETE COMPRESSIVE STRENGTH (28-Day Cube Test):
- Specified Grade: M50 (Target: 58.5 MPa)
- Pier P-102 Sample A: 61.2 MPa (PASSED)
- Pier P-103 Sample B: 59.8 MPa (PASSED)
- Pier P-104 Sample C: 62.4 MPa (PASSED)

2. NON-DESTRUCTIVE REBOUND HAMMER & UPV TEST:
- Ultrasonic Pulse Velocity: 4.35 km/sec (High Quality, Homogeneous Concrete)
- Cover Depth to Reinforcement: 52mm (Requirement: 50mm ± 5mm - PASSED)

3. SAFETY & ENVIRONMENTAL AUDIT SCORE:
- PPE Hardhat & Vest Compliance: 98%
- Deep Excavation Edge Barricades: 100%
- OVERALL AUDIT RATING: 94 / 100 (GRADE A - APPROVED FOR NEXT SPAN)`,
  }
];
