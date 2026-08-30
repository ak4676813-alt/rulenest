import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react"
import AuthShell from "../../../components/AuthShell"
import Button from "../../../components/ui/Button"
import { Field, Input } from "../../../components/ui/Input"
import { useAuth } from "../../../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function fillDemo() {
    setEmail("demo@rulenest.com")
    setPassword("demo123")
    setError(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    // Simulate a network round-trip for realism.
    window.setTimeout(() => {
      const result = login(email, password)
      setLoading(false)
      if (!result.ok) {
        setError(result.error ?? "Login failed.")
        return
      }
      navigate("/app/dashboard")
    }, 500)
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your RuleNest workspace.">
      {/* Demo account — clearly labeled prototype content */}
      <div className="mb-6 rounded-xl border border-primary-100 bg-primary-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary-900">Demo account</p>
            <p className="mt-0.5 text-xs text-primary-700">demo@rulenest.com · demo123</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fillDemo}
            className="border-primary-200 bg-white text-primary-700 hover:border-primary-300"
          >
            Use demo
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field label="Email" htmlFor="login-email">
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field label="Password" htmlFor="login-password">
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              icon={<KeyRound className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {error && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        New to RuleNest?{" "}
        <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}