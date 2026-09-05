/* ------------------------------------------------------------------------ */
/*  RuleNest domain models. These map 1:1 to the tables a future backend     */
/*  would expose (see README → "Future backend architecture").              */
/* ------------------------------------------------------------------------ */

export type PlanId = "free" | "solo" | "portfolio" | "pro"

export interface User {
  id: string
  name: string
  email: string
  role: string
  company?: string
  phone?: string
  plan: PlanId
  avatarColor: string
  /** Google profile picture URL when the user signed in with Google OAuth. */
  avatarUrl?: string
  /** "google" | "email" — how the user last authenticated. */
  provider?: "google" | "email"
  createdAt: string
}

export type PropertyStatus = "excellent" | "good" | "fair" | "attention"

/** Property DNA — the characteristics RuleNest uses to identify which
 *  regulations may apply to a specific property. */
export interface PropertyDNA {
  propertyType: string
  units: number
  yearBuilt: number
  rentalType: string
  occupancy: string
  ownerOccupied: boolean
  floors: number
  sqft: number
  parking: string
  amenities: string[]
}

export interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  units: number
  healthScore: number
  status: PropertyStatus
  nextDeadline?: string
  imageGradient: string
  dna: PropertyDNA
  createdAt: string
  /** True for the 2 first-run example properties seeded on new signup. */
  example?: boolean
}

export type RequirementStatus =
  | "verified"
  | "current"
  | "due-soon"
  | "expiring-soon"
  | "missing-evidence"
  | "overdue"

export interface Requirement {
  id: string
  propertyId: string
  name: string
  category: string
  status: RequirementStatus
  deadline?: string
  /** "Why this applies" — plain-language explanation tied to Property DNA. */
  whyItApplies: string
  requiredEvidence: string[]
  officialSource: string
  lastVerified?: string
  /** Next best action label. */
  action: string
  /** True when created as part of the first-run example seed. */
  example?: boolean
}

export type DocumentStatus =
  | "verified"
  | "pending"
  | "expiring-soon"
  | "expired"
  | "processing"

export type DocumentCategory =
  | "Certificates"
  | "Registrations"
  | "Inspections"
  | "Insurance"
  | "Disclosures"
  | "Other"

export interface DocumentItem {
  id: string
  name: string
  propertyId: string
  category: DocumentCategory
  status: DocumentStatus
  size: string
  uploadedAt: string
  expiresAt?: string
  matchedRequirement?: string
  confidence?: number
  /** True when created as part of the first-run example seed. */
  example?: boolean
}

export type TaskStatus = "open" | "completed" | "snoozed"

export interface ComplianceTask {
  id: string
  title: string
  propertyId: string
  dueDate: string
  status: TaskStatus
  requirement?: string
  priority: "high" | "medium" | "low"
  createdAt: string
  completedAt?: string
  snoozedUntil?: string
  /** True when created as part of the first-run example seed. */
  example?: boolean
}

export interface RegulatoryChange {
  id: string
  jurisdiction: string
  title: string
  summary: string
  severity: "critical" | "high" | "medium" | "low"
  detectedAt: string
  effectiveDate: string
  source: string
  affectedPropertyIds: string[]
  requiredAction: string
  before: { label: string; text: string }
  after: { label: string; text: string }
  read: boolean
  /** True when created as part of the first-run example seed. */
  example?: boolean
}

export type ActivityType =
  | "inspection"
  | "regulation"
  | "document"
  | "task"
  | "property"
  | "report"

export interface ActivityItem {
  id: string
  type: ActivityType
  text: string
  propertyId?: string
  at: string
  /** True when created as part of the first-run example seed. */
  example?: boolean
}

export interface InboxItem {
  id: string
  kind: "city-notice" | "inspection" | "regulation" | "system"
  title: string
  jurisdiction: string
  preview: string
  body: string
  receivedAt: string
  detectedPropertyId?: string
  detectedRequirement?: string
  detectedDeadline?: string
  read: boolean
  archived: boolean
}

export interface ReportRecord {
  id: string
  type: string
  title: string
  createdAt: string
  propertyId?: string
  /** True when created as part of the first-run example seed. */
  example?: boolean
}

export interface AppData {
  properties: Property[]
  requirements: Requirement[]
  documents: DocumentItem[]
  tasks: ComplianceTask[]
  changes: RegulatoryChange[]
  activity: ActivityItem[]
  inbox: InboxItem[]
  reports: ReportRecord[]
}