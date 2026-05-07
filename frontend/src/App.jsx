import { useState } from 'react'
import axios from 'axios'
import QuestionForm from './components/QuestionForm.jsx'
import ResultReport from './components/ResultReport.jsx'

export default function App() {
  const [view, setView] = useState('form') // 'form' | 'loading' | 'result'
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(answers) {
    setView('loading')
    setError(null)
    try {
      const response = await axios.post('/api/estimate', answers)
      setResult(response.data)
      setView('result')
    } catch (err) {
      console.error(err)
      setError(
        err?.response?.data?.detail ||
          'Something went wrong. Please make sure the backend is running and try again.'
      )
      setView('form')
    }
  }

  function handleStartOver() {
    setResult(null)
    setError(null)
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
          <QuestionForm onSubmit={handleSubmit} serverError={error} />
        )}
        {view === 'loading' && (
          <div className="loading-screen">
            <div className="loading-spinner" />
            <p className="loading-text">Analyzing your lifestyle profile…</p>
            <p className="loading-subtext">
              Calculating your personalized life expectancy estimate
            </p>
          </div>
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
