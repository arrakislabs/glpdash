"use client";

import { useState, useMemo } from "react";
import { drugPricing } from "../../data/pricing";
import { drugs, type DrugId } from "../../data/drugs";
import MultiDrugSelector from "../ui/MultiDrugSelector";
import AffiliateDisclosure from "../ui/AffiliateDisclosure";

const SAGE = "#3F5D52";
const MUTED = "#6B655C";
const RULE = "#E0DAD0";
const RULE_SOFT = "#EDE7DC";
const INK = "#1A1815";
const INK_2 = "#3A352E";
const PAPER = "#FBFAF7";
const PAPER_2 = "#FFFEFB";
const SAGE_SOFT = "#E8EDE9";
const SAGE_DEEP = "#2A3F38";

const CHANNEL_LABELS: Record<string, string> = {
  retail: "Retail (cash)",
  goodRx: "GoodRx coupon",
  insurance: "With insurance",
  telehealth: "Telehealth",
};

type TimeHorizon = "monthly" | "annually";

export default function CostComparisonCalculator() {
  const [selectedDrugs, setSelectedDrugs] = useState<DrugId[]>(["wegovy", "wegovy-hd", "ozempic", "mounjaro", "zepbound"]);
  const [showInsurance, setShowInsurance] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("monthly");

  const multiplier = timeHorizon === "annually" ? 12 : 1;
  const perLabel = timeHorizon === "monthly" ? "/ month" : "/ year";

  const rows = useMemo(() => {
    return selectedDrugs.map((drugId) => {
      const pricing = drugPricing[drugId];
      const drug = drugs[drugId];

      const channels = {
        retail: pricing.retailMonthly * multiplier,
        goodRx: pricing.goodRxMonthly * multiplier,
        insurance: pricing.withInsuranceEstimate !== null ? pricing.withInsuranceEstimate * multiplier : null,
        telehealth: pricing.telehealthMonthly * multiplier,
      };

      const validPrices = Object.values(channels).filter((value): value is number => value !== null);
      const minPrice = Math.min(...validPrices);

      return { drug, pricing, channels, minPrice };
    });
  }, [selectedDrugs, multiplier]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 32 }}>
      {/* Filters */}
      <div style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        padding: "24px 0",
        borderBottom: `1px solid ${RULE}`,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Show
          </span>
          <MultiDrugSelector selected={selectedDrugs} onChange={setSelectedDrugs} />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              View
            </span>
            <div className="unit-tog">
              <button
                className={timeHorizon === "monthly" ? "active" : ""}
                onClick={() => setTimeHorizon("monthly")}
              >
                Monthly
              </button>
              <button
                className={timeHorizon === "annually" ? "active" : ""}
                onClick={() => setTimeHorizon("annually")}
              >
                Annual
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Insurance
            </span>
            <div className="unit-tog">
              <button
                className={!showInsurance ? "active" : ""}
                onClick={() => setShowInsurance(false)}
              >
                No
              </button>
              <button
                className={showInsurance ? "active" : ""}
                onClick={() => setShowInsurance(true)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing table */}
      <div style={{ background: PAPER, border: `1px solid ${RULE}`, borderRadius: 10, overflow: "hidden" }}>
        {/* Table header — desktop */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `1.4fr repeat(${showInsurance ? 4 : 3}, 1fr) 1fr`,
          background: INK,
          color: PAPER,
          padding: "16px 24px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          gap: 12,
          alignItems: "center",
        }}
        className="price-head-responsive"
        >
          <span>Medication</span>
          <span>Retail (cash)</span>
          <span>GoodRx coupon</span>
          {showInsurance && <span>With insurance</span>}
          <span>Telehealth</span>
          <span></span>
        </div>

        {/* Rows */}
        {rows.map((row) => {
          const channels = [
            "retail",
            "goodRx",
            ...(showInsurance ? ["insurance"] : []),
            "telehealth",
          ] as Array<keyof typeof row.channels>;

          return (
            <div
              key={row.drug.id}
              style={{
                display: "grid",
                gridTemplateColumns: `1.4fr repeat(${showInsurance ? 4 : 3}, 1fr) 1fr`,
                padding: "24px",
                borderBottom: `1px solid ${RULE}`,
                gap: 12,
                alignItems: "center",
                transition: "background 0.15s",
              }}
              className="price-row-responsive"
              onMouseEnter={(event) => (event.currentTarget.style.background = PAPER_2)}
              onMouseLeave={(event) => (event.currentTarget.style.background = "")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.01em" }}>
                  {row.drug.name}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {row.drug.genericName.toLowerCase()}
                </span>
              </div>

              {channels.map((channel) => {
                const price = row.channels[channel];
                const isBest = price !== null && price === row.minPrice;
                return (
                  <div key={channel} style={{ position: "relative" }}>
                    {price !== null ? (
                      <>
                        {isBest && (
                          <span style={{
                            position: "absolute",
                            left: -14,
                            top: 6,
                            color: SAGE,
                            fontSize: 11,
                          }}>★</span>
                        )}
                        <span style={{
                          fontFamily: "'Fraunces', serif",
                          fontSize: 24,
                          fontWeight: 400,
                          color: isBest ? SAGE : INK,
                          letterSpacing: "-0.02em",
                        }}>
                          ${price.toLocaleString()}
                        </span>
                        <span style={{
                          display: "block",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          color: MUTED,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          marginTop: 2,
                        }}>
                          {perLabel}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED }}>—</span>
                    )}
                  </div>
                );
              })}

              <div>
                <a
                  href="/weight-loss-timeline"
                  style={{ fontSize: 13, color: SAGE, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  Project results →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginTop: 12,
      }}
      className="legend-responsive"
      >
        {[
          { title: "Retail (cash)", body: "What the pharmacy charges if you walk in with no coupon and no insurance. Use it as the upper bound, not the expected price." },
          { title: "GoodRx coupon", body: "The discount cards anyone can use without insurance. Honored at most major U.S. pharmacy chains." },
          { title: "★ With insurance", body: "Estimated copay if your plan covers the medication for your indication. Many plans require prior authorization.", star: true },
          { title: "Telehealth", body: "Subscription pricing through licensed online providers (e.g. Ro, Hims). Brand-name only — compounded options are excluded." },
        ].map((item) => (
          <div key={item.title} style={{ background: PAPER, border: `1px solid ${RULE}`, borderRadius: 8, padding: 18 }}>
            <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 6, color: INK }}>
              {item.star && <span style={{ color: SAGE }}>★ </span>}
              {item.star ? "With insurance" : item.title}
            </h4>
            <p style={{ fontSize: 13, color: INK_2, lineHeight: 1.55, margin: 0 }}>{item.body}</p>
          </div>
        ))}
      </div>

      {/* Insurance card */}
      <div style={{
        background: SAGE_SOFT,
        border: `1px solid color-mix(in srgb, ${SAGE} 25%, ${RULE})`,
        borderRadius: 10,
        padding: 28,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
        alignItems: "center",
        marginTop: 4,
      }}
      className="insurance-responsive"
      >
        <div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 500, marginBottom: 8, color: INK }}>
            A note about the insurance column.
          </h3>
          <p style={{ fontSize: 14, color: INK_2, lineHeight: 1.6, margin: "0 0 10px" }}>
            This reflects the <strong>manufacturer savings card</strong> rate, available with most commercial insurance that covers the medication — not a guarantee of coverage. If your plan doesn't cover it for weight loss (very common for Wegovy and Zepbound), you'll fall back to the cash or telehealth column.
          </p>
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 64, lineHeight: 1, textAlign: "center", color: SAGE, fontWeight: 400, letterSpacing: "-0.03em" }}>
          ~63%
          <sub style={{ fontSize: 18, color: INK_2, fontWeight: 400, display: "block", marginTop: 8, fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            of commercial plans cover at least one GLP-1 for weight loss
          </sub>
        </div>
      </div>

      {/* Method */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
        background: RULE,
        border: `1px solid ${RULE}`,
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 4,
      }}
      className="method-responsive"
      >
        {[
          {
            title: "Where the retail prices come from",
            body: "Average cash price across the five largest U.S. pharmacy chains (CVS, Walgreens, Walmart, Kroger, Costco), pulled monthly.",
            code: "avg(CVS, WAG, WMT, KR, COST)",
          },
          {
            title: "Where the telehealth prices come from",
            body: "Median monthly subscription price across major providers offering brand-name GLP-1s. Not promotional or first-month rates.",
            code: "median(Ro, Hims, Found, Sequence)",
          },
          {
            title: "What we don't show",
            body: "Compounded semaglutide and tirzepatide. They can be cheaper but are not FDA-approved formulations; safety and consistency vary by source.",
            code: "↳ See \"compounding\" in About",
          },
        ].map((col) => (
          <div key={col.title} style={{ background: PAPER, padding: 24 }}>
            <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 8, color: INK }}>{col.title}</h4>
            <p style={{ fontSize: 13, color: INK_2, lineHeight: 1.6, margin: "0 0 12px" }}>{col.body}</p>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: MUTED,
              padding: "10px 12px",
              background: RULE_SOFT,
              borderRadius: 6,
            }}>
              {col.code}
            </div>
          </div>
        ))}
      </div>

      <AffiliateDisclosure />

      <style>{`
        @media (max-width: 980px) {
          .price-head-responsive { display: none !important; }
          .price-row-responsive { grid-template-columns: 1fr 1fr !important; gap: 12px 18px !important; padding: 20px !important; }
          .legend-responsive { grid-template-columns: 1fr 1fr !important; }
          .insurance-responsive { grid-template-columns: 1fr !important; }
          .method-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
