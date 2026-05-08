import { useState } from 'react'
import { getTranslations } from '../lib/i18n.js'

const QUESTION_META = [
  { id: 'smoking',          number: 1,  icon: '🚬' },
  { id: 'exercise',         number: 2,  icon: '🏃' },
  { id: 'diet',             number: 3,  icon: '🥗' },
  { id: 'bmi',              number: 4,  icon: '⚖️' },
  { id: 'alcohol',          number: 5,  icon: '🍷' },
  { id: 'sleep',            number: 6,  icon: '😴' },
  { id: 'stress',           number: 7,  icon: '🧘' },
  { id: 'social',           number: 8,  icon: '👥' },
  { id: 'checkups',         number: 9,  icon: '🩺' },
  { id: 'family_longevity', number: 10, icon: '🧬' },
]

export default function QuestionForm({ onSubmit, lang = 'en' }) {
  const [answers, setAnswers] = useState({})
  const [validationError, setValidationError] = useState(false)

  const t = getTranslations(lang)
  const totalCount = QUESTION_META.length
  const answeredCount = Object.keys(answers).length
  const progressPercent = (answeredCount / totalCount) * 100

  function handleSelect(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (validationError && Object.keys({ ...answers, [questionId]: value }).length === totalCount) {
      setValidationError(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (answeredCount < totalCount) {
      setValidationError(true)
      const firstUnanswered = QUESTION_META.find((q) => !answers[q.id])
      if (firstUnanswered) {
        document.getElementById(`question-${firstUnanswered.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
      return
    }
    setValidationError(false)
    onSubmit(answers)
  }

  return (
    <div className="form-container">
      <div className="form-hero">
        <h1 className="form-title">{t.ui.formTitle}</h1>
        <p className="form-subtitle">{t.ui.formSubtitle}</p>
        <div className="progress-bar-wrapper">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="progress-label">
            {t.ui.progressLabel(answeredCount, totalCount)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="questions-grid">
          {QUESTION_META.map((q) => {
            const qt = t.questions[q.id]
            const optionEntries = Object.entries(qt.options)
            return (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className={`question-card ${answers[q.id] ? 'answered' : ''} ${
                  validationError && !answers[q.id] ? 'error' : ''
                }`}
              >
                <div className="question-header">
                  <span className="question-number">Q{q.number}</span>
                  <span className="question-icon">{q.icon}</span>
                  <h2 className="question-text">{qt.question}</h2>
                </div>
                <div className="options-row">
                  {optionEntries.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`option-pill ${answers[q.id] === value ? 'selected' : ''}`}
                      onClick={() => handleSelect(q.id, value)}
                      aria-pressed={answers[q.id] === value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {validationError && !answers[q.id] && (
                  <p className="question-error">{t.ui.questionError}</p>
                )}
              </div>
            )
          })}
        </div>

        {validationError && (
          <div className="validation-banner">
            {t.ui.validationBanner(totalCount)}
          </div>
        )}

        <div className="submit-section">
          <button type="submit" className="submit-btn">
            <span className="submit-btn-icon">✨</span>
            {t.ui.submitButton}
          </button>
          <p className="submit-note">{t.ui.submitNote}</p>
        </div>
      </form>
    </div>
  )
}
