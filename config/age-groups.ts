export type AgeGroupId = "young" | "youths" | "elderly" | "unknown";

export interface AgeGroupConfig {
  id: AgeGroupId;
  labelAr: string;
  labelEn: string;
  rangeLabelAr: string;
  rangeLabelEn: string;
  minAge: number | null;
  maxAge: number | null;
  color: string;
  badgeClass: string;
}

export const AGE_GROUPS: Record<AgeGroupId, AgeGroupConfig> = {
  young: {
    id: "young",
    labelAr: "صغار",
    labelEn: "Young",
    rangeLabelAr: "أقل من 18 سنة",
    rangeLabelEn: "Under 18",
    minAge: 0,
    maxAge: 17,
    color: "#E8CB6E",
    badgeClass: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  },
  youths: {
    id: "youths",
    labelAr: "شباب",
    labelEn: "Youths",
    rangeLabelAr: "18 – 44 سنة",
    rangeLabelEn: "18 – 44 yrs",
    minAge: 18,
    maxAge: 44,
    color: "#D4AF37",
    badgeClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  },
  elderly: {
    id: "elderly",
    labelAr: "كبار السن",
    labelEn: "Elderly",
    rangeLabelAr: "45 سنة فأكثر",
    rangeLabelEn: "45+ yrs",
    minAge: 45,
    maxAge: 120,
    color: "#8C6D1F",
    badgeClass: "bg-amber-700/10 text-amber-500 border-amber-700/30",
  },
  unknown: {
    id: "unknown",
    labelAr: "غير محدد",
    labelEn: "Unknown",
    rangeLabelAr: "غير محدد",
    rangeLabelEn: "Not specified",
    minAge: null,
    maxAge: null,
    color: "#525252",
    badgeClass: "bg-neutral-800 text-neutral-400 border-neutral-700",
  },
};

/**
 * Server-side classifier that maps an age number to an age group ID
 */
export function classifyAge(age: number | string | null | undefined): AgeGroupId {
  if (age === null || age === undefined || age === "") return "unknown";
  const num = typeof age === "number" ? age : parseInt(String(age).trim(), 10);
  if (isNaN(num) || num < 1 || num > 120) return "unknown";

  if (num <= 17) return "young";
  if (num <= 44) return "youths";
  return "elderly";
}
