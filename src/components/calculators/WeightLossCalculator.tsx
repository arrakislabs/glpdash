"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { projectWeightLoss } from "../../lib/weightLossProjection";
import { drugs, type DrugId } from "../../data/drugs";
import DrugSelector from "../ui/DrugSelector";
import UnitToggle, { lbsToKg, kgToLbs, type WeightUnit } from "../ui/UnitToggle";
import AffiliateDisclosure from "../ui/AffiliateDisclosure";

const SAGE = "#3F5D52";
const MUTED = "#6B655C";
const RULE = "#E0DAD0";
const INK = "#1A1815";
const PAPER = "#FBFAF7";

interface TooltipPayload {
  value: number;
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
  unit: WeightUnit;
}) {
  if (!active || !payload?.length) return null;
  const weight = payload[0].value;
  return (
    <div style={{
      background: INK,
      color: PAPER,
      fontSize: 12,
      padding: "8px 12px",
      borderRadius: 6,
      whiteSpace: "nowrap",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.08em", color: "#B8B0A0", textTransform: "uppercase", marginBottom: 2 }}>
        Week {label}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16 }}>
        {unit === "lbs" ? `${weight.toFixed(1)} lbs` : `${lbsToKg(weight)} kg`}
      </div>
    </div>
  );
}

export default function WeightLossCalculator() {
  const [unit, setUnit] = useState<WeightUnit>("lbs");
  const [drugId, setDrugId] = useState<DrugId>("wegovy");
  const [currentWeightLbs, setCurrentWeightLbs] = useState(220);
  const [currentWeightStr, setCurrentWeightStr] = useState("220");
  const [goalWeightLbs, setGoalWeightLbs] = useState<number | null>(null);
  const [goalWeightStr, setGoalWeightStr] = useState("");
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(7);
  const [linkCopied, setLinkCopied] = useState(false);

  const heightTotalInches = heightFeet * 12 + heightInches;

  function handleUnitChange(newUnit: WeightUnit) {
    if (newUnit === unit) return;
    setUnit(newUnit);
    if (newUnit === "kg") {
      setCurrentWeightStr(String(lbsToKg(currentWeightLbs)));
      if (goalWeightLbs !== null) setGoalWeightStr(String(lbsToKg(goalWeightLbs)));
    } else {
      setCurrentWeightStr(String(currentWeightLbs));
      if (goalWeightLbs !== null) setGoalWeightStr(String(goalWeightLbs));
    }
  }

  const projection = useMemo(
    () => projectWeightLoss(currentWeightLbs, goalWeightLbs, heightTotalInches, drugId),
    [currentWeightLbs, goalWeightLbs, heightTotalInches, drugId]
  );

  const chartData = projection.dataPoints.map((point) => ({
    week: point.week,
    weight: unit === "lbs" ? parseFloat(point.projectedWeightLbs.toFixed(1)) : lbsToKg(point.projectedWeightLbs),
  }));

  const displayCurrentWeight = unit === "lbs" ? currentWeightLbs : lbsToKg(currentWeightLbs);
  const displayGoalWeight = goalWeightLbs !== null
    ? (unit === "lbs" ? goalWeightLbs : lbsToKg(goalWeightLbs))
    : null;
  const displayLossAtEnd =
    unit === "lbs"
      ? `${projection.projectedLossAtTrialEndLbs.toFixed(1)} lbs`
      : `${lbsToKg(projection.projectedLossAtTrialEndLbs)} kg`;

  const drug = drugs[drugId];
  const goalWeek = projection.estimatedGoalWeek;

  return (
    <div className="calc-grid">
      {/* Inputs */}
      <aside className="calc-inputs" style={{
        background: PAPER,
        border: `1px solid ${RULE}`,
        borderRadius: 10,
        padding: 28,
      }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 6, color: INK }}>
          Your numbers
        </h3>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>
          Type in all three. The chart updates live.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Current weight */}
          <div className="field">
            <label>Current weight</label>
            <div className="input-row">
              <input
                type="number"
                inputMode="decimal"
                value={currentWeightStr}
                min={unit === "lbs" ? 100 : 45}
                max={unit === "lbs" ? 600 : 272}
                onChange={(event) => {
                  const raw = event.target.value;
                  setCurrentWeightStr(raw);
                  const parsed = parseFloat(raw);
                  if (!isNaN(parsed) && parsed > 0) {
                    setCurrentWeightLbs(unit === "kg" ? kgToLbs(parsed) : parsed);
                  }
                }}
              />
              <UnitToggle unit={unit} onChange={handleUnitChange} />
            </div>
          </div>

          {/* Goal weight */}
          <div className="field">
            <label>Goal weight (optional)</label>
            <div className="input-row">
              <input
                type="number"
                inputMode="decimal"
                value={goalWeightStr}
                min={unit === "lbs" ? 80 : 36}
                max={displayCurrentWeight - 1}
                onChange={(event) => {
                  const raw = event.target.value;
                  setGoalWeightStr(raw);
                  if (raw === "" || raw === "0") {
                    setGoalWeightLbs(null);
                    return;
                  }
                  const parsed = parseFloat(raw);
                  if (!isNaN(parsed) && parsed > 0) {
                    setGoalWeightLbs(unit === "kg" ? kgToLbs(parsed) : parsed);
                  }
                }}
              />
              <UnitToggle unit={unit} onChange={handleUnitChange} />
            </div>
            <span className="hint">Leave blank to just see the curve.</span>
          </div>

          {/* Medication */}
          <div className="field">
            <label>Medication</label>
            <DrugSelector selected={drugId} onChange={setDrugId} />
          </div>

          <hr className="hr-dashed" style={{ margin: "4px 0" }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-s"
              style={{ flex: 1, fontSize: 13, padding: "10px 14px" }}
              onClick={() => window.print()}
            >
              Print / save PDF
            </button>
            <button
              className="btn btn-s"
              style={{ fontSize: 13, padding: "10px 14px", color: linkCopied ? SAGE : undefined }}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("d", drugId);
                url.searchParams.set("c", String(currentWeightLbs));
                url.searchParams.set("g", String(goalWeightLbs ?? ""));
                url.searchParams.set("u", unit);
                navigator.clipboard?.writeText(url.toString());
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
            >
              {linkCopied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Headline stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: RULE,
          border: `1px solid ${RULE}`,
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <div style={{ background: PAPER, padding: "24px 28px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
              At week {projection.dataPoints[projection.dataPoints.length - 1]?.week ?? "—"} (end of trial)
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: 48, lineHeight: 1, letterSpacing: "-0.03em", color: INK }}>
              {unit === "lbs"
                ? Math.round(projection.dataPoints[projection.dataPoints.length - 1]?.projectedWeightLbs ?? currentWeightLbs)
                : lbsToKg(projection.dataPoints[projection.dataPoints.length - 1]?.projectedWeightLbs ?? currentWeightLbs)
              }
              <span style={{ fontSize: 20, color: MUTED, marginLeft: 4 }}>{unit}</span>
            </div>
            <div style={{ fontSize: 13, color: SAGE, marginTop: 8, fontWeight: 500 }}>
              ↓ {displayLossAtEnd} · {projection.projectedLossAtTrialEndPct.toFixed(1)}% of starting weight
            </div>
          </div>

          <div style={{ background: PAPER, padding: "24px 28px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
              {goalWeek !== null
                ? "You'll likely hit your goal around"
                : goalWeightLbs !== null
                  ? "Goal is beyond this trial's range"
                  : "Or set a goal weight on the left"}
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: 48, lineHeight: 1, letterSpacing: "-0.03em", color: INK }}>
              {goalWeek !== null ? `wk ${goalWeek}` : "—"}
            </div>
            <div style={{ fontSize: 13, color: goalWeek !== null ? SAGE : MUTED, marginTop: 8, fontWeight: goalWeek !== null ? 500 : 400 }}>
              {goalWeek !== null
                ? `≈ ${Math.round(goalWeek / 4.345)} months from your first dose`
                : goalWeightLbs !== null
                  ? "Try a higher goal weight or a stronger medication."
                  : "Goal milestone is optional."}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ background: PAPER, border: `1px solid ${RULE}`, borderRadius: 10, padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: INK }}>Your projected curve</h3>
              <p style={{ fontSize: 13, color: MUTED, marginTop: 4, maxWidth: "48ch" }}>
                {drug.trialName} mean. Hover the chart for any week's projected weight.
              </p>
            </div>
            <a className="cite" href="/about/#data">{drug.trialName} · {drug.name}</a>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 4, right: 20, bottom: 4, left: 10 }}>
              <defs>
                <linearGradient id="weight-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={SAGE} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={SAGE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke={RULE} />
              <XAxis
                dataKey="week"
                stroke={RULE}
                tick={{ fill: MUTED, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                tickFormatter={(value: number) => `Wk ${value}`}
              />
              <YAxis
                stroke={RULE}
                tick={{ fill: MUTED, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                domain={["auto", "auto"]}
                tickFormatter={(value: number) => `${value} ${unit}`}
                width={65}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              {displayGoalWeight !== null && (
                <ReferenceLine
                  y={displayGoalWeight}
                  stroke={MUTED}
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                  label={{ value: `Goal: ${displayGoalWeight} ${unit}`, position: "right", fill: MUTED, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                />
              )}
              <Line
                type="monotone"
                dataKey="weight"
                stroke={SAGE}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: SAGE, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Milestones */}
        <div style={{ background: PAPER, border: `1px solid ${RULE}`, borderRadius: 10, overflow: "hidden" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, padding: "20px 24px 6px", color: INK }}>Key milestones</h3>
          <p style={{ fontSize: 13, color: MUTED, padding: "0 24px 16px", borderBottom: `1px solid ${RULE}` }}>
            Based on the {drug.trialName} trial average. Individual response may differ.
          </p>
          {(() => {
            const lastWeek = projection.dataPoints[projection.dataPoints.length - 1]?.week ?? 68;
            const milestoneWeeks = [4, 16, 28, projection.estimatedGoalWeek, lastWeek]
              .filter((week, index, arr): week is number =>
                week != null && arr.indexOf(week) === index
              );

            const milestoneLabels: Record<number, string> = {
              4: "Starter dose period ends. Mild loss begins.",
              16: "Side effects typically settle. Curve steepens.",
              28: "About one-third of the way to maintenance-dose effect.",
            };

            return milestoneWeeks.map((week, index) => {
              const nearest = projection.dataPoints.reduce((closest, point) =>
                Math.abs(point.week - week) < Math.abs(closest.week - week) ? point : closest
              );
              const isGoal = week === projection.estimatedGoalWeek;
              const isFinal = index === milestoneWeeks.length - 1;
              const label = isGoal
                ? "Projected to reach your goal weight."
                : milestoneLabels[week] ?? "Trial maintenance plateau approaches.";

              return (
                <div key={week} style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 100px 120px",
                  padding: "14px 24px",
                  borderBottom: isFinal ? "none" : `1px dashed ${RULE}`,
                  alignItems: "center",
                  gap: 16,
                  fontSize: 14,
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: MUTED, letterSpacing: "0.08em" }}>
                    Week {week}
                  </span>
                  <span style={{ color: INK }}>{label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: SAGE, fontWeight: 600, fontSize: 13 }}>
                    −{nearest.weightLossPct.toFixed(1)}%
                  </span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: INK, textAlign: "right" }}>
                    {unit === "lbs" ? Math.round(nearest.projectedWeightLbs) : lbsToKg(nearest.projectedWeightLbs)} {unit}
                  </span>
                </div>
              );
            });
          })()}
        </div>

        {/* Variance note */}
        <div style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          background: "#E8EDE9",
          border: "1px solid color-mix(in srgb, #3F5D52 25%, #E0DAD0)",
          borderRadius: 10,
          padding: "20px 24px",
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: SAGE, marginTop: 2 }}>
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: 14, color: "#3A352E", lineHeight: 1.55, margin: 0 }}>
            <strong style={{ color: "#2A3F38", fontWeight: 600 }}>This is an average, not a guarantee.</strong>{" "}
            {drugId === "wegovy"
              ? "In the STEP 1 trial, about 32% of participants lost more than 20% of body weight, while ~14% lost less than 5%."
              : drugId === "wegovy-hd"
              ? "In the STEP UP trial, participants on 7.2mg lost an average of 20.7% of body weight — roughly 6 percentage points more than the 2.4mg standard dose arm."
              : drugId === "ozempic"
              ? "In the STEP 2 trial, about 25% of participants lost more than 15% of body weight, while ~20% lost less than 3%."
              : "In the SURMOUNT-1 trial, about 57% of participants on the highest dose lost more than 20% of body weight, while ~9% lost less than 5%."
            }{" "}
            Your response depends on adherence, diet, activity, baseline metabolism, and other factors only your prescriber can assess.
          </p>
        </div>

        {/* Source strip */}
        <div style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          fontSize: 13,
          color: "#3A352E",
          padding: "18px 24px",
          background: PAPER,
          border: `1px solid ${RULE}`,
          borderRadius: 10,
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginRight: 6 }}>
            Trial source
          </span>
          <span>
            <strong>{drug.trialName}</strong> · {drug.name} ({drug.genericName}).{" "}
            <em>{drug.citation}</em>
          </span>
        </div>

        <AffiliateDisclosure />
      </div>

    </div>
  );
}
