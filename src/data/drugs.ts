export type DrugId = "wegovy" | "ozempic" | "mounjaro" | "zepbound";

export interface Drug {
  id: DrugId;
  name: string;
  genericName: string;
  manufacturer: string;
  activeIngredient: string;
  approvedFor: "weight-loss" | "diabetes" | "both";
  maxDoseMg: number;
  color: string;
  trialName: string;
}

export const drugs: Record<DrugId, Drug> = {
  wegovy: {
    id: "wegovy",
    name: "Wegovy",
    genericName: "Semaglutide 2.4mg",
    manufacturer: "Novo Nordisk",
    activeIngredient: "Semaglutide",
    approvedFor: "weight-loss",
    maxDoseMg: 2.4,
    color: "#10B981",
    trialName: "STEP 1",
  },
  ozempic: {
    id: "ozempic",
    name: "Ozempic",
    genericName: "Semaglutide 1mg",
    manufacturer: "Novo Nordisk",
    activeIngredient: "Semaglutide",
    approvedFor: "diabetes",
    maxDoseMg: 2.0,
    color: "#6366F1",
    trialName: "STEP 2",
  },
  mounjaro: {
    id: "mounjaro",
    name: "Mounjaro",
    genericName: "Tirzepatide 15mg",
    manufacturer: "Eli Lilly",
    activeIngredient: "Tirzepatide",
    approvedFor: "diabetes",
    maxDoseMg: 15,
    color: "#F59E0B",
    trialName: "SURPASS-2",
  },
  zepbound: {
    id: "zepbound",
    name: "Zepbound",
    genericName: "Tirzepatide 15mg",
    manufacturer: "Eli Lilly",
    activeIngredient: "Tirzepatide",
    approvedFor: "weight-loss",
    maxDoseMg: 15,
    color: "#EC4899",
    trialName: "SURMOUNT-1",
  },
};

export const drugList = Object.values(drugs);
