import { useState, useEffect } from 'react'
import { estimateLifeExpectancy, detectCountry } from './lib/estimator.js'
import { detectLanguage, getTranslations } from './lib/i18n.js'
import QuestionForm from './components/QuestionForm.jsx'
import ResultReport from './components/ResultReport.jsx'
import ReferencesPage from './components/ReferencesPage.jsx'
import LanguageSelector from './components/LanguageSelector.jsx'

function LogoIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M16 26 C6 20 3.5 15.5 3.5 12 C3.5 8.5 6.5 6 10 6 C12 6 14 7.5 16 9.5 C18 7.5 20 6 22 6 C25.5 6 28.5 8.5 28.5 12 C28.5 15.5 26 20 16 26 Z"
        stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinejoin="round"
      />
      <polyline
        points="4,16 8,16 9.5,19.5 11.5,8.5 13.5,19.5 15,16 16.5,13 17.5,16 28,16"
        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export default function App() {
  const [view, setView] = useState('form') // 'form' | 'result' | 'references'
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
          <div className="header-logo" onClick={handleStartOver} style={{ cursor: 'pointer' }}>
            <LogoIcon />
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
        {view === 'references' && (
          <ReferencesPage onBack={() => setView(result ? 'result' : 'form')} lang={lang} />
        )}
      </main>

      <footer className="app-footer">
        <p>{t.ui.footer}</p>
        <button className="refs-footer-link" onClick={() => setView('references')}>
          {t.ui.refsLink}
        </button>
      </footer>
    </div>
  )
}
