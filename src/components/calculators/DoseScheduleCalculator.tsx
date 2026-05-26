"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { generateDoseSchedule, formatDoseDate, getDaysUntil } from "../../lib/doseScheduleGenerator";
import { generateIcsFile, downloadIcsFile } from "../../lib/icsGenerator";
import { titrationSchedules } from "../../data/titration";
import { drugs, type DrugId } from "../../data/drugs";
import DrugSelector from "../ui/DrugSelector";

const SAGE = "#3F5D52";
const SAGE_SOFT = "#E8EDE9";
const SAGE_DEEP = "#2A3F38";
const MUTED = "#6B655C";
const RULE = "#E0DAD0";
const INK = "#1A1815";
const INK_2 = "#3A352E";
const PAPER = "#FBFAF7";
const PAPER_2 = "#FFFEFB";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DoseScheduleCalculator() {
  const [drugId, setDrugId] = useState<DrugId>("wegovy");
  const [startDate, setStartDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [alreadyStarted, setAlreadyStarted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [injectionDay, setInjectionDay] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(
    new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
  );

  const drug = drugs[drugId];
  const steps = titrationSchedules[drugId];

  const schedule = useMemo(() => {
    const start = new Date(startDate + "T12:00:00");
    const stepIndex = alreadyStarted ? currentStepIndex : 0;
    return generateDoseSchedule(drugId, start, stepIndex, injectionDay);
  }, [drugId, startDate, alreadyStarted, currentStepIndex, injectionDay]);

  const doseChangeEvents = schedule.filter((dose, index) => {
    if (index === 0) return true;
    return schedule[index - 1].doseMg !== dose.doseMg;
  });

  function handleDrugChange(newDrugId: DrugId) {
    setDrugId(newDrugId);
    setCurrentStepIndex(0);
  }

  function handleDownloadIcs() {
    const icsContent = generateIcsFile(schedule, drug.name);
    downloadIcsFile(icsContent, `${drug.name.toLowerCase()}-dose-schedule.ics`);
  }

  const stepDescriptions: Record<string, string[]> = {
    wegovy: [
      "Your body's getting used to the medication. Nausea and reflux are most common in this window — eat smaller portions and stay hydrated.",
      "Side effects may briefly reappear when stepping up. They usually fade within 1–2 weeks.",
      "Visible weight loss usually begins here. Average of about 4% by end of week 12 in the STEP 1 trial.",
      "The curve starts steepening. If side effects at this step are intolerable, your prescriber may slow your escalation.",
      "The dose used through the STEP 1 trial. Most of your projected weight loss happens between months 4 and 12 on this dose.",
    ],
    ozempic: [
      "Starter dose. Your body is adjusting to the medication.",
      "First escalation. Side effects may briefly reappear.",
      "Maintenance dose for most patients. Continue weekly.",
    ],
    mounjaro: [
      "Starter dose. Nausea is most common in this first month.",
      "First step up. Side effects typically ease within 1–2 weeks.",
      "Visible weight changes begin for most patients.",
      "Curve continues steepening toward higher doses.",
      "Nearing therapeutic range for most patients.",
      "Maximum approved dose — the SURMOUNT-1 trial maintenance dose.",
    ],
    zepbound: [
      "Starter dose. Your body is adjusting to the medication.",
      "First escalation. Side effects may briefly reappear.",
      "Visible weight changes begin for most patients.",
      "Curve continues steepening toward higher doses.",
      "Nearing therapeutic range for most patients.",
      "Maximum dose — the SURMOUNT-1 trial maintenance dose.",
    ],
  };

  const descriptions = stepDescriptions[drugId] ?? [];

  return (
    <div className="dose-calc-grid">
      {/* Inputs */}
      <aside className="calc-inputs" style={{
        background: PAPER,
        border: `1px solid ${RULE}`,
        borderRadius: 10,
        padding: 28,
      }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 6, color: INK }}>
          Your starting point
        </h3>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>
          Then a clear timeline appears on the right.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Medication */}
          <div className="field">
            <label>Medication</label>
            <DrugSelector selected={drugId} onChange={handleDrugChange} />
          </div>

          {/* Start date */}
          <div className="field">
            <label>{alreadyStarted ? "Date you started" : "First dose date"}</label>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
            <span className="hint">The day of your first injection.</span>
          </div>

          {/* Injection day */}
          <div className="field">
            <label>Injection day of week</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {DAY_NAMES.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setInjectionDay(index as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
                  style={{
                    padding: "7px 10px",
                    border: injectionDay === index ? `1px solid ${SAGE}` : `1px solid ${RULE}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    background: injectionDay === index ? SAGE_SOFT : PAPER_2,
                    color: injectionDay === index ? SAGE : MUTED,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: injectionDay === index ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
            <span className="hint">Same day each week.</span>
          </div>

          {/* Already started toggle */}
          <div>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: MUTED,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              <button
                role="switch"
                aria-checked={alreadyStarted}
                onClick={() => setAlreadyStarted((prev) => !prev)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  border: "none",
                  cursor: "pointer",
                  background: alreadyStarted ? SAGE : RULE,
                  position: "relative",
                  transition: "background 0.15s",
                  flexShrink: 0,
                }}
              >
                <span style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: PAPER,
                  top: 3,
                  left: alreadyStarted ? 21 : 3,
                  transition: "left 0.15s",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }} />
              </button>
              I've already started
            </label>

            {alreadyStarted && (
              <div className="field" style={{ marginTop: 12 }}>
                <label>Current dose</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {steps.map((step, index) => (
                    <button
                      key={step.doseMg}
                      type="button"
                      onClick={() => setCurrentStepIndex(index)}
                      style={{
                        padding: "8px 14px",
                        border: currentStepIndex === index ? `1px solid ${SAGE}` : `1px solid ${RULE}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        background: currentStepIndex === index ? SAGE : PAPER_2,
                        color: currentStepIndex === index ? PAPER : MUTED,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        transition: "all 0.15s",
                      }}
                    >
                      {step.doseMg} mg
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Result */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Schedule card */}
        <div style={{ background: PAPER, border: `1px solid ${RULE}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{
            padding: "24px 28px",
            borderBottom: `1px solid ${RULE}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
          }}>
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, marginBottom: 4, color: INK }}>
                Your {drug.name} escalation plan
              </h3>
              <p style={{ fontSize: 13, color: MUTED }}>
                Per FDA prescribing information. Each step is four weeks before increasing.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={handleDownloadIcs}
                className="btn btn-s"
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                ⤓ Calendar (.ics)
              </button>
              <button
                onClick={() => window.print()}
                className="btn btn-s"
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                Print PDF
              </button>
            </div>
          </div>

          {/* Steps */}
          {doseChangeEvents.map((doseEvent, index) => {
            const daysUntil = getDaysUntil(doseEvent.date);
            const isPast = daysUntil < 0;
            const isMaintenance = doseEvent.isMaintenance;
            const isFirst = index === 0;

            return (
              <div
                key={`${doseEvent.date.toISOString()}-${doseEvent.doseMg}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 100px",
                  padding: "24px 28px",
                  borderBottom: index === doseChangeEvents.length - 1 ? "none" : `1px solid ${RULE}`,
                  gap: 24,
                  alignItems: "flex-start",
                  position: "relative",
                  background: isMaintenance ? `linear-gradient(to right, ${SAGE_SOFT} 0%, ${PAPER} 60%)` : undefined,
                  opacity: isPast ? 0.6 : 1,
                }}
                className="step-responsive"
              >
                {/* Vertical connector */}
                {index < doseChangeEvents.length - 1 && (
                  <div style={{
                    position: "absolute",
                    left: 88,
                    top: 50,
                    bottom: -24,
                    width: 1,
                    background: RULE,
                  }} />
                )}

                {/* When */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, position: "relative", paddingLeft: 32 }}>
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 6,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: isMaintenance ? SAGE : PAPER,
                    border: `2px solid ${SAGE}`,
                  }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {isFirst ? "Week 1" : `Week ${index * 4 + 1}`}
                  </span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: INK, fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {formatDoseDate(doseEvent.date)}
                  </span>
                </div>

                {/* What */}
                <div>
                  <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 18, letterSpacing: "-0.01em", marginBottom: 6, color: INK }}>
                    {isMaintenance ? "Maintenance dose" : isFirst ? "Starter dose" : `Step ${index + 1}`}
                  </h4>
                  <p style={{ fontSize: 14, color: INK_2, lineHeight: 1.55, maxWidth: "48ch", margin: 0 }}>
                    {descriptions[index] ?? "Continue per your prescriber's instructions."}
                  </p>
                  {isMaintenance && (
                    <p style={{ marginTop: 8, fontSize: 12, color: MUTED, fontStyle: "italic", fontFamily: "'Fraunces', serif" }}>
                      Your prescriber may adjust this. Some patients do well below the maximum dose.
                    </p>
                  )}
                  {!isPast && !isMaintenance && (
                    <p style={{ marginTop: 6, fontSize: 12, color: MUTED, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
                      {daysUntil > 0 ? `In ${daysUntil} days` : "Today"}
                    </p>
                  )}
                </div>

                {/* Dose */}
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 36,
                  fontWeight: 400,
                  color: SAGE,
                  letterSpacing: "-0.03em",
                  textAlign: "right",
                  lineHeight: 1,
                }}>
                  {doseEvent.doseMg}
                  <span style={{ fontSize: 14, color: MUTED, fontFamily: "'Inter', sans-serif", marginLeft: 2 }}>mg</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Export options */}
        <div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 6, color: INK }}>Take it with you</h3>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>Three ways to keep your schedule somewhere useful.</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
          className="export-responsive"
          >
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="4" width="14" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Calendar file",
                body: "An .ics file with weekly reminders and dose changes. Works in Apple, Google, Outlook.",
                action: handleDownloadIcs,
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 3h8l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M12 3v4h4M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Printable PDF",
                body: "One page, clean type, doctor-readable. Bring it to your appointment.",
                action: () => window.print(),
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 10l3 3 4-4M10 10l3 3 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "Shareable link",
                body: "A URL with no personal info. Send it to yourself, your partner, or your doctor.",
                action: () => navigator.clipboard?.writeText(window.location.href),
              },
            ].map((option) => (
              <button
                key={option.title}
                onClick={option.action}
                style={{
                  background: PAPER,
                  border: `1px solid ${RULE}`,
                  borderRadius: 10,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  transition: "all 0.15s",
                  textAlign: "left",
                  cursor: "pointer",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor = INK;
                  event.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = RULE;
                  event.currentTarget.style.transform = "";
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  background: SAGE_SOFT,
                  color: SAGE,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}>
                  {option.icon}
                </div>
                <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 500, color: INK }}>{option.title}</h4>
                <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, margin: 0 }}>{option.body}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          background: SAGE_SOFT,
          border: `1px solid color-mix(in srgb, ${SAGE} 25%, ${RULE})`,
          borderRadius: 10,
          padding: "20px 24px",
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: SAGE, marginTop: 2 }}>
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: 14, color: INK_2, lineHeight: 1.55, margin: 0 }}>
            <strong style={{ color: SAGE_DEEP, fontWeight: 600 }}>This is the manufacturer's recommended schedule.</strong>{" "}
            Your prescriber may modify it — especially if side effects persist, if you're transitioning from another GLP-1, or if you've reached a satisfactory weight before the maintenance dose. Always follow the schedule your doctor gives you over the one on this page.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .step-responsive {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .export-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
