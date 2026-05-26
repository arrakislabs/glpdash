export default function AffiliateDisclosure() {
  return (
    <div style={{
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      background: "#E8EDE9",
      border: "1px solid color-mix(in srgb, #3F5D52 25%, #E0DAD0)",
      borderRadius: 10,
      padding: "20px 24px",
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: "#3F5D52", marginTop: 2 }}>
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <div>
        <p style={{ fontSize: 14, color: "#1A1815", fontWeight: 600, marginBottom: 4 }}>
          Looking to get a GLP-1 prescription?
        </p>
        <p style={{ fontSize: 14, color: "#3A352E", lineHeight: 1.55, margin: 0 }}>
          Several licensed telehealth providers offer online GLP-1 prescriptions. Consult your doctor to find the right option for your situation.
        </p>
      </div>
    </div>
  );
}
