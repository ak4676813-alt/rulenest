import type { AppData } from "../types"
import { buildEmptyData, buildExampleSeedData } from "../data/mockData"

/* ------------------------------------------------------------------------ */
/*  Persistence layer. Auth now lives in Supabase; app data (properties,     */
/*  documents, tasks, radar-read state) persists in localStorage.            */
/* ------------------------------------------------------------------------ */

const DATA_KEY = "rulenest.data.v1"
const SETTINGS_KEY = "rulenest.settings.v1"

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/* ------------------------------ App data -------------------------------- */

export function loadData(): AppData {
  const existing = safeParse<AppData | null>(localStorage.getItem(DATA_KEY), null)
  if (existing && Array.isArray(existing.properties)) return existing
  // No stored data yet — the first signed-in user gets the example seed from
  // DataProvider. Nothing is written here so logged-out visitors stay empty.
  return buildEmptyData()
}

export function saveData(data: AppData): void {
  localStorage.setItem(DATA_KEY, JSON.stringify(data))
}

export function resetData(): AppData {
  const seed = buildExampleSeedData()
  saveData(seed)
  return seed
}

/* ------------------------------ Settings -------------------------------- */

export function loadSettings<T extends Record<string, unknown>>(defaults: T): T {
  return { ...defaults, ...safeParse<Partial<T>>(localStorage.getItem(SETTINGS_KEY), {}) }
}

export function saveSettings<T>(settings: T): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}