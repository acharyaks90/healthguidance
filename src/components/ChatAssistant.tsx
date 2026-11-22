'use client'

import { useState } from "react"
import { Icon } from "./Icon"

const cohorts = [
  { age: "23–35", life: "Early career & independence" },
  { age: "36–45", life: "Family & career peak" },
  { age: "45–60+", life: "Active health maintenance" },
]

const extendedSymptoms = [
  "Hair fall",
  "Eyesight changes",
  "Back pain",
  "Fatigue",
  "Poor sleep",
  "Stress",
  "Gut health",
  "Mood swings",
  "Thyroid",
  "Blood pressure",
]

const careOptions = [
  "General physician",
  "Medical specialist",
  "Mental health",
  "Ayurveda / traditional",
  "Nutrition support",
  "Physiotherapy",
  "Lifestyle coaching",
  "Help me decide",
]

const movementOptions = [
  "Yoga",
  "Gym",
  "Walking",
  "Swimming",
  "Cycling",
  "Pilates",
  "High intensity",
  "Not sure yet",
]

export type ChatAnswers = {
  cohort: string
  symptoms: string[]
  worry: number
  care: string[]
  movement: string[]
}

interface ChatAssistantProps {
  onClose: () => void
  onComplete: (answers: ChatAnswers) => void
}

function ChatMultiSelect({
  options,
  selected,
  limit,
  onToggle,
  onContinue,
  actionLabel = "Continue",
}: {
  options: string[]
  selected: string[]
  limit: number
  onToggle: (option: string) => void
  onContinue: () => void
  actionLabel?: string
}) {
  return (
    <>
      <div className="chat-selection-count">
        {selected.length} selected · maximum {limit}
      </div>
      <div className="chat-chips">
        {options.map((option) => (
          <button
            key={option}
            className={selected.includes(option) ? "selected" : ""}
            disabled={selected.length >= limit && !selected.includes(option)}
            onClick={() => onToggle(option)}
          >
            {selected.includes(option) && <Icon name="check" size={12} />}
            {option}
          </button>
        ))}
      </div>
      <button
        className="chat-primary"
        disabled={!selected.length}
        onClick={onContinue}
      >
        {actionLabel} <Icon name="arrow" size={16} />
      </button>
    </>
  )
}

export function ChatAssistant({ onClose, onComplete }: ChatAssistantProps) {
  const [step, setStep] = useState(0)
  const [age, setAge] = useState("")
  const [chatSymptoms, setChatSymptoms] = useState<string[]>([])
  const [chatWorry, setChatWorry] = useState(3)
  const [chatCare, setChatCare] = useState<string[]>([])
  const [chatMovement, setChatMovement] = useState<string[]>([])

  function toggle(
    option: string,
    current: string[],
    update: (values: string[]) => void,
    limit: number
  ) {
    if (current.includes(option)) {
      update(current.filter((item) => item !== option))
    } else if (current.length < limit) {
      update([...current, option])
    }
  }

  const prompts = [
    "Ready when you are",
    "Which life stage fits you best?",
    "What are you experiencing?",
    "How worried do you feel right now?",
    "What types of care are you open to?",
    "What movement feels realistic for you?",
    "Your guidance is ready",
  ]

  return (
    <div className="chat-overlay" onMouseDown={onClose}>
      <aside
        className="chat-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Aroha AI assistant"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="chat-header">
          <div className="chat-identity">
            <span>
              <Icon name="sparkle" size={18} />
            </span>
            <div>
              <strong>Aroha AI Assistant</strong>
              <small>Guided health conversation</small>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close AI assistant">
            <Icon name="close" size={19} />
          </button>
        </div>

        <div className="chat-safety">
          <Icon name="shield" size={14} />
          Guidance only—not a diagnosis or emergency service.
        </div>

        <div className="chat-thread">
          <div className="chat-message assistant">
            <span className="chat-bot-mark">
              <Icon name="sparkle" size={14} />
            </span>
            <div>
              <strong>
                {step === 0
                  ? "Hi, I'll help you find a sensible next step."
                  : prompts[step]}
              </strong>
              <p>
                {step === 0 &&
                  "I'll ask a few short questions, one at a time. You can stop whenever you want."}
                {step === 2 && "Select all that apply."}
                {(step === 4 || step === 5) && "Choose up to three options."}
                {step === 6 &&
                  "I've considered your concerns, worry level, and preferences."}
              </p>
            </div>
          </div>

          {age && step > 1 && (
            <div className="chat-message user">
              <div>Age {age}</div>
            </div>
          )}
          {chatSymptoms.length > 0 && step > 2 && (
            <div className="chat-message user">
              <div>{chatSymptoms.join(", ")}</div>
            </div>
          )}
          {step > 3 && (
            <div className="chat-message user">
              <div>Worry level {chatWorry} of 5</div>
            </div>
          )}
          {chatCare.length > 0 && step > 4 && (
            <div className="chat-message user">
              <div>{chatCare.join(", ")}</div>
            </div>
          )}
          {chatMovement.length > 0 && step > 5 && (
            <div className="chat-message user">
              <div>{chatMovement.join(", ")}</div>
            </div>
          )}

          {step === 6 && (
            <div className="chat-result">
              <span>
                <Icon name="check" size={16} />
              </span>
              <div>
                <small>Suggested starting point</small>
                <strong>General physician-led whole-health review</strong>
                <p>
                  Your full plan also includes food, sleep, movement,
                  consultation, and warning signs.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="chat-controls">
          {step === 0 && (
            <button className="chat-primary" onClick={() => setStep(1)}>
              Start guided chat <Icon name="arrow" size={16} />
            </button>
          )}
          {step === 1 && (
            <div className="chat-options">
              {cohorts.map((item) => (
                <button
                  key={item.age}
                  onClick={() => {
                    setAge(item.age)
                    setStep(2)
                  }}
                >
                  <strong>Age {item.age}</strong>
                  <small>{item.life}</small>
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <ChatMultiSelect
              options={extendedSymptoms}
              selected={chatSymptoms}
              limit={6}
              onToggle={(option) =>
                toggle(option, chatSymptoms, setChatSymptoms, 6)
              }
              onContinue={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <div className="chat-worry">
              <div>
                <span>Low concern</span>
                <strong>{chatWorry} of 5</strong>
                <span>Very worried</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={chatWorry}
                onChange={(event) => setChatWorry(Number(event.target.value))}
                aria-label="Worry level in AI chat"
              />
              <button className="chat-primary" onClick={() => setStep(4)}>
                Continue <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
          {step === 4 && (
            <ChatMultiSelect
              options={careOptions}
              selected={chatCare}
              limit={3}
              onToggle={(option) => toggle(option, chatCare, setChatCare, 3)}
              onContinue={() => setStep(5)}
            />
          )}
          {step === 5 && (
            <ChatMultiSelect
              options={movementOptions}
              selected={chatMovement}
              limit={3}
              onToggle={(option) =>
                toggle(option, chatMovement, setChatMovement, 3)
              }
              onContinue={() => setStep(6)}
              actionLabel="Create my guidance"
            />
          )}
          {step === 6 && (
            <button
              className="chat-primary"
              onClick={() =>
                onComplete({
                  cohort: age,
                  symptoms: chatSymptoms,
                  worry: chatWorry,
                  care: chatCare,
                  movement: chatMovement,
                })
              }
            >
              View my complete plan <Icon name="arrow" size={16} />
            </button>
          )}
          {step > 1 && step < 6 && (
            <button className="chat-back" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}
