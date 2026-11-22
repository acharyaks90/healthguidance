import { Assessment } from "./Assessment"
import { Recommendation } from "./Recommendation"
import { Icon } from "./Icon"

interface AssessmentSectionProps {
  started: boolean
  submitted: boolean
  assessmentStep: number
  cohort: string
  selected: string[]
  worry: number
  carePreferences: string[]
  movementPreferences: string[]
  query: string
  saved: boolean
  onCohortChange: (cohort: string) => void
  onToggleSymptom: (symptom: string) => void
  onWorryChange: (worry: number) => void
  onCareToggle: (option: string) => void
  onMovementToggle: (option: string) => void
  onNextStep: () => void
  onBackStep: () => void
  onSave: () => void
  onEdit: () => void
}

export function AssessmentSection({
  started,
  submitted,
  assessmentStep,
  cohort,
  selected,
  worry,
  carePreferences,
  movementPreferences,
  query,
  saved,
  onCohortChange,
  onToggleSymptom,
  onWorryChange,
  onCareToggle,
  onMovementToggle,
  onNextStep,
  onBackStep,
  onSave,
  onEdit,
}: AssessmentSectionProps) {
  return (
    <section
      className={`assessment-section ${started ? "visible" : ""}`}
      id="assessment"
    >
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            {assessmentStep === 4
              ? "Your complete guidance"
              : "Personalize your guidance"}
          </span>
          <h2>
            {assessmentStep === 4
              ? "A calm, practical next step"
              : "A few simple questions, one at a time"}
          </h2>
        </div>
        <span className="review-badge">
          <Icon name="shield" size={16} /> Clinically reviewed framework
        </span>
      </div>

      {!submitted ? (
        <div className="empty-assessment">
          <span>
            <Icon name="message" size={25} />
          </span>
          <h3>Tell us a little more first</h3>
          <p>
            Describe what you're feeling above or select a concern to see a
            sample guidance pathway.
          </p>
        </div>
      ) : (
        <>
          <div className="journey-progress">
            <span className={assessmentStep === 1 ? "active" : "done"}>
              <b>{assessmentStep > 1 ? "✓" : "1"}</b> About you
            </span>
            <i />
            <span
              className={
                assessmentStep === 2
                  ? "active"
                  : assessmentStep > 2
                    ? "done"
                    : ""
              }
            >
              <b>{assessmentStep > 2 ? "✓" : "2"}</b> How you feel
            </span>
            <i />
            <span
              className={
                assessmentStep === 3
                  ? "active"
                  : assessmentStep > 3
                    ? "done"
                    : ""
              }
            >
              <b>{assessmentStep > 3 ? "✓" : "3"}</b> Preferences
            </span>
            <i />
            <span className={assessmentStep === 4 ? "active" : ""}>
              <b>4</b> Your plan
            </span>
          </div>

          <div
            className={`studio-grid ${
              assessmentStep < 4 ? "question-mode" : "result-mode"
            }`}
          >
            {assessmentStep < 4 && (
              <Assessment
                assessmentStep={assessmentStep}
                cohort={cohort}
                selected={selected}
                worry={worry}
                carePreferences={carePreferences}
                movementPreferences={movementPreferences}
                onCohortChange={onCohortChange}
                onToggleSymptom={onToggleSymptom}
                onWorryChange={onWorryChange}
                onCareToggle={onCareToggle}
                onMovementToggle={onMovementToggle}
                onNext={onNextStep}
                onBack={onBackStep}
              />
            )}

            {assessmentStep === 4 && (
              <Recommendation
                query={query}
                selected={selected}
                cohort={cohort}
                worry={worry}
                carePreferences={carePreferences}
                movementPreferences={movementPreferences}
                saved={saved}
                onSave={onSave}
                onEdit={onEdit}
              />
            )}
          </div>
        </>
      )}
    </section>
  )
}
