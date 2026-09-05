import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Check, KeyRound, Mail, User as UserIcon } from "lucide-react"
import AuthShell from "../../../components/AuthShell"
import Button from "../../../components/ui/Button"
import { Field, Input } from "../../../components/ui/Input"
import { useAuth } from "../../../context/AuthContext"
import { AuthNotConfigured, GoogleButton } from "./GoogleButton"

export default function Signup() {
  const { signUp, configured, loading, user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
  ]

  // Once auth resolves with an active session (e.g. OAuth return), go to the
  // dashboard instead of staying stuck on the signup page.
  useEffect(() => {
    if (!loading && user) navigate("/app/dashboard", { replace: true })
  }, [loading, user, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }
    if (password.length < 8 || !/\d/.test(password)) {
      setError("Password must be at least 8 characters and contain a number.")
      return
    }
    setSubmitting(true)
    const result = await signUp(email, password, name)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error ?? "Signup failed.")
      return
    }
    if (result.error) {
      // Email confirmation pending.
      setNotice(result.error)
      return
    }
    navigate("/app/dashboard")
  }

  return (
    <AuthShell title="Create your account" subtitle="Free plan — no credit card required.">
      {!configured && <AuthNotConfigured />}

      {configured && (
        <>
          <GoogleButton label="Continue with Google" />
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">or</span>
            <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field label="Full name" htmlFor="signup-name">
          <Input
            id="signup-name"
            autoComplete="name"
            placeholder="John Anderson"
            icon={<UserIcon className="h-4 w-4" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={!configured}
          />
        </Field>
        <Field label="Work email" htmlFor="signup-email">
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!configured}
          />
        </Field>
        <Field label="Password" htmlFor="signup-password">
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            icon={<KeyRound className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!configured}
          />
        </Field>

        {password.length > 0 && (
          <ul className="space-y-1.5">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-xs">
                <span
                  className={
                    c.ok
                      ? "flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500"
                      : "flex h-4 w-4 items-center justify-center rounded-full bg-gray-200"
                  }
                >
                  {c.ok && <Check className="h-2.5 w-2.5 text-white" aria-hidden="true" />}
                </span>
                <span className={c.ok ? "text-emerald-700" : "text-gray-500"}>{c.label}</span>
              </li>
            ))}
          </ul>
        )}

        {notice && !error && (
          <p
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800"
            role="status"
          >
            {notice}
          </p>
        )}

        {error && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={!configured}>
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
        By creating an account you agree that RuleNest provides compliance information and workflow
        assistance — not legal advice.
      </p>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}