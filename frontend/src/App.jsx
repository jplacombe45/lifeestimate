import { useState } from 'react'
import { estimateLifeExpectancy } from './lib/estimator.js'
import QuestionForm from './components/QuestionForm.jsx'
import ResultReport from './components/ResultReport.jsx'

export default function App() {
  const [view, setView] = useState('form') // 'form' | 'result'
  const [result, setResult] = useState(null)

  function handleSubmit(answers) {
    const estimate = estimateLifeExpectancy(answers)
    setResult(estimate)
    setView('result')
  }

  function handleStartOver() {
    setResult(null)
    setView('form')
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-icon">♡</span>
            <span className="logo-text">LifeEstimate</span>
          </div>
          <p className="header-tagline">Understand your longevity potential</p>
        </div>
      </header>

      <main className="app-main">
        {view === 'form' && (
          <QuestionForm onSubmit={handleSubmit} />
        )}
        {view === 'result' && result && (
          <ResultReport result={result} onStartOver={handleStartOver} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          This estimate is for informational purposes only and is not a medical
          diagnosis. Consult a healthcare professional for personalized health
          advice.
        </p>
      </footer>
    </div>
  )
}
