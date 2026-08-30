import type { AppData, StoredAccount } from "../types"
import { buildSeedData, demoAccount } from "../data/mockData"

/* ------------------------------------------------------------------------ */
/*  Persistence layer. In the prototype everything lives in localStorage;    */
/*  to connect a real backend, replace each function body with an API call   */
/*  and keep the signatures (see README → "Replacing mock data").           */
/* ------------------------------------------------------------------------ */

const DATA_KEY = "rulenest.data.v1"
const ACCOUNTS_KEY = "rulenest.accounts.v1"
const SESSION_KEY = "rulenest.session.v1"
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
  const seed = buildSeedData()
  saveData(seed)
  return seed
}

export function saveData(data: AppData): void {
  localStorage.setItem(DATA_KEY, JSON.stringify(data))
}

export function resetData(): AppData {
  const seed = buildSeedData()
  saveData(seed)
  return seed
}

/* ------------------------------ Accounts -------------------------------- */

export function loadAccounts(): StoredAccount[] {
  const accounts = safeParse<StoredAccount[]>(localStorage.getItem(ACCOUNTS_KEY), [])
  if (!accounts.some((a) => a.email === demoAccount.email)) {
    const next = [demoAccount, ...accounts]
    saveAccounts(next)
    return next
  }
  return accounts
}

export function saveAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function loadSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function saveSession(userId: string | null): void {
  if (userId) localStorage.setItem(SESSION_KEY, userId)
  else localStorage.removeItem(SESSION_KEY)
}

/* ------------------------------ Settings -------------------------------- */

export function loadSettings<T extends Record<string, unknown>>(defaults: T): T {
  return { ...defaults, ...safeParse<Partial<T>>(localStorage.getItem(SETTINGS_KEY), {}) }
}

export function saveSettings<T>(settings: T): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}