import { describe, it, expect } from "vitest";
import { projectWeightLoss } from "./weightLossProjection";

const HEIGHT_INCHES = 67; // 5'7"
const START_WEIGHT = 220;

describe("projectWeightLoss — published trial endpoints", () => {
  it("wegovy: projects 14.9% loss at week 68", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "wegovy");
    expect(result.projectedLossAtTrialEndPct).toBeCloseTo(14.9, 1);
    expect(result.maxTrialWeeks).toBe(68);
  });

  it("wegovy-hd: projects 20.7% loss at week 72", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "wegovy-hd");
    expect(result.projectedLossAtTrialEndPct).toBeCloseTo(20.7, 1);
    expect(result.maxTrialWeeks).toBe(72);
  });

  it("ozempic: projects 8.7% loss at week 68", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "ozempic");
    expect(result.projectedLossAtTrialEndPct).toBeCloseTo(8.7, 1);
    expect(result.maxTrialWeeks).toBe(68);
  });

  it("mounjaro: projects 20.9% loss at week 72", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "mounjaro");
    expect(result.projectedLossAtTrialEndPct).toBeCloseTo(20.9, 1);
    expect(result.maxTrialWeeks).toBe(72);
  });

  it("zepbound: projects 20.9% loss at week 72", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "zepbound");
    expect(result.projectedLossAtTrialEndPct).toBeCloseTo(20.9, 1);
    expect(result.maxTrialWeeks).toBe(72);
  });
});

describe("projectWeightLoss — projected weight at trial end", () => {
  it("wegovy: final projected weight from 220 lbs ≈ 187 lbs", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "wegovy");
    const finalPoint = result.dataPoints[result.dataPoints.length - 1];
    expect(finalPoint.projectedWeightLbs).toBeCloseTo(220 * (1 - 0.149), 0);
  });

  it("data points start at week 0 with the starting weight and zero loss", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "wegovy");
    expect(result.dataPoints[0].week).toBe(0);
    expect(result.dataPoints[0].projectedWeightLbs).toBeCloseTo(START_WEIGHT, 1);
    expect(result.dataPoints[0].weightLossPct).toBeCloseTo(0, 2);
  });

  it("projectedLossAtTrialEndLbs equals start minus final projected weight", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "mounjaro");
    const finalPoint = result.dataPoints[result.dataPoints.length - 1];
    expect(result.projectedLossAtTrialEndLbs).toBeCloseTo(
      START_WEIGHT - finalPoint.projectedWeightLbs,
      1
    );
  });
});

describe("projectWeightLoss — goal week detection", () => {
  it("returns null estimatedGoalWeek when goalWeightLbs is null", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "wegovy");
    expect(result.estimatedGoalWeek).toBeNull();
  });

  it("detects goal week when goal is reachable within the trial window", () => {
    // Wegovy from 220 lbs reaches ~187 lbs; 195 lbs is reachable
    const result = projectWeightLoss(START_WEIGHT, 195, HEIGHT_INCHES, "wegovy");
    expect(result.estimatedGoalWeek).not.toBeNull();
    expect(result.estimatedGoalWeek).toBeGreaterThan(0);
    expect(result.estimatedGoalWeek as number).toBeLessThanOrEqual(68);
  });

  it("returns null estimatedGoalWeek when goal is below the trial endpoint (unreachable)", () => {
    // Wegovy endpoint from 220 lbs ≈ 187 lbs; 170 lbs cannot be reached
    const result = projectWeightLoss(START_WEIGHT, 170, HEIGHT_INCHES, "wegovy");
    expect(result.estimatedGoalWeek).toBeNull();
  });

  it("sets estimatedGoalWeek to 0 when goal is at or above the starting weight", () => {
    const result = projectWeightLoss(START_WEIGHT, 225, HEIGHT_INCHES, "wegovy");
    expect(result.estimatedGoalWeek).toBe(0);
  });

  it("wegovy-hd detects goal week for a reachable target", () => {
    // Wegovy HD from 240 lbs reaches ~240 * (1-0.207) = 190.3 lbs; 192 lbs is reachable
    const result = projectWeightLoss(240, 192, HEIGHT_INCHES, "wegovy-hd");
    expect(result.estimatedGoalWeek).not.toBeNull();
    expect(result.estimatedGoalWeek as number).toBeLessThanOrEqual(72);
  });
});

describe("projectWeightLoss — BMI", () => {
  it("calculates starting BMI correctly for 220 lbs at 5'7\"", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "wegovy");
    // BMI = (220 / (67 * 67)) * 703 ≈ 34.4
    expect(result.startingBmi).toBeCloseTo(34.4, 0);
  });

  it("projectedBmiAtTrialEnd is less than startingBmi", () => {
    const result = projectWeightLoss(START_WEIGHT, null, HEIGHT_INCHES, "wegovy");
    expect(result.projectedBmiAtTrialEnd).toBeLessThan(result.startingBmi);
  });
});
