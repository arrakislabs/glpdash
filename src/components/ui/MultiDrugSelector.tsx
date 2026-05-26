import { drugs, type DrugId } from "../../data/drugs";

interface Props {
  selected: DrugId[];
  onChange: (drugIds: DrugId[]) => void;
  className?: string;
}

export default function MultiDrugSelector({ selected, onChange, className = "" }: Props) {
  function toggle(drugId: DrugId) {
    if (selected.includes(drugId)) {
      if (selected.length === 1) return; // always keep at least one selected
      onChange(selected.filter((id) => id !== drugId));
    } else {
      onChange([...selected, drugId]);
    }
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Object.values(drugs).map((drug) => {
        const isSelected = selected.includes(drug.id);
        return (
          <button
            key={drug.id}
            onClick={() => toggle(drug.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              isSelected
                ? "border-transparent text-white shadow-lg"
                : "border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#475569] bg-[#1E293B]"
            }`}
            style={isSelected ? { backgroundColor: drug.color, borderColor: drug.color } : {}}
          >
            {drug.name}
          </button>
        );
      })}
    </div>
  );
}
