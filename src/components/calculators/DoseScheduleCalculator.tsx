"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { generateDoseSchedule, formatDoseDate, getDaysUntil } from "../../lib/doseScheduleGenerator";
import { generateIcsFile, downloadIcsFile } from "../../lib/icsGenerator";
import { titrationSchedules } from "../../data/titration";
import { drugs, type DrugId } from "../../data/drugs";
import DrugSelector from "../ui/DrugSelector";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DoseScheduleCalculator() {
  const [drugId, setDrugId] = useState<DrugId>("wegovy");
  const [startDate, setStartDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [alreadyStarted, setAlreadyStarted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [injectionDay, setInjectionDay] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6);

  const drug = drugs[drugId];
  const steps = titrationSchedules[drugId];

  const schedule = useMemo(() => {
    const start = new Date(startDate + "T12:00:00");
    const stepIndex = alreadyStarted ? currentStepIndex : 0;
    return generateDoseSchedule(drugId, start, stepIndex, injectionDay);
  }, [drugId, startDate, alreadyStarted, currentStepIndex, injectionDay]);

  const upcomingDoses = schedule.filter((dose) => dose.isUpcoming);
  const nextDoseChange = upcomingDoses.find((dose, index) => {
    if (index === 0) return false;
    return upcomingDoses[index - 1].doseMg !== dose.doseMg;
  });

  function handleDrugChange(newDrugId: DrugId) {
    setDrugId(newDrugId);
    setCurrentStepIndex(0);
  }

  function handleDownloadIcs() {
    const icsContent = generateIcsFile(schedule, drug.name);
    downloadIcsFile(icsContent, `${drug.name.toLowerCase()}-dose-schedule.ics`);
  }

  function handlePrint() {
    window.print();
  }

  const doseChangeEvents = schedule.filter((dose, index) => {
    if (index === 0) return true;
    return schedule[index - 1].doseMg !== dose.doseMg;
  });

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6 space-y-6">
        <h2 className="text-base font-semibold text-[#F8FAFC]">Your schedule</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#94A3B8]">Medication</label>
          <DrugSelector selected={drugId} onChange={handleDrugChange} />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#94A3B8]">
              {alreadyStarted ? "Date you started" : "Planned start date"}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#334155] text-[#F8FAFC] focus:outline-none focus:border-[#10B981] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#94A3B8]">Preferred injection day</label>
            <div className="flex gap-1 flex-wrap">
              {DAY_NAMES.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setInjectionDay(index as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    injectionDay === index
                      ? "bg-[#10B981] text-white"
                      : "bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              role="switch"
              aria-checked={alreadyStarted}
              onClick={() => setAlreadyStarted((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                alreadyStarted ? "bg-[#10B981]" : "bg-[#334155]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-1 ${
                  alreadyStarted ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-[#94A3B8]">I&apos;ve already started</span>
          </div>

          {alreadyStarted && (
            <div className="space-y-2 ml-1">
              <label className="text-sm font-medium text-[#94A3B8]">Current dose</label>
              <div className="flex flex-wrap gap-2">
                {steps.map((step, index) => (
                  <button
                    key={step.doseMg}
                    onClick={() => setCurrentStepIndex(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium tabular-nums transition-all border ${
                      currentStepIndex === index
                        ? "bg-[#10B981] border-[#10B981] text-white"
                        : "bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    {step.doseMg} mg
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next action card */}
      {nextDoseChange && (
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 3v6l4 2" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="9" r="7" stroke="#10B981" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F8FAFC]">
              Next dose increase: {formatDoseDate(nextDoseChange.date)}
            </p>
            <p className="text-sm text-[#94A3B8] mt-0.5">
              Move to{" "}
              <strong className="text-[#10B981] tabular-nums">{nextDoseChange.doseMg} mg</strong>
              {" "}— in{" "}
              <strong className="text-[#F8FAFC]">{getDaysUntil(nextDoseChange.date)} days</strong>
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Dose escalation timeline</h3>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#334155] text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#475569] transition-colors print:hidden"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M3.5 5V2.5h8V5M3.5 10.5h8m-7 2V10.5h6V12.5m-7-3.5H2a.5.5 0 01-.5-.5V5.5A.5.5 0 012 5h11a.5.5 0 01.5.5V9a.5.5 0 01-.5.5h-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
              Print
            </button>
            <button
              onClick={handleDownloadIcs}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-sm font-semibold text-white transition-colors print:hidden"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M7.5 10l-4-4h2.5V2h3v4H11.5L7.5 10zM2 12.5h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add to calendar
            </button>
          </div>
        </div>

        {/* Dose change milestones */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#334155]" />
          <div className="space-y-0">
            {doseChangeEvents.map((doseEvent, index) => {
              const daysUntil = getDaysUntil(doseEvent.date);
              const isPast = daysUntil < 0;
              const isCurrent = doseEvent.isCurrentStep || (index === 0 && !alreadyStarted);

              return (
                <div key={`${doseEvent.date.toISOString()}-${doseEvent.doseMg}`} className="relative flex gap-4 pb-8 last:pb-0">
                  <div className={`shrink-0 z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCurrent
                      ? "bg-[#10B981] border-[#10B981]"
                      : isPast
                      ? "bg-[#334155] border-[#334155]"
                      : "bg-[#0F172A] border-[#334155]"
                  }`}>
                    {isCurrent ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="white" aria-hidden="true">
                        <path d="M8 4a4 4 0 100 8 4 4 0 000-8z"/>
                      </svg>
                    ) : (
                      <span className={`text-xs font-bold tabular-nums ${isPast ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <div className={`flex-1 rounded-xl p-4 border ${
                    isCurrent
                      ? "bg-[#10B981]/10 border-[#10B981]/30"
                      : isPast
                      ? "bg-[#0F172A]/50 border-[#334155]/50 opacity-60"
                      : "bg-[#0F172A] border-[#334155]"
                  }`}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className={`text-sm font-semibold tabular-nums ${isCurrent ? "text-[#10B981]" : "text-[#F8FAFC]"}`}>
                          {doseEvent.doseMg} mg
                          {doseEvent.isMaintenance && (
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                              Maintenance
                            </span>
                          )}
                          {index === 0 && !alreadyStarted && (
                            <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">
                              Starter
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{formatDoseDate(doseEvent.date)}</p>
                      </div>

                      {isCurrent && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#10B981] text-white">
                          You are here
                        </span>
                      )}
                      {!isPast && !isCurrent && (
                        <span className="text-xs tabular-nums text-[#94A3B8]">
                          In {daysUntil} days
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white; color: black; }
          .print\\:hidden { display: none; }
        }
      `}</style>
    </div>
  );
}
