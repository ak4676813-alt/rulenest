/** Compact helper for the newly added city pages (same shape as _base). */
function city(
  name: string,
  state: string,
  coords: [number, number],
  registration: string,
  inspection: string,
  fees: string,
  officials: Array<{ label: string; url: string }>,
): CityInfo {
  return {
    name,
    state,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    coords,
    registration,
    inspection,
    fees,
    officials,
  }
}

const _added: CityInfo[] = [
  city("Miami", "FL", [25.7617, -80.1918], "Rentals must be licensed each year; buildings over a unit threshold also register with the county.", "Complaint-driven and license-triggered inspections verify habitability and safety.", "Annual license fee per unit; late renewals carry penalties.", [{ label: "Miami", url: "https://www.miamigov.com" }]),
  city("Orlando", "FL", [28.5383, -81.3789], "Short-term rentals are licensed by the city; long-term rentals follow state and municipal habitability codes.", "Complaint-driven code enforcement; STRs have their own inspection requirements.", "STR license fees apply; no general long-term registration fee.", [{ label: "Orlando", url: "https://www.orlando.gov" }]),
  city("Tampa", "FL", [27.9506, -82.4572], "No separate long-term rental registration; habitability and STR rules governed by city code.", "Complaint-driven enforcement.", "General registration: none.", [{ label: "Tampa", url: "https://www.tampa.gov" }]),
  city("Atlanta", "GA", [33.749, -84.388], "Rental properties must be registered annually; some units require additional licensing or building registration.", "Periodic and complaint-driven inspections support registration.", "Annual per-unit registration fees.", [{ label: "Atlanta", url: "https://www.atlantaga.gov" }]),
  city("Charlotte", "NC", [35.2271, -80.8431], "No broad citywide rental licensing; dwelling licenses apply to multi-family buildings.", "Building maintenance and habitability inspections occur on complaint and licensing.", "Per-dwelling license fees.", [{ label: "Charlotte", url: "https://www.charlottenc.gov" }]),
  city("Raleigh", "NC", [35.7796, -78.6382], "Multi-family and non-owner-occupied single-family rentals must be registered.", "Registration supports periodic property inspections.", "Annual registration fees by unit count.", [{ label: "Raleigh", url: "https://raleighnc.gov" }]),
  city("Nashville", "TN", [36.1627, -86.7816], "Short-term rentals require permits; long-term rentals follow state law without a city registry.", "Complaint-driven housing enforcement.", "STR permit fees only.", [{ label: "Nashville", url: "https://www.nashville.gov" }]),
  city("Memphis", "TN", [35.1495, -90.049], "Residential rentals must be registered and inspected for lead hazards where applicable.", "Annual inspections cover habitability and safety for registered rentals.", "Annual registration fee per unit.", [{ label: "Memphis", url: "https://www.memphistn.gov" }]),
  city("New Orleans", "LA", [29.9511, -90.0715], "Rental properties must obtain a license; certain short-term rentals have separate permits.", "Licensing triggers periodic safety inspections.", "Annual license fees per unit.", [{ label: "New Orleans", url: "https://nola.gov" }]),
  city("Detroit", "MI", [42.3314, -83.0458], "Residential rentals must be licensed annually; owner-occupied and small buildings have reduced rules.", "Licensed rentals pass periodic property inspections.", "Annual license fee per unit.", [{ label: "Detroit", url: "https://detroitmi.gov" }]),
  city("Cleveland", "OH", [41.4993, -81.6944], "Rental registrations are required and must be renewed annually for most residential units.", "Registered rentals are subject to periodic housing inspections.", "Annual per-unit registration fees.", [{ label: "Cleveland", url: "https://www.clevelandohio.gov" }]),
  city("Columbus", "OH", [39.9612, -82.9988], "Rental registration applies to most residential rental properties, with owner-occupied exclusions.", "Registration supports complaint-driven and periodic inspections.", "Annual registration fee per unit.", [{ label: "Columbus", url: "https://www.columbus.gov" }]),
  city("Cincinnati", "OH", [39.1031, -84.512], "Rental properties must be registered and inspected before receiving a rental license.", "A property inspection is required at license issuance.", "License and inspection fees per unit.", [{ label: "Cincinnati", url: "https://www.cincinnati-oh.gov" }]),
  city("Indianapolis", "IN", [39.7684, -86.1581], "No citywide rental registry for long-term rentals; state codes and complaint enforcement apply.", "Complaint-driven housing code inspections.", "General registration: none.", [{ label: "Indianapolis", url: "https://www.indy.gov" }]),
  city("Milwaukee", "WI", [43.0389, -87.9065], "Residential rental properties must register annually; some units require a rental certificate.", "Registered rentals are inspected periodically for health and safety.", "Annual registration fees.", [{ label: "Milwaukee", url: "https://city.milwaukee.gov" }]),
  city("St. Louis", "MO", [38.627, -90.1994], "Rental properties must be licensed and registered; inspections are tied to the license.", "Property inspections occur at licensing and renewal.", "Annual license fee per unit.", [{ label: "St. Louis", url: "https://www.stlouis-mo.gov" }]),
  city("Kansas City", "MO", [39.0997, -94.5786], "Residential rentals must hold a valid rental license renewed annually.", "Periodic inspections verify habitability for licensed rentals.", "Annual license fees.", [{ label: "Kansas City", url: "https://www.kcmo.gov" }]),
  city("Oklahoma City", "OK", [35.4676, -97.5164], "No citywide rental registry; complaint-driven housing code enforcement applies.", "Complaint-based inspections only.", "General registration: none.", [{ label: "Oklahoma City", url: "https://www.okc.gov" }]),
  city("Tulsa", "OK", [36.154, -95.9928], "Rental licensing applies to short-term rentals; long-term rentals follow state codes.", "Complaint-driven enforcement.", "STR fees only.", [{ label: "Tulsa", url: "https://www.cityoftulsa.org" }]),
  city("Albuquerque", "NM", [35.0844, -106.6504], "Residential rental properties must register; licensing applies to multi-family housing.", "Registered multi-family rentals pass periodic inspections.", "Annual registration and license fees.", [{ label: "Albuquerque", url: "https://www.cabq.gov" }]),
  city("Phoenix", "AZ", [33.4484, -112.074], "Rental licensing is required for short-term rentals; long-term rentals follow state and municipal codes.", "Complaint-driven and STR-permit inspections.", "STR license fees.", [{ label: "Phoenix", url: "https://www.phoenix.gov" }]),
  city("Tucson", "AZ", [32.2226, -110.9747], "Short-term rentals require licensing; long-term rentals are governed by habitability code.", "Complaint-driven enforcement.", "STR fees only.", [{ label: "Tucson", url: "https://www.tucsonaz.gov" }]),
  city("Las Vegas", "NV", [36.1699, -115.1398], "Short-term rentals are licensed; long-term rentals follow county/state registrations (NV landlord registry).", "Complaint-driven housing code enforcement.", "STR licensing fees; state landlord registration.", [{ label: "Las Vegas", url: "https://www.lasvegasnevada.gov" }]),
  city("Sacramento", "CA", [38.5816, -121.4944], "Rental properties must register annually; some units are subject to rent-review registration.", "Registered properties are inspected on a periodic cycle.", "Annual registration fees per unit.", [{ label: "Sacramento", url: "https://www.cityofsacramento.gov" }]),
  city("San Jose", "CA", [37.3382, -121.8863], "Rent-controlled units require annual registration with habitability verifications.", "Recorded registration supports periodic habitability inspections.", "Annual registration fee per unit.", [{ label: "San Jose", url: "https://www.sanjoseca.gov" }]),
  city("Long Beach", "CA", [33.7701, -118.1937], "Rent-controlled units must register annually.", "Registration supports periodic inspections of regulated units.", "Annual registration fee per unit.", [{ label: "Long Beach", url: "https://www.longbeach.gov" }]),
  city("Fresno", "CA", [36.7378, -119.7871], "No broad citywide rental registration; state habitability codes apply.", "Complaint-driven enforcement.", "General registration: none.", [{ label: "Fresno", url: "https://www.fresno.gov" }]),
  city("Mesa", "AZ", [33.4152, -111.8315], "Long-term rentals follow state and municipal codes without a city registry.", "Complaint-driven housing enforcement.", "General registration: none.", [{ label: "Mesa", url: "https://www.mesaaz.gov" }]),
  city("Wichita", "KS", [37.6872, -97.3301], "No citywide rental registry; state and municipal habitability codes apply.", "Complaint-driven enforcement.", "General registration: none.", [{ label: "Wichita", url: "https://www.wichita.gov" }]),
  city("Omaha", "NE", [41.2565, -95.9345], "No general long-term rental registry; habitability and STR rules apply by code.", "Complaint-driven enforcement.", "General registration: none.", [{ label: "Omaha", url: "https://www.cityofomaha.org" }]),
]
/* City-level rental compliance reference data for RuleNest's SEO content
   engine. Each entry powers a /compliance/:slug city page. Rules summaries are
   directional, not legal advice — always verify with the linked official
   sources before acting. */

export interface CityInfo {
  name: string
  state: string
  slug: string
  coords: [number, number]
  registration: string
  inspection: string
  fees: string
  officials: Array<{ label: string; url: string }>
}

export const VERIFY_NOTE =
  "Rules change — verify current deadlines, fees, and requirements with the official city sources linked on this page before filing."

const _base: CityInfo[] = [
  {
    name: "Boston",
    state: "MA",
    slug: "boston",
    coords: [42.3601, -71.0589],
    registration: "Most rental buildings must be registered with the Inspectional Services Department; registration is separate from the sanitary-code inspection cycle.",
    inspection: "Units are inspected against the state Sanitary Code on a recurring cycle, often every two years and whenever tenancy changes.",
    fees: "Registration and inspection fees are set by ordinance and generally scale with unit count.",
    officials: [
      { label: "Boston ISD", url: "https://www.boston.gov/departments/inspectional-services" },
      { label: "Boston housing rules", url: "https://www.boston.gov/departments/housing" },
    ],
  },
  {
    name: "Chicago",
    state: "IL",
    slug: "chicago",
    coords: [41.8781, -87.6298],
    registration: "Residential rental buildings must be registered with the Department of Buildings annually, with a per-building and per-unit fee.",
    inspection: "Registered buildings are subject to periodic inspection requirements; renewals can trigger inspection activity.",
    fees: "Annual registration fee is structured per building plus per unit.",
    officials: [
      { label: "Chicago Buildings", url: "https://www.chicago.gov/city/en/depts/bldgs.html" },
    ],
  },
  {
    name: "Denver",
    state: "CO",
    slug: "denver",
    coords: [39.7392, -104.9903],
    registration: "Denver operates rental licensing and registry programs for residential rentals, with annual licensing tied to safety inspections.",
    inspection: "Licensed rentals must pass periodic life-safety inspections covering detectors, egress, and basic habitability.",
    fees: "Annual licensing fees vary by unit count; late renewals incur penalties.",
    officials: [
      { label: "Denver licensing", url: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Excise-and-Licenses" },
    ],
  },
  {
    name: "Seattle",
    state: "WA",
    slug: "seattle",
    coords: [47.6062, -122.3321],
    registration: "Seattle's Rental Registration and Inspection Ordinance (RRIO) requires rental housing to be registered and inspected on a five-year cycle.",
    inspection: "RRIO inspections cover detectors, smoke alarms, and life-safety items every five years.",
    fees: "Registration and inspection fees are set by the city; late registration carries penalties.",
    officials: [
      { label: "Seattle SDCI", url: "https://www.seattle.gov/sdci/rental-housing" },
    ],
  },
  {
    name: "San Francisco",
    state: "CA",
    slug: "san-francisco",
    coords: [37.7749, -122.4194],
    registration: "Residential units are subject to annual registration and, in many buildings, rent-control-related certificate requirements.",
    inspection: "Periodic building and unit inspections enforce habitability standards; certificate updates can surface inspections.",
    fees: "Registration fees per unit are among the highest in the state, with steep late penalties.",
    officials: [
      { label: "SF DBI", url: "https://www.sf.gov/departments/department-building-inspection" },
      { label: "SF rent board", url: "https://sfrb.org" },
    ],
  },
  {
    name: "Austin",
    state: "TX",
    slug: "austin",
    coords: [30.2672, -97.7431],
    registration: "Austin does not require a general rental license for most long-term rentals, but city codes govern habitability and short-term rentals separately.",
    inspection: "Code enforcement responds to complaints; short-term rentals have their own inspection and permit rules.",
    fees: "No general registration fee; STR permits carry their own licensing costs.",
    officials: [
      { label: "Austin Code", url: "https://www.austintexas.gov/department/code" },
    ],
  },
  {
    name: "New York",
    state: "NY",
    slug: "new-york",
    coords: [40.7128, -74.006],
    registration: "Multiple dwelling units must be registered annually with HPD, with a fee per unit and a named owner/managing agent.",
    inspection: "HPD conducts periodic cycle inspections and complaint-based inspections of registered buildings.",
    fees: "Annual registration is per unit; failure to register can trigger significant civil penalties.",
    officials: [
      { label: "NYC HPD", url: "https://www.nyc.gov/site/hpd/index.page" },
      { label: "NYC property registration", url: "https://www.nyc.gov/site/hpd/services-and-information/property-registration.page" },
    ],
  },
  {
    name: "Los Angeles",
    state: "CA",
    slug: "los-angeles",
    coords: [34.0522, -118.2437],
    registration: "Rental properties must be registered under the Rent Stabilization Ordinance (RSO) and many units require certificates of occupancy or inspection.",
    inspection: "RSO registration requires self-inspection or inspection-based certificate compliance on a periodic schedule.",
    fees: "Registration fees are per unit with annual increases and late charges.",
    officials: [
      { label: "LA HCIDLA", url: "https://hcidla.lacity.gov" },
      { label: "LA RSO", url: "https://rso.lacity.gov" },
    ],
  },
  {
    name: "Houston",
    state: "TX",
    slug: "houston",
    coords: [29.7604, -95.3698],
    registration: "Houston does not require broad rental licensing, but minimum standards ordinances govern habitability and can carry penalties per unit.",
    inspection: "Inspections occur on complaint or as part of permit and violation enforcement.",
    fees: "No general registration; enforcement fines apply to ordinance violations.",
    officials: [
      { label: "Houston planning", url: "https://www.houstontx.gov/planning" },
      { label: "Houston municipal", url: "https://www.houstontx.gov" },
    ],
  },
  {
    name: "Dallas",
    state: "TX",
    slug: "dallas",
    coords: [32.7767, -96.797],
    registration: "No citywide rental licensing program for long-term rentals in Dallas; habitability is enforced through the housing code.",
    inspection: "Complaint-driven inspections by code compliance; no universal inspection cycle.",
    fees: "No registration fee; violation fines apply where the housing code is breached.",
    officials: [
      { label: "Dallas code compliance", url: "https://www.dallascityhall.com/departments/codecompliance" },
    ],
  },
  {
    name: "Philadelphia",
    state: "PA",
    slug: "philadelphia",
    coords: [39.9526, -75.1652],
    registration: "Rental properties must hold a valid rental license, renewed annually, with a fee per unit.",
    inspection: "A Basic Systems Certification (BSC) inspection is required every four years or when a license is first issued.",
    fees: "Annual license fee per unit; late renewal incurs a late fee.",
    officials: [
      { label: "Philly L&I", url: "https://www.phila.gov/departments/department-of-licenses-and-inspections" },
    ],
  },
  {
    name: "San Diego",
    state: "CA",
    slug: "san-diego",
    coords: [32.7157, -117.1611],
    registration: "Units subject to rent control must register; other rentals follow state and municipal habitability rules.",
    inspection: "Rent-controlled units require annual registration with dwelling-unit habitability certification.",
    fees: "Annual registration fees apply to regulated units.",
    officials: [
      { label: "San Diego", url: "https://www.sandiego.gov" },
      { label: "SD municipal code", url: "https://www.sandiego.gov" },
    ],
  },
  {
    name: "Portland",
    state: "OR",
    slug: "portland",
    coords: [45.5152, -122.6784],
    registration: "Portland operates residential rental licensing with annual registration and required landlord testing for larger portfolios.",
    inspection: "Regulated rental properties must meet periodic housing safety inspection requirements.",
    fees: "Annual rental license fees scale with unit count.",
    officials: [
      { label: "Portland BDS", url: "https://www.portland.gov/bds" },
    ],
  },
  {
    name: "Minneapolis",
    state: "MN",
    slug: "minneapolis",
    coords: [44.9778, -93.265],
    registration: "Rental properties are licensed annually with a per-unit fee and must pass periodic property inspections.",
    inspection: "Rental licenses require passing periodic property maintenance inspections.",
    fees: "Per-unit licensing fees; late renewals add penalties.",
    officials: [
      { label: "Minneapolis", url: "https://www.minneapolismn.gov" },
    ],
  },
  {
    name: "Baltimore",
    state: "MD",
    slug: "baltimore",
    coords: [39.2904, -76.6122],
    registration: "Rental properties must obtain a license and annual Maryland registration; lead-paint certification is required for pre-1978 homes.",
    inspection: "Maryland requires lead risk-reduction inspections for older rental properties.",
    fees: "Annual registration per unit; license fees apply.",
    officials: [
      { label: "Baltimore DHCD", url: "https://dhcd.baltimorecity.gov" },
      { label: "MD lead program", url: "https://mde.maryland.gov" },
    ],
  },
  {
    name: "Washington",
    state: "DC",
    slug: "washington-dc",
    coords: [38.9072, -77.0369],
    registration: "Rental housing and individual units must be registered; housing licenses are renewed on a biennial cycle.",
    inspection: "Housing inspections verify compliance with the Housing Code at registration and on complaint.",
    fees: "Registration and license fees apply per unit.",
    officials: [
      { label: "DCRA", url: "https://dcra.dc.gov" },
    ],
  },
  {
    name: "Pittsburgh",
    state: "PA",
    slug: "pittsburgh",
    coords: [40.4406, -79.9959],
    registration: "Rental properties must be licensed and registered annually with the city.",
    inspection: "A rental registration inspection is required at the time of registration.",
    fees: "Annual license and inspection fees apply.",
    officials: [
      { label: "Pittsburgh PLI", url: "https://pittsburghpa.gov/pli" },
    ],
  },
  {
    name: "Richmond",
    state: "VA",
    slug: "richmond-va",
    coords: [37.5407, -77.436],
    registration: "Rental properties must be licensed and registered; phased inspections occur at sale, transfer, or as part of license issuance.",
    inspection: "Rental inspections verify habitability and detectors at licensing milestones.",
    fees: "License and inspection fees apply per unit.",
    officials: [
      { label: "Richmond", url: "https://www.rva.gov" },
    ],
  },
  {
    name: "Virginia Beach",
    state: "VA",
    slug: "virginia-beach",
    coords: [36.8529, -75.978],
    registration: "No separate citywide rental license for most long-term rentals; state habitability codes apply.",
    inspection: "Complaint-driven housing enforcement.",
    fees: "None annually for general rentals.",
    officials: [
      { label: "Virginia Beach", url: "https://www.vbgov.com" },
    ],
  },
  {
    name: "Boise",
    state: "ID",
    slug: "boise",
    coords: [43.615, -116.2023],
    registration: "No citywide rental licensing; state landlord-tenant law and municipal habitability codes apply.",
    inspection: "Complaint-driven enforcement.",
    fees: "None for general registration.",
    officials: [
      { label: "Boise", url: "https://www.cityofboise.org" },
    ],
  },
]
export const CITIES: CityInfo[] = [..._base, ..._added]

export function cityBySlug(slug: string): CityInfo | undefined {
  return CITIES.find((c) => c.slug === slug)
}

export function citySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}