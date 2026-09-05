import { useState, type SVGProps } from "react"
import { AlertTriangle } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { cn } from "../../../lib/utils"

/** Official multicolor Google "G". */
export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.18 7.18 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}

/** Prominent 3D-styled "Continue with Google" button. */
export function GoogleButton({ label }: { label: string }) {
  const { signInWithGoogle } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle()
      // OAuth redirects the browser; no navigation needed here.
    } catch {
      setError("Google sign-in failed. Please try again.")
      setBusy(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={cn(
          "relative flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-800",
          "border border-gray-200 shadow-[0_10px_25px_-8px_rgba(16,24,40,0.25)] transition-all duration-300",
          "hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_14px_32px_-10px_rgba(16,24,40,0.3)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60",
        )}
      >
        <GoogleIcon className="h-5 w-5" />
        {busy ? "Redirecting…" : label}
      </button>
      {error && (
        <p
          className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/** Friendly "auth is not configured" state shown when env vars are missing. */
export function AuthNotConfigured() {
  return (
    <div className="card-3d mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-amber-900">Authentication isn't set up yet</p>
        <p className="mt-1 text-xs leading-relaxed text-amber-800">
          The owner needs to add their Supabase credentials (
          <code className="rounded bg-amber-100/60 px-1">VITE_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-amber-100/60 px-1">VITE_SUPABASE_ANON_KEY</code>) to enable
          sign-in. Please check back soon.
        </p>
      </div>
    </div>
  )
}