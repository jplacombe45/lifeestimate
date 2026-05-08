const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
]

export default function LanguageSelector({ lang, onChange }) {
  return (
    <div className="lang-selector">
      {LANGUAGES.map(({ code, flag, label }) => (
        <button
          key={code}
          className={`lang-btn ${lang === code ? 'active' : ''}`}
          onClick={() => onChange(code)}
          aria-pressed={lang === code}
          aria-label={label}
        >
          <span className="lang-flag">{flag}</span>
          <span className="lang-code">{label}</span>
        </button>
      ))}
    </div>
  )
}
