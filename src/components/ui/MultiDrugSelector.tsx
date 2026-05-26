import { drugs, type DrugId } from "../../data/drugs";

interface Props {
  selected: DrugId[];
  onChange: (drugIds: DrugId[]) => void;
}

export default function MultiDrugSelector({ selected, onChange }: Props) {
  function toggle(drugId: DrugId) {
    if (selected.includes(drugId)) {
      if (selected.length === 1) return;
      onChange(selected.filter((id) => id !== drugId));
    } else {
      onChange([...selected, drugId]);
    }
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {Object.values(drugs).map((drug) => {
        const isSelected = selected.includes(drug.id);
        return (
          <button
            key={drug.id}
            type="button"
            onClick={() => toggle(drug.id)}
            style={{
              padding: "8px 16px",
              border: isSelected ? "1px solid #3F5D52" : "1px solid #E0DAD0",
              borderRadius: 24,
              cursor: "pointer",
              background: isSelected ? "#3F5D52" : "#FBFAF7",
              color: isSelected ? "#FBFAF7" : "#6B655C",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.15s",
              fontWeight: 500,
            }}
          >
            {drug.name}
          </button>
        );
      })}
    </div>
  );
}
