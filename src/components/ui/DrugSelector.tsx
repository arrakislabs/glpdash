import { drugs, type DrugId } from "../../data/drugs";

interface Props {
  selected: DrugId;
  onChange: (drugId: DrugId) => void;
  className?: string;
}

export default function DrugSelector({ selected, onChange, className = "" }: Props) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Object.values(drugs).map((drug) => (
        <button
          key={drug.id}
          onClick={() => onChange(drug.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
            selected === drug.id
              ? "border-transparent text-white shadow-lg"
              : "border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#475569] bg-[#1E293B]"
          }`}
          style={selected === drug.id ? { backgroundColor: drug.color, borderColor: drug.color } : {}}
        >
          {drug.name}
        </button>
      ))}
    </div>
  );
}
