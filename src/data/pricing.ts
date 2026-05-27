import type { DrugId } from "./drugs";

export interface DrugPricing {
  drugId: DrugId;
  retailMonthly: number;
  goodRxMonthly: number;
  withInsuranceEstimate: number | null;
  telehealthMonthly: number;
  lastUpdated: string;
}

// Prices last updated May 2026 — verify against GoodRx before updating
export const drugPricing: Record<DrugId, DrugPricing> = {
  wegovy: {
    drugId: "wegovy",
    retailMonthly: 1349,
    goodRxMonthly: 1100,
    withInsuranceEstimate: 25,
    telehealthMonthly: 299,
    lastUpdated: "2026-05-01",
  },
  "wegovy-hd": {
    drugId: "wegovy-hd",
    retailMonthly: 1499,
    goodRxMonthly: 1250,
    withInsuranceEstimate: 25,
    telehealthMonthly: 399,
    lastUpdated: "2026-05-01",
  },
  ozempic: {
    drugId: "ozempic",
    retailMonthly: 968,
    goodRxMonthly: 850,
    withInsuranceEstimate: 25,
    telehealthMonthly: 249,
    lastUpdated: "2026-05-01",
  },
  mounjaro: {
    drugId: "mounjaro",
    retailMonthly: 1069,
    goodRxMonthly: 950,
    withInsuranceEstimate: 25,
    telehealthMonthly: 349,
    lastUpdated: "2026-05-01",
  },
  zepbound: {
    drugId: "zepbound",
    retailMonthly: 1059,
    goodRxMonthly: 920,
    withInsuranceEstimate: 25,
    telehealthMonthly: 329,
    lastUpdated: "2026-05-01",
  },
};
