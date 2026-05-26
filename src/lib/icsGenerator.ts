import { format, subDays } from "date-fns";
import type { ScheduledDose } from "./doseScheduleGenerator";

function formatIcsDate(date: Date): string {
  return format(date, "yyyyMMdd");
}

function generateUid(date: Date, doseMg: number): string {
  return `glpdash-${formatIcsDate(date)}-${doseMg}mg@glpdash.com`;
}

export function generateIcsFile(doses: ScheduledDose[], drugName: string): string {
  const doseChanges = doses.filter((dose, index) => {
    if (index === 0) return true;
    return doses[index - 1].doseMg !== dose.doseMg;
  });

  const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

  const events = doseChanges
    .map((dose) => {
      const dateStr = formatIcsDate(dose.date);
      const reminderDate = formatIcsDate(subDays(dose.date, 1));
      const summary =
        dose.stepNumber === 0
          ? `${drugName} — Start ${dose.doseMg} mg (Starter Dose)`
          : `${drugName} — Increase to ${dose.doseMg} mg`;

      return [
        "BEGIN:VEVENT",
        `UID:${generateUid(dose.date, dose.doseMg)}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:Your ${drugName} dose changes to ${dose.doseMg} mg today. Consult your prescriber with any questions.`,
        "BEGIN:VALARM",
        "TRIGGER:-P1D",
        "ACTION:DISPLAY",
        `DESCRIPTION:Reminder: ${summary} tomorrow`,
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GLPDash//Dose Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${drugName} Dose Schedule`,
    events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
