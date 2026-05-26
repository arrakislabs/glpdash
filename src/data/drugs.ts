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
  citation: string;
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
    color: "#3F5D52",
    trialName: "STEP 1",
    citation: "N Engl J Med 384:989 (2021)",
  },
  ozempic: {
    id: "ozempic",
    name: "Ozempic",
    genericName: "Semaglutide 1mg",
    manufacturer: "Novo Nordisk",
    activeIngredient: "Semaglutide",
    approvedFor: "diabetes",
    maxDoseMg: 2.0,
    color: "#5B7B8A",
    trialName: "STEP 2",
    citation: "Lancet 397:971 (2021)",
  },
  mounjaro: {
    id: "mounjaro",
    name: "Mounjaro",
    genericName: "Tirzepatide 15mg",
    manufacturer: "Eli Lilly",
    activeIngredient: "Tirzepatide",
    approvedFor: "diabetes",
    maxDoseMg: 15,
    color: "#A05A3D",
    trialName: "SURPASS-2",
    citation: "N Engl J Med 385:503 (2021)",
  },
  zepbound: {
    id: "zepbound",
    name: "Zepbound",
    genericName: "Tirzepatide 15mg",
    manufacturer: "Eli Lilly",
    activeIngredient: "Tirzepatide",
    approvedFor: "weight-loss",
    maxDoseMg: 15,
    color: "#85684A",
    trialName: "SURMOUNT-1",
    citation: "N Engl J Med 387:205 (2022)",
  },
};

export const drugList = Object.values(drugs);
