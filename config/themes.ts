export interface ThemeKeyword {
  id: string;
  labelAr: string;
  labelEn: string;
  iconName: string;
  keywordsAr: string[];
  keywordsEn: string[];
}

export const THEMES: ThemeKeyword[] = [
  {
    id: "haircut_quality",
    labelAr: "جودة القصة والتصفيف",
    labelEn: "Cut & Styling Quality",
    iconName: "Scissors",
    keywordsAr: ["قصة", "شعر", "استايل", "تدريج", "فيد", "موس", "سشوار", "حلاقة", "تحديد", "دقن", "لحية", "شغل عالي", "فنان", "دقيق"],
    keywordsEn: ["cut", "hair", "fade", "style", "razor", "beard", "shave", "sharp", "precision", "styling"],
  },
  {
    id: "cleanliness",
    labelAr: "النظافة والتعقيم",
    labelEn: "Cleanliness & Hygiene",
    iconName: "Sparkles",
    keywordsAr: ["نظافة", "نظيف", "تعقيم", "فوط", "ريحة", "أدوات", "معقمة", "كرسي", "شياكة", "مرتب"],
    keywordsEn: ["clean", "hygiene", "sanitized", "towel", "fresh", "smell", "tools", "neat", "spotless"],
  },
  {
    id: "waiting_time",
    labelAr: "وقت الانتظار والمواعيد",
    labelEn: "Waiting Time & Punctuality",
    iconName: "Clock",
    keywordsAr: ["انتظار", "دور", "تأخير", "مواعيد", "سريع", "بطيء", "وقت", "زحمة", "حجز", "طابور", "ساعة"],
    keywordsEn: ["wait", "delay", "queue", "punctual", "fast", "slow", "time", "crowd", "appointment"],
  },
  {
    id: "behaviour",
    labelAr: "التعامل والضيافة",
    labelEn: "Staff Hospitality & Attitude",
    iconName: "HeartHandshake",
    keywordsAr: ["معاملة", "ذوق", "محترم", "مبتسم", "ترحيب", "كرم", "شاي", "قهوة", "مؤدب", "اخلاق", "استقبال"],
    keywordsEn: ["service", "friendly", "polite", "respect", "welcome", "hospitality", "staff", "behavior", "smile"],
  },
  {
    id: "price",
    labelAr: "الأسعار والقيمة",
    labelEn: "Pricing & Value",
    iconName: "BadgePercent",
    keywordsAr: ["سعر", "غالي", "رخيص", "مناسب", "فلوس", "عرض", "قيمة", "مبالغ"],
    keywordsEn: ["price", "cost", "expensive", "cheap", "value", "affordable", "deal"],
  },
  {
    id: "atmosphere",
    labelAr: "الأجواء والموسيقى والمكان",
    labelEn: "Atmosphere & Vibe",
    iconName: "Music",
    keywordsAr: ["جو", "أجواء", "تكييف", "موسيقى", "اغاني", "صوت", "ديكور", "شياكة", "فخم", "رايق", "هادي", "اضاءة"],
    keywordsEn: ["music", "vibe", "decor", "air conditioning", "ac", "atmosphere", "luxury", "chill", "lighting"],
  },
];

/**
 * Extracts matching themes from text (combining liked and improvement text)
 */
export function extractThemes(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matched: string[] = [];

  for (const theme of THEMES) {
    const hasAr = theme.keywordsAr.some((kw) => lower.includes(kw.toLowerCase()));
    const hasEn = theme.keywordsEn.some((kw) => lower.includes(kw.toLowerCase()));
    if (hasAr || hasEn) {
      matched.push(theme.id);
    }
  }

  return matched;
}
