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
import type { User } from "../types"
import { supabase, isAuthConfigured } from "../lib/supabase"
import { buildExampleSeedData } from "../data/mockData"
import { loadData, saveData } from "../lib/storage"

interface AuthResult {
  ok: boolean
  error?: string
}

interface AuthContextValue {
  user: User | null
  /** True when SUPABASE_URL + ANON_KEY are configured (real auth live). */
  configured: boolean
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  updateUser: (patch: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Convert a Supabase session/identity into the app's User shape. */
function toUser(
  sessionUser: {
    id: string
    email?: string | null
    user_metadata?: Record<string, unknown>
    created_at?: string
  },
): User {
  const meta = sessionUser.user_metadata ?? {}
  const name =
    (meta.name as string) || (meta.full_name as string) || (meta.email as string) || "Owner"
  const avatarUrl = meta.avatar_url as string | undefined
  const providers = (meta.providers as string[] | undefined) ?? []
  const provider = (meta.provider as string | undefined) ?? providers[0] ?? "email"
  return {
    id: sessionUser.id,
    name,
    email: sessionUser.email ?? "",
    role: "Owner",
    plan: "free",
    avatarColor: "bg-primary-600",
    avatarUrl,
    provider: provider === "google" ? "google" : "email",
    createdAt: sessionUser.created_at ?? new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Seed the 2 example properties exactly once for a brand-new user.
  const seededUserIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (!user) return
    if (seededUserIdRef.current === user.id) return
    seededUserIdRef.current = user.id
    const existing = loadData()
    if (existing.properties.length === 0) {
      saveData(buildExampleSeedData())
    }
  }, [user])

  // Restore the session + subscribe to auth changes.
  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      const sessionUser = data.session?.user
      setUser(sessionUser ? toUser(sessionUser) : null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      const sessionUser = session?.user
      setUser(sessionUser ? toUser(sessionUser) : null)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // Fire a GA sign_up event on first-ever signup (Google or email).
  const fireSignUp = useCallback((method: string) => {
    window.gtag?.("event", "sign_up", { method })
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/app/dashboard" },
    })
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, name?: string): Promise<AuthResult> => {
      if (!supabase) return { ok: false, error: "Auth is not configured." }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name: name?.trim() || email.split("@")[0] } },
      })
      if (error) return { ok: false, error: error.message }
      if (!data.session && data.user) {
        // Email confirmation required — tell the user to check their inbox.
        return {
          ok: true,
          error:
            "We sent you a confirmation email. Please click the link, then sign in.",
        }
      }
      fireSignUp("email")
      return { ok: true }
    },
    [fireSignUp],
  )

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return { ok: false, error: "Auth is not configured." }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) return { ok: false, error: error.message }
      return { ok: true }
    },
    [],
  )

  const signOut = useCallback(async () => {
    setUser(null)
    if (supabase) await supabase.auth.signOut()
  }, [])

  const updateUser = useCallback(async (patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      if (supabase) {
        void supabase.auth.updateUser({
          data: { name: next.name, company: next.company, phone: next.phone },
        })
      }
      return next
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      configured: isAuthConfigured,
      signInWithGoogle,
      signUp,
      signIn,
      signOut,
      updateUser,
    }),
    [user, signInWithGoogle, signUp, signIn, signOut, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}