import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail, MailCheck } from "lucide-react"
import AuthShell from "../../../components/AuthShell"
import Button from "../../../components/ui/Button"
import { Field, Input } from "../../../components/ui/Input"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Prototype: simulate sending a reset link — no email is actually sent.
    window.setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 700)
  }

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a secure reset link.">
      {sent ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <MailCheck className="mx-auto h-8 w-8 text-emerald-600" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-emerald-900">Check your inbox</p>
          <p className="mt-1 text-sm leading-relaxed text-emerald-700">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is on
            its way. <span className="text-emerald-600/80">(Prototype — no email is actually sent.)</span>
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
            />
          </Field>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!email.includes("@")}
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