import { Icon } from "./Icon"

export function TrustSection() {
  return (
    <section className="trust-section" id="experts">
      <div className="trust-copy">
        <span className="section-kicker">Built around trust</span>
        <h2>
          AI for clarity.
          <br />
          Experts for confidence.
        </h2>
        <p>
          Aroha's recommendations use transparent clinical pathways reviewed by
          qualified professionals across physical, mental, and lifestyle health.
        </p>
        <div className="trust-points">
          <span>
            <Icon name="check" size={15} /> Verified credentials
          </span>
          <span>
            <Icon name="check" size={15} /> Clear scope of care
          </span>
          <span>
            <Icon name="check" size={15} /> No paid rankings
          </span>
        </div>
      </div>
      <div className="expert-panel">
        <div className="expert-stack">
          <div className="portrait portrait-one">RM</div>
          <div className="portrait portrait-two">AS</div>
          <div className="portrait portrait-three">NK</div>
        </div>
        <div className="expert-stat">
          <strong>24+</strong>
          <span>Clinical advisors</span>
        </div>
        <div className="panel-divider" />
        <div className="expert-stat">
          <strong>12</strong>
          <span>Specialties represented</span>
        </div>
        <div className="quote">
          "Guidance should help people feel informed, not alarmed."
        </div>
      </div>
    </section>
  )
}
