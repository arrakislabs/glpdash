const SAGE = "#3F5D52";
const MUTED = "#6B655C";
const RULE = "#E0DAD0";
const INK = "#1A1815";
const INK_2 = "#3A352E";
const PAPER = "#FBFAF7";
const SAGE_SOFT = "#E8EDE9";

const PROVIDERS = [
  {
    name: "Ro",
    tagline: "Online visits and brand-name GLP-1 prescriptions shipped to your door.",
    features: ["Wegovy", "Ozempic", "Insurance support"],
    href: "#",
  },
  {
    name: "Hims & Hers",
    tagline: "Licensed providers, personalized weight care, and ongoing clinical support.",
    features: ["Semaglutide", "Tirzepatide", "Ongoing care"],
    href: "#",
  },
  {
    name: "Found",
    tagline: "Weight-focused primary care with GLP-1 prescriptions and health coaching.",
    features: ["GLP-1s", "Coaching", "Insurance accepted"],
    href: "#",
  },
  {
    name: "Sequence",
    tagline: "Specialists in insurance navigation and prior authorization for GLP-1s.",
    features: ["Prior auth help", "Brand-name drugs", "Insurance focus"],
    href: "#",
  },
];

export default function AffiliateDisclosure() {
  return (
    <div id="providers" style={{ marginTop: 8 }}>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 16,
        flexWrap: "wrap",
      }}>
        <div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: INK, marginBottom: 4 }}>
            Accessing care
          </h3>
          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
            Licensed telehealth providers that prescribe GLP-1 medications online.
          </p>
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: MUTED,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          border: `1px solid ${RULE}`,
          padding: "4px 8px",
          borderRadius: 4,
          whiteSpace: "nowrap",
        }}>
          Affiliate disclosure
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="provider-grid">
        {PROVIDERS.map((provider) => (
          <a
            key={provider.name}
            href={provider.href}
            rel="noopener noreferrer sponsored"
            style={{
              display: "flex",
              flexDirection: "column",
              background: PAPER,
              border: `1px solid ${RULE}`,
              borderRadius: 10,
              padding: "20px 22px",
              textDecoration: "none",
              transition: "border-color 0.15s, transform 0.15s",
              gap: 10,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor = SAGE;
              event.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor = RULE;
              event.currentTarget.style.transform = "";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500, color: INK }}>
                {provider.name}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: MUTED,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: `1px solid ${RULE}`,
                padding: "2px 6px",
                borderRadius: 3,
                marginTop: 3,
                flexShrink: 0,
              }}>
                Sponsored
              </span>
            </div>
            <p style={{ fontSize: 13, color: INK_2, lineHeight: 1.5, margin: 0, flexGrow: 1 }}>
              {provider.tagline}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {provider.features.map((feature) => (
                <span key={feature} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: SAGE,
                  background: SAGE_SOFT,
                  padding: "3px 8px",
                  borderRadius: 4,
                  letterSpacing: "0.06em",
                }}>
                  {feature}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: SAGE, marginTop: 2 }}>
              Get started →
            </div>
          </a>
        ))}
      </div>

      <p style={{ fontSize: 12, color: MUTED, marginTop: 12, lineHeight: 1.55 }}>
        GLP Index may earn a referral fee if you start a subscription through one of these links — at no extra cost to you. Calculator inputs are processed entirely in your browser and are never shared with any provider.
      </p>

      <style>{`
        @media (max-width: 680px) {
          .provider-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
