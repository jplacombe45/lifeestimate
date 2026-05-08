import { useState } from 'react'

function computeBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null
  const bmi = weightKg / Math.pow(heightCm / 100, 2)
  return bmi > 5 && bmi < 100 ? bmi : null
}

function bmiToCategory(bmi) {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25)   return 'normal'
  if (bmi < 30)   return 'overweight'
  return 'obese'
}

export default function BmiInput({ value, onChange, t, validationError, number }) {
  const [unit, setUnit]         = useState('metric')
  const [weight, setWeight]     = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [computedBmi, setComputedBmi] = useState(null)

  const tb = t.ui.bmiInput
  const qt = t.questions.bmi

  function tryAutoSelect(w, hCm, hFt, hIn, u) {
    let weightKg, heightInCm
    if (u === 'metric') {
      weightKg   = parseFloat(w)
      heightInCm = parseFloat(hCm)
    } else {
      weightKg   = parseFloat(w) * 0.453592
      heightInCm = ((parseFloat(hFt) || 0) * 12 + (parseFloat(hIn) || 0)) * 2.54
    }
    const bmi = computeBmi(weightKg, heightInCm)
    if (bmi) {
      setComputedBmi(bmi)
      onChange(bmiToCategory(bmi))
    } else {
      setComputedBmi(null)
    }
  }

  function handleWeight(e) {
    const w = e.target.value
    setWeight(w)
    tryAutoSelect(w, heightCm, heightFt, heightIn, unit)
  }

  function handleHeightCm(e) {
    const h = e.target.value
    setHeightCm(h)
    tryAutoSelect(weight, h, heightFt, heightIn, unit)
  }

  function handleHeightFt(e) {
    const f = e.target.value
    setHeightFt(f)
    tryAutoSelect(weight, heightCm, f, heightIn, unit)
  }

  function handleHeightIn(e) {
    const i = e.target.value
    setHeightIn(i)
    tryAutoSelect(weight, heightCm, heightFt, i, unit)
  }

  function handleUnitSwitch(u) {
    setUnit(u)
    setWeight('')
    setHeightCm('')
    setHeightFt('')
    setHeightIn('')
    setComputedBmi(null)
  }

  function handlePillClick(val) {
    setWeight('')
    setHeightCm('')
    setHeightFt('')
    setHeightIn('')
    setComputedBmi(null)
    onChange(val)
  }

  return (
    <div
      id="question-bmi"
      className={`question-card ${value ? 'answered' : ''} ${validationError && !value ? 'error' : ''}`}
    >
      <div className="question-header">
        <span className="question-number">Q{number}</span>
        <span className="question-icon">⚖️</span>
        <h2 className="question-text">{qt.question}</h2>
      </div>

      <div className="bmi-calculator">
        <div className="bmi-unit-toggle">
          <button type="button" className={`bmi-unit-btn ${unit === 'metric' ? 'active' : ''}`} onClick={() => handleUnitSwitch('metric')}>
            {tb.metricLabel}
          </button>
          <button type="button" className={`bmi-unit-btn ${unit === 'imperial' ? 'active' : ''}`} onClick={() => handleUnitSwitch('imperial')}>
            {tb.imperialLabel}
          </button>
        </div>

        <div className="bmi-fields">
          <div className="bmi-field">
            <label className="bmi-label">{tb.weightLabel}</label>
            <div className="bmi-input-row">
              <input
                type="number" className="bmi-input" value={weight}
                onChange={handleWeight}
                placeholder={unit === 'metric' ? '70' : '154'}
                min="1" step="0.1"
              />
              <span className="bmi-unit-suffix">{unit === 'metric' ? 'kg' : 'lbs'}</span>
            </div>
          </div>

          <div className="bmi-field">
            <label className="bmi-label">{tb.heightLabel}</label>
            {unit === 'metric' ? (
              <div className="bmi-input-row">
                <input
                  type="number" className="bmi-input" value={heightCm}
                  onChange={handleHeightCm}
                  placeholder="170" min="1"
                />
                <span className="bmi-unit-suffix">cm</span>
              </div>
            ) : (
              <div className="bmi-input-row">
                <input
                  type="number" className="bmi-input bmi-input-sm" value={heightFt}
                  onChange={handleHeightFt}
                  placeholder="5" min="1" max="9"
                />
                <span className="bmi-unit-suffix">ft</span>
                <input
                  type="number" className="bmi-input bmi-input-sm" value={heightIn}
                  onChange={handleHeightIn}
                  placeholder="10" min="0" max="11"
                />
                <span className="bmi-unit-suffix">in</span>
              </div>
            )}
          </div>
        </div>

        {computedBmi && (
          <div className="bmi-result">
            <span className="bmi-result-label">{tb.bmiLabel}</span>
            <span className="bmi-result-value">{computedBmi.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="bmi-divider"><span>{tb.orLabel}</span></div>

      <div className="options-row">
        {Object.entries(qt.options).map(([optValue, label]) => (
          <button
            key={optValue}
            type="button"
            className={`option-pill ${value === optValue ? 'selected' : ''}`}
            onClick={() => handlePillClick(optValue)}
            aria-pressed={value === optValue}
          >
            {label}
          </button>
        ))}
      </div>

      {validationError && !value && (
        <p className="question-error">{t.ui.questionError}</p>
      )}
    </div>
  )
}
