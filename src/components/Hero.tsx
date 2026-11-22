import { Icon } from "./Icon"

const symptoms = [
  "Headache",
  "Back pain",
  "Feeling anxious",
  "Poor sleep",
  "Low energy",
  "Digestive issues",
]

interface HeroProps {
  query: string
  onQueryChange: (value: string) => void
  selected: string[]
  onToggleSymptom: (symptom: string) => void
  onSubmit: () => void
}

export function Hero({
  query,
  onQueryChange,
  selected,
  onToggleSymptom,
  onSubmit,
}: HeroProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit()
    }
  }

  return (
    <section className="hero">
      <div className="eyebrow">
        <span className="online-dot" /> Thoughtful health guidance, any time
      </div>
      <h1>
        Not sure what to do next?
        <br />
        <em>Let's figure it out together.</em>
      </h1>
      <p className="hero-copy">
        Share what you're experiencing. We'll help you understand how urgent it
        may be, who to speak with, and what you can safely do next.
      </p>

      <div className="guide-card">
        <div className="guide-heading">
          <span className="guide-icon">
            <Icon name="sparkle" />
          </span>
          <div>
            <h2>What's been bothering you?</h2>
            <p>Use your own words — no medical terms needed.</p>
          </div>
        </div>
        <div className="search-box">
          <Icon name="search" size={21} />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="For example: I've had lower back pain for 3 days..."
            aria-label="Describe your health concern"
          />
          <button onClick={onSubmit} aria-label="Start health guide">
            <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="privacy-note">
          <Icon name="shield" size={14} /> Your response is private and not used
          to identify you.
        </div>
        <div className="divider">
          <span>or choose what feels closest</span>
        </div>
        <div className="symptom-list">
          {symptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => onToggleSymptom(symptom)}
              className={selected.includes(symptom) ? "selected" : ""}
            >
              {selected.includes(symptom) && <Icon name="check" size={15} />}
              {symptom}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <button className="primary-action" onClick={onSubmit}>
            Continue with {selected.length}{" "}
            {selected.length === 1 ? "concern" : "concerns"}{" "}
            <Icon name="arrow" size={17} />
          </button>
        )}
      </div>
      <p className="safety-line">
        <strong>If this feels life-threatening,</strong> call your local
        emergency services immediately.
      </p>
    </section>
  )
}
