import { useMemo } from "react"
import { Icon } from "./Icon"

interface RecommendationProps {
  query: string
  selected: string[]
  cohort: string
  worry: number
  carePreferences: string[]
  movementPreferences: string[]
  saved: boolean
  onSave: () => void
  onEdit: () => void
}

export function Recommendation({
  query,
  selected,
  cohort,
  worry,
  carePreferences,
  movementPreferences,
  saved,
  onSave,
  onEdit,
}: RecommendationProps) {
  const displayQuery = useMemo(
    () => query.trim() || selected.join(", "),
    [query, selected]
  )

  return (
    <div className="recommendation-panel">
      <div className="recommendation-topline">
        <span>
          <Icon name="sparkle" size={16} /> Your guidance path
        </span>
        <span className={worry >= 4 ? "attention" : ""}>
          {worry >= 4 ? "Prompt attention" : "Routine care"}
        </span>
      </div>

      <div className="recommendation-hero">
        <small>Recommended starting point</small>
        <h3>
          General physician-led
          <br />
          whole-health review
        </h3>
        <p>
          For "{displayQuery}", begin with one qualified clinician who can
          assess the full picture before adding specialists or complementary
          care.
        </p>
      </div>

      <div className="rationale-card">
        <span className="rationale-icon">
          <Icon name="brain" size={19} />
        </span>
        <div>
          <strong>Why this path makes sense</strong>
          <p>
            Your symptom mix and worry level suggest that a broad first
            assessment is more useful than self-selecting a narrow specialist.
            Your age group ({cohort}) and care preferences (
            {carePreferences.length
              ? carePreferences.join(", ").toLowerCase()
              : "open to guidance"}
            ) have been considered.
          </p>
        </div>
      </div>

      <div className="verified-card">
        <div className="verified-heading">
          <span>
            <Icon name="shield" size={17} /> Expert-reviewed pathway
          </span>
          <small>Transparent guidance</small>
        </div>
        <div className="reviewer-row">
          <span className="reviewer-mark">CP</span>
          <div>
            <strong>Multidisciplinary clinical panel</strong>
            <p>General medicine · Mental health · Lifestyle care</p>
          </div>
        </div>
        <blockquote>
          We show the reasoning and practitioner credentials so you can make an
          informed choice—not simply follow an AI answer.
        </blockquote>
      </div>

      <div className="advice-grid">
        <div>
          <span>
            <Icon name="leaf" size={17} /> Movement fit
          </span>
          <strong>
            {movementPreferences.includes("High intensity")
              ? "Pause intense training for now"
              : `${movementPreferences[0] || "Gentle movement"} is a reasonable starting point`}
          </strong>
          <p>Keep effort gentle until symptoms are assessed.</p>
        </div>
        <div>
          <span>
            <Icon name="clock" size={17} /> Immediate next step
          </span>
          <strong>
            {worry >= 4
              ? "Arrange care within 24 hours"
              : "Book a routine consultation"}
          </strong>
          <p>Seek urgent help if symptoms rapidly worsen.</p>
        </div>
      </div>

      <div className="complete-plan-heading">
        <span>Personalized daily support</span>
        <h4>Your practical care plan</h4>
        <p>
          Small, low-risk actions to support you while you arrange appropriate
          professional care.
        </p>
      </div>

      <div className="care-plan-grid">
        <div className="care-plan-card">
          <span className="plan-icon">
            <Icon name="leaf" size={19} />
          </span>
          <div>
            <small>Food & hydration</small>
            <strong>A simple, steady meal rhythm</strong>
            <ul>
              <li>Regular meals with vegetables and protein</li>
              <li>Drink water through the day</li>
              <li>Limit excess caffeine and avoid crash diets</li>
            </ul>
          </div>
        </div>
        <div className="care-plan-card">
          <span className="plan-icon">
            <Icon name="heart" size={19} />
          </span>
          <div>
            <small>Movement plan</small>
            <strong>
              {movementPreferences.includes("High intensity")
                ? "Choose lighter movement for now"
                : `Begin with gentle ${(movementPreferences[0] || "movement").toLowerCase()}`}
            </strong>
            <ul>
              <li>Start with 15–20 comfortable minutes</li>
              <li>Stop if pain, dizziness, or weakness increases</li>
              <li>Build intensity only after symptoms settle</li>
            </ul>
          </div>
        </div>
        <div className="care-plan-card">
          <span className="plan-icon">
            <Icon name="clock" size={19} />
          </span>
          <div>
            <small>Sleep & recovery</small>
            <strong>Protect a consistent wind-down</strong>
            <ul>
              <li>Keep a regular sleep and wake time</li>
              <li>Reduce screens and stimulants before bed</li>
              <li>Track sleep changes alongside symptoms</li>
            </ul>
          </div>
        </div>
        <div className="care-plan-card warning">
          <span className="plan-icon">
            <Icon name="shield" size={19} />
          </span>
          <div>
            <small>When to seek help sooner</small>
            <strong>Do not wait if symptoms worsen</strong>
            <ul>
              <li>Sudden severe pain or breathing difficulty</li>
              <li>Fainting, confusion, weakness, or numbness</li>
              <li>Any immediate concern for personal safety</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="recommendation-actions">
        <button
          onClick={() =>
            document
              .querySelector("#experts")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Find a verified practitioner <Icon name="arrow" size={16} />
        </button>
        <button onClick={onSave}>
          {saved ? "Care brief saved" : "Save my care brief"}
          <Icon name={saved ? "check" : "chevron"} size={16} />
        </button>
      </div>
      <p className="recommendation-disclaimer">
        This prototype offers educational guidance, not a diagnosis or treatment
        plan. In an emergency, contact local emergency services.
      </p>
      <button className="edit-answers" onClick={onEdit}>
        Edit my answers
      </button>
    </div>
  )
}
