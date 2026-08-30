import { useEffect, useState } from "react"
import { Joyride, STATUS, type EventData, type Step } from "react-joyride"
import { useAuth } from "../context/AuthContext"

const STEPS: Step[] = [
  {
    target: "header",
    title: "Top Bar",
    content: "Switch properties, check notifications, and manage your profile — all from the top bar.",
  },
  {
    target: "nav",
    title: "Navigation",
    content: "Use the sidebar to explore your Dashboard, Properties, Compliance Radar, Documents, Tasks, and more.",
  },
  {
    target: "main",
    title: "Dashboard",
    content: "Your live compliance overview — health scores, deadlines, and alerts at a glance.",
  },
]

export default function ProductTour() {
  const { user } = useAuth()
  const [run, setRun] = useState(false)

  // Start the tour once, 1s after a user is logged in, unless it has already run.
  useEffect(() => {
    if (!user) return
    if (localStorage.getItem("rn_tour_done")) return
    const id = window.setTimeout(() => {
      setRun(true)
    }, 1000)
    return () => window.clearTimeout(id)
  }, [user])

  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      localStorage.setItem("rn_tour_done", "1")
      setRun(false)
    }
  }

  return (
    <Joyride
      run={run}
      steps={STEPS}
      continuous
      options={{
        showProgress: true,
        buttons: ["back", "close", "primary", "skip"],
        zIndex: 10000,
        primaryColor: "#1d4ed8",
      }}
      locale={{
        back: "Back",
        next: "Next",
        nextWithProgress: "Next",
        last: "Finish",
        skip: "Skip",
      }}
      onEvent={handleEvent}
    />
  )
}