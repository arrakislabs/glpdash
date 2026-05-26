import { drugs, type DrugId } from "../../data/drugs";

interface Props {
  selected: DrugId;
  onChange: (drugId: DrugId) => void;
}

export default function DrugSelector({ selected, onChange }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {Object.values(drugs).map((drug) => {
        const isSelected = selected === drug.id;
        return (
          <button
            key={drug.id}
            type="button"
            onClick={() => onChange(drug.id)}
            style={{
              padding: "12px",
              border: isSelected ? `1px solid #3F5D52` : "1px solid #E0DAD0",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              background: isSelected ? "#E8EDE9" : "#FFFEFB",
              boxShadow: isSelected ? "0 0 0 1px #3F5D52" : "none",
              transition: "all 0.15s",
              textAlign: "left",
            }}
          >
            <span style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              fontWeight: 500,
              color: "#1A1815",
            }}>
              {drug.name}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#6B655C",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              {drug.genericName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
