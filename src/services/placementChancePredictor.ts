import model from '../data/placementChanceModel.json';
import report from '../../placement_chance_model_report.json';

// ─── Input & Output Types ────────────────────────────────────────────────────

export interface PlacementChanceInput {
  CGPA: number;
  Internships: number;
  Coding_Hours_Per_Week: number;
  Projects_Completed: number;
  Certifications: number;
  Communication_Skills_Rating: number;
  Aptitude_Test_Score: number;
  Hackathon_Participation: number;
  // Optional extras for tier / LPA enrichment
  college_tier?: number;
  aptitude_score?: number;
  coding_contest_rating?: number;
}

export type ChanceBand = 'Low' | 'Medium' | 'High';
export type CompanyTier = 'Product/Top' | 'Mid-tier' | 'Mass Recruiter' | 'Not Placed';

export interface PlacementPrediction {
  /** Probability of being placed (0-1), derived from High-class probability */
  placedProbability: number;
  predictedPlaced: boolean;
  /** High / Medium / Low placement chance band (97.08% accuracy) */
  band: ChanceBand;
  /** Full class probabilities for all three bands */
  probabilities: Record<ChanceBand, number>;
  /** Predicted company tier */
  predictedTier: CompanyTier;
  /** Estimated CTC in LPA */
  predictedPackageLpa: number;
  /** Top driving features with their contribution magnitude */
  topFactors: { feature: string; contribution: number }[];
  modelInfo: {
    accuracy: number;
    balancedAccuracy: number;
    macroF1: number;
  };
}

// ─── Core Predictor ──────────────────────────────────────────────────────────

export function predictPlacement(input: PlacementChanceInput): PlacementPrediction {
  // Encode the 8 core features
  const coreKeys: (keyof PlacementChanceInput)[] = [
    'CGPA', 'Internships', 'Coding_Hours_Per_Week', 'Projects_Completed',
    'Certifications', 'Communication_Skills_Rating', 'Aptitude_Test_Score',
    'Hackathon_Participation',
  ];

  const encoded = coreKeys.map((key, index) => {
    const val = (input[key] as number) ?? model.means[index];
    return (val - model.means[index]) / model.scales[index];
  });

  // Softmax over three classes: Low, Medium, High
  const logits = model.classes.map((_, classIndex) =>
    model.weights[0][classIndex] +
    encoded.reduce((sum, val, i) => sum + val * model.weights[i + 1][classIndex], 0)
  );

  const maxLogit = Math.max(...logits);
  const exps = logits.map(v => Math.exp(Math.max(-30, Math.min(30, v - maxLogit))));
  const total = exps.reduce((s, v) => s + v, 0);
  const probabilities = Object.fromEntries(
    model.classes.map((label, i) => [label, exps[i] / total])
  ) as Record<ChanceBand, number>;

  const band = model.classes.reduce(
    (best, label) => probabilities[label as ChanceBand] > probabilities[best as ChanceBand] ? label : best,
    model.classes[0]
  ) as ChanceBand;

  // Use High probability as placement probability (direct and interpretable)
  const placedProbability = probabilities['High'];
  const predictedPlaced = band === 'High' || band === 'Medium';

  // ── Tier Prediction ────────────────────────────────────────────────────────
  let predictedTier: CompanyTier = 'Not Placed';
  if (predictedPlaced) {
    const collegeTier = input.college_tier ?? 2;
    const tierBoost = collegeTier === 1 ? 0.12 : collegeTier === 2 ? 0.04 : -0.04;
    const tierScore = placedProbability + tierBoost;

    if (tierScore >= 0.88) {
      predictedTier = 'Product/Top';
    } else if (tierScore >= 0.60 || band === 'Medium') {
      predictedTier = 'Mid-tier';
    } else {
      predictedTier = 'Mass Recruiter';
    }
  }

  // ── Package Estimation (LPA) ───────────────────────────────────────────────
  let predictedPackageLpa = 0;
  if (predictedPlaced) {
    const cgpa = input.CGPA ?? 7.0;
    const internships = input.Internships ?? 0;
    const projects = input.Projects_Completed ?? 0;
    const certifications = input.Certifications ?? 0;
    const aptitude = input.Aptitude_Test_Score ?? 60;
    const collegeTier = input.college_tier ?? 2;

    // Weighted formula calibrated to realistic Indian campus placements
    const base =
      cgpa * 0.9 +
      internships * 1.4 +
      projects * 0.5 +
      certifications * 0.3 +
      (aptitude / 100) * 3.5 +
      (collegeTier === 1 ? 3.5 : collegeTier === 2 ? 1.5 : 0) +
      placedProbability * 4;

    predictedPackageLpa = Math.max(3.0, Math.round(base * 10) / 10);

    // Cap by tier
    if (predictedTier === 'Mass Recruiter') predictedPackageLpa = Math.min(predictedPackageLpa, 8);
    if (predictedTier === 'Mid-tier') predictedPackageLpa = Math.min(predictedPackageLpa, 18);
  }

  // ── Top Factors ────────────────────────────────────────────────────────────
  // Use the "High" class weights (index 2) as the factor contributions
  const highClassIdx = model.classes.indexOf('High');
  const topFactors = encoded
    .map((val, i) => ({
      feature: coreKeys[i] as string,
      contribution: val * model.weights[i + 1][highClassIdx],
    }))
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 6);

  return {
    placedProbability,
    predictedPlaced,
    band,
    probabilities,
    predictedTier,
    predictedPackageLpa,
    topFactors,
    modelInfo: {
      accuracy: model.metrics.accuracy,
      balancedAccuracy: model.metrics.balancedAccuracy,
      macroF1: model.metrics.macroF1,
    },
  };
}

// ─── Legacy band-only helper (for backward compat) ───────────────────────────
export function predictChanceBand(input: PlacementChanceInput): { band: ChanceBand; probabilities: Record<ChanceBand, number> } {
  const { band, probabilities } = predictPlacement(input);
  return { band, probabilities };
}

// ─── Model metadata exports ───────────────────────────────────────────────────
export const PLACEMENT_CHANCE_VALIDATION = model.metrics;
export const PLACEMENT_CHANCE_DATASET = {
  rows: report.rows,
  testRows: report.testRows,
  lowLabels: report.labelCounts.Low,
  lowHoldoutRows: report.multinomialLogisticRegression.perClass.Low.count,
};
