const BASE_AGE = 79.0

const SCORING = {
  smoking: {
    never:   { name: 'Never smoked',    impact:  3, description: 'Non-smokers significantly reduce their risk of cancer, heart disease, and stroke.' },
    former:  { name: 'Former smoker',   impact:  1, description: 'Quitting smoking partially reverses health risks over time.' },
    current: { name: 'Current smoker',  impact: -7, description: 'Smoking is the leading preventable cause of death, dramatically shortening lifespan.' },
  },
  exercise: {
    daily:  { name: 'Exercise: Daily',       impact:  4, description: 'Daily physical activity is one of the strongest predictors of longevity.' },
    '3_5x': { name: 'Exercise: 3–5x/week',   impact:  3, description: 'Regular exercise significantly reduces cardiovascular and metabolic disease risk.' },
    '1_2x': { name: 'Exercise: 1–2x/week',   impact:  1, description: 'Some exercise is better than none — even light activity extends life.' },
    rarely: { name: 'Exercise: Rarely',      impact: -2, description: 'Infrequent exercise leaves you at higher risk for chronic diseases.' },
    never:  { name: 'Exercise: Never',       impact: -4, description: 'Sedentary lifestyles are strongly associated with early mortality.' },
  },
  diet: {
    excellent: { name: 'Diet: Excellent',  impact:  3, description: 'A whole-foods diet rich in vegetables and lean protein strongly supports longevity.' },
    good:      { name: 'Diet: Good',       impact:  1, description: 'A balanced diet helps maintain healthy weight and reduces disease risk.' },
    average:   { name: 'Diet: Average',    impact:  0, description: 'An average diet has a neutral effect on life expectancy.' },
    poor:      { name: 'Diet: Poor',       impact: -2, description: 'Processed foods increase inflammation and risk of chronic disease.' },
    very_poor: { name: 'Diet: Very poor',  impact: -4, description: 'A consistently poor diet significantly raises risk of heart disease, diabetes, and cancer.' },
  },
  bmi: {
    underweight: { name: 'BMI: Underweight', impact: -1, description: 'Being underweight can signal nutritional deficiencies or underlying illness.' },
    normal:      { name: 'BMI: Normal',      impact:  2, description: 'A healthy weight range is associated with lower risk of most chronic diseases.' },
    overweight:  { name: 'BMI: Overweight',  impact: -1, description: 'Excess weight moderately raises risk of cardiovascular disease and diabetes.' },
    obese:       { name: 'BMI: Obese',       impact: -3, description: 'Obesity is a major risk factor for heart disease, diabetes, and several cancers.' },
  },
  alcohol: {
    none:       { name: 'Alcohol: None',       impact:  1, description: 'Not drinking eliminates alcohol-related health risks entirely.' },
    moderate:   { name: 'Alcohol: Moderate',   impact:  0, description: 'Moderate alcohol consumption has a largely neutral effect on longevity.' },
    heavy:      { name: 'Alcohol: Heavy',      impact: -4, description: 'Heavy drinking damages the liver, heart, and brain, shortening lifespan.' },
    very_heavy: { name: 'Alcohol: Very heavy', impact: -7, description: 'Very heavy alcohol use is one of the most serious lifestyle threats to longevity.' },
  },
  sleep: {
    lt5:    { name: 'Sleep: <5 hrs/night',   impact: -3, description: 'Chronic sleep deprivation raises risk of heart disease, obesity, and cognitive decline.' },
    '5_6':  { name: 'Sleep: 5–6 hrs/night',  impact: -1, description: 'Slightly short sleep is associated with modestly increased health risks.' },
    '7_8':  { name: 'Sleep: 7–8 hrs/night',  impact:  2, description: 'Optimal sleep duration is strongly linked to better health outcomes and longevity.' },
    '9plus':{ name: 'Sleep: 9+ hrs/night',   impact: -1, description: 'Consistently long sleep may indicate underlying health issues or reduce activity.' },
  },
  stress: {
    low:       { name: 'Stress: Low',       impact:  2, description: 'Low chronic stress reduces inflammation and supports immune function.' },
    moderate:  { name: 'Stress: Moderate',  impact:  0, description: 'Moderate stress has a largely neutral effect when well-managed.' },
    high:      { name: 'Stress: High',      impact: -2, description: 'High chronic stress accelerates cellular aging and raises disease risk.' },
    very_high: { name: 'Stress: Very high', impact: -4, description: 'Persistent extreme stress is linked to significantly shorter telomeres and earlier mortality.' },
  },
  social: {
    strong:   { name: 'Social: Strong connections',   impact:  2, description: 'Strong social ties are one of the most reliable predictors of long life.' },
    moderate: { name: 'Social: Moderate connections', impact:  1, description: 'Moderate social engagement provides meaningful protection against isolation.' },
    weak:     { name: 'Social: Weak connections',     impact: -1, description: 'Limited social ties are associated with higher inflammation and mortality risk.' },
    isolated: { name: 'Social: Isolated',             impact: -3, description: 'Social isolation is as dangerous as smoking 15 cigarettes a day for longevity.' },
  },
  checkups: {
    yes:       { name: 'Medical checkups: Annual',     impact:  2, description: 'Regular checkups enable early detection and prevention of serious conditions.' },
    sometimes: { name: 'Medical checkups: Sometimes',  impact:  1, description: 'Occasional checkups provide some protection through early detection.' },
    no:        { name: 'Medical checkups: None',       impact: -1, description: 'Skipping checkups increases the chance of detecting diseases too late.' },
  },
  family_longevity: {
    many: { name: 'Family longevity: Many 90+', impact:  2, description: 'Having many long-lived relatives suggests favorable genetic predispositions.' },
    some: { name: 'Family longevity: Some 90+', impact:  1, description: 'Some long-lived relatives indicate a modest genetic advantage.' },
    few:  { name: 'Family longevity: Few 90+',  impact:  0, description: 'Few long-lived relatives suggests an average genetic baseline.' },
    none: { name: 'Family longevity: None 90+', impact: -1, description: 'No long-lived relatives may indicate less favorable genetic factors for longevity.' },
  },
}

function buildRecommendations(answers) {
  const recs = []

  if (answers.smoking === 'current')
    recs.push('Quit smoking — this single change can add up to 10 years to your life. Talk to your doctor about cessation programs, nicotine replacement therapy, or prescription medications.')
  if (answers.exercise === 'rarely' || answers.exercise === 'never')
    recs.push('Aim for at least 150 minutes of moderate aerobic activity per week. Start with 20-minute walks and build gradually — consistency matters more than intensity.')
  if (answers.diet === 'poor' || answers.diet === 'very_poor')
    recs.push('Shift toward a whole-foods diet: more vegetables, fruits, legumes, whole grains, and lean proteins. Reduce ultra-processed foods, refined sugars, and sodium.')
  if (answers.bmi === 'overweight' || answers.bmi === 'obese')
    recs.push('Work toward a healthy BMI through sustainable diet changes and regular movement. Even a 5–10% weight reduction significantly improves metabolic health.')
  if (answers.bmi === 'underweight')
    recs.push('Consult a healthcare provider about reaching a healthy weight through nutrient-dense foods. Underweight can signal deficiencies or underlying conditions.')
  if (answers.alcohol === 'heavy' || answers.alcohol === 'very_heavy')
    recs.push('Reduce alcohol consumption to no more than 1–2 drinks per day, or consider abstaining. Seek support if reducing feels difficult — resources like AA or SMART Recovery can help.')
  if (answers.sleep === 'lt5')
    recs.push('Prioritize getting 7–8 hours of sleep. Improve sleep hygiene: consistent bedtime, dark cool room, no screens 1 hour before bed, and avoid caffeine after 2pm.')
  if (answers.sleep === '5_6')
    recs.push('Try to extend your sleep to 7–8 hours. Even 30 extra minutes can meaningfully improve your health outcomes over time.')
  if (answers.stress === 'high' || answers.stress === 'very_high')
    recs.push('Actively manage stress through proven techniques: mindfulness meditation, regular exercise, therapy or counseling, and time in nature. Chronic stress is a silent life shortener.')
  if (answers.social === 'weak' || answers.social === 'isolated')
    recs.push('Invest in social connections — they\'re as important as diet and exercise. Join a club, volunteer, call a friend weekly, or consider therapy to address barriers to connection.')
  if (answers.checkups === 'no')
    recs.push('Schedule annual physical exams and age-appropriate screenings (blood pressure, cholesterol, cancer screenings). Early detection saves lives.')

  const positives = []
  if (answers.smoking === 'never') positives.push('never smoking')
  if (answers.exercise === 'daily' || answers.exercise === '3_5x') positives.push('consistent exercise')
  if (answers.diet === 'excellent' || answers.diet === 'good') positives.push('a healthy diet')
  if (answers.sleep === '7_8') positives.push('optimal sleep')
  if (answers.social === 'strong') positives.push('strong social connections')

  if (positives.length > 0)
    recs.push(`Keep up your excellent habits — ${positives.join(', ')} are pillars of a long, healthy life.`)

  if (recs.length === 0)
    recs.push("You're already doing great across all lifestyle factors! Focus on maintaining consistency and scheduling annual checkups to stay on top of your health.")

  return recs
}

function buildSummary(estimatedAge, totalAdjustment) {
  let quality, outlook
  if (totalAdjustment >= 6) {
    quality = 'exceptional'
    outlook = "Your lifestyle choices are outstanding — you're actively maximizing your healthspan."
  } else if (totalAdjustment >= 3) {
    quality = 'very healthy'
    outlook = "You're making strong choices that meaningfully extend your life expectancy."
  } else if (totalAdjustment >= 0) {
    quality = 'healthy'
    outlook = 'Your lifestyle is broadly positive with some room for improvement.'
  } else if (totalAdjustment >= -4) {
    quality = 'mixed'
    outlook = 'You have a balanced lifestyle, but some key areas are holding back your longevity potential.'
  } else if (totalAdjustment >= -8) {
    quality = 'concerning'
    outlook = "Several lifestyle factors are significantly impacting your projected lifespan. The good news: most are changeable."
  } else {
    quality = 'high-risk'
    outlook = 'Multiple high-risk factors are substantially reducing your projected life expectancy. Meaningful changes now could add years to your life.'
  }

  const diff = estimatedAge - BASE_AGE
  const comparison =
    diff > 0 ? `${diff.toFixed(1)} years above the US average` :
    diff < 0 ? `${Math.abs(diff).toFixed(1)} years below the US average` :
    'exactly at the US average'

  return (
    `Based on your lifestyle assessment, your estimated life expectancy is ${estimatedAge.toFixed(1)} years — ` +
    `${comparison} of ${BASE_AGE} years. ` +
    `Overall, your lifestyle profile is ${quality}. ${outlook}`
  )
}

export function estimateLifeExpectancy(answers) {
  const fieldOrder = ['smoking', 'exercise', 'diet', 'bmi', 'alcohol', 'sleep', 'stress', 'social', 'checkups', 'family_longevity']
  let totalAdjustment = 0
  const factors = []

  for (const field of fieldOrder) {
    const entry = SCORING[field][answers[field]]
    factors.push({ name: entry.name, impact: entry.impact, description: entry.description })
    totalAdjustment += entry.impact
  }

  const estimatedAge = Math.round((BASE_AGE + totalAdjustment) * 10) / 10

  return {
    estimated_age: estimatedAge,
    base_age: BASE_AGE,
    factors,
    summary: buildSummary(estimatedAge, totalAdjustment),
    recommendations: buildRecommendations(answers),
  }
}
