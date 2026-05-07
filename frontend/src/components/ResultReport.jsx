import { useEffect, useRef } from 'react'

function ImpactBar({ impact }) {
  const maxImpact = 7
  const absImpact = Math.abs(impact)
  const widthPercent = (absImpact / maxImpact) * 100
  const isPositive = impact > 0
  const isNeutral = impact === 0

  return (
    <div className="impact-bar-wrapper">
      <div className="impact-bar-track">
        <div
          className={`impact-bar-fill ${
            isNeutral ? 'neutral' : isPositive ? 'positive' : 'negative'
          }`}
          style={{ width: `${isNeutral ? 4 : widthPercent}%` }}
        />
      </div>
      <span
        className={`impact-badge ${
          isNeutral ? 'neutral' : isPositive ? 'positive' : 'negative'
        }`}
      >
        {isNeutral ? '±0' : isPositive ? `+${impact}` : `${impact}`} yrs
      </span>
    </div>
  )
}

function FactorCard({ factor, index }) {
  const isPositive = factor.impact > 0
  const isNeutral = factor.impact === 0

  return (
    <div
      className={`factor-card ${
        isNeutral ? 'neutral' : isPositive ? 'positive' : 'negative'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="factor-top">
        <span className="factor-name">{factor.name}</span>
        <span
          className={`factor-impact-label ${
            isNeutral ? 'neutral' : isPositive ? 'positive' : 'negative'
          }`}
        >
          {isNeutral ? '±0' : isPositive ? `+${factor.impact}` : `${factor.impact}`} yrs
        </span>
      </div>
      <ImpactBar impact={factor.impact} />
      <p className="factor-description">{factor.description}</p>
    </div>
  )
}

export default function ResultReport({ result, onStartOver }) {
  const { estimated_age, base_age, factors, summary, recommendations } = result

  const totalAdjustment = estimated_age - base_age
  const isAboveAverage = totalAdjustment > 0
  const isBelowAverage = totalAdjustment < 0

  const positiveFactors = factors.filter((f) => f.impact > 0)
  const negativeFactors = factors.filter((f) => f.impact < 0)
  const neutralFactors = factors.filter((f) => f.impact === 0)

  const ageRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Animated counter for the main age number
  useEffect(() => {
    const el = ageRef.current
    if (!el) return
    const target = estimated_age
    const duration = 1200
    const start = performance.now()
    const startVal = base_age

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startVal + (target - startVal) * eased
      el.textContent = current.toFixed(1)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [estimated_age, base_age])

  return (
    <div className="report-container">
      {/* Hero section */}
      <div className="report-hero">
        <div className="report-hero-inner">
          <p className="report-hero-label">Your estimated life expectancy</p>
          <div className="report-age-display">
            <span className="report-age-number" ref={ageRef}>
              {base_age}
            </span>
            <span className="report-age-unit">years</span>
          </div>
          <div
            className={`report-vs-average ${
              isAboveAverage ? 'positive' : isBelowAverage ? 'negative' : 'neutral'
            }`}
          >
            {isAboveAverage && `+${totalAdjustment.toFixed(1)} years above`}
            {isBelowAverage && `${totalAdjustment.toFixed(1)} years below`}
            {!isAboveAverage && !isBelowAverage && 'At'} the US average of {base_age} years
          </div>
          <p className="report-summary">{summary}</p>
        </div>

        <div className="report-stats-row">
          <div className="report-stat">
            <span className="report-stat-value positive">
              +{positiveFactors.reduce((s, f) => s + f.impact, 0)} yrs
            </span>
            <span className="report-stat-label">From positive factors</span>
          </div>
          <div className="report-stat-divider" />
          <div className="report-stat">
            <span className="report-stat-value negative">
              {negativeFactors.reduce((s, f) => s + f.impact, 0)} yrs
            </span>
            <span className="report-stat-label">From risk factors</span>
          </div>
          <div className="report-stat-divider" />
          <div className="report-stat">
            <span className="report-stat-value neutral">
              {totalAdjustment > 0 ? '+' : ''}{totalAdjustment.toFixed(1)} yrs
            </span>
            <span className="report-stat-label">Net adjustment</span>
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <section className="report-section">
        <h2 className="section-title">
          <span className="section-title-icon">📊</span>
          Lifestyle Factor Breakdown
        </h2>
        <p className="section-subtitle">
          Each factor shows how your answers compare to the statistical baseline.
        </p>

        {positiveFactors.length > 0 && (
          <div className="factors-group">
            <h3 className="factors-group-label positive">
              <span>✓</span> Positive factors ({positiveFactors.length})
            </h3>
            <div className="factors-grid">
              {positiveFactors.map((factor, i) => (
                <FactorCard key={factor.name} factor={factor} index={i} />
              ))}
            </div>
          </div>
        )}

        {negativeFactors.length > 0 && (
          <div className="factors-group">
            <h3 className="factors-group-label negative">
              <span>↓</span> Areas for improvement ({negativeFactors.length})
            </h3>
            <div className="factors-grid">
              {negativeFactors.map((factor, i) => (
                <FactorCard key={factor.name} factor={factor} index={i} />
              ))}
            </div>
          </div>
        )}

        {neutralFactors.length > 0 && (
          <div className="factors-group">
            <h3 className="factors-group-label neutral">
              <span>—</span> Neutral factors ({neutralFactors.length})
            </h3>
            <div className="factors-grid">
              {neutralFactors.map((factor, i) => (
                <FactorCard key={factor.name} factor={factor} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Recommendations */}
      <section className="report-section">
        <h2 className="section-title">
          <span className="section-title-icon">💡</span>
          Personalized Recommendations
        </h2>
        <p className="section-subtitle">
          Evidence-based actions you can take to improve your longevity.
        </p>
        <div className="recommendations-list">
          {recommendations.map((rec, i) => (
            <div key={i} className="recommendation-item">
              <div className="rec-number">{i + 1}</div>
              <p className="rec-text">{rec}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="report-cta">
        <div className="report-cta-inner">
          <h3 className="cta-title">Want to see how your habits could change things?</h3>
          <p className="cta-subtitle">
            Small lifestyle changes can add meaningful years to your life. Retake
            the assessment to see the impact.
          </p>
          <button className="start-over-btn" onClick={onStartOver}>
            <span>↩</span> Start Over
          </button>
        </div>
      </div>

      <div className="report-disclaimer">
        <strong>Disclaimer:</strong> This estimate is based on population-level
        statistics and general lifestyle research. It is not a medical diagnosis
        and should not replace professional healthcare advice. Individual outcomes
        vary significantly based on genetics, environment, and many other factors.
      </div>
    </div>
  )
}
