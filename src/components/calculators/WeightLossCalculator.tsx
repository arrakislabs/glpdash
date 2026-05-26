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
import ResultCard from "../ui/ResultCard";
import AffiliateDisclosure from "../ui/AffiliateDisclosure";

const DEBOUNCE_MS = 200;

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useMemo(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

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
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-sm shadow-xl">
      <p className="text-[#94A3B8]">Week {label}</p>
      <p className="font-semibold text-[#F8FAFC] tabular-nums">
        {unit === "lbs" ? `${weight.toFixed(1)} lbs` : `${lbsToKg(weight)} kg`}
      </p>
    </div>
  );
}

export default function WeightLossCalculator() {
  const [unit, setUnit] = useState<WeightUnit>("lbs");
  const [drugId, setDrugId] = useState<DrugId>("wegovy");
  const [currentWeightLbs, setCurrentWeightLbs] = useState(220);
  const [goalWeightLbs, setGoalWeightLbs] = useState(180);
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(7);

  const heightTotalInches = heightFeet * 12 + heightInches;

  function handleUnitChange(newUnit: WeightUnit) {
    setUnit(newUnit);
  }

  function parseWeightInput(raw: string, currentLbs: number): number {
    const parsed = parseFloat(raw);
    if (isNaN(parsed) || parsed <= 0) return currentLbs;
    return unit === "kg" ? kgToLbs(parsed) : parsed;
  }

  const debouncedWeight = useDebounced(currentWeightLbs, DEBOUNCE_MS);
  const debouncedGoal = useDebounced(goalWeightLbs, DEBOUNCE_MS);

  const projection = useMemo(
    () =>
      projectWeightLoss(
        debouncedWeight,
        debouncedGoal,
        heightTotalInches,
        drugId
      ),
    [debouncedWeight, debouncedGoal, heightTotalInches, drugId]
  );

  const chartData = projection.dataPoints.map((point) => ({
    week: point.week,
    weight: unit === "lbs" ? parseFloat(point.projectedWeightLbs.toFixed(1)) : lbsToKg(point.projectedWeightLbs),
  }));

  const displayCurrentWeight = unit === "lbs" ? currentWeightLbs : lbsToKg(currentWeightLbs);
  const displayGoalWeight = unit === "lbs" ? goalWeightLbs : lbsToKg(goalWeightLbs);
  const displayLossAtEnd =
    unit === "lbs"
      ? `${projection.projectedLossAtTrialEndLbs.toFixed(1)} lbs`
      : `${lbsToKg(projection.projectedLossAtTrialEndLbs)} kg`;

  const drug = drugs[drugId];

  const milestones = [5, 10, 15, 20];

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-[#F8FAFC]">Your details</h2>
          <UnitToggle unit={unit} onChange={handleUnitChange} />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Current weight */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#94A3B8]">
              Current weight ({unit})
            </label>
            <input
              type="number"
              value={unit === "lbs" ? currentWeightLbs : lbsToKg(currentWeightLbs)}
              min={unit === "lbs" ? 100 : 45}
              max={unit === "lbs" ? 600 : 272}
              onChange={(event) =>
                setCurrentWeightLbs(parseWeightInput(event.target.value, currentWeightLbs))
              }
              className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-[#F8FAFC] text-base tabular-nums focus:outline-none focus:border-[#10B981] transition-colors"
            />
            <input
              type="range"
              min={unit === "lbs" ? 100 : 45}
              max={unit === "lbs" ? 500 : 227}
              value={unit === "lbs" ? currentWeightLbs : lbsToKg(currentWeightLbs)}
              onChange={(event) =>
                setCurrentWeightLbs(
                  unit === "kg" ? kgToLbs(parseInt(event.target.value)) : parseInt(event.target.value)
                )
              }
              className="w-full accent-[#10B981]"
            />
          </div>

          {/* Goal weight */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#94A3B8]">
              Goal weight ({unit})
            </label>
            <input
              type="number"
              value={unit === "lbs" ? goalWeightLbs : lbsToKg(goalWeightLbs)}
              min={unit === "lbs" ? 80 : 36}
              max={displayCurrentWeight - 1}
              onChange={(event) =>
                setGoalWeightLbs(parseWeightInput(event.target.value, goalWeightLbs))
              }
              className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-[#F8FAFC] text-base tabular-nums focus:outline-none focus:border-[#10B981] transition-colors"
            />
            <input
              type="range"
              min={unit === "lbs" ? 80 : 36}
              max={displayCurrentWeight - 5}
              value={unit === "lbs" ? goalWeightLbs : lbsToKg(goalWeightLbs)}
              onChange={(event) =>
                setGoalWeightLbs(
                  unit === "kg" ? kgToLbs(parseInt(event.target.value)) : parseInt(event.target.value)
                )
              }
              className="w-full accent-[#10B981]"
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#94A3B8]">Height (for BMI)</label>
            {unit === "lbs" ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={heightFeet}
                    min={3}
                    max={7}
                    onChange={(event) => setHeightFeet(parseInt(event.target.value) || 5)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-[#F8FAFC] tabular-nums focus:outline-none focus:border-[#10B981] transition-colors"
                    placeholder="5"
                  />
                  <span className="text-xs text-[#94A3B8] ml-1">ft</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={heightInches}
                    min={0}
                    max={11}
                    onChange={(event) => setHeightInches(parseInt(event.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-[#F8FAFC] tabular-nums focus:outline-none focus:border-[#10B981] transition-colors"
                    placeholder="7"
                  />
                  <span className="text-xs text-[#94A3B8] ml-1">in</span>
                </div>
              </div>
            ) : (
              <input
                type="number"
                value={Math.round(heightTotalInches * 2.54)}
                min={100}
                max={220}
                onChange={(event) => {
                  const cm = parseInt(event.target.value) || 170;
                  const totalInches = Math.round(cm / 2.54);
                  setHeightFeet(Math.floor(totalInches / 12));
                  setHeightInches(totalInches % 12);
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-[#F8FAFC] tabular-nums focus:outline-none focus:border-[#10B981] transition-colors"
                placeholder="170"
              />
            )}
          </div>
        </div>

        {/* Drug selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#94A3B8]">Medication</label>
          <DrugSelector selected={drugId} onChange={setDrugId} />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ResultCard
            label="Projected loss at trial endpoint"
            value={displayLossAtEnd}
            subValue={`${projection.projectedLossAtTrialEndPct.toFixed(1)}% of body weight`}
            accent
          />
          <ResultCard
            label="Estimated weeks to goal"
            value={
              projection.estimatedGoalWeek !== null
                ? `Week ${projection.estimatedGoalWeek}`
                : "Beyond trial period"
            }
            subValue={
              projection.estimatedGoalWeek !== null
                ? `~${Math.ceil(projection.estimatedGoalWeek / 4)} months`
                : `Max loss: ${displayLossAtEnd}`
            }
          />
          <ResultCard
            label="BMI change"
            value={`${projection.startingBmi.toFixed(1)} → ${projection.projectedBmiAtTrialEnd.toFixed(1)}`}
            subValue="Starting → projected at trial end"
          />
        </div>

        {/* Chart */}
        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Weight loss projection</h3>
            <span className="text-xs text-[#94A3B8]">{drug.trialName} trial data</span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="week"
                stroke="#475569"
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                label={{ value: "Weeks", position: "insideBottom", offset: -2, fill: "#94A3B8", fontSize: 12 }}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                domain={["auto", "auto"]}
                tickFormatter={(value: number) => `${value} ${unit}`}
                width={70}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />

              {/* Milestone reference lines */}
              {milestones.map((pct) => {
                const milestoneWeight =
                  unit === "lbs"
                    ? currentWeightLbs * (1 - pct / 100)
                    : lbsToKg(currentWeightLbs * (1 - pct / 100));
                const isReachable = milestoneWeight > (unit === "lbs" ? goalWeightLbs : lbsToKg(goalWeightLbs));
                if (!isReachable) return null;
                return (
                  <ReferenceLine
                    key={pct}
                    y={parseFloat(milestoneWeight.toFixed(1))}
                    stroke="#334155"
                    strokeDasharray="4 4"
                    label={{ value: `${pct}%`, position: "right", fill: "#64748B", fontSize: 11 }}
                  />
                );
              })}

              {/* Goal weight line */}
              <ReferenceLine
                y={unit === "lbs" ? goalWeightLbs : lbsToKg(goalWeightLbs)}
                stroke="#10B981"
                strokeDasharray="6 3"
                label={{ value: "Goal", position: "right", fill: "#10B981", fontSize: 12, fontWeight: 600 }}
              />

              <Line
                type="monotone"
                dataKey="weight"
                stroke={drug.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: drug.color, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-4 text-xs text-[#94A3B8]">
            Based on {drug.trialName} clinical trial data ({drug.name}, {drug.genericName}).
            Individual results will vary significantly.
          </p>
        </div>

        <AffiliateDisclosure />
      </div>
    </div>
  );
}
