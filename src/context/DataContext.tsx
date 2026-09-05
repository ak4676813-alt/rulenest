import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type {
  ActivityItem,
  AppData,
  ComplianceTask,
  DocumentItem,
  InboxItem,
  Property,
  RegulatoryChange,
  ReportRecord,
  Requirement,
} from "../types"
import { loadData, resetData, saveData } from "../lib/storage"
import { buildExampleSeedData } from "../data/mockData"
import { CITY_BULLETINS } from "../data/cityBulletins"
import { CITIES, citySlug } from "../data/cities"
import { propertyStatusFromScore, uid } from "../lib/utils"
import { useAuth } from "./AuthContext"

export interface NewPropertyInput {
  address: string
  city: string
  state: string
  zip: string
  units: number
  yearBuilt: number
  propertyType: string
  rentalType: string
  ownerOccupied: boolean
}

interface DataContextValue extends AppData {
  unreadInboxCount: number
  getProperty: (id: string) => Property | undefined
  addProperty: (input: NewPropertyInput) => Property
  /** Cascade-deletes the property, its requirements, documents, tasks, activity,
   *  inbox references, report references, and radar alert links. */
  deleteProperty: (id: string) => void
  addTask: (input: {
    title: string
    propertyId: string
    dueDate: string
    priority?: "high" | "medium" | "low"
    requirement?: string
  }) => void
  completeTask: (id: string) => void
  snoozeTask: (id: string, days: number) => void
  reopenTask: (id: string) => void
  addDocument: (doc: Omit<DocumentItem, "id" | "uploadedAt">) => DocumentItem
  updateDocument: (id: string, patch: Partial<DocumentItem>) => void
  deleteDocument: (id: string) => void
  markInboxRead: (id: string) => void
  markAllInboxRead: () => void
  archiveInboxItem: (id: string) => void
  createTaskFromInbox: (item: InboxItem) => void
  markChangeRead: (id: string) => void
  addReport: (report: Omit<ReportRecord, "id" | "createdAt">) => void
  resetAll: () => void
  /** True while the first-run example data still exists. */
  hasExamples: boolean
  /** Deletes every example-flagged property, document, task, and requirement. */
  removeExamples: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

const GRADIENTS = [
  "from-indigo-500 via-blue-500 to-sky-400",
  "from-violet-500 via-purple-500 to-fuchsia-400",
  "from-sky-500 via-cyan-500 to-teal-400",
  "from-blue-600 via-indigo-500 to-violet-500",
  "from-slate-600 via-slate-500 to-gray-400",
]

function pushActivity(
  data: AppData,
  text: string,
  type: ActivityItem["type"],
  propertyId?: string,
): AppData {
  const item: ActivityItem = {
    id: uid("act"),
    type,
    text,
    propertyId,
    at: new Date().toISOString(),
  }
  return { ...data, activity: [item, ...data.activity].slice(0, 50) }
}

/* ------------------- Compliance Radar derivation ------------------------- *
   Alerts are generated from the static CITY_BULLETINS dataset, matched to the
   user's property jurisdictions by canonical city slug. Read state lives in its
   own localStorage key so "mark read" survives reloads. */

const RADAR_READ_KEY = "rulenest.radarRead.v1"

function loadRadarRead(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(RADAR_READ_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function saveRadarRead(record: Record<string, boolean>): void {
  localStorage.setItem(RADAR_READ_KEY, JSON.stringify(record))
}

/** Map a property to the canonical citySlug used by CITIES / cityBulletins. */
function propertyCitySlug(p: Property): string {
  const name = p.city.trim().toLowerCase()
  const hit = CITIES.find((c) => c.name.toLowerCase() === name)
  return hit?.slug ?? citySlug(p.city)
}

const CITY_NAME_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c.name]))

function buildRadarChanges(
  properties: Property[],
  read: Record<string, boolean>,
): RegulatoryChange[] {
  const matchedSlugs = new Set(properties.map(propertyCitySlug))
  return CITY_BULLETINS.filter((b) => matchedSlugs.has(b.citySlug))
    .map<RegulatoryChange>((b) => {
      const affected = properties
        .filter((p) => propertyCitySlug(p) === b.citySlug)
        .map((p) => p.id)
      return {
        id: b.id,
        jurisdiction: CITY_NAME_BY_SLUG.get(b.citySlug) ?? b.citySlug,
        title: b.title,
        summary: b.summary,
        severity: b.severity,
        detectedAt: b.detectedDate,
        effectiveDate: b.effectiveDate,
        source: b.sourceName,
        affectedPropertyIds: affected,
        requiredAction: b.afterText,
        before: { label: "Before", text: b.beforeText },
        after: { label: "After", text: b.afterText },
        read: read[b.id] ?? false,
      }
    })
    .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt))
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<AppData>(loadData)
  const [radarRead, setRadarRead] = useState<Record<string, boolean>>(() => loadRadarRead())

  // Seed a fresh workspace for a NEW user exactly once (first sign-in). Existing
  // sessions keep the old data untouched. If data already exists in storage we
  // don't touch it — so new signups get the 2-example seed, returning users keep
  // their own data, and the demo is fully gone.
  const seededUserIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (!user) return
    if (seededUserIdRef.current === user.id) return
    seededUserIdRef.current = user.id

    // Only seed when there are no persisted properties yet — i.e. a new account.
    const existing = loadData()
    if (existing.properties.length === 0) {
      const seed = buildExampleSeedData()
      saveData(seed)
      setData(seed)
    }
  }, [user])

  const update = useCallback((fn: (current: AppData) => AppData) => {
    setData((current) => {
      const next = fn(current)
      saveData(next)
      return next
    })
  }, [])

  const getProperty = useCallback(
    (id: string) => data.properties.find((p) => p.id === id),
    [data.properties],
  )

  // Derived Compliance Radar alerts: bulletins for the user's property cities.
  const changes = useMemo(
    () => buildRadarChanges(data.properties, radarRead),
    [data.properties, radarRead],
  )

  const addProperty = useCallback(
    (input: NewPropertyInput): Property => {
      // New properties start with a provisional score until evidence is added.
      const score = 62 + Math.floor(Math.random() * 21)
      const property: Property = {
        id: uid("prop"),
        address: input.address.trim(),
        city: input.city.trim(),
        state: input.state.trim().toUpperCase(),
        zip: input.zip.trim(),
        units: input.units,
        healthScore: score,
        status: propertyStatusFromScore(score),
        imageGradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
        createdAt: new Date().toISOString(),
        dna: {
          propertyType: input.propertyType,
          units: input.units,
          yearBuilt: input.yearBuilt,
          rentalType: input.rentalType,
          occupancy: input.ownerOccupied ? "Owner-occupied" : "Tenant-occupied",
          ownerOccupied: input.ownerOccupied,
          floors: input.propertyType === "Single-family" ? 1 : 2,
          sqft: 1500 + input.units * 600,
          parking: "Street",
          amenities: [],
        },
      }

      const starterRequirements: Requirement[] = [
        {
          id: uid("req"),
          propertyId: property.id,
          name: "Rental Registration",
          category: "Registration",
          status: "missing-evidence",
          whyItApplies: `${property.city}, ${property.state} may require registration or licensing for rental properties. Verify the exact requirement with the local authority.`,
          requiredEvidence: ["Registration or license certificate"],
          officialSource: `${property.city} — official municipal website`,
          action: "Check requirement",
        },
        {
          id: uid("req"),
          propertyId: property.id,
          name: "Smoke/CO Certification",
          category: "Safety",
          status: "missing-evidence",
          whyItApplies:
            "Most states require certified smoke and carbon monoxide alarms in residential rentals.",
          requiredEvidence: ["Smoke/CO certificate"],
          officialSource: "State fire authority",
          action: "Upload certificate",
        },
        {
          id: uid("req"),
          propertyId: property.id,
          name: "Landlord Insurance",
          category: "Insurance",
          status: "missing-evidence",
          whyItApplies:
            "Proof of liability insurance is commonly required for registered rental properties.",
          requiredEvidence: ["Insurance declarations page"],
          officialSource: "Municipal housing authority",
          action: "Upload policy",
        },
        {
          id: uid("req"),
          propertyId: property.id,
          name: "Lead Paint Disclosure",
          category: "Disclosure",
          status: property.dna.yearBuilt < 1978 ? "missing-evidence" : "current",
          whyItApplies:
            property.dna.yearBuilt < 1978
              ? `Built in ${property.dna.yearBuilt} — before 1978 — so federal law requires a lead-based paint disclosure to tenants.`
              : `Built in ${property.dna.yearBuilt} — after 1978 — so the federal lead-based paint disclosure generally does not apply. Keep build-year documentation on file.`,
          requiredEvidence: ["Signed tenant disclosure"],
          officialSource: "EPA / HUD",
          action: "View disclosure",
        },
      ]

      const starterTask: ComplianceTask = {
        id: uid("task"),
        title: `Complete Property DNA for ${property.address}`,
        propertyId: property.id,
        dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
        status: "open",
        priority: "medium",
        requirement: "Property DNA",
        createdAt: new Date().toISOString(),
      }

      update((current) =>
        pushActivity(
          {
            ...current,
            properties: [property, ...current.properties],
            requirements: [...starterRequirements, ...current.requirements],
            tasks: [starterTask, ...current.tasks],
          },
          `New property added: ${property.address}`,
          "property",
          property.id,
        ),
      )
      return property
    },
    [update],
  )

  const addTask = useCallback(
    (input: {
      title: string
      propertyId: string
      dueDate: string
      priority?: "high" | "medium" | "low"
      requirement?: string
    }) => {
      const task: ComplianceTask = {
        id: uid("task"),
        status: "open",
        createdAt: new Date().toISOString(),
        title: input.title,
        propertyId: input.propertyId,
        dueDate: input.dueDate,
        priority: input.priority ?? "medium",
        requirement: input.requirement,
      }
      update((current) => ({ ...current, tasks: [task, ...current.tasks] }))
    },
    [update],
  )

  const completeTask = useCallback(
    (id: string) => {
      update((current) => {
        const task = current.tasks.find((t) => t.id === id)
        const tasks = current.tasks.map((t) =>
          t.id === id
            ? { ...t, status: "completed" as const, completedAt: new Date().toISOString() }
            : t,
        )
        return pushActivity(
          { ...current, tasks },
          `Task completed: ${task?.title ?? "task"}`,
          "task",
          task?.propertyId,
        )
      })
    },
    [update],
  )

  const snoozeTask = useCallback(
    (id: string, days: number) => {
      const snoozedUntil = new Date(Date.now() + days * 86_400_000).toISOString()
      update((current) => ({
        ...current,
        tasks: current.tasks.map((t) =>
          t.id === id
            ? { ...t, status: "snoozed" as const, dueDate: snoozedUntil, snoozedUntil }
            : t,
        ),
      }))
    },
    [update],
  )

  const reopenTask = useCallback(
    (id: string) => {
      update((current) => ({
        ...current,
        tasks: current.tasks.map((t) =>
          t.id === id
            ? { ...t, status: "open" as const, completedAt: undefined, snoozedUntil: undefined }
            : t,
        ),
      }))
    },
    [update],
  )

  const addDocument = useCallback(
    (doc: Omit<DocumentItem, "id" | "uploadedAt">): DocumentItem => {
      const item: DocumentItem = { ...doc, id: uid("doc"), uploadedAt: new Date().toISOString() }
      update((current) =>
        pushActivity(
          { ...current, documents: [item, ...current.documents] },
          `Document uploaded: ${item.name}`,
          "document",
          item.propertyId,
        ),
      )
      return item
    },
    [update],
  )

  const updateDocument = useCallback(
    (id: string, patch: Partial<DocumentItem>) => {
      update((current) => ({
        ...current,
        documents: current.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      }))
    },
    [update],
  )

  const deleteDocument = useCallback(
    (id: string) => {
      update((current) => ({
        ...current,
        documents: current.documents.filter((d) => d.id !== id),
      }))
    },
    [update],
  )

  const markInboxRead = useCallback(
    (id: string) => {
      update((current) => ({
        ...current,
        inbox: current.inbox.map((i) => (i.id === id ? { ...i, read: true } : i)),
      }))
    },
    [update],
  )

  const markAllInboxRead = useCallback(() => {
    update((current) => ({
      ...current,
      inbox: current.inbox.map((i) => ({ ...i, read: true })),
    }))
  }, [update])

  const archiveInboxItem = useCallback(
    (id: string) => {
      update((current) => ({
        ...current,
        inbox: current.inbox.map((i) => (i.id === id ? { ...i, archived: true } : i)),
      }))
    },
    [update],
  )

  const createTaskFromInbox = useCallback(
    (item: InboxItem) => {
      const task: ComplianceTask = {
        id: uid("task"),
        title: item.detectedRequirement
          ? `${item.detectedRequirement} — follow up`
          : item.title,
        propertyId: item.detectedPropertyId ?? "",
        dueDate: item.detectedDeadline ?? new Date(Date.now() + 14 * 86_400_000).toISOString(),
        status: "open",
        priority: "high",
        requirement: item.detectedRequirement,
        createdAt: new Date().toISOString(),
      }
      update((current) => ({
        ...current,
        tasks: [task, ...current.tasks],
        inbox: current.inbox.map((i) => (i.id === item.id ? { ...i, read: true } : i)),
      }))
    },
    [update],
  )

  const markChangeRead = useCallback((id: string) => {
    setRadarRead((prev) => {
      if (prev[id]) return prev
      const next = { ...prev, [id]: true }
      saveRadarRead(next)
      return next
    })
  }, [])

  const deleteProperty = useCallback(
    (id: string) => {
      update((current) => {
        const property = current.properties.find((p) => p.id === id)
        const next: AppData = {
          ...current,
          properties: current.properties.filter((p) => p.id !== id),
          requirements: current.requirements.filter((r) => r.propertyId !== id),
          documents: current.documents.filter((d) => d.propertyId !== id),
          tasks: current.tasks.filter((t) => t.propertyId !== id),
          activity: current.activity.filter((a) => a.propertyId !== id),
          inbox: current.inbox.filter((i) => i.detectedPropertyId !== id),
          reports: current.reports.filter((r) => r.propertyId !== id),
          changes: current.changes
            .map((c) => ({
              ...c,
              affectedPropertyIds: c.affectedPropertyIds.filter((pid) => pid !== id),
            }))
            .filter((c) => c.affectedPropertyIds.length > 0),
        }
        return pushActivity(
          next,
          `Property deleted: ${property?.address ?? id}`,
          "property",
        )
      })
    },
    [update],
  )

  const addReport = useCallback(
    (report: Omit<ReportRecord, "id" | "createdAt">) => {
      update((current) =>
        pushActivity(
          {
            ...current,
            reports: [
              { ...report, id: uid("rep"), createdAt: new Date().toISOString() },
              ...current.reports,
            ],
          },
          `${report.type} generated`,
          "report",
          report.propertyId,
        ),
      )
    },
    [update],
  )

  const resetAll = useCallback(() => {
    setData(resetData())
  }, [])

  // Deletes every example-flagged property, document, task, requirement, and
  // activity item — nothing else is touched.
  const removeExamples = useCallback(() => {
    setData((current) => {
      const exampleIds = current.properties.filter((p) => p.example).map((p) => p.id)
      const exampleSet = new Set(exampleIds)
      const next: AppData = {
        ...current,
        properties: current.properties.filter((p) => !p.example),
        requirements: current.requirements.filter(
          (r) => !r.example && !exampleSet.has(r.propertyId),
        ),
        documents: current.documents.filter(
          (d) => !d.example && !exampleSet.has(d.propertyId),
        ),
        tasks: current.tasks.filter(
          (t) => !t.example && !exampleSet.has(t.propertyId),
        ),
        activity: current.activity.filter(
          (a) => !a.example && (!a.propertyId || !exampleSet.has(a.propertyId)),
        ),
        inbox: current.inbox.filter(
          (i) => !i.detectedPropertyId || !exampleSet.has(i.detectedPropertyId),
        ),
        changes: current.changes
          .filter((c) => !c.example)
          .map((c) => ({
            ...c,
            affectedPropertyIds: c.affectedPropertyIds.filter((id) => !exampleSet.has(id)),
          })),
        reports: current.reports.filter(
          (r) => !r.example && (!r.propertyId || !exampleSet.has(r.propertyId)),
        ),
      }
      saveData(next)
      return next
    })
  }, [])

  const hasExamples =
    data.properties.some((p) => p.example) ||
    data.documents.some((d) => d.example) ||
    data.tasks.some((t) => t.example) ||
    data.requirements.some((r) => r.example)

  const unreadInboxCount = data.inbox.filter((i) => !i.read && !i.archived).length

  const value = useMemo<DataContextValue>(
    () => ({
      ...data,
      // Override the (empty/mock) persisted changes with city-derived alerts.
      changes,
      unreadInboxCount,
      getProperty,
      addProperty,
      deleteProperty,
      addTask,
      completeTask,
      snoozeTask,
      reopenTask,
      addDocument,
      updateDocument,
      deleteDocument,
      markInboxRead,
      markAllInboxRead,
      archiveInboxItem,
      createTaskFromInbox,
      markChangeRead,
      addReport,
      resetAll,
      hasExamples,
      removeExamples,
    }),
    [
      data,
      changes,
      unreadInboxCount,
      getProperty,
      addProperty,
      deleteProperty,
      addTask,
      completeTask,
      snoozeTask,
      reopenTask,
      addDocument,
      updateDocument,
      deleteDocument,
      markInboxRead,
      markAllInboxRead,
      archiveInboxItem,
      createTaskFromInbox,
      markChangeRead,
      addReport,
      resetAll,
      hasExamples,
      removeExamples,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}