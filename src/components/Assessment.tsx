import { CSSProperties } from "react"
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

interface AssessmentProps {
  assessmentStep: number
  cohort: string
  selected: string[]
  worry: number
  carePreferences: string[]
  movementPreferences: string[]
  onCohortChange: (cohort: string) => void
  onToggleSymptom: (symptom: string) => void
  onWorryChange: (worry: number) => void
  onCareToggle: (option: string) => void
  onMovementToggle: (option: string) => void
  onNext: () => void
  onBack: () => void
}

export function Assessment({
  assessmentStep,
  cohort,
  selected,
  worry,
  carePreferences,
  movementPreferences,
  onCohortChange,
  onToggleSymptom,
  onWorryChange,
  onCareToggle,
  onMovementToggle,
  onNext,
  onBack,
}: AssessmentProps) {
  return (
    <div className="wizard-card">
      <div className="panel-title">
        <div>
          <span className="section-kicker">Step {assessmentStep} of 3</span>
          <h3>
            {assessmentStep === 1 && "Which life stage fits you?"}
            {assessmentStep === 2 && "What else should we understand?"}
            {assessmentStep === 3 && "What kind of support feels right?"}
          </h3>
          <p>
            {assessmentStep === 1 &&
              "This helps make your context and next steps more relevant."}
            {assessmentStep === 2 &&
              "Select anything that applies and tell us how worried you feel."}
            {assessmentStep === 3 &&
              "Choose up to three in each group. Mixed preferences are completely okay."}
          </p>
        </div>
        <span className="question-count">{assessmentStep}/3</span>
      </div>

      {assessmentStep === 1 && (
        <>
          <div className="intake-group">
            <label>Your life stage</label>
            <div className="cohort-grid">
              {cohorts.map((item) => (
                <button
                  key={item.age}
                  className={cohort === item.age ? "selected" : ""}
                  onClick={() => onCohortChange(item.age)}
                >
                  <strong>Age {item.age}</strong>
                  <small>{item.life}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="empathy-note">
            <span>
              <Icon name="message" size={18} />
            </span>
            <div>
              <strong>It's understandable to feel unsure.</strong>
              <p>
                "There are so many choices. I want to know what's real, who to
                trust, and where to begin."
              </p>
            </div>
          </div>
        </>
      )}

      {assessmentStep === 2 && (
        <>
          <div className="intake-group">
            <div className="group-label-row">
              <label>Anything else you're experiencing?</label>
              <small>{selected.length} selected</small>
            </div>
            <div className="studio-chips">
              {extendedSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  className={selected.includes(symptom) ? "selected" : ""}
                  onClick={() => onToggleSymptom(symptom)}
                >
                  {selected.includes(symptom) ? (
                    <Icon name="check" size={13} />
                  ) : (
                    <span>+</span>
                  )}
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <div className="intake-group worry-group">
            <div className="group-label-row">
              <label>How worried do you feel right now?</label>
              <strong>{worry} of 5</strong>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={worry}
              style={
                {
                  "--worry-progress": `${((worry - 1) / 4) * 100}%`,
                } as CSSProperties
              }
              onChange={(e) => onWorryChange(Number(e.target.value))}
              aria-label="Current worry level"
            />
            <div className="range-labels">
              <span>A little concerned</span>
              <span>Very worried</span>
            </div>
          </div>
        </>
      )}

      {assessmentStep === 3 && (
        <div className="choice-columns">
          <div className="intake-group">
            <div className="group-label-row">
              <label>Care you're open to</label>
              <small>{carePreferences.length}/3 selected</small>
            </div>
            <div className="choice-grid">
              {careOptions.map((option) => (
                <button
                  key={option}
                  className={carePreferences.includes(option) ? "selected" : ""}
                  disabled={
                    carePreferences.length >= 3 &&
                    !carePreferences.includes(option)
                  }
                  onClick={() => onCareToggle(option)}
                >
                  {carePreferences.includes(option) && (
                    <Icon name="check" size={13} />
                  )}
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="intake-group">
            <div className="group-label-row">
              <label>Movement you enjoy</label>
              <small>{movementPreferences.length}/3 selected</small>
            </div>
            <div className="choice-grid">
              {movementOptions.map((option) => (
                <button
                  key={option}
                  className={
                    movementPreferences.includes(option) ? "selected" : ""
                  }
                  disabled={
                    movementPreferences.length >= 3 &&
                    !movementPreferences.includes(option)
                  }
                  onClick={() => onMovementToggle(option)}
                >
                  {movementPreferences.includes(option) && (
                    <Icon name="check" size={13} />
                  )}
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="wizard-actions">
        {assessmentStep > 1 ? (
          <button className="wizard-back" onClick={onBack}>
            Back
          </button>
        ) : (
          <span />
        )}
        <button className="wizard-next" onClick={onNext}>
          {assessmentStep === 3 ? "See my complete plan" : "Continue"}{" "}
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </div>
  )
}
