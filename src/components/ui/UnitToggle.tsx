export type WeightUnit = "lbs" | "kg";

interface Props {
  unit: WeightUnit;
  onChange: (unit: WeightUnit) => void;
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg / 0.453592);
}

export default function UnitToggle({ unit, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-[#334155] p-0.5 bg-[#1E293B]">
      {(["lbs", "kg"] as WeightUnit[]).map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            unit === option
              ? "bg-[#10B981] text-white shadow-sm"
              : "text-[#94A3B8] hover:text-[#F8FAFC]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
