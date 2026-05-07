# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

**Backend** (FastAPI on port 8000):
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend** (Vite dev server on port 5173):
```bash
cd frontend
npm install
npm run dev
```

**Production build:**
```bash
cd frontend && npm run build   # outputs to frontend/dist/
```

The Vite dev server proxies `/api/*` requests to `http://localhost:8000`, so both services must run simultaneously during development.

## Architecture

Single-page app with no client-side router. State machine in `App.jsx` drives three views: `form → loading → result` (or back to `form` on error/reset).

### Data flow
1. User fills out `QuestionForm` → `onSubmit(answers)` fires with a flat object `{ smoking, exercise, diet, bmi, alcohol, sleep, stress, social, checkups, family_longevity }`
2. `App.jsx` POSTs to `/api/estimate`
3. FastAPI returns `EstimateResponse` with `estimated_age`, `base_age`, `factors[]`, `summary`, `recommendations[]`
4. `ResultReport` renders the result; "Start Over" resets state to `form`

### Scoring logic (backend)
All logic lives in `backend/main.py`. Base age is **79.0** (US average). Each of the 10 questions maps to a `SCORING` dict entry `{ value: (display_name, float_adjustment, description) }`. Total adjustment is summed and added to base age. `build_summary()` buckets the total adjustment into 6 tiers; `build_recommendations()` generates targeted advice per suboptimal answer plus positive reinforcement.

To add a new question: add a field to `LifestyleAnswers`, add an entry to `SCORING`, add it to `field_order` in `estimate_life_expectancy()`, add to `build_recommendations()` if needed — then add the question card to the `QUESTIONS` array in `QuestionForm.jsx`.

### Frontend conventions
- Plain JS/JSX — no TypeScript
- No CSS framework — all styles in `frontend/src/index.css` using CSS custom properties (variables defined on `:root`)
- Options rendered as `<button type="button">` pill elements with `aria-pressed`, not `<input type="radio">`
- Validation: `QuestionForm` tracks unanswered questions locally; on failed submit it sets `validationError` state and scrolls to the first unanswered card via `document.getElementById`

### API contract
`POST /api/estimate` — request body matches `LifestyleAnswers` Pydantic model (all fields required strings). Response: `{ estimated_age, base_age, factors: [{name, impact, description}], summary, recommendations[] }`. Health check: `GET /health`.

CORS is locked to `localhost:5173` — update `allow_origins` in `main.py` for any other origin.
