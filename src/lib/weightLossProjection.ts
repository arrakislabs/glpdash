import type { DrugId } from "../data/drugs";
import { trialCurves } from "../data/trialData";

export interface ProjectionDataPoint {
  week: number;
  projectedWeightLbs: number;
  weightLossPct: number;
}

export interface WeightLossProjection {
  dataPoints: ProjectionDataPoint[];
  estimatedGoalWeek: number | null;
  projectedLossAtTrialEndLbs: number;
  projectedLossAtTrialEndPct: number;
  startingBmi: number;
  projectedBmiAtTrialEnd: number;
  maxTrialWeeks: number;
}

function interpolatePct(week: number, curve: { week: number; avgWeightLossPct: number }[]): number {
  for (let index = 0; index < curve.length - 1; index++) {
    const current = curve[index];
    const next = curve[index + 1];
    if (week >= current.week && week <= next.week) {
      const fraction = (week - current.week) / (next.week - current.week);
      return current.avgWeightLossPct + fraction * (next.avgWeightLossPct - current.avgWeightLossPct);
    }
  }
  return curve[curve.length - 1].avgWeightLossPct;
}

function calculateBmi(weightLbs: number, heightInches: number): number {
  return (weightLbs / (heightInches * heightInches)) * 703;
}

export function projectWeightLoss(
  currentWeightLbs: number,
  goalWeightLbs: number,
  heightInches: number,
  drugId: DrugId
): WeightLossProjection {
  const curve = trialCurves[drugId];
  const maxTrialWeeks = curve[curve.length - 1].week;

  const dataPoints: ProjectionDataPoint[] = [];
  let estimatedGoalWeek: number | null = null;

  for (let week = 0; week <= maxTrialWeeks; week += 1) {
    const weightLossPct = interpolatePct(week, curve);
    const projectedWeightLbs = currentWeightLbs * (1 - weightLossPct / 100);
    dataPoints.push({ week, projectedWeightLbs, weightLossPct });

    if (estimatedGoalWeek === null && projectedWeightLbs <= goalWeightLbs) {
      estimatedGoalWeek = week;
    }
  }

  const finalPoint = dataPoints[dataPoints.length - 1];
  const projectedLossAtTrialEndLbs = currentWeightLbs - finalPoint.projectedWeightLbs;
  const projectedLossAtTrialEndPct = finalPoint.weightLossPct;

  const startingBmi = calculateBmi(currentWeightLbs, heightInches);
  const projectedBmiAtTrialEnd = calculateBmi(finalPoint.projectedWeightLbs, heightInches);

  // Downsample to weekly points for chart rendering performance
  const sampledPoints = dataPoints.filter((point) => point.week % 4 === 0 || point.week === maxTrialWeeks);

  return {
    dataPoints: sampledPoints,
    estimatedGoalWeek,
    projectedLossAtTrialEndLbs,
    projectedLossAtTrialEndPct,
    startingBmi,
    projectedBmiAtTrialEnd,
    maxTrialWeeks,
  };
}
