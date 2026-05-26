interface Props {
  label: string;
  value: string;
  subValue?: string;
  accent?: boolean;
}

export default function ResultCard({ label, value, subValue, accent = false }: Props) {
  return (
    <div style={{
      background: "#FBFAF7",
      border: "1px solid #E0DAD0",
      borderRadius: 10,
      padding: "24px 28px",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: "#6B655C",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Fraunces', serif",
        fontWeight: 400,
        fontSize: 40,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        color: accent ? "#3F5D52" : "#1A1815",
      }}>
        {value}
      </div>
      {subValue && (
        <div style={{
          fontSize: 13,
          color: accent ? "#3F5D52" : "#6B655C",
          marginTop: 8,
          fontWeight: accent ? 500 : 400,
        }}>
          {subValue}
        </div>
      )}
    </div>
  );
}
