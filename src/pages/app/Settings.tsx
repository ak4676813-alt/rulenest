import { useState } from "react"
import {
  Bell,
  Building2,
  Check,
  CreditCard,
  Database,
  Download,
  Lock,
  RefreshCw,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { Field, Input, Select } from "../../components/ui/Input"
import { useAuth } from "../../context/AuthContext"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { supabase } from "../../lib/supabase"
import { loadSettings, saveSettings } from "../../lib/storage"
import { cn } from "../../lib/utils"

type SectionId = "profile" | "notifications" | "security" | "subscription" | "defaults" | "data"

const SECTIONS: Array<{ id: SectionId; label: string; icon: LucideIcon }> = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "defaults", label: "Property defaults", icon: Building2 },
  { id: "data", label: "Data", icon: Database },
]

type SettingsState = {
  notifyChanges: boolean
  notifyDeadlines: boolean
  notifyExpiration: boolean
  notifyTasks: boolean
  weeklySummary: boolean
  emailChannel: boolean
  smsChannel: boolean
  defaultState: string
  defaultRentalType: string
  reminderLead: string
  autoTasks: boolean
}

const DEFAULT_SETTINGS: SettingsState = {
  notifyChanges: true,
  notifyDeadlines: true,
  notifyExpiration: true,
  notifyTasks: true,
  weeklySummary: false,
  emailChannel: true,
  smsChannel: false,
  defaultState: "MA",
  defaultRentalType: "Long-term rental",
  reminderLead: "30",
  autoTasks: true,
}

export default function Settings() {
  const { user, updateUser, configured } = useAuth()
  const data = useData()
  const { toast } = useToast()
  const [section, setSection] = useState<SectionId>("profile")
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings(DEFAULT_SETTINGS))

  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    company: user?.company ?? "",
  })

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })

  function updateSetting<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function saveProfile() {
    if (!profile.name.trim()) {
      toast({ variant: "error", title: "Name is required" })
      return
    }
    updateUser({ name: profile.name.trim(), phone: profile.phone.trim(), company: profile.company.trim() })
    toast({ variant: "success", title: "Profile updated" })
  }

  function savePreferences(sectionName: string) {
    saveSettings(settings)
    toast({ variant: "success", title: `${sectionName} saved` })
  }

  async function changePassword() {
    if (!configured) {
      toast({ variant: "error", title: "Authentication isn't configured" })
      return
    }
    if (passwords.next.length < 8 || !/\d/.test(passwords.next)) {
      toast({ variant: "error", title: "Weak password", description: "At least 8 characters and one number." })
      return
    }
    if (passwords.next !== passwords.confirm) {
      toast({ variant: "error", title: "Passwords don't match" })
      return
    }
    const { error } = await supabase!.auth.updateUser({ password: passwords.next })
    if (error) {
      toast({ variant: "error", title: "Couldn't update password", description: error.message })
      return
    }
    setPasswords({ current: "", next: "", confirm: "" })
    toast({ variant: "success", title: "Password updated" })
  }

  function exportData() {
    const payload = {
      properties: data.properties,
      requirements: data.requirements,
      documents: data.documents,
      tasks: data.tasks,
      changes: data.changes,
      activity: data.activity,
      inbox: data.inbox,
      reports: data.reports,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "rulenest-export.json"
    a.click()
    URL.revokeObjectURL(url)
    toast({ variant: "success", title: "Export started", description: "rulenest-export.json" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Account, notifications, security, and workspace defaults</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Section nav */}
        <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Settings sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              aria-pressed={section === s.id}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors lg:w-full",
                section === s.id
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <s.icon className="h-4 w-4" aria-hidden="true" />
              {s.label}
            </button>
          ))}
        </nav>

        {/* Panels */}
        <div className="space-y-5 lg:col-span-3">
          {section === "profile" && (
            <Card title="Profile" subtitle="How you appear in RuleNest">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="set-name">
                    <Input id="set-name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                  </Field>
                  <Field label="Email" htmlFor="set-email">
                    <Input id="set-email" value={user?.email ?? ""} disabled />
                  </Field>
                  <Field label="Phone" htmlFor="set-phone">
                    <Input id="set-phone" placeholder="(555) 123-4567" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
                  </Field>
                  <Field label="Company" htmlFor="set-company">
                    <Input id="set-company" placeholder="Anderson Properties LLC" value={profile.company} onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))} />
                  </Field>
                </div>
                <div className="flex justify-end">
                  <Button onClick={saveProfile}>Save changes</Button>
                </div>
              </div>
            </Card>
          )}

          {section === "notifications" && (
            <>
              <Card title="Notifications" subtitle="Choose what RuleNest alerts you about">
                <div className="divide-y divide-gray-100">
                  <SettingRow label="Regulatory changes" description="Compliance Radar alerts when rules change." checked={settings.notifyChanges} onChange={(v) => updateSetting("notifyChanges", v)} />
                  <SettingRow label="Deadline reminders" description="Reminders before compliance deadlines." checked={settings.notifyDeadlines} onChange={(v) => updateSetting("notifyDeadlines", v)} />
                  <SettingRow label="Document expiration" description="When certificates or policies are expiring." checked={settings.notifyExpiration} onChange={(v) => updateSetting("notifyExpiration", v)} />
                  <SettingRow label="Task reminders" description="Nudges for open and overdue tasks." checked={settings.notifyTasks} onChange={(v) => updateSetting("notifyTasks", v)} />
                  <SettingRow label="Weekly summary" description="A Monday digest of portfolio health." checked={settings.weeklySummary} onChange={(v) => updateSetting("weeklySummary", v)} />
                </div>
              </Card>
              <Card title="Channels" subtitle="How notifications reach you">
                <div className="divide-y divide-gray-100">
                  <SettingRow label="Email" description={user?.email} checked={settings.emailChannel} onChange={(v) => updateSetting("emailChannel", v)} />
                  <SettingRow label="SMS" description="Text messages for urgent items only." checked={settings.smsChannel} onChange={(v) => updateSetting("smsChannel", v)} />
                </div>
                <div className="mt-5 flex justify-end">
                  <Button onClick={() => savePreferences("Notification preferences")}>Save preferences</Button>
                </div>
              </Card>
            </>
          )}

          {section === "security" && (
            <Card title="Security" subtitle="Password and sign-in">
              <div className="space-y-4">
                  <Field label="Current password" htmlFor="set-current">
                    <Input id="set-current" type="password" autoComplete="current-password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="New password" htmlFor="set-next" hint="8+ characters, one number.">
                      <Input id="set-next" type="password" autoComplete="new-password" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} />
                    </Field>
                    <Field label="Confirm new password" htmlFor="set-confirm">
                      <Input id="set-confirm" type="password" autoComplete="new-password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} />
                    </Field>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={changePassword} disabled={!passwords.current || !passwords.next}>
                      Update password
                    </Button>
                  </div>
                </div>
              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-sm font-medium text-gray-900">Active session</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  This browser · signed in as {user?.email}
                </p>
              </div>
            </Card>
          )}

          {section === "subscription" && (
            <Card title="Subscription" subtitle="Your current plan — prototype billing, no charges">
              <div className="rounded-xl border border-primary-600 bg-primary-50/50 p-5 ring-1 ring-primary-600">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">Early Access — $0</p>
                    <Badge variant="purple">Current plan</Badge>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200">
                    <CreditCard className="h-4 w-4 text-neutral-900" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-gray-700">
                  All features unlocked · No charges during beta
                </p>
                <p className="mt-2 text-xs text-gray-500">Prototype billing — no payment method required.</p>
              </div>
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-400">Paid plans coming after Early Access.</p>
              </div>
            </Card>
          )}

          {section === "defaults" && (
            <Card title="Property defaults" subtitle="Prefilled when you add a property">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Default state" htmlFor="set-state">
                    <Input id="set-state" maxLength={2} value={settings.defaultState} onChange={(e) => updateSetting("defaultState", e.target.value.toUpperCase())} />
                  </Field>
                  <Field label="Default rental type" htmlFor="set-rental">
                    <Select
                      id="set-rental"
                      value={settings.defaultRentalType}
                      onChange={(e) => updateSetting("defaultRentalType", e.target.value)}
                      options={["Long-term rental", "Short-term rental", "Mixed use"].map((t) => ({ value: t, label: t }))}
                    />
                  </Field>
                  <Field label="Reminder lead time" htmlFor="set-lead">
                    <Select
                      id="set-lead"
                      value={settings.reminderLead}
                      onChange={(e) => updateSetting("reminderLead", e.target.value)}
                      options={[
                        { value: "7", label: "7 days before" },
                        { value: "14", label: "14 days before" },
                        { value: "30", label: "30 days before" },
                        { value: "60", label: "60 days before" },
                      ]}
                    />
                  </Field>
                </div>
                <SettingRow
                  label="Auto-create tasks from alerts"
                  description="Radar alerts and city notices become tasks automatically."
                  checked={settings.autoTasks}
                  onChange={(v) => updateSetting("autoTasks", v)}
                />
                <div className="flex justify-end">
                  <Button onClick={() => savePreferences("Property defaults")}>Save defaults</Button>
                </div>
              </div>
            </Card>
          )}

          {section === "data" && (
            <Card title="Data" subtitle="Your local prototype data">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Export data</p>
                    <p className="text-xs text-gray-500">Download all properties, requirements, documents, and tasks as JSON.</p>
                  </div>
                  <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />} onClick={exportData}>
                    Export JSON
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reset example data</p>
                    <p className="text-xs text-gray-500">
                      Restore the two starter example properties. This cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<RefreshCw className="h-4 w-4" />}
                    onClick={() => {
                      data.resetAll()
                      toast({ variant: "info", title: "Example data reset", description: "The two starter example properties are back." })
                    }}
                  >
                    Reset data
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Pieces ----------------------------------- */

function SettingRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="mt-0.5 truncate text-xs text-gray-500">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        checked ? "bg-primary-600" : "bg-gray-200",
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  )
}