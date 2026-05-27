import { describe, it, expect } from "vitest";
import { trialCurves } from "./trialData";
import type { DrugId } from "./drugs";

const DRUG_IDS: DrugId[] = ["wegovy", "wegovy-hd", "ozempic", "mounjaro", "zepbound"];

const PUBLISHED_ENDPOINTS: Record<DrugId, { week: number; pct: number }> = {
  wegovy:       { week: 68, pct: 14.9 },
  "wegovy-hd":  { week: 72, pct: 20.7 },
  ozempic:      { week: 68, pct:  8.7 },
  mounjaro:     { week: 72, pct: 20.9 },
  zepbound:     { week: 72, pct: 20.9 },
};

for (const drugId of DRUG_IDS) {
  describe(`trialCurves["${drugId}"]`, () => {
    it("starts at week 0 with 0% loss", () => {
      const curve = trialCurves[drugId];
      expect(curve[0].week).toBe(0);
      expect(curve[0].avgWeightLossPct).toBe(0);
    });

    it("has strictly increasing week values", () => {
      const curve = trialCurves[drugId];
      for (let index = 1; index < curve.length; index++) {
        expect(curve[index].week).toBeGreaterThan(curve[index - 1].week);
      }
    });

    it("final point matches the published trial endpoint", () => {
      const curve = trialCurves[drugId];
      const endpoint = PUBLISHED_ENDPOINTS[drugId];
      const final = curve[curve.length - 1];
      expect(final.week).toBe(endpoint.week);
      expect(final.avgWeightLossPct).toBeCloseTo(endpoint.pct, 1);
    });

    it("all percentages are between 0 and 30", () => {
      const curve = trialCurves[drugId];
      for (const point of curve) {
        expect(point.avgWeightLossPct).toBeGreaterThanOrEqual(0);
        expect(point.avgWeightLossPct).toBeLessThanOrEqual(30);
      }
    });

    it("contains at least 6 data points", () => {
      expect(trialCurves[drugId].length).toBeGreaterThanOrEqual(6);
    });
  });
}
