export interface GuideFaq {
  q: string
  a: string
}

export interface GuideCityRow {
  city: string
  slug: string
  summary: string
}

export interface GuideTopic {
  slug: string
  title: string
  eyebrow: string
  description: string
  intro: string[]
  sections: Array<{ heading: string; paragraphs: string[]; list?: string[] }>
  cityRows: GuideCityRow[]
  faq: GuideFaq[]
}

export const GUIDE_LINKS: Array<{ slug: string; title: string }> = [
  { slug: "rental-registration", title: "Rental registration: the complete guide" },
  { slug: "rental-inspections", title: "Rental inspections: how often and what's checked" },
  { slug: "smoke-co-detectors", title: "Smoke & CO detector laws for landlords" },
  { slug: "lead-paint-disclosure", title: "Lead paint disclosure for pre-1978 rentals" },
  { slug: "proof-of-compliance", title: "Proof of compliance: building an evidence vault" },
]

const RENTAL_REGISTRATION: GuideTopic = {
  slug: "rental-registration",
  title: "Rental Registration: What Landlords Must Know",
  eyebrow: "Guide",
  description:
    "Which cities require rental registration or licensing, what it costs, and how to keep renewals from slipping.",
  intro: [
    "Rental registration is the closest thing to a universal landlord obligation in the United States. Hundreds of cities require residential rental property to be registered or licensed on an annual or biennial cycle, and the fee is usually small — a few hundred dollars a year per building. What turns that modest cost into an expensive problem is missing the deadline: late fees, per-unit fines, and in some cities a hold on evictions or certificate renewals.",
    "The difficulty for self-managing landlords is not understanding the concept — it is knowing which city each property sits in, what that city expects, and when the renewal lands every single year.",
  ],
  sections: [
    {
      heading: "Why cities require registration",
      paragraphs: [
        "Registration exists so the city knows who owns and manages every rental unit. That single fact powers code enforcement, tenant complaint response, inspection scheduling, and contact for emergency or demolition notices. When a building is unregistered, the city has no reliable way to reach the responsible party — which is exactly why penalties escalate quickly.",
        "Registration is separate from a lease, a business license, or a building permit. Even a perfectly maintained property can be out of compliance the day its registration lapses.",
      ],
    },
    {
      heading: "How fees and cycles vary",
      paragraphs: [
        "Most cities charge a base registration fee per building plus a per-unit component, so a two-family is cheaper to register than a twenty-unit building. Cycles are typically annual, though some jurisdictions register biennially or tie the renewal to the certificate of occupancy cycle.",
        "Late penalties are structured to hurt: a modest late fee for the first month, escalating fines for each additional cycle missed, and in rent-regulated cities, potential loss of certificate-based protections.",
      ],
    },
    {
      heading: "Keep renewals from slipping",
      paragraphs: [
        "The landlords who never miss a renewal treat registration as a calendar event with a paper trail, not a memory task. Practical habits include keeping the certificate in a dedicated folder, noting the renewal month on a shared calendar, and setting reminders 90, 60, and 30 days before the due date.",
        "When you manage more than one property in different cities, a spreadsheet stops scaling quickly — each property carries its own city, cycle, and fee structure. That is exactly the workload RuleNest automates.",
      ],
    },
  ],
  cityRows: [
    { city: "Boston", slug: "boston", summary: "Annual registration with ISD; separate inspection cycle." },
    { city: "Chicago", slug: "chicago", summary: "Annual building + per-unit registration with Buildings." },
    { city: "Denver", slug: "denver", summary: "Annual rental licensing tied to safety inspections." },
    { city: "Seattle", slug: "seattle", summary: "RRIO registration + five-year inspection cycle." },
    { city: "Philadelphia", slug: "philadelphia", summary: "Annual rental license; BSC inspection every four years." },
    { city: "New York", slug: "new-york", summary: "Annual HPD registration per unit." },
    { city: "Los Angeles", slug: "los-angeles", summary: "RSO registration with habitability certification." },
  ],
  faq: [
    { q: "Is rental registration the same as a rental license?", a: "Usually yes in the practical sense. Some cities call it registration, others license it, and a few require both a building registration and a separate unit certificate. The obligation is the same: the city needs a current record tying you to the property." },
    { q: "Do I need to register a single-family rental?", a: "It depends on the city. Many cities require registration for any rented dwelling including single-family homes, while others exempt owner-occupied buildings or small landlords. Check your city's ordinance." },
    { q: "What happens if I rent without registering?", a: "You risk escalating fines that are often per-unit and per-cycle, and in some cities a lapse can delay permit renewals or eviction proceedings. Compliance history also matters if the city ever performs a complaint-driven inspection." },
    { q: "How much does registration cost per year?", a: "Fees vary widely — from roughly $50 per unit to several hundred per building, plus per-unit components in large cities. Always verify current numbers with the official source before budgeting." },
  ],
}
const RENTAL_INSPECTIONS: GuideTopic = {
  slug: "rental-inspections",
  title: "Rental Inspections: How Often and What's Checked",
  eyebrow: "Guide",
  description:
    "Rental inspection frequency by city, what inspectors look for, and how to pass on the first visit.",
  intro: [
    "Rental property inspections verify that a unit meets minimum habitability standards: working smoke and CO detectors, safe egress, functioning heating and plumbing, and no visible hazards. Cities enforce these through scheduled cycles, certificate renewals, tenancy changes, or complaints — and a failed inspection usually means a correction list and a follow-up visit.",
    "For self-managing landlords the inspection itself is rarely intimidating. The hard part is knowing when each property is due, because the cycles differ from city to city.",
  ],
  sections: [
    {
      heading: "How often inspections happen",
      paragraphs: [
        "There is no national cadence. Seattle's RRIO inspects on a five-year cycle. Boston and several Massachusetts cities inspect periodically against the Sanitary Code, often near two-year marks. Philadelphia ties inspections to its Basic Systems Certification every four years. Rent-regulated cities in California often pair annual registration with a habitability certification.",
        "Complaints, tenancy changes, and permit activity can trigger an inspection earlier than the scheduled cycle — so 'not due yet' is never a safe assumption.",
      ],
    },
    {
      heading: "What inspectors check",
      paragraphs: ["Inspectors work from a published checklist. Most failures come from a small recurring set of items."],
      list: [
        "Smoke detectors on every level and outside sleeping areas",
        "CO detectors near fuel-burning appliances and bedrooms",
        "Safe, unobstructed exits from every bedroom",
        "Working heating that can maintain required temperatures",
        "Functional hot and cold water, no leaks",
        "No pests, mold, or active water damage",
        "Secure windows, doors, and locks",
      ],
    },
    {
      heading: "Passing on the first attempt",
      paragraphs: [
        "A ten-minute pre-inspection walk catches most failures — dead detector batteries, a blocked exit, a lingering smoke alarm chirp. Keep certificates and registration receipts on site or in an evidence vault so the inspector can verify them immediately.",
        "If the unit fails, fix the listed items, upload photo proof or the signed correction, and schedule the follow-up promptly. A second failure in some cities escalates the enforcement response.",
      ],
    },
  ],
  cityRows: [
    { city: "Boston", slug: "boston", summary: "Periodic Sanitary Code inspections; tenancy changes trigger visits." },
    { city: "Seattle", slug: "seattle", summary: "Five-year RRIO inspection cycle." },
    { city: "Philadelphia", slug: "philadelphia", summary: "Basic Systems Certification every four years." },
    { city: "Chicago", slug: "chicago", summary: "Periodic inspections for registered buildings." },
    { city: "Denver", slug: "denver", summary: "Life-safety inspections tied to rental licensing." },
  ],
  faq: [
    { q: "Do all cities require scheduled rental inspections?", a: "No. Some cities inspect on a recurring schedule, others only on complaint or tenancy change, and a few have no citywide inspection program at all. Check your specific city page." },
    { q: "Who pays for a failed re-inspection?", a: "The landlord nearly always pays — both for the correction itself and for any re-inspection fee the city charges. Passing the first time saves real money." },
    { q: "Can I do anything about a complaint-driven inspection?", a: "You can't block a legitimate complaint inspection, but you can control your readiness. Keep detectors fresh, exits clear, and evidence organized so the visit is uneventful." },
    { q: "What evidence should I keep from an inspection?", a: "The inspection report, the signed certificate, photo evidence of corrections, and the detector or exit inventory you used to prepare. Store these with your other compliance documents." },
  ],
}
const SMOKE_CO: GuideTopic = {
  slug: "smoke-co-detectors",
  title: "Smoke & CO Detector Laws for Landlords",
  eyebrow: "Guide",
  description:
    "Where detectors must go, which certificates expire, and how to prove compliance when it counts.",
  intro: [
    "Smoke and carbon monoxide detector requirements come from state building and fire codes and get most landlord enforcement attention at inspections and tenancy changes. The modern baseline is simple to state and harder to remember across a portfolio: alarms on every level, outside every sleeping area, and CO coverage near any fuel-burning appliance or attached garage.",
    "Many jurisdictions now require sealed, tamper-resistant alarms and written certificates proving installation — and those certificates often expire on a set cycle.",
  ],
  sections: [
    {
      heading: "Where detectors must go",
      paragraphs: ["Work through each unit against this list before you call it compliant."],
      list: [
        "At least one smoke alarm on every level",
        "A smoke alarm outside each sleeping area",
        "Smoke alarms inside bedrooms where local code requires",
        "A CO alarm on every level with a fuel-burning appliance",
        "A CO alarm within close reach of every bedroom",
        "Interconnected alarms where code requires it",
      ],
    },
    {
      heading: "Certificates and expiration",
      paragraphs: [
        "Several cities require landlords to submit or hold a smoke/CO certificate tied to the certificate of occupancy or a tenancy change. These certificates expire — often on a one- or two-year cycle — which means last year's proof may not be this year's proof.",
        "Keep the certificate, its issue date, and its expiration date in one place, and check it against every inspection and renewal date on your calendar.",
      ],
    },
    {
      heading: "The annual detector checklist",
      paragraphs: ["A short annual sweep prevents almost all detector-related surprises."],
      list: [
        "Test every detector and replace any that fail",
        "Confirm detectors are in code-required locations",
        "Verify sealed-battery or hardwire requirements",
        "Upload current certificates with expiry dates",
        "Schedule the next check before any certificate lapses",
      ],
    },
  ],
  cityRows: [
    { city: "Boston", slug: "boston", summary: "Smoke + CO certificates verified at Sanitary Code inspections." },
    { city: "Chicago", slug: "chicago", summary: "Detector certificates tracked with building registration." },
    { city: "Seattle", slug: "seattle", summary: "Smoke and CO requirements enforced through RRIO inspections." },
    { city: "Denver", slug: "denver", summary: "Detectors verified at rental-license life-safety inspections." },
    { city: "New York", slug: "new-york", summary: "Smoke/CO certification required at renewal and on complaint." },
  ],
  faq: [
    { q: "Do smoke detector certificates expire?", a: "In many cities, yes — they are tied to the certificate of occupancy or a registration cycle and must be refreshed periodically. Check your city's rules on the city page." },
    { q: "Can tenants replace their own detector batteries?", a: "Leases usually place detector maintenance on the landlord. Regardless of who changes batteries, the landlord remains responsible for code compliance and is the one cited at inspection." },
    { q: "Are interconnected alarms required everywhere?", a: "Many states now require interconnection on new installations or major renovations, while existing units follow the code in force at installation. Verify the current code for your city." },
    { q: "What proof do I need at an inspection?", a: "A dated certificate from a qualified vendor or the building department plus detector IDs and locations. Photo evidence or a signed self-certification works in some cities." },
  ],
}
const LEAD_PAINT: GuideTopic = {
  slug: "lead-paint-disclosure",
  title: "Lead Paint Disclosure for Pre-1978 Rentals",
  eyebrow: "Guide",
  description:
    "Federal disclosure duties, state lead-certification rules, and the checklist for pre-1978 rental properties.",
  intro: [
    "Federal law requires landlords who rent housing built before 1978 to disclose known lead-based paint hazards, provide the EPA pamphlet 'Protect Your Family From Lead in Your Home,' and include a lead warning statement in the lease. States like Maryland go further and require lead risk-reduction inspections and certificates for qualifying units.",
    "For self-managing landlords, lead compliance is a documentation obligation first: the building's age, any known hazards, and the paperwork trail that proves disclosure happened.",
  ],
  sections: [
    {
      heading: "What federal law requires",
      paragraphs: ["For any pre-1978 rental, the landlord must provide:"],
      list: [
        "The EPA 'Protect Your Family From Lead' pamphlet to the tenant",
        "Disclosure of any known lead-based paint or hazards",
        "A lead warning statement in the lease",
        "Signed acknowledgment that the tenant received the information",
      ],
    },
    {
      heading: "State and city lead-certification layers",
      paragraphs: [
        "Some states layer certification on top of federal disclosure. Maryland requires an approved lead risk-reduction treatment plus a certificate for certain pre-1978 rental properties before occupancy, and renewal on a set schedule. Cities with strong lead ordinances can require inspection reports even where the state does not.",
        "Because the rules differ by building age, unit count, and state, the first step is always to check the applicable state and city programs.",
      ],
    },
    {
      heading: "Building the paper trail",
      paragraphs: [
        "Keep the disposition: the property's year built, any inspection reports, the signed disclosure form per tenancy, and the certificate where required. 'We disclosed it' is only useful if you can prove it years later — disputes and audits arrive precisely when the paperwork is missing.",
      ],
    },
  ],
  cityRows: [
    { city: "Baltimore", slug: "baltimore", summary: "Maryland lead certification + city housing registration for pre-1978." },
    { city: "Boston", slug: "boston", summary: "Federal lead law enforced at inspection and tenancy." },
    { city: "Chicago", slug: "chicago", summary: "Pre-1978 units require lead disclosure and inspection windows." },
    { city: "New York", slug: "new-york", summary: "Local Law 1 lead paint and XRF testing for pre-1978 units." },
  ],
  faq: [
    { q: "Which buildings are covered by lead disclosure law?", a: "Any rental housing built before 1978, regardless of whether lead paint has been identified. If the building is pre-1978, disclosure obligations apply." },
    { q: "What happens if I don't disclose?", a: "Violations risk federal civil penalties, state fines, and exposure in tenant lawsuits. A signed disclosure form is your defense." },
    { q: "Is a lead inspection required for my building?", a: "Federal law doesn't require an inspection before renting — it requires disclosure. But state programs like Maryland's and city rules like New York's Local Law 1 do require risk-reduction inspections and certificates." },
    { q: "Can a tenant waive the lead disclosure?", a: "No. Disclosure is a federal duty that cannot be waived by lease terms, and lease language attempting to waive it is unenforceable." },
  ],
}
const PROOF_OF_COMPLIANCE: GuideTopic = {
  slug: "proof-of-compliance",
  title: "Proof of Compliance: Building an Evidence Vault",
  eyebrow: "Guide",
  description:
    "The documents every compliance audit asks for, how to organize them, and how to export proof in minutes.",
  intro: [
    "Compliance is not finished when the requirement is met — it's finished when you can prove it. A registration paid from memory, a detector certificate filed in a drawer, an inspection you passed two years ago: each becomes valuable only when an auditor, buyer, or inspector asks for it.",
    "An evidence vault is simply a disciplined filing system that answers 'what applies to this property, what's the deadline, and where's the proof?' at a glance.",
  ],
  sections: [
    {
      heading: "The documents every audit asks for",
      paragraphs: ["A standard compliance review collects a predictable set of records."],
      list: [
        "Current rental registration or license certificates",
        "Inspection reports and signed certificates of occupancy",
        "Smoke and CO detector certificates with expiry dates",
        "Lead paint disclosures for pre-1978 buildings",
        "Required disclosures (security deposit, bedbug, radon)",
        "Proof of payments: receipts or bank records",
      ],
    },
    {
      heading: "Organizing across a portfolio",
      paragraphs: [
        "The failure mode for self-managing landlords isn't collecting documents — it's knowing which document belongs to which property and when the next version is due. Date everything, name files consistently, keep the latest version on top, and map every requirement to at least one current document.",
        "When a request arrives, the goal is to hand over a complete, dated set in minutes rather than scramble through inboxes and folders.",
      ],
    },
    {
      heading: "Exporting proof when it counts",
      paragraphs: [
        "A compliance packet is a PDF with a cover summary plus each document in order: registration, inspection, certificates, disclosures. Before an audit, a sale, or an inspection, generate the packet and verify nothing has expired.",
        "Tools like RuleNest's Evidence Vault do exactly this — upload once, match each document to the right property and requirement, and export the whole packet on demand.",
      ],
    },
  ],
  cityRows: [
    { city: "Boston", slug: "boston", summary: "Registration certificates + inspection reports expected on site." },
    { city: "Chicago", slug: "chicago", summary: "Registration certificate and proof of payment for renewals." },
    { city: "Denver", slug: "denver", summary: "License, inspection sign-off, and detector tracking." },
    { city: "Seattle", slug: "seattle", summary: "RRIO registration and inspection checklist on file." },
    { city: "Philadelphia", slug: "philadelphia", summary: "Rental license + BSC inspection certificate." },
  ],
  faq: [
    { q: "What is the most important compliance document to keep?", a: "For most cities it's the current registration or license certificate, plus proof of payment. Without it, every other record is harder to defend." },
    { q: "How long should I keep old certificates?", a: "Keep at least the last full cycle (typically one to two years) plus the current one. For lead disclosures, keep the signed form for as long as the tenancy plus any applicable statute of limitations." },
    { q: "Can digital copies substitute for paper?", a: "In most cities yes — scans of certificates and reports are accepted, especially if they show dates and the issuing agency. Keep high-resolution originals and a backup." },
    { q: "How do I export a complete compliance packet?", a: "Collect the current documents for one property in order, add a cover summary with the property details, and export as a single PDF. RuleNest's Proof Pack does this automatically." },
  ],
}

export const GUIDE_TOPICS: GuideTopic[] = [
  RENTAL_REGISTRATION,
  RENTAL_INSPECTIONS,
  SMOKE_CO,
  LEAD_PAINT,
  PROOF_OF_COMPLIANCE,
]

export function getGuide(slug: string): GuideTopic | undefined {
  return GUIDE_TOPICS.find((g) => g.slug === slug)
}