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
    <div className="unit-tog">
      {(["lbs", "kg"] as WeightUnit[]).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={unit === option ? "active" : ""}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
