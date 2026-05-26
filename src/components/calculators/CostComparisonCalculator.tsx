"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { drugPricing } from "../../data/pricing";
import { drugs, type DrugId } from "../../data/drugs";
import MultiDrugSelector from "../ui/MultiDrugSelector";
import AffiliateDisclosure from "../ui/AffiliateDisclosure";

type InsuranceStatus = "insured" | "uninsured";
type TimeHorizon = "monthly" | "annually";

const CHANNEL_LABELS: Record<string, string> = {
  retail: "Retail",
  goodRx: "GoodRx",
  insurance: "With Insurance",
  telehealth: "Telehealth",
};

const CHANNEL_COLORS: Record<string, string> = {
  retail: "#334155",
  goodRx: "#6366F1",
  insurance: "#10B981",
  telehealth: "#F59E0B",
};

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-3 text-sm shadow-xl">
      <p className="font-semibold text-[#F8FAFC] mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[#94A3B8]">{entry.name}:</span>
          <span className="font-medium text-[#F8FAFC] tabular-nums">${entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function CostComparisonCalculator() {
  const [selectedDrugs, setSelectedDrugs] = useState<DrugId[]>(["wegovy", "ozempic", "mounjaro", "zepbound"]);
  const [insuranceStatus, setInsuranceStatus] = useState<InsuranceStatus>("uninsured");
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("monthly");

  const multiplier = timeHorizon === "annually" ? 12 : 1;

  const rows = useMemo(() => {
    return selectedDrugs.map((drugId) => {
      const pricing = drugPricing[drugId];
      const drug = drugs[drugId];

      const channels = {
        retail: pricing.retailMonthly * multiplier,
        goodRx: pricing.goodRxMonthly * multiplier,
        insurance: insuranceStatus === "insured" && pricing.withInsuranceEstimate !== null
          ? pricing.withInsuranceEstimate * multiplier
          : null,
        telehealth: pricing.telehealthMonthly * multiplier,
      };

      const validPrices = Object.values(channels).filter((v): v is number => v !== null);
      const minPrice = Math.min(...validPrices);

      return { drug, pricing, channels, minPrice };
    });
  }, [selectedDrugs, insuranceStatus, multiplier]);

  const bestValue = useMemo(() => {
    let best: { drugName: string; channel: string; price: number } | null = null;
    rows.forEach((row) => {
      const channels = row.channels;
      const entries: [string, number | null][] = Object.entries(channels) as [string, number | null][];
      entries.forEach(([channel, price]) => {
        if (price !== null && (best === null || price < best.price)) {
          best = { drugName: row.drug.name, channel: CHANNEL_LABELS[channel], price };
        }
      });
    });
    return best as { drugName: string; channel: string; price: number } | null;
  }, [rows]);

  const chartData = rows.map((row) => ({
    name: row.drug.name,
    Retail: row.channels.retail,
    GoodRx: row.channels.goodRx,
    ...(insuranceStatus === "insured" ? { "With Insurance": row.channels.insurance ?? 0 } : {}),
    Telehealth: row.channels.telehealth,
    color: row.drug.color,
  }));

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6 space-y-6">
        <h2 className="text-base font-semibold text-[#F8FAFC]">Compare options</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#94A3B8]">Medications to compare</label>
          <MultiDrugSelector selected={selectedDrugs} onChange={setSelectedDrugs} />
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#94A3B8]">Insurance</label>
            <div className="inline-flex rounded-lg border border-[#334155] p-0.5 bg-[#0F172A]">
              {(["uninsured", "insured"] as InsuranceStatus[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setInsuranceStatus(option)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    insuranceStatus === option
                      ? "bg-[#10B981] text-white"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  {option === "insured" ? "I have insurance" : "No insurance"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#94A3B8]">Time horizon</label>
            <div className="inline-flex rounded-lg border border-[#334155] p-0.5 bg-[#0F172A]">
              {(["monthly", "annually"] as TimeHorizon[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeHorizon(option)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                    timeHorizon === option
                      ? "bg-[#10B981] text-white"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Best value callout */}
      {bestValue && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30">
          <svg className="shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 1l2.5 5 5.5.8-4 3.9.9 5.4L9 13.5l-4.9 2.6.9-5.4L1 6.8l5.5-.8L9 1z" fill="#10B981"/>
          </svg>
          <p className="text-sm text-[#94A3B8]">
            <strong className="text-[#10B981]">Best value:</strong>{" "}
            {bestValue.drugName} via {bestValue.channel} at{" "}
            <strong className="text-[#F8FAFC] tabular-nums">
              ${bestValue.price.toLocaleString()}/{timeHorizon === "monthly" ? "mo" : "yr"}
            </strong>
          </p>
        </div>
      )}

      {/* Price table */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
        <div className="p-6 border-b border-[#334155]">
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Price comparison</h3>
          <p className="text-xs text-[#94A3B8] mt-1">
            Prices last updated May 2026. Retail prices vary by pharmacy. Insurance coverage varies widely.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#334155]">
                <th className="text-left px-6 py-3 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Drug</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Retail</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">GoodRx</th>
                {insuranceStatus === "insured" && (
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Insurance</th>
                )}
                <th className="text-right px-6 py-3 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Telehealth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {rows.map((row) => {
                const validPrices = Object.values(row.channels).filter((v): v is number => v !== null);
                const minPrice = Math.min(...validPrices);
                return (
                  <tr key={row.drug.id} className="hover:bg-[#0F172A]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.drug.color }} />
                        <span className="font-medium text-[#F8FAFC]">{row.drug.name}</span>
                        <span className="text-xs text-[#94A3B8]">{row.drug.genericName}</span>
                      </div>
                    </td>
                    {(["retail", "goodRx", ...(insuranceStatus === "insured" ? ["insurance"] : []), "telehealth"] as string[]).map((channel) => {
                      const price = row.channels[channel as keyof typeof row.channels];
                      const isMin = price === minPrice && price !== null;
                      return (
                        <td key={channel} className={`text-right px-4 py-4 tabular-nums font-medium ${isMin ? "text-[#10B981]" : "text-[#F8FAFC]"}`}>
                          {price !== null ? (
                            <span className="flex items-center justify-end gap-1">
                              ${price.toLocaleString()}
                              {isMin && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="#10B981" aria-hidden="true">
                                  <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5l-3 1.5.6-3.2L1.2 4.5 4.5 4z"/>
                                </svg>
                              )}
                            </span>
                          ) : (
                            <span className="text-[#94A3B8] text-xs">Varies</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#334155]">
          {rows.map((row) => {
            const validPrices = Object.values(row.channels).filter((v): v is number => v !== null);
            const minPrice = Math.min(...validPrices);
            return (
              <div key={row.drug.id} className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.drug.color }} />
                  <span className="font-semibold text-[#F8FAFC]">{row.drug.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["retail", "goodRx", ...(insuranceStatus === "insured" ? ["insurance"] : []), "telehealth"] as string[]).map((channel) => {
                    const price = row.channels[channel as keyof typeof row.channels];
                    const isMin = price === minPrice && price !== null;
                    return (
                      <div key={channel} className={`rounded-lg p-3 ${isMin ? "bg-[#10B981]/10 border border-[#10B981]/30" : "bg-[#0F172A]"}`}>
                        <p className="text-xs text-[#94A3B8]">{CHANNEL_LABELS[channel]}</p>
                        <p className={`text-sm font-semibold tabular-nums mt-0.5 ${isMin ? "text-[#10B981]" : "text-[#F8FAFC]"}`}>
                          {price !== null ? `$${price.toLocaleString()}` : "Varies"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6">
        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-6">Annual cost comparison</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData.map((d) => ({ ...d, name: d.name }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#475569" tick={{ fill: "#94A3B8", fontSize: 12 }} />
            <YAxis stroke="#475569" tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Retail" fill="#334155" radius={[4, 4, 0, 0]} />
            <Bar dataKey="GoodRx" fill="#6366F1" radius={[4, 4, 0, 0]} />
            {insuranceStatus === "insured" && <Bar dataKey="With Insurance" fill="#10B981" radius={[4, 4, 0, 0]} />}
            <Bar dataKey="Telehealth" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <AffiliateDisclosure />
    </div>
  );
}
