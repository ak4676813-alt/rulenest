import { useEffect, useRef, useState, type FormEvent } from "react"
import { RefreshCw, Sparkles } from "lucide-react"
import Badge from "./ui/Badge"
import Button from "./ui/Button"
import Card from "./ui/Card"
import { useData } from "../context/DataContext"
import { cn, formatDate, relativeDeadline } from "../lib/utils"

interface ChatMessage {
  id: number
  role: "user" | "assistant"
  text: string
}

const SUGGESTIONS = [
  "Can I rent this property next month?",
  "What documents do I need?",
  "What are my upcoming deadlines?",
]

const GREETING =
  "Hi! I answer questions using your portfolio's structured compliance data — requirements, deadlines, documents, and regulatory changes. What would you like to know?"

let messageId = 0
function nextId(): number {
  messageId += 1
  return messageId
}

interface AIAssistantProps {
  /** Scope answers to one property (used on the property detail page). */
  propertyId?: string
  className?: string
}

/* Prototype assistant: responses are simulated in the browser from the
   structured RuleNest data store — no real AI calls are made. */
export default function AIAssistant({ propertyId, className }: AIAssistantProps) {
  const data = useData()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextId(), role: "assistant", text: GREETING },
  ])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, thinking])

  function propertyName(id: string): string {
    return data.getProperty(id)?.address ?? "General"
  }

  function buildAnswer(question: string): string {
    const q = question.toLowerCase()
    const scope = propertyId ? data.properties.filter((p) => p.id === propertyId) : data.properties
    if (scope.length === 0) return "Add a property first, and I'll analyze its compliance profile."

    const propIds = new Set(scope.map((p) => p.id))
    const reqs = data.requirements.filter((r) => propIds.has(r.propertyId))
    const docs = data.documents.filter((d) => propIds.has(d.propertyId))
    const openTasks = data.tasks.filter((t) => t.status !== "completed" && propIds.has(t.propertyId))
    const main = propertyId ? scope[0] : data.getProperty("prop_main") ?? scope[0]
    const bullets = (items: string[]) => items.map((i) => `• ${i}`).join("\n")

    if (/(rent|lease|ready)/.test(q)) {
      const gaps = reqs.filter((r) =>
        ["missing-evidence", "overdue", "due-soon"].includes(r.status),
      )
      if (gaps.length === 0) {
        return `Based on the current profile for ${main.address}, all tracked requirements are in good standing. Keep evidence current and you're ready to rent.\n\nI'm reading RuleNest's structured compliance data — this is informational, not legal advice.`
      }
      return `Based on the current profile for ${main.address}, there are ${gaps.length} item${
        gaps.length === 1 ? "" : "s"
      } you should address before renting:\n${bullets(
        gaps.slice(0, 3).map((g) => `${g.name} — ${g.action.toLowerCase()}`),
      )}\n\nThis summarizes your structured compliance data — it isn't legal advice.`
    }

    if (/(document|missing|evidence|upload|vault)/.test(q)) {
      const missing = reqs.filter((r) => r.status === "missing-evidence")
      const expiring = docs.filter((d) => d.status === "expiring-soon")
      if (missing.length === 0 && expiring.length === 0) {
        return "No missing evidence right now — your Evidence Vault covers all tracked requirements."
      }
      const parts: string[] = []
      if (missing.length > 0) {
        parts.push(`Missing evidence for:\n${bullets(missing.slice(0, 4).map((r) => r.name))}`)
      }
      if (expiring.length > 0) {
        parts.push(
          `Expiring soon:\n${bullets(
            expiring.slice(0, 3).map((d) => `${d.name} (expires ${formatDate(d.expiresAt)})`),
          )}`,
        )
      }
      return parts.join("\n\n")
    }

    if (/(deadline|due|upcoming|when|calendar)/.test(q)) {
      const sorted = [...openTasks]
        .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
        .slice(0, 4)
      if (sorted.length === 0) return "No open deadlines — everything is on track."
      return `Your next deadlines:\n${bullets(
        sorted.map((t) => `${t.title} — ${relativeDeadline(t.dueDate)} (${propertyName(t.propertyId)})`),
      )}`
    }

    if (/(radar|change|regulat|law|update|rule)/.test(q)) {
      const unread = data.changes.filter((c) => !c.read)
      const list = (unread.length > 0 ? unread : data.changes).slice(0, 3)
      return `Compliance Radar has detected ${unread.length || list.length} relevant change${
        (unread.length || list.length) === 1 ? "" : "s"
      }:\n${bullets(
        list.map((c) => `${c.jurisdiction}: ${c.title} — effective ${formatDate(c.effectiveDate)}`),
      )}\n\nOpen Compliance Radar for the full before/after comparison.`
    }

    if (/(score|health|risk)/.test(q)) {
      const avg = Math.round(scope.reduce((s, p) => s + p.healthScore, 0) / scope.length)
      const worst = [...scope].sort((a, b) => a.healthScore - b.healthScore)[0]
      return `Portfolio compliance health is ${avg}/100. ${worst.address} needs the most attention (${worst.healthScore}/100). Health improves as you close gaps and upload evidence.`
    }

    return "I answer from your RuleNest compliance data. Try asking about:\n• Missing documents or evidence\n• Upcoming deadlines\n• Regulatory changes from Compliance Radar\n• Whether a property is ready to rent"
  }

  function handleAsk(question: string) {
    const trimmed = question.trim()
    if (!trimmed || thinking) return
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }])
    setInput("")
    setThinking(true)
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: buildAnswer(trimmed) }])
      setThinking(false)
    }, 750)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    handleAsk(input)
  }

  return (
    <Card className={className} noPadding>
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
            <Sparkles className="h-4 w-4 text-primary-600" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Ask My Property</h3>
          <Badge variant="purple">AI</Badge>
        </div>
        <button
          onClick={() => setMessages([{ id: nextId(), role: "assistant", text: GREETING }])}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Reset conversation"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="max-h-72 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                m.role === "user" ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-800",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-4 py-3"
              aria-label="Assistant is thinking"
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleAsk(s)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-gray-100 px-4 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your property compliance..."
          className="h-10 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
          aria-label="Ask the assistant"
        />
        <Button type="submit" size="sm" className="h-10 px-4" disabled={!input.trim() || thinking}>
          Ask
        </Button>
      </form>
      <p className="px-5 pb-4 text-[11px] leading-relaxed text-gray-400">
        Answers come from RuleNest's structured compliance data for your properties — not legal
        advice.
      </p>
    </Card>
  )
}