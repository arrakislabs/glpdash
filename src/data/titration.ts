import type { DrugId } from "./drugs";

export interface DoseStep {
  stepNumber: number;
  doseMg: number;
  durationWeeks: number;
  label: string;
  isMaintenance: boolean;
}

// FDA-approved dose escalation schedules per prescribing information
export const titrationSchedules: Record<DrugId, DoseStep[]> = {
  wegovy: [
    { stepNumber: 0, doseMg: 0.25, durationWeeks: 4, label: "0.25 mg — Starter dose", isMaintenance: false },
    { stepNumber: 1, doseMg: 0.5, durationWeeks: 4, label: "0.5 mg", isMaintenance: false },
    { stepNumber: 2, doseMg: 1.0, durationWeeks: 4, label: "1.0 mg", isMaintenance: false },
    { stepNumber: 3, doseMg: 1.7, durationWeeks: 4, label: "1.7 mg", isMaintenance: false },
    { stepNumber: 4, doseMg: 2.4, durationWeeks: 52, label: "2.4 mg — Maintenance dose", isMaintenance: true },
  ],
  ozempic: [
    { stepNumber: 0, doseMg: 0.25, durationWeeks: 4, label: "0.25 mg — Starter dose", isMaintenance: false },
    { stepNumber: 1, doseMg: 0.5, durationWeeks: 4, label: "0.5 mg", isMaintenance: false },
    { stepNumber: 2, doseMg: 1.0, durationWeeks: 4, label: "1.0 mg", isMaintenance: false },
    { stepNumber: 3, doseMg: 2.0, durationWeeks: 52, label: "2.0 mg — Maintenance dose (if needed)", isMaintenance: true },
  ],
  mounjaro: [
    { stepNumber: 0, doseMg: 2.5, durationWeeks: 4, label: "2.5 mg — Starter dose", isMaintenance: false },
    { stepNumber: 1, doseMg: 5.0, durationWeeks: 4, label: "5.0 mg", isMaintenance: false },
    { stepNumber: 2, doseMg: 7.5, durationWeeks: 4, label: "7.5 mg", isMaintenance: false },
    { stepNumber: 3, doseMg: 10.0, durationWeeks: 4, label: "10.0 mg", isMaintenance: false },
    { stepNumber: 4, doseMg: 12.5, durationWeeks: 4, label: "12.5 mg", isMaintenance: false },
    { stepNumber: 5, doseMg: 15.0, durationWeeks: 52, label: "15.0 mg — Maintenance dose", isMaintenance: true },
  ],
  zepbound: [
    { stepNumber: 0, doseMg: 2.5, durationWeeks: 4, label: "2.5 mg — Starter dose", isMaintenance: false },
    { stepNumber: 1, doseMg: 5.0, durationWeeks: 4, label: "5.0 mg", isMaintenance: false },
    { stepNumber: 2, doseMg: 7.5, durationWeeks: 4, label: "7.5 mg", isMaintenance: false },
    { stepNumber: 3, doseMg: 10.0, durationWeeks: 4, label: "10.0 mg", isMaintenance: false },
    { stepNumber: 4, doseMg: 12.5, durationWeeks: 4, label: "12.5 mg", isMaintenance: false },
    { stepNumber: 5, doseMg: 15.0, durationWeeks: 52, label: "15.0 mg — Maintenance dose", isMaintenance: true },
  ],
};
