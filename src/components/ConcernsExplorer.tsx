import { Icon } from "./Icon"

type IconName = "brain" | "clock" | "heart" | "leaf"
type Tone = "lilac" | "blue" | "peach" | "green"

const concerns = [
  { name: "Stress & anxiety", icon: "brain" as IconName, tone: "lilac" as Tone },
  { name: "Sleep concerns", icon: "clock" as IconName, tone: "blue" as Tone },
  { name: "Pain & fatigue", icon: "heart" as IconName, tone: "peach" as Tone },
  { name: "Gut health", icon: "leaf" as IconName, tone: "green" as Tone },
]

interface ConcernsExplorerProps {
  onExploreConcern: (concern: string) => void
}

export function ConcernsExplorer({ onExploreConcern }: ConcernsExplorerProps) {
  return (
    <section className="concerns-section" id="wellness">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Explore by concern</span>
          <h2>Start where you are</h2>
        </div>
        <p>
          Evidence-aware explainers for common questions, written to reduce
          uncertainty — not add to it.
        </p>
      </div>
      <div className="concern-grid">
        {concerns.map((concern) => (
          <button
            className="concern-card"
            key={concern.name}
            onClick={() => onExploreConcern(concern.name)}
          >
            <span className={`concern-icon ${concern.tone}`}>
              <Icon name={concern.icon} />
            </span>
            <span>
              <strong>{concern.name}</strong>
              <small>Understand signs & next steps</small>
            </span>
            <Icon name="chevron" size={18} />
          </button>
        ))}
      </div>
    </section>
  )
}
