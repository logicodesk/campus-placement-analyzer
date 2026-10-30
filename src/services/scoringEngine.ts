import { ScoringWeightsConfig } from '../types';

export const DEFAULT_SCORING_CONFIG: ScoringWeightsConfig = {
  version: 'v2.4-2025-Q1',
  lastUpdated: '2025-01-15T10:00:00Z',
  updatedBy: 'Placement Cell Academic Council',
  dsaWeight: 25,
  coreCsWeight: 15,
  sqlDbWeight: 15,
  aptitudeWeight: 15,
  systemDesignWeight: 15,
  academicWeight: 10,
  resumeSoftSkillsWeight: 5,
  minimumCoverageThreshold: 75,
};

export interface CategoryScoreInput {
  dsa: number; // 0-100
  coreCs: number; // 0-100
  sqlDb: number; // 0-100
  aptitude: number; // 0-100
  systemDesign: number; // 0-100
  academicCgpaScaled: number; // e.g. (cgpa / 10) * 100
  resumeSoftSkills: number; // 0-100
}

export interface ScoringResult {
  overallScore: number;
  coveragePercent: number;
  isCoverageSufficient: boolean;
  band: 'Needs Development' | 'Building Readiness' | 'Approaching Readiness' | 'Strong Readiness';
  bandColor: 'error' | 'primary' | 'secondary';
  contributions: {
    category: string;
    rawScore: number;
    weight: number;
    pointsContributed: number;
  }[];
  balanceQuotient: number; // 0-10 scale
  asymmetryRisk: string;
}

export function calculateReadinessScore(
  scores: Partial<CategoryScoreInput>,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): ScoringResult {
  const categories = [
    { key: 'dsa', name: 'Programming & DSA', weight: config.dsaWeight, score: scores.dsa },
    { key: 'coreCs', name: 'Core CS (OS/Networks)', weight: config.coreCsWeight, score: scores.coreCs },
    { key: 'sqlDb', name: 'Database & SQL', weight: config.sqlDbWeight, score: scores.sqlDb },
    { key: 'aptitude', name: 'Aptitude & Reasoning', weight: config.aptitudeWeight, score: scores.aptitude },
    { key: 'systemDesign', name: 'System Design & Projects', weight: config.systemDesignWeight, score: scores.systemDesign },
    { key: 'academicCgpaScaled', name: 'Academic Profile (CGPA)', weight: config.academicWeight, score: scores.academicCgpaScaled },
    { key: 'resumeSoftSkills', name: 'Communication & Resume', weight: config.resumeSoftSkillsWeight, score: scores.resumeSoftSkills },
  ];

  let assessedWeight = 0;
  let weightedSum = 0;
  const contributions: ScoringResult['contributions'] = [];
  const scoreValues: number[] = [];

  for (const cat of categories) {
    if (typeof cat.score === 'number' && !isNaN(cat.score)) {
      assessedWeight += cat.weight;
      const points = (cat.score * cat.weight) / 100;
      weightedSum += points;
      scoreValues.push(cat.score);
      contributions.push({
        category: cat.name,
        rawScore: cat.score,
        weight: cat.weight,
        pointsContributed: Math.round(points * 10) / 10,
      });
    }
  }

  const coveragePercent = Math.round((assessedWeight / 100) * 100);
  const isCoverageSufficient = coveragePercent >= config.minimumCoverageThreshold;

  // Normalized overall score across assessed categories
  const normalizedOverall = assessedWeight > 0 ? Math.round((weightedSum / (assessedWeight / 100))) : 0;

  // Compute Balance Quotient: standard deviation of domain scores
  let balanceQuotient = 7.0;
  let asymmetryRisk = 'None';

  if (scoreValues.length >= 3) {
    const mean = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
    const variance = scoreValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scoreValues.length;
    const stdDev = Math.sqrt(variance);
    // Lower standard deviation means higher balance (0 to 10 scale)
    balanceQuotient = Math.max(1, Math.min(10, Math.round((10 - stdDev / 5) * 10) / 10));

    // Detect primary bottleneck if score is substantially below mean
    if (typeof scores.dsa === 'number' && scores.dsa < 55) {
      asymmetryRisk = 'DSA Bottleneck';
    } else if (typeof scores.systemDesign === 'number' && scores.systemDesign < 55) {
      asymmetryRisk = 'Architecture Gap';
    } else if (typeof scores.coreCs === 'number' && scores.coreCs < 60) {
      asymmetryRisk = 'Systems Gap';
    } else if (balanceQuotient < 6.0) {
      asymmetryRisk = 'High Variance Profile';
    } else {
      asymmetryRisk = 'Well Balanced';
    }
  }

  let band: ScoringResult['band'] = 'Needs Development';
  let bandColor: ScoringResult['bandColor'] = 'error';

  if (normalizedOverall >= 75) {
    band = 'Strong Readiness';
    bandColor = 'secondary';
  } else if (normalizedOverall >= 65) {
    band = 'Approaching Readiness';
    bandColor = 'primary';
  } else if (normalizedOverall >= 50) {
    band = 'Building Readiness';
    bandColor = 'primary';
  }

  return {
    overallScore: normalizedOverall,
    coveragePercent,
    isCoverageSufficient,
    band,
    bandColor,
    contributions,
    balanceQuotient,
    asymmetryRisk,
  };
}

export function simulateWhatIf(
  current: CategoryScoreInput,
  simulatedDeltas: Partial<CategoryScoreInput>
) {
  const hypothetical: CategoryScoreInput = {
    dsa: Math.min(100, Math.max(0, current.dsa + (simulatedDeltas.dsa ?? 0))),
    coreCs: Math.min(100, Math.max(0, current.coreCs + (simulatedDeltas.coreCs ?? 0))),
    sqlDb: Math.min(100, Math.max(0, current.sqlDb + (simulatedDeltas.sqlDb ?? 0))),
    aptitude: Math.min(100, Math.max(0, current.aptitude + (simulatedDeltas.aptitude ?? 0))),
    systemDesign: Math.min(100, Math.max(0, current.systemDesign + (simulatedDeltas.systemDesign ?? 0))),
    academicCgpaScaled: current.academicCgpaScaled,
    resumeSoftSkills: Math.min(100, Math.max(0, current.resumeSoftSkills + (simulatedDeltas.resumeSoftSkills ?? 0))),
  };

  const currentResult = calculateReadinessScore(current);
  const simulatedResult = calculateReadinessScore(hypothetical);

  return {
    hypotheticalScores: hypothetical,
    currentScore: currentResult.overallScore,
    simulatedScore: simulatedResult.overallScore,
    scoreDelta: simulatedResult.overallScore - currentResult.overallScore,
    currentBand: currentResult.band,
    simulatedBand: simulatedResult.band,
    simulatedBalanceQuotient: simulatedResult.balanceQuotient,
    simulatedAsymmetryRisk: simulatedResult.asymmetryRisk,
  };
}
