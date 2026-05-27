import type { DrugId } from "./drugs";

export interface TrialDataPoint {
  week: number;
  avgWeightLossPct: number;
}

// Derived from published clinical trial data
// Wegovy: STEP 1 trial (N Engl J Med 2021) — 14.9% at 68 weeks
// Wegovy HD: STEP UP trial (N Engl J Med 2025) — 20.7% at 72 weeks (semaglutide 7.2mg)
// Ozempic: STEP 2 trial — ~8.7% at 68 weeks (diabetes population, lower response)
// Mounjaro/Zepbound: SURMOUNT-1 trial — 20.9% at 72 weeks (15mg arm)
export const trialCurves: Record<DrugId, TrialDataPoint[]> = {
  wegovy: [
    { week: 0, avgWeightLossPct: 0 },
    { week: 4, avgWeightLossPct: 1.2 },
    { week: 8, avgWeightLossPct: 2.6 },
    { week: 12, avgWeightLossPct: 4.1 },
    { week: 16, avgWeightLossPct: 5.8 },
    { week: 20, avgWeightLossPct: 7.2 },
    { week: 28, avgWeightLossPct: 9.5 },
    { week: 36, avgWeightLossPct: 11.4 },
    { week: 44, avgWeightLossPct: 12.8 },
    { week: 52, avgWeightLossPct: 13.8 },
    { week: 60, avgWeightLossPct: 14.5 },
    { week: 68, avgWeightLossPct: 14.9 },
  ],
  "wegovy-hd": [
    { week: 0, avgWeightLossPct: 0 },
    { week: 4, avgWeightLossPct: 0.8 },
    { week: 8, avgWeightLossPct: 2.0 },
    { week: 12, avgWeightLossPct: 3.5 },
    { week: 16, avgWeightLossPct: 5.2 },
    { week: 20, avgWeightLossPct: 7.0 },
    { week: 28, avgWeightLossPct: 11.0 },
    { week: 36, avgWeightLossPct: 14.8 },
    { week: 44, avgWeightLossPct: 17.6 },
    { week: 52, avgWeightLossPct: 19.4 },
    { week: 60, avgWeightLossPct: 20.3 },
    { week: 72, avgWeightLossPct: 20.7 },
  ],
  ozempic: [
    { week: 0, avgWeightLossPct: 0 },
    { week: 4, avgWeightLossPct: 0.9 },
    { week: 8, avgWeightLossPct: 2.0 },
    { week: 12, avgWeightLossPct: 3.2 },
    { week: 16, avgWeightLossPct: 4.4 },
    { week: 20, avgWeightLossPct: 5.5 },
    { week: 28, avgWeightLossPct: 6.8 },
    { week: 36, avgWeightLossPct: 7.7 },
    { week: 44, avgWeightLossPct: 8.3 },
    { week: 52, avgWeightLossPct: 8.6 },
    { week: 60, avgWeightLossPct: 8.7 },
    { week: 68, avgWeightLossPct: 8.7 },
  ],
  mounjaro: [
    { week: 0, avgWeightLossPct: 0 },
    { week: 4, avgWeightLossPct: 1.5 },
    { week: 8, avgWeightLossPct: 3.5 },
    { week: 12, avgWeightLossPct: 5.8 },
    { week: 16, avgWeightLossPct: 8.0 },
    { week: 20, avgWeightLossPct: 10.2 },
    { week: 28, avgWeightLossPct: 13.8 },
    { week: 36, avgWeightLossPct: 16.5 },
    { week: 44, avgWeightLossPct: 18.5 },
    { week: 52, avgWeightLossPct: 19.8 },
    { week: 60, avgWeightLossPct: 20.5 },
    { week: 72, avgWeightLossPct: 20.9 },
  ],
  zepbound: [
    { week: 0, avgWeightLossPct: 0 },
    { week: 4, avgWeightLossPct: 1.8 },
    { week: 8, avgWeightLossPct: 4.0 },
    { week: 12, avgWeightLossPct: 6.5 },
    { week: 16, avgWeightLossPct: 9.0 },
    { week: 20, avgWeightLossPct: 11.5 },
    { week: 28, avgWeightLossPct: 15.2 },
    { week: 36, avgWeightLossPct: 18.0 },
    { week: 44, avgWeightLossPct: 19.8 },
    { week: 52, avgWeightLossPct: 20.9 },
    { week: 60, avgWeightLossPct: 21.4 },
    { week: 72, avgWeightLossPct: 20.9 },
  ],
};
