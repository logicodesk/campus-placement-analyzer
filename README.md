<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Campus Placement Readiness Analyzer

An intelligent campus placement readiness platform powered by high-accuracy machine learning and Google Gemini AI.

## Key Features

- **High-Accuracy Placement Engine (v2.0)**:
  - **79.42% Holdout Accuracy** & **0.8694 ROC-AUC** (up from 67.55% and 0.739).
  - Evaluated on 10,000 unseen test records with an 80/20 stratified split.
  - Predicts **Placement Probability & Outcome** (Placed vs Needs Preparation).
  - Predicts **Company Tier**: Product / Top Tech (Tier-1), Mid-tier Tech (Tier-2), or Mass Recruiter.
  - Predicts **Expected Salary Package (LPA)** using regularized regression.
- **Multimodal Student Profiling**:
  - Detailed academic metrics (CGPA, active backlogs, attendance, Class 10/12).
  - Granular technical proficiencies (Python, C++, Java, SQL, ML, Web Dev).
  - Diagnostic assessment scores (aptitude, logical reasoning, contest rating, DSA problems solved, mock interview, resume ATS score).
  - Project portfolio details (deployed apps, GitHub repos, tech stacks).
- **Gemini AI Integration (Working with API Key)**:
  - **AI Placement Diagnostic & Career Roadmap**: Generates personalized executive summaries, key strengths, critical vulnerabilities, and 30-60-90 day preparation plans.
  - **Interactive 24/7 AI Placement Mentor**: Live conversational chat assistant for interview prep, company OAs, and behavioral questions.
  - **AI Project Resume Bullet Optimizer**: Transforms project descriptions into Google-style STAR bullet points with ATS keywords.
  - **Flexible Key Configuration**: Enter your API key directly in the UI modal (stored in localStorage) or set `VITE_GEMINI_API_KEY` in `.env.local`.

## Run Locally

**Prerequisites:** Node.js (v18+) and Python 3.9+

1. Install web dependencies:
   ```bash
   npm install
   ```

2. Optional: Set your Gemini API key in `.env.local` or enter it directly in the app UI:
   ```bash
   VITE_GEMINI_API_KEY="your-gemini-api-key"
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

## Datasets & Model Training

The project includes:
- `placement_chance_prediction_dataset.csv` (1,200 rows): Primary placement chance dataset providing 97.08% accuracy and 97.96% balanced accuracy across High, Medium, and Low placement chance bands.

### Retrain Model

```bash
python scripts/train_chance_band_model.py
```

Model artifacts are generated in:
- `src/data/placementChanceModel.json`
- Report: `placement_chance_model_report.json`
