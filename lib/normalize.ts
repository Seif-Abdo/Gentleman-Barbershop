import { classifyAge } from "@/config/age-groups";
import { FORM_CONFIG } from "@/config/form.config";
import { extractThemes } from "@/config/themes";
import { NormalizedFeedback, SentimentType } from "./types";

/**
 * Converts text rating (ممتاز / جيد جدا / etc) or numeric string to 1-5 number
 */
export function parseRating(val: any): number {
  if (typeof val === "number" && val >= 1 && val <= 5) return val;
  const str = String(val || "").trim();
  if (FORM_CONFIG.reverseScaleMap[str]) {
    return FORM_CONFIG.reverseScaleMap[str];
  }
  const parsed = parseInt(str, 10);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) return parsed;
  return 3; // safe fallback
}

/**
 * Derives sentiment from overall ratings
 */
export function deriveSentiment(shopRating: number, barberRating: number): SentimentType {
  const avg = (shopRating + barberRating) / 2;
  if (avg >= 3.8) return "positive";
  if (avg <= 2.5) return "negative";
  return "neutral";
}

/**
 * Normalizes a single feedback row from Sheets or Web submission
 */
export function normalizeRecord(raw: {
  id?: string;
  timestamp?: string | Date;
  age?: number | string | null;
  barber?: string;
  barberRating?: any;
  barberFeedback?: string;
  barberLikes?: string;
  barberImprovements?: string;
  shopRating?: any;
  shopFeedback?: string;
  shopLikes?: string;
  shopImprovements?: string;
  suggestion?: string;
}): NormalizedFeedback {
  const dateObj = raw.timestamp ? new Date(raw.timestamp) : new Date();
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  const iso = validDate.toISOString();
  const dateDisplay = iso.split("T")[0];

  const parsedAge =
    raw.age !== undefined && raw.age !== null && String(raw.age).trim() !== ""
      ? parseInt(String(raw.age).trim(), 10)
      : null;
  const safeAge = parsedAge !== null && !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 120 ? parsedAge : null;
  const ageGroup = classifyAge(safeAge);

  const barber = String(raw.barber || "سعيد").trim();
  const barberRating = parseRating(raw.barberRating);
  const shopRating = parseRating(raw.shopRating);

  const barberFeedback = String(
    raw.barberFeedback ||
      [raw.barberLikes ? `أعجبني: ${raw.barberLikes}` : "", raw.barberImprovements ? `ملاحظات: ${raw.barberImprovements}` : ""]
        .filter(Boolean)
        .join(" | ")
  ).trim();

  const shopFeedback = String(
    raw.shopFeedback ||
      [raw.shopLikes ? `أعجبني: ${raw.shopLikes}` : "", raw.shopImprovements ? `ملاحظات: ${raw.shopImprovements}` : ""]
        .filter(Boolean)
        .join(" | ")
  ).trim();

  const suggestion = String(raw.suggestion || "").trim();

  const allText = `${barberFeedback} ${shopFeedback} ${suggestion}`;
  const themes = extractThemes(allText);
  const sentiment = deriveSentiment(shopRating, barberRating);
  const isLowRating = shopRating <= 2 || barberRating <= 2;

  return {
    id: raw.id || `fb-${validDate.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: iso,
    dateDisplay,
    age: safeAge,
    ageGroup,
    barber,
    barberRating,
    barberFeedback,
    barberLikes: raw.barberLikes,
    barberImprovements: raw.barberImprovements,
    shopRating,
    shopFeedback,
    shopLikes: raw.shopLikes,
    shopImprovements: raw.shopImprovements,
    suggestion,
    sentiment,
    themes,
    isLowRating,
  };
}
