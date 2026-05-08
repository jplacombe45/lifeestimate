# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

```bash
cd frontend
npm install
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # Production build → frontend/dist/
npm run preview    # Serve the production build locally
npm run deploy     # Build + deploy to Cloudflare Workers
```

No backend — all logic runs in the browser. Deployed at `https://lifeestimate.jplmail.workers.dev/`. Cloudflare config is in `frontend/wrangler.toml`.

## Architecture

Pure client-side React app. No router. `App.jsx` drives a two-view state machine: `form → result` (reset sends back to `form`).

### Data flow

1. User fills out `QuestionForm` → `onSubmit(answers)` fires with `{ smoking, exercise, diet, bmi, alcohol, sleep, stress, social, checkups, family_longevity }`
2. `App.jsx` calls `estimateLifeExpectancy(answers, countryInfo)` from `src/lib/estimator.js` — no network request
3. Returns `{ estimated_age, base_age, country_name, factors[], summary, recommendations[] }`
4. `ResultReport` renders the result

Country baseline is auto-detected once on mount via `detectCountry()` (calls `ipapi.co` with a 3 s timeout; falls back to US).

### Scoring logic (`src/lib/estimator.js`)

All estimation lives here. 66 countries have hardcoded WHO/World Bank 2023 baseline life expectancies. Each of the 10 question answers maps to a `SCORING` entry `{ value: [display_name, float_adjustment, description] }`. Total adjustment is summed and added to the country baseline. `buildSummary()` buckets the total into 6 tiers; `buildRecommendations()` generates targeted advice per suboptimal answer.

To add a question: add an entry to `SCORING`, update the calculation loop in `estimateLifeExpectancy()`, add to `buildRecommendations()` if needed, then add the question card to the `QUESTIONS` array in `QuestionForm.jsx`.

### Frontend conventions

- Plain JS/JSX — no TypeScript
- No CSS framework — all styles in `src/index.css` using CSS custom properties (`:root` variables)
- Options are `<button type="button">` pill elements with `aria-pressed`, not `<input type="radio">`
- Validation: `QuestionForm` tracks unanswered questions; on failed submit it sets `validationError` and scrolls to the first unanswered card via `document.getElementById`

## Deployment

Deployed manually to Cloudflare Workers. From `frontend/`:

```bash
npx wrangler login   # one-time auth
npm run deploy       # build + push to Cloudflare
```

`wrangler.toml` configures the worker name (`lifeestimate`) and sets `not_found_handling = "single-page-application"` so all routes correctly serve `index.html`.
