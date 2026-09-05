import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, ArrowLeft, Mail, MailCheck } from "lucide-react"
import AuthShell from "../../../components/AuthShell"
import Button from "../../../components/ui/Button"
import { Field, Input } from "../../../components/ui/Input"
import { useAuth } from "../../../context/AuthContext"
import { AuthNotConfigured } from "./GoogleButton"

export default function ForgotPassword() {
  const { configured } = useAuth()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!configured) {
      setError("Authentication isn't configured yet.")
      return
    }
    setLoading(true)
    const { supabase } = await import("../../../lib/supabase")
    if (supabase) {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: window.location.origin + "/login" },
      )
      if (resetError) {
        setError(resetError.message)
        setLoading(false)
        return
      }
    }
    setLoading(false)
    setSent(true)
  }

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a secure reset link.">
      {!configured && <AuthNotConfigured />}
      {sent ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <MailCheck className="mx-auto h-8 w-8 text-emerald-600" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-emerald-900">Check your inbox</p>
          <p className="mt-1 text-sm leading-relaxed text-emerald-700">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is on
            its way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Field label="Email" htmlFor="fp-email" hint="Use the email you signed up with.">
            <Input
              id="fp-email"
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
          {error && (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              role="alert"
            >
              <AlertTriangle className="mr-1 inline h-4 w-4" aria-hidden="true" />
              {error}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!email.includes("@") || !configured}
          >
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to login
        </Link>
      </p>
    </AuthShell>
  )
}