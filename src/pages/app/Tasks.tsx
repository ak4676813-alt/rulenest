import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Check,
  CheckCircle2,
  ListChecks,
  MoreHorizontal,
  Plus,
  RotateCcw,
} from "lucide-react"
import StatusBadge from "../../components/StatusBadge"
import Button from "../../components/ui/Button"
import Dropdown, { DropdownItem } from "../../components/ui/Dropdown"
import EmptyState from "../../components/ui/EmptyState"
import Modal from "../../components/ui/Modal"
import { Field, Input, Select } from "../../components/ui/Input"
import { useData } from "../../context/DataContext"
import { useToast } from "../../context/ToastContext"
import { cn, daysUntil, formatDate, relativeDeadline } from "../../lib/utils"
import type { ComplianceTask } from "../../types"

const byDate = (a: ComplianceTask, b: ComplianceTask) =>
  +new Date(a.dueDate) - +new Date(b.dueDate)

export default function Tasks() {
  const { tasks, properties, addTask } = useData()
  const { toast } = useToast()
  const [newOpen, setNewOpen] = useState(false)
  const [form, setForm] = useState({ title: "", propertyId: "", due: "", priority: "medium" })

  const buckets = useMemo(() => {
    const open = tasks.filter((t) => t.status !== "completed")
    return {
      overdue: open.filter((t) => (daysUntil(t.dueDate) ?? 0) < 0).sort(byDate),
      dueSoon: open
        .filter((t) => {
          const d = daysUntil(t.dueDate) ?? 0
          return d >= 0 && d <= 14
        })
        .sort(byDate),
      upcoming: open.filter((t) => (daysUntil(t.dueDate) ?? 0) > 14).sort(byDate),
      completed: tasks
        .filter((t) => t.status === "completed")
        .sort((a, b) => +new Date(b.completedAt ?? 0) - +new Date(a.completedAt ?? 0)),
    }
  }, [tasks])

  function openNewTask() {
    setForm({
      title: "",
      propertyId: properties[0]?.id ?? "",
      due: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
      priority: "medium",
    })
    setNewOpen(true)
  }

  function submitNewTask() {
    if (!form.title.trim() || !form.due) return
    addTask({
      title: form.title.trim(),
      propertyId: form.propertyId,
      dueDate: new Date(`${form.due}T00:00:00`).toISOString(),
      priority: form.priority as "high" | "medium" | "low",
    })
    toast({ variant: "success", title: "Task created", description: form.title.trim() })
    setNewOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            {buckets.overdue.length + buckets.dueSoon.length + buckets.upcoming.length} open ·{" "}
            {buckets.overdue.length} overdue
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openNewTask}>
          New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks yet"
          description="Tasks appear from requirements, alerts, and notices — or create one yourself."
          action={
            <Button size="sm" icon={<Plus className="h-4 w-4" />} onClick={openNewTask}>
              New Task
            </Button>
          }
        />
      ) : (
        <>
          <TaskSection title="Overdue" tone="red" tasks={buckets.overdue} />
          <TaskSection title="Due Soon" tone="amber" tasks={buckets.dueSoon} />
          <TaskSection title="Upcoming" tone="gray" tasks={buckets.upcoming} />
          <TaskSection title="Completed" tone="green" tasks={buckets.completed} />
        </>
      )}

      {/* New task modal */}
      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New task"
        subtitle="Create a tracked compliance action."
        footer={
          <>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitNewTask} disabled={!form.title.trim() || !form.due}>
              Create task
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Task" htmlFor="task-title">
            <Input
              id="task-title"
              placeholder="e.g. Renew rental registration"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              autoFocus
            />
          </Field>
          <Field label="Property" htmlFor="task-property">
            <Select
              id="task-property"
              value={form.propertyId}
              onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}
              options={properties.map((p) => ({
                value: p.id,
                label: `${p.address} — ${p.city}, ${p.state}`,
              }))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Due date" htmlFor="task-due">
              <Input
                id="task-due"
                type="date"
                value={form.due}
                onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
              />
            </Field>
            <Field label="Priority" htmlFor="task-priority">
              <Select
                id="task-priority"
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
              />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ------------------------------ Sections --------------------------------- */

function TaskSection({
  title,
  tone,
  tasks,
}: {
  title: string
  tone: "red" | "amber" | "gray" | "green"
  tasks: ComplianceTask[]
}) {
  if (tasks.length === 0) return null
  const tones = {
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    gray: "bg-gray-100 text-gray-600",
    green: "bg-emerald-50 text-emerald-700",
  }
  return (
    <section>
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span
          className={cn(
            "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
            tones[tone],
          )}
        >
          {tasks.length}
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
        <ul className="divide-y divide-gray-50">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function TaskRow({ task }: { task: ComplianceTask }) {
  const { completeTask, snoozeTask, reopenTask, getProperty } = useData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const property = getProperty(task.propertyId)
  const completed = task.status === "completed"
  const days = daysUntil(task.dueDate)

  function toggleComplete() {
    if (completed) {
      reopenTask(task.id)
      toast({ variant: "info", title: "Task reopened", description: task.title })
    } else {
      completeTask(task.id)
      toast({ variant: "success", title: "Task completed", description: task.title })
    }
  }

  return (
    <li className="flex flex-wrap items-center gap-3 px-5 py-4">
      <button
        onClick={toggleComplete}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-gray-300 text-transparent hover:border-primary-400",
        )}
        aria-label={completed ? "Reopen task" : "Mark complete"}
        aria-pressed={completed}
      >
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            completed ? "text-gray-400 line-through" : "text-gray-900",
          )}
        >
          {task.title}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-gray-400">
          <span>{property ? property.address : "General"}</span>
          {task.requirement && <span>· {task.requirement}</span>}
          {task.status === "snoozed" && task.snoozedUntil && (
            <span>· Snoozed until {formatDate(task.snoozedUntil)}</span>
          )}
        </p>
      </div>

      <StatusBadge status={task.priority} />

      <span
        className={cn(
          "text-xs font-semibold",
          completed
            ? "text-gray-400"
            : days !== null && days < 0
              ? "text-red-600"
              : days !== null && days <= 14
                ? "text-amber-600"
                : "text-gray-500",
        )}
      >
        {completed ? `Completed ${formatDate(task.completedAt)}` : relativeDeadline(task.dueDate)}
      </span>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => property && navigate(`/app/properties/${property.id}`)}
          disabled={!property}
        >
          View property
        </Button>
        {!completed && (
          <Dropdown
            label={`Actions for ${task.title}`}
            width="w-44"
            trigger={
              <div className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            }
          >
            {(close) => (
              <div className="py-1">
                <DropdownItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => {
                    close()
                    toggleComplete()
                  }}
                >
                  Complete
                </DropdownItem>
                {[3, 7, 14].map((d) => (
                  <DropdownItem
                    key={d}
                    icon={<RotateCcw className="h-4 w-4" />}
                    onClick={() => {
                      close()
                      snoozeTask(task.id, d)
                      toast({
                        variant: "info",
                        title: `Snoozed for ${d} days`,
                        description: task.title,
                      })
                    }}
                  >
                    Snooze {d} days
                  </DropdownItem>
                ))}
              </div>
            )}
          </Dropdown>
        )}
      </div>
    </li>
  )
}