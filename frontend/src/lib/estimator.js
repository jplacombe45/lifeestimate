import { getTranslations } from './i18n.js'

// WHO / World Bank 2023 life expectancy data by country code
const COUNTRY_DATA = {
  AF: { name: 'Afghanistan', baseAge: 63 },
  AL: { name: 'Albania', baseAge: 78 },
  DZ: { name: 'Algeria', baseAge: 77 },
  AR: { name: 'Argentina', baseAge: 76 },
  AU: { name: 'Australia', baseAge: 83 },
  AT: { name: 'Austria', baseAge: 82 },
  BE: { name: 'Belgium', baseAge: 82 },
  BR: { name: 'Brazil', baseAge: 75 },
  BG: { name: 'Bulgaria', baseAge: 75 },
  CA: { name: 'Canada', baseAge: 83 },
  CL: { name: 'Chile', baseAge: 80 },
  CN: { name: 'China', baseAge: 78 },
  CO: { name: 'Colombia', baseAge: 77 },
  HR: { name: 'Croatia', baseAge: 78 },
  CZ: { name: 'Czech Republic', baseAge: 79 },
  DK: { name: 'Denmark', baseAge: 81 },
  EG: { name: 'Egypt', baseAge: 72 },
  FI: { name: 'Finland', baseAge: 82 },
  FR: { name: 'France', baseAge: 83 },
  DE: { name: 'Germany', baseAge: 81 },
  GR: { name: 'Greece', baseAge: 82 },
  HK: { name: 'Hong Kong', baseAge: 85 },
  HU: { name: 'Hungary', baseAge: 76 },
  IN: { name: 'India', baseAge: 70 },
  ID: { name: 'Indonesia', baseAge: 72 },
  IR: { name: 'Iran', baseAge: 77 },
  IE: { name: 'Ireland', baseAge: 82 },
  IL: { name: 'Israel', baseAge: 83 },
  IT: { name: 'Italy', baseAge: 83 },
  JP: { name: 'Japan', baseAge: 84 },
  JO: { name: 'Jordan', baseAge: 75 },
  KZ: { name: 'Kazakhstan', baseAge: 73 },
  KE: { name: 'Kenya', baseAge: 67 },
  KR: { name: 'South Korea', baseAge: 83 },
  LU: { name: 'Luxembourg', baseAge: 82 },
  MY: { name: 'Malaysia', baseAge: 76 },
  MX: { name: 'Mexico', baseAge: 75 },
  MA: { name: 'Morocco', baseAge: 77 },
  NL: { name: 'Netherlands', baseAge: 82 },
  NZ: { name: 'New Zealand', baseAge: 82 },
  NG: { name: 'Nigeria', baseAge: 63 },
  NO: { name: 'Norway', baseAge: 83 },
  PK: { name: 'Pakistan', baseAge: 68 },
  PE: { name: 'Peru', baseAge: 77 },
  PH: { name: 'Philippines', baseAge: 71 },
  PL: { name: 'Poland', baseAge: 77 },
  PT: { name: 'Portugal', baseAge: 81 },
  RO: { name: 'Romania', baseAge: 75 },
  RU: { name: 'Russia', baseAge: 73 },
  SA: { name: 'Saudi Arabia', baseAge: 77 },
  ZA: { name: 'South Africa', baseAge: 64 },
  ES: { name: 'Spain', baseAge: 84 },
  SE: { name: 'Sweden', baseAge: 83 },
  CH: { name: 'Switzerland', baseAge: 84 },
  TW: { name: 'Taiwan', baseAge: 81 },
  TH: { name: 'Thailand', baseAge: 77 },
  TR: { name: 'Turkey', baseAge: 77 },
  UA: { name: 'Ukraine', baseAge: 72 },
  AE: { name: 'United Arab Emirates', baseAge: 79 },
  GB: { name: 'United Kingdom', baseAge: 82 },
  US: { name: 'United States', baseAge: 79 },
  VN: { name: 'Vietnam', baseAge: 75 },
}

const DEFAULT_COUNTRY = { code: 'US', name: 'United States', baseAge: 79 }

export function getCountryInfo(code) {
  const data = COUNTRY_DATA[code]
  return data ? { code, name: data.name, baseAge: data.baseAge } : DEFAULT_COUNTRY
}

export async function detectCountry() {
  try {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 3000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    const data = await res.json()
    return getCountryInfo(data.country_code)
  } catch {
    return DEFAULT_COUNTRY
  }
}

const SCORING_IMPACTS = {
  smoking:  { never: 3, former: 1, current: -7 },
  exercise: { daily: 4, '3_5x': 3, '1_2x': 1, rarely: -2, never: -4 },
  diet:     { excellent: 3, good: 1, average: 0, poor: -2, very_poor: -4 },
  bmi:      { underweight: -1, normal: 2, overweight: -1, obese: -3 },
  alcohol:  { none: 1, moderate: 0, heavy: -4, very_heavy: -7 },
  sleep:    { lt5: -3, '5_6': -1, '7_8': 2, '9plus': -1 },
  stress:   { low: 2, moderate: 0, high: -2, very_high: -4 },
  social:   { strong: 2, moderate: 1, weak: -1, isolated: -3 },
  checkups: { yes: 2, sometimes: 1, no: -1 },
  family_longevity: { many: 2, some: 1, few: 0, none: -1 },
}

function buildRecommendations(answers, t) {
  const r = t.recommendations
  const recs = []

  if (answers.smoking === 'current')                              recs.push(r.smoking)
  if (answers.exercise === 'rarely' || answers.exercise === 'never') recs.push(r.exercise)
  if (answers.diet === 'poor' || answers.diet === 'very_poor')   recs.push(r.diet)
  if (answers.bmi === 'overweight' || answers.bmi === 'obese')   recs.push(r.bmi_over)
  if (answers.bmi === 'underweight')                             recs.push(r.bmi_under)
  if (answers.alcohol === 'heavy' || answers.alcohol === 'very_heavy') recs.push(r.alcohol)
  if (answers.sleep === 'lt5')                                   recs.push(r.sleep_lt5)
  if (answers.sleep === '5_6')                                   recs.push(r.sleep_5_6)
  if (answers.stress === 'high' || answers.stress === 'very_high')    recs.push(r.stress)
  if (answers.social === 'weak' || answers.social === 'isolated')     recs.push(r.social)
  if (answers.checkups === 'no')                                 recs.push(r.checkups)

  const positives = []
  if (answers.smoking === 'never')                                        positives.push(r.positiveNames.never_smoking)
  if (answers.exercise === 'daily' || answers.exercise === '3_5x')        positives.push(r.positiveNames.consistent_exercise)
  if (answers.diet === 'excellent' || answers.diet === 'good')            positives.push(r.positiveNames.healthy_diet)
  if (answers.sleep === '7_8')                                            positives.push(r.positiveNames.optimal_sleep)
  if (answers.social === 'strong')                                        positives.push(r.positiveNames.strong_social)

  if (positives.length > 0)
    recs.push(r.positivePrefix + positives.join(', ') + r.positiveSuffix)

  if (recs.length === 0)
    recs.push(r.allGood)

  return recs
}

function buildSummary(estimatedAge, totalAdjustment, countryName, countryBaseAge, t) {
  const s = t.summary
  let quality, outlook
  if (totalAdjustment >= 6)       { quality = s.qualities.exceptional;  outlook = s.outlooks.exceptional }
  else if (totalAdjustment >= 3)  { quality = s.qualities.very_healthy; outlook = s.outlooks.very_healthy }
  else if (totalAdjustment >= 0)  { quality = s.qualities.healthy;      outlook = s.outlooks.healthy }
  else if (totalAdjustment >= -4) { quality = s.qualities.mixed;        outlook = s.outlooks.mixed }
  else if (totalAdjustment >= -8) { quality = s.qualities.concerning;   outlook = s.outlooks.concerning }
  else                            { quality = s.qualities.high_risk;    outlook = s.outlooks.high_risk }

  const diff = estimatedAge - countryBaseAge
  const comparison =
    diff > 0 ? s.comparisonAbove(diff.toFixed(1), countryName, countryBaseAge) :
    diff < 0 ? s.comparisonBelow(Math.abs(diff).toFixed(1), countryName, countryBaseAge) :
    s.comparisonAt(countryName, countryBaseAge)

  return s.template(estimatedAge.toFixed(1), comparison, quality, outlook)
}

export function estimateLifeExpectancy(answers, countryInfo = DEFAULT_COUNTRY, lang = 'en') {
  const t = getTranslations(lang)
  const fieldOrder = ['smoking', 'exercise', 'diet', 'bmi', 'alcohol', 'sleep', 'stress', 'social', 'checkups', 'family_longevity']
  let totalAdjustment = 0
  const factors = []

  for (const field of fieldOrder) {
    const impact = SCORING_IMPACTS[field][answers[field]]
    const { name, description } = t.scoring[field][answers[field]]
    factors.push({ name, impact, description })
    totalAdjustment += impact
  }

  const estimatedAge = Math.round((countryInfo.baseAge + totalAdjustment) * 10) / 10
  const localCountryName = t.countryNames[countryInfo.code] || countryInfo.name

  return {
    estimated_age: estimatedAge,
    base_age: countryInfo.baseAge,
    country_name: localCountryName,
    factors,
    summary: buildSummary(estimatedAge, totalAdjustment, localCountryName, countryInfo.baseAge, t),
    recommendations: buildRecommendations(answers, t),
  }
}
