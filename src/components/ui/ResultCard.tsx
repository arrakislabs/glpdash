interface Props {
  label: string;
  value: string;
  subValue?: string;
  accent?: boolean;
  className?: string;
}

export default function ResultCard({ label, value, subValue, accent = false, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        accent
          ? "bg-[#10B981]/10 border-[#10B981]/30"
          : "bg-[#1E293B] border-[#334155]"
      } ${className}`}
    >
      <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${accent ? "text-[#10B981]" : "text-[#F8FAFC]"}`}>
        {value}
      </p>
      {subValue && (
        <p className="mt-1 text-sm text-[#94A3B8]">{subValue}</p>
      )}
    </div>
  );
}
