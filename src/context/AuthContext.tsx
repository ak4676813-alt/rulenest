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
import type { Session } from "@supabase/supabase-js"

interface AuthResult {
  ok: boolean
  error?: string
}

interface AuthContextValue {
  user: User | null
  /** Live Supabase session (null when signed out). */
  session: Session | null
  /** True while auth is still being resolved (e.g. OAuth hash → session). */
  loading: boolean
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
  const [session, setSession] = useState<Session | null>(null)
  // Start resolving immediately when configured; if not configured there is
  // nothing to resolve, so auth is "ready" right away.
  const [loading, setLoading] = useState<boolean>(() => isAuthConfigured)

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

  // Restore the session on mount (this also consumes the OAuth #access_token
  // hash on the way back from Google) AND subscribe to live auth changes.
  useEffect(() => {
    if (!supabase) {
      setSession(null)
      setUser(null)
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        setSession(data.session)
        setUser(data.session?.user ? toUser(data.session.user) : null)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setLoading(false)
      })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!active) return
      setSession(currentSession)
      setUser(currentSession?.user ? toUser(currentSession.user) : null)
      setLoading(false)
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
      session,
      loading,
      configured: isAuthConfigured,
      signInWithGoogle,
      signUp,
      signIn,
      signOut,
      updateUser,
    }),
    [user, session, loading, signInWithGoogle, signUp, signIn, signOut, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}