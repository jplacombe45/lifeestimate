import { useEffect } from 'react'
import { getTranslations } from '../lib/i18n.js'

const REFERENCES = [
  {
    id: 'baseline',
    icon: '🌍',
    category: 'Baseline Life Expectancy Data',
    papers: [
      {
        authors: 'World Health Organization.',
        title: 'Global Health Observatory — Life Expectancy and Healthy Life Expectancy.',
        journal: 'WHO',
        year: 2024,
        url: 'https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy',
      },
      {
        authors: 'World Bank.',
        title: 'Life Expectancy at Birth (SP.DYN.LE00.IN) — World Development Indicators.',
        journal: 'World Bank Open Data',
        year: 2023,
        url: 'https://data.worldbank.org/indicator/SP.DYN.LE00.IN',
      },
    ],
  },
  {
    id: 'smoking',
    icon: '🚬',
    category: 'Smoking & Tobacco',
    papers: [
      {
        authors: 'Doll R, Peto R, Boreham J, Sutherland I.',
        title: 'Mortality in relation to smoking: 50 years\' observations on male British doctors.',
        journal: 'BMJ',
        year: 2004,
        volume: '328:1519',
        url: 'https://doi.org/10.1136/bmj.38142.554479.AE',
      },
      {
        authors: 'US Department of Health and Human Services.',
        title: 'The Health Consequences of Smoking — 50 Years of Progress: A Report of the Surgeon General.',
        journal: 'US DHHS / CDC',
        year: 2014,
        url: 'https://www.cdc.gov/tobacco/data_statistics/sgr/50th-anniversary/index.htm',
      },
    ],
  },
  {
    id: 'exercise',
    icon: '🏃',
    category: 'Physical Activity & Exercise',
    papers: [
      {
        authors: 'Lee IM, Shiroma EJ, Lobelo F, Puska P, Blair SN, Katzmarzyk PT.',
        title: 'Effect of physical inactivity on major non-communicable diseases worldwide: an analysis of burden of disease and life expectancy.',
        journal: 'The Lancet',
        year: 2012,
        volume: '380(9838):219–229',
        url: 'https://doi.org/10.1016/S0140-6736(12)61031-9',
      },
      {
        authors: 'Wen CP, Wai JP, Tsai MK, et al.',
        title: 'Minimum amount of physical activity for reduced mortality and extended life expectancy: a prospective cohort study.',
        journal: 'The Lancet',
        year: 2011,
        volume: '378(9798):1244–1253',
        url: 'https://doi.org/10.1016/S0140-6736(11)60749-6',
      },
      {
        authors: 'Moore SC, Patel AV, Matthews CE, et al.',
        title: 'Leisure Time Physical Activity of Moderate to Vigorous Intensity and Mortality: A Large Pooled Cohort Analysis.',
        journal: 'PLOS Medicine',
        year: 2012,
        volume: '9(11):e1001335',
        url: 'https://doi.org/10.1371/journal.pmed.1001335',
      },
    ],
  },
  {
    id: 'diet',
    icon: '🥗',
    category: 'Diet & Nutrition',
    papers: [
      {
        authors: 'GBD 2017 Diet Collaborators.',
        title: 'Health effects of dietary risks in 195 countries, 1990–2017: a systematic analysis for the Global Burden of Disease Study 2017.',
        journal: 'The Lancet',
        year: 2019,
        volume: '393(10184):1958–1972',
        url: 'https://doi.org/10.1016/S0140-6736(19)30041-8',
      },
      {
        authors: 'Sofi F, Cesari F, Abbate R, Gensini GF, Casini A.',
        title: 'Adherence to Mediterranean diet and health status: meta-analysis.',
        journal: 'BMJ',
        year: 2008,
        volume: '337:a1344',
        url: 'https://doi.org/10.1136/bmj.a1344',
      },
    ],
  },
  {
    id: 'bmi',
    icon: '⚖️',
    category: 'Body Weight & BMI',
    papers: [
      {
        authors: 'Global BMI Mortality Collaboration.',
        title: 'Body-mass index and all-cause mortality: individual-participant-data meta-analysis of 239 prospective studies in four continents.',
        journal: 'The Lancet',
        year: 2016,
        volume: '388(10046):776–786',
        url: 'https://doi.org/10.1016/S0140-6736(16)30175-1',
      },
      {
        authors: 'Berrington de Gonzalez A, Hartge P, Cerhan JR, et al.',
        title: 'Body-Mass Index and Mortality among 1.46 Million White Adults.',
        journal: 'New England Journal of Medicine',
        year: 2010,
        volume: '363:2211–2219',
        url: 'https://doi.org/10.1056/NEJMoa1000367',
      },
    ],
  },
  {
    id: 'alcohol',
    icon: '🍷',
    category: 'Alcohol Consumption',
    papers: [
      {
        authors: 'GBD 2016 Alcohol Collaborators.',
        title: 'Alcohol use and burden for 195 countries and territories, 1990–2016: a systematic analysis for the Global Burden of Disease Study 2016.',
        journal: 'The Lancet',
        year: 2018,
        volume: '392(10152):1015–1035',
        url: 'https://doi.org/10.1016/S0140-6736(18)31310-2',
      },
      {
        authors: 'Wood AM, Kaptoge S, Butterworth AS, et al.',
        title: 'Risk thresholds for alcohol consumption: combined analysis of individual-participant data for 599,912 current drinkers in 83 prospective studies.',
        journal: 'The Lancet',
        year: 2018,
        volume: '391(10129):1513–1523',
        url: 'https://doi.org/10.1016/S0140-6736(18)30134-X',
      },
    ],
  },
  {
    id: 'sleep',
    icon: '😴',
    category: 'Sleep Duration',
    papers: [
      {
        authors: 'Cappuccio FP, D\'Elia L, Strazzullo P, Miller MA.',
        title: 'Sleep Duration and All-Cause Mortality: A Systematic Review and Meta-Analysis of Prospective Studies.',
        journal: 'Sleep',
        year: 2010,
        volume: '33(5):585–592',
        url: 'https://doi.org/10.1093/sleep/33.5.585',
      },
      {
        authors: 'Yin J, Jin X, Shan Z, et al.',
        title: 'Relationship of Sleep Duration With All-Cause Mortality and Cardiovascular Events: A Systematic Review and Dose-Response Meta-Analysis of Prospective Cohort Studies.',
        journal: 'Journal of the American Heart Association',
        year: 2017,
        volume: '6(9):e005947',
        url: 'https://doi.org/10.1161/JAHA.117.005947',
      },
    ],
  },
  {
    id: 'stress',
    icon: '🧘',
    category: 'Chronic Stress',
    papers: [
      {
        authors: 'Epel ES, Blackburn EH, Lin J, et al.',
        title: 'Accelerated telomere shortening in response to life stress.',
        journal: 'Proceedings of the National Academy of Sciences',
        year: 2004,
        volume: '101(49):17312–17315',
        url: 'https://doi.org/10.1073/pnas.0407162101',
      },
      {
        authors: 'Kivimäki M, Nyberg ST, Batty GD, et al.',
        title: 'Job strain as a risk factor for coronary heart disease: a collaborative meta-analysis of individual participant data.',
        journal: 'The Lancet',
        year: 2012,
        volume: '380(9852):1491–1497',
        url: 'https://doi.org/10.1016/S0140-6736(12)60994-5',
      },
    ],
  },
  {
    id: 'social',
    icon: '👥',
    category: 'Social Connections',
    papers: [
      {
        authors: 'Holt-Lunstad J, Smith TB, Layton JB.',
        title: 'Social Relationships and Mortality Risk: A Meta-analytic Review.',
        journal: 'PLOS Medicine',
        year: 2010,
        volume: '7(7):e1000316',
        url: 'https://doi.org/10.1371/journal.pmed.1000316',
      },
      {
        authors: 'Holt-Lunstad J, Smith TB, Baker M, Harris T, Stephenson D.',
        title: 'Loneliness and Social Isolation as Risk Factors for Mortality: A Meta-Analytic Review.',
        journal: 'Perspectives on Psychological Science',
        year: 2015,
        volume: '10(2):227–237',
        url: 'https://doi.org/10.1177/1745691614568352',
      },
    ],
  },
  {
    id: 'checkups',
    icon: '🩺',
    category: 'Preventive Medical Care',
    papers: [
      {
        authors: 'US Preventive Services Task Force.',
        title: 'Published Recommendations — Evidence-based recommendations for preventive care services.',
        journal: 'USPSTF',
        year: 2024,
        url: 'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation-topics/uspstf-and-b-recommendations',
      },
      {
        authors: 'Krogsbøll LT, Jørgensen KJ, Gøtzsche PC.',
        title: 'General health checks in adults for reducing morbidity and mortality from disease.',
        journal: 'Cochrane Database of Systematic Reviews',
        year: 2019,
        url: 'https://doi.org/10.1002/14651858.CD009009.pub3',
      },
    ],
  },
  {
    id: 'genetics',
    icon: '🧬',
    category: 'Family Longevity & Genetics',
    papers: [
      {
        authors: 'Hjelmborg JV, Iachine I, Skytthe A, et al.',
        title: 'Genetic influence on human lifespan and longevity.',
        journal: 'Human Genetics',
        year: 2006,
        volume: '119(3):312–321',
        url: 'https://doi.org/10.1007/s00439-006-0144-y',
      },
      {
        authors: 'Sebastiani P, Perls TT.',
        title: 'The Genetics of Extreme Longevity: Lessons from the New England Centenarian Study.',
        journal: 'Frontiers in Genetics',
        year: 2012,
        volume: '3:277',
        url: 'https://doi.org/10.3389/fgene.2012.00277',
      },
    ],
  },
]

export default function ReferencesPage({ onBack, lang = 'en' }) {
  const t = getTranslations(lang)
  const ui = t.ui

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="refs-container">
      <button className="refs-back-btn" onClick={onBack}>
        {ui.refsBackBtn}
      </button>

      <div className="refs-hero">
        <h1 className="refs-title">{ui.refsTitle}</h1>
        <p className="refs-subtitle">{ui.refsSubtitle}</p>
      </div>

      {REFERENCES.map((section) => (
        <section key={section.id} className="refs-section">
          <h2 className="refs-section-title">
            <span>{section.icon}</span> {section.category}
          </h2>
          <div className="refs-list">
            {section.papers.map((paper, i) => (
              <div key={i} className="ref-card">
                <a
                  className="ref-title"
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {paper.title}
                </a>
                <p className="ref-meta">
                  {paper.authors}
                  {' '}
                  <em>{paper.journal}</em>
                  {paper.volume ? `, ${paper.volume}` : ''}.
                  {' '}{paper.year}.
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="refs-method-note">
        <p>{ui.refsMethodNote}</p>
      </div>
    </div>
  )
}
