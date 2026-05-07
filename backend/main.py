from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Life Expectancy Estimator API")

import os

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN] if ALLOWED_ORIGIN != "*" else ["*"],
    allow_credentials=ALLOWED_ORIGIN != "*",
    allow_methods=["*"],
    allow_headers=["*"],
)


class LifestyleAnswers(BaseModel):
    smoking: str           # "never" | "former" | "current"
    exercise: str          # "daily" | "3_5x" | "1_2x" | "rarely" | "never"
    diet: str              # "excellent" | "good" | "average" | "poor" | "very_poor"
    bmi: str               # "underweight" | "normal" | "overweight" | "obese"
    alcohol: str           # "none" | "moderate" | "heavy" | "very_heavy"
    sleep: str             # "lt5" | "5_6" | "7_8" | "9plus"
    stress: str            # "low" | "moderate" | "high" | "very_high"
    social: str            # "strong" | "moderate" | "weak" | "isolated"
    checkups: str          # "yes" | "sometimes" | "no"
    family_longevity: str  # "many" | "some" | "few" | "none"


class Factor(BaseModel):
    name: str
    impact: float
    description: str


class EstimateResponse(BaseModel):
    estimated_age: float
    base_age: float
    factors: list[Factor]
    summary: str
    recommendations: list[str]


SCORING = {
    "smoking": {
        "never":   ("Never smoked", +3, "Non-smokers significantly reduce their risk of cancer, heart disease, and stroke."),
        "former":  ("Former smoker", +1, "Quitting smoking partially reverses health risks over time."),
        "current": ("Current smoker", -7, "Smoking is the leading preventable cause of death, dramatically shortening lifespan."),
    },
    "exercise": {
        "daily":  ("Exercise: Daily", +4, "Daily physical activity is one of the strongest predictors of longevity."),
        "3_5x":   ("Exercise: 3–5x/week", +3, "Regular exercise significantly reduces cardiovascular and metabolic disease risk."),
        "1_2x":   ("Exercise: 1–2x/week", +1, "Some exercise is better than none — even light activity extends life."),
        "rarely": ("Exercise: Rarely", -2, "Infrequent exercise leaves you at higher risk for chronic diseases."),
        "never":  ("Exercise: Never", -4, "Sedentary lifestyles are strongly associated with early mortality."),
    },
    "diet": {
        "excellent": ("Diet: Excellent", +3, "A whole-foods diet rich in vegetables and lean protein strongly supports longevity."),
        "good":      ("Diet: Good", +1, "A balanced diet helps maintain healthy weight and reduces disease risk."),
        "average":   ("Diet: Average", 0, "An average diet has a neutral effect on life expectancy."),
        "poor":      ("Diet: Poor", -2, "Processed foods increase inflammation and risk of chronic disease."),
        "very_poor": ("Diet: Very poor", -4, "A consistently poor diet significantly raises risk of heart disease, diabetes, and cancer."),
    },
    "bmi": {
        "underweight": ("BMI: Underweight", -1, "Being underweight can signal nutritional deficiencies or underlying illness."),
        "normal":      ("BMI: Normal", +2, "A healthy weight range is associated with lower risk of most chronic diseases."),
        "overweight":  ("BMI: Overweight", -1, "Excess weight moderately raises risk of cardiovascular disease and diabetes."),
        "obese":       ("BMI: Obese", -3, "Obesity is a major risk factor for heart disease, diabetes, and several cancers."),
    },
    "alcohol": {
        "none":       ("Alcohol: None", +1, "Not drinking eliminates alcohol-related health risks entirely."),
        "moderate":   ("Alcohol: Moderate", 0, "Moderate alcohol consumption has a largely neutral effect on longevity."),
        "heavy":      ("Alcohol: Heavy", -4, "Heavy drinking damages the liver, heart, and brain, shortening lifespan."),
        "very_heavy": ("Alcohol: Very heavy", -7, "Very heavy alcohol use is one of the most serious lifestyle threats to longevity."),
    },
    "sleep": {
        "lt5":   ("Sleep: <5 hrs/night", -3, "Chronic sleep deprivation raises risk of heart disease, obesity, and cognitive decline."),
        "5_6":   ("Sleep: 5–6 hrs/night", -1, "Slightly short sleep is associated with modestly increased health risks."),
        "7_8":   ("Sleep: 7–8 hrs/night", +2, "Optimal sleep duration is strongly linked to better health outcomes and longevity."),
        "9plus": ("Sleep: 9+ hrs/night", -1, "Consistently long sleep may indicate underlying health issues or reduce activity."),
    },
    "stress": {
        "low":       ("Stress: Low", +2, "Low chronic stress reduces inflammation and supports immune function."),
        "moderate":  ("Stress: Moderate", 0, "Moderate stress has a largely neutral effect when well-managed."),
        "high":      ("Stress: High", -2, "High chronic stress accelerates cellular aging and raises disease risk."),
        "very_high": ("Stress: Very high", -4, "Persistent extreme stress is linked to significantly shorter telomeres and earlier mortality."),
    },
    "social": {
        "strong":   ("Social: Strong connections", +2, "Strong social ties are one of the most reliable predictors of long life."),
        "moderate": ("Social: Moderate connections", +1, "Moderate social engagement provides meaningful protection against isolation."),
        "weak":     ("Social: Weak connections", -1, "Limited social ties are associated with higher inflammation and mortality risk."),
        "isolated": ("Social: Isolated", -3, "Social isolation is as dangerous as smoking 15 cigarettes a day for longevity."),
    },
    "checkups": {
        "yes":       ("Medical checkups: Annual", +2, "Regular checkups enable early detection and prevention of serious conditions."),
        "sometimes": ("Medical checkups: Sometimes", +1, "Occasional checkups provide some protection through early detection."),
        "no":        ("Medical checkups: None", -1, "Skipping checkups increases the chance of detecting diseases too late."),
    },
    "family_longevity": {
        "many": ("Family longevity: Many 90+", +2, "Having many long-lived relatives suggests favorable genetic predispositions."),
        "some": ("Family longevity: Some 90+", +1, "Some long-lived relatives indicate a modest genetic advantage."),
        "few":  ("Family longevity: Few 90+", 0, "Few long-lived relatives suggests an average genetic baseline."),
        "none": ("Family longevity: None 90+", -1, "No long-lived relatives may indicate less favorable genetic factors for longevity."),
    },
}

BASE_AGE = 79.0


def build_recommendations(answers: LifestyleAnswers) -> list[str]:
    recs = []

    if answers.smoking == "current":
        recs.append("Quit smoking — this single change can add up to 10 years to your life. Talk to your doctor about cessation programs, nicotine replacement therapy, or prescription medications.")
    if answers.exercise in ("rarely", "never"):
        recs.append("Aim for at least 150 minutes of moderate aerobic activity per week. Start with 20-minute walks and build gradually — consistency matters more than intensity.")
    if answers.diet in ("poor", "very_poor"):
        recs.append("Shift toward a whole-foods diet: more vegetables, fruits, legumes, whole grains, and lean proteins. Reduce ultra-processed foods, refined sugars, and sodium.")
    if answers.bmi in ("overweight", "obese"):
        recs.append("Work toward a healthy BMI through sustainable diet changes and regular movement. Even a 5–10% weight reduction significantly improves metabolic health.")
    if answers.bmi == "underweight":
        recs.append("Consult a healthcare provider about reaching a healthy weight through nutrient-dense foods. Underweight can signal deficiencies or underlying conditions.")
    if answers.alcohol in ("heavy", "very_heavy"):
        recs.append("Reduce alcohol consumption to no more than 1–2 drinks per day, or consider abstaining. Seek support if reducing feels difficult — resources like AA or SMART Recovery can help.")
    if answers.sleep == "lt5":
        recs.append("Prioritize getting 7–8 hours of sleep. Improve sleep hygiene: consistent bedtime, dark cool room, no screens 1 hour before bed, and avoid caffeine after 2pm.")
    if answers.sleep == "5_6":
        recs.append("Try to extend your sleep to 7–8 hours. Even 30 extra minutes can meaningfully improve your health outcomes over time.")
    if answers.stress in ("high", "very_high"):
        recs.append("Actively manage stress through proven techniques: mindfulness meditation, regular exercise, therapy or counseling, and time in nature. Chronic stress is a silent life shortener.")
    if answers.social in ("weak", "isolated"):
        recs.append("Invest in social connections — they're as important as diet and exercise. Join a club, volunteer, call a friend weekly, or consider therapy to address barriers to connection.")
    if answers.checkups == "no":
        recs.append("Schedule annual physical exams and age-appropriate screenings (blood pressure, cholesterol, cancer screenings). Early detection saves lives.")

    # Positive reinforcement for good habits
    positive = []
    if answers.smoking == "never":
        positive.append("never smoking")
    if answers.exercise in ("daily", "3_5x"):
        positive.append("consistent exercise")
    if answers.diet in ("excellent", "good"):
        positive.append("a healthy diet")
    if answers.sleep == "7_8":
        positive.append("optimal sleep")
    if answers.social == "strong":
        positive.append("strong social connections")

    if positive:
        recs.append(f"Keep up your excellent habits — {', '.join(positive)} are pillars of a long, healthy life.")

    if not recs:
        recs.append("You're already doing great across all lifestyle factors! Focus on maintaining consistency and scheduling annual checkups to stay on top of your health.")

    return recs


def build_summary(estimated_age: float, total_adjustment: float, answers: LifestyleAnswers) -> str:
    if total_adjustment >= 6:
        quality = "exceptional"
        outlook = "Your lifestyle choices are outstanding — you're actively maximizing your healthspan."
    elif total_adjustment >= 3:
        quality = "very healthy"
        outlook = "You're making strong choices that meaningfully extend your life expectancy."
    elif total_adjustment >= 0:
        quality = "healthy"
        outlook = "Your lifestyle is broadly positive with some room for improvement."
    elif total_adjustment >= -4:
        quality = "mixed"
        outlook = "You have a balanced lifestyle, but some key areas are holding back your longevity potential."
    elif total_adjustment >= -8:
        quality = "concerning"
        outlook = "Several lifestyle factors are significantly impacting your projected lifespan. The good news: most are changeable."
    else:
        quality = "high-risk"
        outlook = "Multiple high-risk factors are substantially reducing your projected life expectancy. Meaningful changes now could add years to your life."

    age_vs_avg = estimated_age - BASE_AGE
    if age_vs_avg > 0:
        comparison = f"{age_vs_avg:.1f} years above the US average"
    elif age_vs_avg < 0:
        comparison = f"{abs(age_vs_avg):.1f} years below the US average"
    else:
        comparison = "exactly at the US average"

    return (
        f"Based on your lifestyle assessment, your estimated life expectancy is {estimated_age:.1f} years — "
        f"{comparison} of {BASE_AGE:.0f} years. "
        f"Overall, your lifestyle profile is {quality}. {outlook}"
    )


@app.post("/api/estimate", response_model=EstimateResponse)
def estimate_life_expectancy(answers: LifestyleAnswers):
    factors = []
    total_adjustment = 0.0

    field_order = [
        ("smoking", answers.smoking),
        ("exercise", answers.exercise),
        ("diet", answers.diet),
        ("bmi", answers.bmi),
        ("alcohol", answers.alcohol),
        ("sleep", answers.sleep),
        ("stress", answers.stress),
        ("social", answers.social),
        ("checkups", answers.checkups),
        ("family_longevity", answers.family_longevity),
    ]

    for field, value in field_order:
        name, impact, description = SCORING[field][value]
        factors.append(Factor(name=name, impact=impact, description=description))
        total_adjustment += impact

    estimated_age = round(BASE_AGE + total_adjustment, 1)

    summary = build_summary(estimated_age, total_adjustment, answers)
    recommendations = build_recommendations(answers)

    return EstimateResponse(
        estimated_age=estimated_age,
        base_age=BASE_AGE,
        factors=factors,
        summary=summary,
        recommendations=recommendations,
    )


@app.get("/health")
def health():
    return {"status": "ok"}
