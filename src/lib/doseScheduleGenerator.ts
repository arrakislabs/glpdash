import { addWeeks, nextDay, format, isBefore, addDays } from "date-fns";
import type { DrugId } from "../data/drugs";
import { titrationSchedules } from "../data/titration";

export interface ScheduledDose {
  date: Date;
  doseMg: number;
  label: string;
  stepNumber: number;
  isMaintenance: boolean;
  isCurrentStep: boolean;
  isUpcoming: boolean;
}

export function generateDoseSchedule(
  drugId: DrugId,
  startDate: Date,
  currentStepIndex: number,
  injectionDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
): ScheduledDose[] {
  const steps = titrationSchedules[drugId];
  const doses: ScheduledDose[] = [];
  const now = new Date();

  // Find the first injection date on or after startDate that falls on the chosen day
  let firstInjectionDate = startDate;
  const startDay = startDate.getDay();
  if (startDay !== injectionDayOfWeek) {
    firstInjectionDate = nextDay(startDate, injectionDayOfWeek as Parameters<typeof nextDay>[1]);
  }

  let currentDate = firstInjectionDate;

  for (let stepIndex = currentStepIndex; stepIndex < steps.length; stepIndex++) {
    const step = steps[stepIndex];
    const weeksForStep = step.isMaintenance ? 12 : step.durationWeeks;

    for (let week = 0; week < weeksForStep; week++) {
      const injectionDate = addWeeks(currentDate, week);
      doses.push({
        date: injectionDate,
        doseMg: step.doseMg,
        label: step.label,
        stepNumber: step.stepNumber,
        isMaintenance: step.isMaintenance,
        isCurrentStep: stepIndex === currentStepIndex && week === 0,
        isUpcoming: !isBefore(injectionDate, addDays(now, -1)),
      });
    }

    currentDate = addWeeks(currentDate, weeksForStep);
  }

  return doses;
}

export function formatDoseDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
