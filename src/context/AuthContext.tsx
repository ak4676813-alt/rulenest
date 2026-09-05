import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { StoredAccount, User } from "../types"
import { loadAccounts, loadSession, saveAccounts, saveSession } from "../lib/storage"
import { uid } from "../lib/utils"

interface AuthResult {
  ok: boolean
  error?: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => AuthResult
  signup: (name: string, email: string, password: string) => AuthResult
  logout: () => void
  updateUser: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toUser(account: StoredAccount): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    company: account.company,
    phone: account.phone,
    plan: account.plan,
    avatarColor: account.avatarColor,
    createdAt: account.createdAt,
  }
}

/* Prototype auth: accounts live in localStorage. Replace with your auth API
   (see README → "Replacing mock data with a real API"). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const sessionId = loadSession()
    if (!sessionId) return null
    const account = loadAccounts().find((a) => a.id === sessionId)
    return account ? toUser(account) : null
  })

  const login = useCallback((email: string, password: string): AuthResult => {
    const account = loadAccounts().find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
    )
    if (!account || account.password !== password) {
      return {
        ok: false,
        error: "Invalid email or password.",
      }
    }
    saveSession(account.id)
    setUser(toUser(account))
    return { ok: true }
  }, [])

  const signup = useCallback((name: string, email: string, password: string): AuthResult => {
    const accounts = loadAccounts()
    if (accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "An account with this email already exists. Try logging in." }
    }
    const account: StoredAccount = {
      id: uid("user"),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "Owner",
      plan: "free",
      avatarColor: "bg-primary-600",
      createdAt: new Date().toISOString(),
    }
    saveAccounts([account, ...accounts])
    saveSession(account.id)
    setUser(toUser(account))
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    saveSession(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      const accounts = loadAccounts().map((a) => (a.id === next.id ? { ...a, ...patch } : a))
      saveAccounts(accounts)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ user, login, signup, logout, updateUser }),
    [user, login, signup, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}