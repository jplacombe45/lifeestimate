import { useState } from 'react'

const QUESTIONS = [
  {
    id: 'smoking',
    number: 1,
    question: 'Do you smoke?',
    icon: '🚬',
    options: [
      { value: 'never', label: 'Never' },
      { value: 'former', label: 'Former smoker' },
      { value: 'current', label: 'Current smoker' },
    ],
  },
  {
    id: 'exercise',
    number: 2,
    question: 'How often do you exercise?',
    icon: '🏃',
    options: [
      { value: 'daily', label: 'Daily' },
      { value: '3_5x', label: '3–5 times/week' },
      { value: '1_2x', label: '1–2 times/week' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'never', label: 'Never' },
    ],
  },
  {
    id: 'diet',
    number: 3,
    question: 'How would you describe your diet?',
    icon: '🥗',
    options: [
      { value: 'excellent', label: 'Excellent (mostly whole foods)' },
      { value: 'good', label: 'Good (balanced)' },
      { value: 'average', label: 'Average' },
      { value: 'poor', label: 'Poor (mostly processed)' },
      { value: 'very_poor', label: 'Very poor' },
    ],
  },
  {
    id: 'bmi',
    number: 4,
    question: 'What is your BMI category?',
    icon: '⚖️',
    options: [
      { value: 'underweight', label: 'Underweight (<18.5)' },
      { value: 'normal', label: 'Normal (18.5–24.9)' },
      { value: 'overweight', label: 'Overweight (25–29.9)' },
      { value: 'obese', label: 'Obese (30+)' },
    ],
  },
  {
    id: 'alcohol',
    number: 5,
    question: 'How much alcohol do you consume?',
    icon: '🍷',
    options: [
      { value: 'none', label: 'None' },
      { value: 'moderate', label: 'Moderate (1–2 drinks/day)' },
      { value: 'heavy', label: 'Heavy (3–4 drinks/day)' },
      { value: 'very_heavy', label: 'Very heavy (5+/day)' },
    ],
  },
  {
    id: 'sleep',
    number: 6,
    question: 'How many hours do you sleep per night?',
    icon: '😴',
    options: [
      { value: 'lt5', label: 'Less than 5 hours' },
      { value: '5_6', label: '5–6 hours' },
      { value: '7_8', label: '7–8 hours' },
      { value: '9plus', label: '9 or more hours' },
    ],
  },
  {
    id: 'stress',
    number: 7,
    question: 'What is your stress level?',
    icon: '🧘',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'high', label: 'High' },
      { value: 'very_high', label: 'Very high' },
    ],
  },
  {
    id: 'social',
    number: 8,
    question: 'How would you describe your social connections?',
    icon: '👥',
    options: [
      { value: 'strong', label: 'Strong (close family & friends)' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'weak', label: 'Weak' },
      { value: 'isolated', label: 'Isolated' },
    ],
  },
  {
    id: 'checkups',
    number: 9,
    question: 'Do you get regular medical checkups?',
    icon: '🩺',
    options: [
      { value: 'yes', label: 'Yes, annually' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'family_longevity',
    number: 10,
    question: 'Do you have family members who lived past 90?',
    icon: '🧬',
    options: [
      { value: 'many', label: 'Many (3+)' },
      { value: 'some', label: 'Some (1–2)' },
      { value: 'few', label: 'Few' },
      { value: 'none', label: 'None' },
    ],
  },
]

export default function QuestionForm({ onSubmit, serverError }) {
  const [answers, setAnswers] = useState({})
  const [validationError, setValidationError] = useState(false)

  const answeredCount = Object.keys(answers).length
  const totalCount = QUESTIONS.length
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
      const firstUnanswered = QUESTIONS.find((q) => !answers[q.id])
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
        <h1 className="form-title">How long will you live?</h1>
        <p className="form-subtitle">
          Answer 10 questions about your lifestyle and we'll estimate your life
          expectancy based on the latest longevity research.
        </p>
        <div className="progress-bar-wrapper">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="progress-label">
            {answeredCount} / {totalCount} answered
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="questions-grid">
          {QUESTIONS.map((q) => (
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
                <h2 className="question-text">{q.question}</h2>
              </div>
              <div className="options-row">
                {q.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`option-pill ${
                      answers[q.id] === opt.value ? 'selected' : ''
                    }`}
                    onClick={() => handleSelect(q.id, opt.value)}
                    aria-pressed={answers[q.id] === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {validationError && !answers[q.id] && (
                <p className="question-error">Please select an answer</p>
              )}
            </div>
          ))}
        </div>

        {serverError && (
          <div className="server-error">
            <span className="server-error-icon">⚠️</span>
            {serverError}
          </div>
        )}

        {validationError && (
          <div className="validation-banner">
            Please answer all {totalCount} questions before submitting.
          </div>
        )}

        <div className="submit-section">
          <button type="submit" className="submit-btn">
            <span className="submit-btn-icon">✨</span>
            Estimate my Life Expectancy
          </button>
          <p className="submit-note">
            Takes about 30 seconds · Completely private · No account needed
          </p>
        </div>
      </form>
    </div>
  )
}
