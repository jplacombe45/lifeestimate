import { useState, useEffect } from 'react'
import { estimateLifeExpectancy, detectCountry } from './lib/estimator.js'
import { detectLanguage, getTranslations } from './lib/i18n.js'
import QuestionForm from './components/QuestionForm.jsx'
import ResultReport from './components/ResultReport.jsx'
import LanguageSelector from './components/LanguageSelector.jsx'

export default function App() {
  const [view, setView] = useState('form') // 'form' | 'result'
  const [result, setResult] = useState(null)
  const [countryInfo, setCountryInfo] = useState(null)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    detectCountry().then((info) => {
      setCountryInfo(info)
      setLang(detectLanguage(info.code))
    })
  }, [])

  const t = getTranslations(lang)

  function handleSubmit(answers) {
    const estimate = estimateLifeExpectancy(answers, countryInfo, lang)
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
            <span className="logo-text">{t.ui.logoText}</span>
          </div>
          <p className="header-tagline">{t.ui.tagline}</p>
          <LanguageSelector lang={lang} onChange={setLang} />
        </div>
      </header>

      <main className="app-main">
        {view === 'form' && (
          <QuestionForm onSubmit={handleSubmit} lang={lang} />
        )}
        {view === 'result' && result && (
          <ResultReport result={result} onStartOver={handleStartOver} lang={lang} />
        )}
      </main>

      <footer className="app-footer">
        <p>{t.ui.footer}</p>
      </footer>
    </div>
  )
}
