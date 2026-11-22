'use client'

import { useState, useMemo } from "react"
import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { AssessmentSection } from "@/components/AssessmentSection"
import { ConcernsExplorer } from "@/components/ConcernsExplorer"
import { TrustSection } from "@/components/TrustSection"
import { ChatAssistantAI, type ChatAnswers } from "@/components/ChatAssistantAI"
import { Icon } from "@/components/Icon"

export default function Home() {
  const [selected, setSelected] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [started, setStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [cohort, setCohort] = useState("23–35")
  const [worry, setWorry] = useState(3)
  const [carePreferences, setCarePreferences] = useState<string[]>([
    "Help me decide",
  ])
  const [movementPreferences, setMovementPreferences] = useState<string[]>([
    "Walking",
  ])
  const [saved, setSaved] = useState(false)
  const [assessmentStep, setAssessmentStep] = useState(1)
  const [chatOpen, setChatOpen] = useState(false)

  const displayQuery = useMemo(
    () => query.trim() || selected.join(", "),
    [query, selected]
  )

  function toggleSymptom(symptom: string) {
    setSelected((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    )
  }

  function togglePreference(
    option: string,
    current: string[],
    update: (preferences: string[]) => void
  ) {
    const uncertainOptions = ["Help me decide", "Not sure yet"]

    if (current.includes(option)) {
      update(current.filter((item) => item !== option))
      return
    }

    if (uncertainOptions.includes(option)) {
      update([option])
      return
    }

    const definitePreferences = current.filter(
      (item) => !uncertainOptions.includes(item)
    )
    if (definitePreferences.length < 3) {
      update([...definitePreferences, option])
    }
  }

  function handleAssessment() {
    setStarted(true)
    setSubmitted(Boolean(query.trim() || selected.length))
    setAssessmentStep(1)
    setTimeout(
      () =>
        document
          .querySelector("#assessment")
          ?.scrollIntoView({ behavior: "smooth" }),
      50
    )
  }

  function exploreConcern(concern: string) {
    setSelected((current) =>
      current.includes(concern) ? current : [...current, concern]
    )
    setStarted(true)
    setSubmitted(true)
    setAssessmentStep(1)
    setTimeout(
      () =>
        document
          .querySelector("#assessment")
          ?.scrollIntoView({ behavior: "smooth" }),
      50
    )
  }

  function completeChat(answers: ChatAnswers) {
    setCohort(answers.cohort)
    setQuery("")
    setSelected(answers.symptoms)
    setWorry(answers.worry)
    setCarePreferences(answers.care)
    setMovementPreferences(answers.movement)
    setStarted(true)
    setSubmitted(true)
    setAssessmentStep(4)
    setChatOpen(false)
    setTimeout(
      () =>
        document
          .querySelector("#assessment")
          ?.scrollIntoView({ behavior: "smooth" }),
      50
    )
  }

  return (
    <div className="app-shell">
      <Navigation onChatOpen={() => setChatOpen(true)} />

      <main>
        <Hero
          query={query}
          onQueryChange={setQuery}
          selected={selected}
          onToggleSymptom={toggleSymptom}
          onSubmit={handleAssessment}
        />

        <AssessmentSection
          started={started}
          submitted={submitted}
          assessmentStep={assessmentStep}
          cohort={cohort}
          selected={selected}
          worry={worry}
          carePreferences={carePreferences}
          movementPreferences={movementPreferences}
          query={query}
          saved={saved}
          onCohortChange={setCohort}
          onToggleSymptom={toggleSymptom}
          onWorryChange={setWorry}
          onCareToggle={(option) =>
            togglePreference(option, carePreferences, setCarePreferences)
          }
          onMovementToggle={(option) =>
            togglePreference(option, movementPreferences, setMovementPreferences)
          }
          onNextStep={() =>
            setAssessmentStep((step) => Math.min(4, step + 1))
          }
          onBackStep={() =>
            setAssessmentStep((step) => Math.max(1, step - 1))
          }
          onSave={() => setSaved(true)}
          onEdit={() => setAssessmentStep(1)}
        />

        <ConcernsExplorer onExploreConcern={exploreConcern} />

        <TrustSection />
      </main>

      <button
        className="chat-launcher"
        onClick={() => setChatOpen(true)}
        aria-label="Open Aroha AI Assistant"
      >
        <span>
          <Icon name="sparkle" size={18} />
        </span>
        <span>
          <strong>Ask Aroha AI</strong>
          <small>Guided health chat</small>
        </span>
      </button>

      {chatOpen && (
        <ChatAssistantAI
          onClose={() => setChatOpen(false)}
          onComplete={completeChat}
          mode="ai"
        />
      )}

      <footer>
        <a className="brand" href="#">
          <span className="brand-mark">
            <Icon name="heart" size={18} />
          </span>
          <span>Aroha</span>
        </a>
        <p>Health clarity, with care.</p>
        <div>
          <a href="#">Privacy</a>
          <a href="#">Medical disclaimer</a>
          <a href="#">How it works</a>
        </div>
      </footer>
    </div>
  )
}
