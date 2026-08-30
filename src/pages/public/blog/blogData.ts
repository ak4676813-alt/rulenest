import { SEO_POSTS } from "./seoPosts"

export interface BlogSection {
  heading: string
  paragraphs: string[]
  list?: string[]
}

export interface BlogPostData {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  author?: string
  sections: BlogSection[]
  relatedLinks?: Array<{ label: string; to: string }>
}

export const BLOG_AUTHOR = "Ankit Kumar, founder of RuleNest"
export const BLOG_AUTHOR_BIO =
  "Ankit Kumar is the founder of RuleNest, building compliance-intelligence software for self-managing landlords. He writes about rental registration, inspections, detector laws, and the paperwork that keeps small landlords audit-ready."

const chicago: BlogPostData = {
  slug: "chicago-rental-registration-2026",
  title: "Chicago Rental Registration 2026: The Complete Landlord Guide",
  excerpt:
    "Everything self-managing landlords need to know about Chicago's residential rental registration — who must register, what it costs, and how to renew on time.",
  date: "January 14, 2026",
  readTime: "7 min read",
  sections: [
    {
      heading: "Why rental registration matters in Chicago",
      paragraphs: [
        "Chicago's Residential Tenant and Landlord Ordinance requires most residential rental buildings in the city to be registered with the Department of Buildings. The system exists so the city knows who owns and manages every rental unit, who to contact about code violations, and where a property's responsible party lives. For landlords, registration is the single most visible compliance obligation in the city — and the one most likely to produce a fine if it lapses.",
        "Registration is separate from a building permit, a business license, or a landlord license. It is a building-level registration that identifies the property and its owner. Missing it doesn't just risk a fine; it can complicate evictions, delay repairs, and put you on the city's enforcement radar when any complaint is filed against the property.",
      ],
    },
    {
      heading: "Which properties must register",
      paragraphs: [
        "In general, any building in Chicago with one or more dwelling units rented to tenants must be registered. This includes single-family homes and condos that are rented out, two-flats and three-flats, and larger apartment buildings. Owner-occupied buildings where the owner lives on-site and rents no more than one or two units may qualify for reduced-fee or exempt treatment depending on the current ordinance, so it is always worth checking the specifics for your building.",
      ],
      list: [
        "Apartment buildings of any size",
        "Two-flats and three-flats with tenants",
        "Rented single-family homes and condos",
        "Buildings with mixed commercial and residential use",
      ],
    },
    {
      heading: "What registration costs",
      paragraphs: [
        "Fees are generally per building and per unit. Chicago structures its registration fee on the number of units in the building, so a two-flat costs less than a 20-unit building. Fees are set by ordinance and can change, so the amount you paid last year may not be the amount due this year. Budget for both the base registration fee and the per-unit component before renewal season arrives.",
        "The good news is that registration is annual and the renewal window is predictable. Because the deadline recurs on a set cycle, it is entirely avoidable with a reminder system — which is exactly the kind of thing RuleNest is built to track.",
      ],
    },
    {
      heading: "Renewals and deadlines",
      paragraphs: [
        "Chicago registrations renew annually. The deadline is tied to the registration cycle for the building, and the city typically sends a renewal notice before the due date. The risk is not the notice — it is what happens when a renewal notice lands in the wrong inbox, or sits in a pile while you are between tenants or managing multiple properties.",
        "A reliable approach is to treat registration like any other hard deadline: set reminders well ahead of time, confirm payment, and keep the receipt as evidence. RuleNest can hold the registration certificate and remind you 90, 60, and 30 days before renewal, so the deadline never sneaks up on you.",
      ],
    },
    {
      heading: "What happens if you miss the deadline",
      paragraphs: [
        "Unregistered rental buildings in Chicago can face fines, and enforcement can compound quickly. A lapse can also put a hold on the building's ability to renew permits or change tenancy, and it is frequently the first thing a tenant or inspector checks when there is a dispute. In the worst cases, repeat non-compliance can trigger additional inspection activity from the Department of Buildings.",
        "The practical fix is straightforward: register before tenants move in, renew on the annual cycle, and keep proof of both. Landlords who treat registration as an annual calendar event rarely have problems. Landlords who rely on memory often do.",
      ],
    },
    {
      heading: "How to stay ahead of Chicago registration",
      paragraphs: [
        "The most reliable way to stay compliant is to make registration part of a repeatable process instead of an annual scramble. Keep the certificate in one place, note the renewal month, and set multiple reminders. If you manage more than one property, track each building separately — a shared spreadsheet gets unwieldy fast once you have a handful of properties with different cycles.",
        "RuleNest was built for exactly this workflow. It matches each of your properties to the Chicago requirements that apply, stores the registration certificate in your Evidence Vault, and reminds you 90, 60, and 30 days before renewal. See how it works on the features page, or start free and add your first property in about ninety seconds.",
      ],
    },
  ],
}

const boston: BlogPostData = {
  slug: "boston-rental-inspection-rules",
  title: "Boston Rental Inspection Rules: What Self-Managing Landlords Must Know",
  excerpt:
    "How Boston's rental inspection program works — what inspectors check, how often inspections happen, and how to pass on the first attempt.",
  date: "January 21, 2026",
  readTime: "6 min read",
  sections: [
    {
      heading: "How Boston inspections work",
      paragraphs: [
        "Boston requires rental units to meet the state's Sanitary Code, and the city enforces it through the Inspectional Services Department (ISD). For many units, that means a scheduled inspection when a property is first certified as habitable and again on a recurring cycle. The goal is to confirm basic health and safety: working smoke and CO detectors, safe egress, functional heating and plumbing, and no visible hazards.",
        "An inspection is not a discretionary upgrade — it is the mechanism Boston uses to keep its rental stock livable. For a self-managing landlord, passing on the first attempt saves both time and the cost of a second visit.",
      ],
    },
    {
      heading: "What inspectors check",
      paragraphs: [
        "Boston inspectors work from the Sanitary Code's list of minimum standards. Knowing that list in advance is the difference between passing quickly and scrambling for a re-inspection. Most failures come from the same handful of items, so it pays to walk the unit with the checklist before the inspector arrives.",
      ],
      list: [
        "Working smoke detectors on every level and outside sleeping areas",
        "Carbon monoxide detectors near fuel-burning appliances and bedrooms",
        "Safe, unobstructed exits from every bedroom",
        "Functional heating that can maintain a safe temperature",
        "Working hot and cold water, with no leaks",
        "No pests, mold, or visible water damage",
        "Secure windows and doors, and working locks",
      ],
    },
    {
      heading: "Frequency and scheduling",
      paragraphs: [
        "Many Boston rental units are inspected on a two-year cycle, though the exact cadence can depend on the building and whether the city has targeted the property for closer attention. When a unit changes tenancy or a complaint is filed, an inspection can be triggered sooner. The key point for landlords is that inspections are recurring, not one-time events — which is why a reminder system matters.",
        "RuleNest tracks the inspection cycle for each property. When your next inspection window opens, it is surfaced as a deadline with a clear next step, so you can schedule the visit before the city has a reason to come looking.",
      ],
    },
    {
      heading: "What happens if you fail",
      paragraphs: [
        "A failed inspection results in a list of corrections and a deadline to fix them, followed by a re-inspection. Failing more than once can escalate the enforcement response — and in Boston, accumulation of serious violations can eventually threaten the unit's certificate of occupancy or trigger a stop-work situation.",
        "The most common reason landlords fail is a simple, fixable issue like a dead detector battery or a blocked exit. These are exactly the kinds of things a ten-minute pre-inspection walk catches. Documentation of the repair, uploaded the same day, closes the loop quickly.",
      ],
    },
    {
      heading: "Staying organized across multiple units",
      paragraphs: [
        "The hard part of Boston compliance is rarely understanding the rules — it is keeping track of which unit is due for what, in which month, across a property you manage on your own. A spreadsheet works until it doesn't, especially once inspection dates, detector certificates, and registration renewals start overlapping.",
        "RuleNest centralizes all of it in one place. Each property gets its own requirement list, evidence vault, and deadline set, so a Boston landlord can see every upcoming inspection and certificate renewal at a glance. You can review the features or start free with one property to see your own compliance profile in minutes.",
      ],
    },
  ],
}


const smoke: BlogPostData = {
  slug: "smoke-co-detector-laws-2026",
  title: "Smoke & CO Detector Laws for Landlords: 2026 Checklist",
  excerpt:
    "A plain-English 2026 checklist for smoke and carbon monoxide detector requirements — placement, testing, certificates, and how to prove compliance.",
  date: "January 28, 2026",
  readTime: "6 min read",
  sections: [
    {
      heading: "What the law requires in 2026",
      paragraphs: [
        "Smoke and carbon monoxide detector requirements come from state building and fire codes, and they have been tightening steadily. The modern baseline most places enforce is simple to state: hardwired or sealed tamper-resistant smoke alarms on every level and outside every sleeping area, plus CO alarms near bedrooms wherever there is a fuel-burning appliance or an attached garage.",
        "Many jurisdictions now require interconnected alarms so that when one sounds, they all sound. Some states also mandate that alarms be within a certain age or use sealed non-removable batteries, so a tenant cannot disable them. The rules are detailed and they differ by city, but the landlord's job is the same everywhere: have working detectors in the right places and be able to prove it.",
      ],
    },
    {
      heading: "Where detectors must go",
      paragraphs: [
        "Placement is where most compliance gaps hide. It is not enough to have detectors somewhere in the unit — they need to be in the specific locations the code names. Walk each unit against this list before you consider it compliant.",
      ],
      list: [
        "At least one smoke alarm on every level of the unit",
        "A smoke alarm outside each sleeping area",
        "Smoke alarms inside any bedroom where required by local code",
        "A CO alarm on every level with a fuel-burning appliance",
        "A CO alarm within close reach of every bedroom",
        "Interconnected alarms where the code requires them",
      ],
    },
    {
      heading: "Certificates and expiration",
      paragraphs: [
        "Many cities require landlords to submit or keep a certificate proving detectors were installed or inspected — often tied to the unit's certificate of occupancy or to a tenancy change. In several jurisdictions these certificates expire on a set cycle, which means a certificate that was fine last year may be due to be refreshed now.",
        "Because detector requirements are so detail-driven and go stale as codes change, tracking them with memory is a losing game. The certificates, their expiration dates, and the underlying requirement all belong in a system that surfaces them before they lapse.",
      ],
    },
    {
      heading: "The landlord's annual checklist",
      paragraphs: [
        "An annual detector check-up prevents almost all enforcement surprises. Set aside an hour, work through the unit methodically, and keep records of what you tested and when. Your year-round checklist should cover these steps.",
      ],
      list: [
        "Test every detector and replace any that fail",
        "Verify detectors are in the correct code-required locations",
        "Confirm battery type and sealed-battery status where required",
        "Upload current certificates to your evidence vault",
        "Note each unit's replacement and maintenance requirements",
        "Schedule the next check before the current certificate expires",
      ],
    },
    {
      heading: "Proving compliance when it counts",
      paragraphs: [
        "Compliance is not finished when the detectors are installed — it is only finished when you can prove it. An auditor, inspector, or prospective buyer will eventually ask for documentation, and landlords who scramble for it are the ones who get cited.",
        "RuleNest's Evidence Vault is built for this: upload each detector certificate once, and it is matched to the right property and requirement, with the expiration date tracked automatically. When the Expiring Soon or Documents lists show a renewal is near, you handle it long before anyone has to ask. See the features that keep landlords audit-ready, or sign up free and see your own compliance picture in under two minutes.",
      ],
    },
  ],
}


const fines: BlogPostData = {
  slug: "rental-registration-fines-10-cities",
  title: "Rental Registration Fines in 10 US Cities (And How to Avoid Them)",
  excerpt:
    "Missed rental registration deadlines cost landlords real money. Here's what a lapse can cost in 10 US cities — and the simple system that avoids it entirely.",
  date: "February 4, 2026",
  readTime: "8 min read",
  sections: [
    {
      heading: "The real cost of missing registration",
      paragraphs: [
        "Rental registration and licensing fees are usually modest — often a few hundred dollars a year. The fines for missing the deadline, however, are designed to hurt. Across the country, cities lean on escalating penalties because registration is their early-warning system for everything else they regulate. A landlord who misses registration is a landlord the city wants to hear from.",
        "The numbers below are representative of the penalty structures in each market and change as ordinances are updated. The pattern is what matters: small recurring fines for a short lapse, larger ones as the violation persists, and sometimes a stop on the ability to renew a certificate or start a new tenancy.",
      ],
    },
    {
      heading: "How fines compare across 10 cities",
      paragraphs: [
        "While every city writes its own ordinance, the penalty ranges cluster into a familiar shape. A few hundred dollars covers most first-offense fines; repeat or long-standing lapses climb quickly from there. Landlords who treat registration as optional are effectively choosing to gamble these amounts against their annual cash flow.",
      ],
      list: [
        "Chicago, IL — fines commonly in the hundreds per building, escalating on repeat cycles",
        "New York City, NY — per-unit penalties that multiply across buildings",
        "Boston, MA — violation fees plus the cost of reinspection after a lapse",
        "Los Angeles, CA — registration plus escalating late fees and potential lien action",
        "San Francisco, CA — among the highest per-unit penalty structures",
        "Seattle, WA — late fees that accrue monthly until registration is current",
        "Denver, CO — per-unit fines that climb with the number of violations",
        "Philadelphia, PA — registration tied to the rental license, with fines for both",
        "Houston, TX — penalty per unit, higher for properties with open violations",
        "Atlanta, GA — escalating fines for properties operating without registration",
      ],
    },
    {
      heading: "Why fines escalate so quickly",
      paragraphs: [
        "Most penalty schedules double or multiply for each renewal cycle missed. A property that is one month late may cost one modest fine; the same property two years behind can owe multiples of the original fee, plus interest or lien fees in some cities. Municipalities can also use unregistered status as the hook for a full inspection — which can surface unrelated violations and their own fines.",
        "That cascade is the real reason registration lapses are dangerous. The fine is rarely the worst outcome; the enforcement attention it invites is.",
      ],
    },
    {
      heading: "How to avoid the fines entirely",
      paragraphs: [
        "None of these penalties are complicated to avoid. Registration is a known deadline that recurs on a predictable cycle, which means a calendar plus a paper trail is almost enough. The gaps appear when the deadline is unknown, the renewal notice goes astray, or a landlord manages multiple properties with different cycles and relies on memory.",
      ],
      list: [
        "Know each city's registration cycle and per-unit fee before the year starts",
        "Set reminders well ahead of the deadline — not on the day it's due",
        "Keep the registration certificate and payment receipt as evidence",
        "Recheck the ordinance each year, because fees and dates change",
        "Track every property separately, never on a shared mental model",
      ],
    },
    {
      heading: "The bottom line for self-managing landlords",
      paragraphs: [
        "Registration compliance is one of the highest-leverage things a self-managing landlord can automate. It costs little, recurs predictably, and the downside of missing it is disproportionate to the effort of staying current. The landlords who avoid these fines are not more organized by nature — they use a system that refuses to let a deadline slip.",
        "RuleNest is that system. It matches each property to the local registration rules that apply, stores the certificates in your Evidence Vault, and reminds you 90, 60, and 30 days before renewal. Explore what it does, or start free and add your first property to see your deadlines mapped out today.",
      ],
    },
  ],
}

export const BLOG_POSTS: BlogPostData[] = [chicago, boston, smoke, fines, ...SEO_POSTS]

export function getPost(slug: string): BlogPostData | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

