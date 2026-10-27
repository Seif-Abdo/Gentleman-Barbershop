import { AgeGroupId } from "@/config/age-groups";

export type SentimentType = "positive" | "neutral" | "negative";

export interface NormalizedFeedback {
  id: string;
  timestamp: string; // ISO string
  dateDisplay: string; // e.g. 2026-10-27
  age: number | null;
  ageGroup: AgeGroupId;
  barber: string;
  barberRating: number; // 1 to 5
  barberFeedback: string;
  barberLikes?: string;
  barberImprovements?: string;
  shopRating: number; // 1 to 5
  shopFeedback: string;
  shopLikes?: string;
  shopImprovements?: string;
  suggestion: string;
  sentiment: SentimentType;
  themes: string[];
  isLowRating: boolean; // barberRating <= 2 or shopRating <= 2
}

export interface DashboardKPIs {
  totalResponses: number;
  periodChangePct: number;
  avgShopRating: number;
  avgBarberRating: number;
  positiveSharePct: number; // shopRating >= 4
  lowRatingCount: number; // rating <= 2
  bestBarber: { name: string; avgRating: number; count: number } | null;
  lowestBarber: { name: string; avgRating: number; count: number } | null;
}

export interface AgeGroupDistributionItem {
  id: AgeGroupId;
  label: string;
  count: number;
  percentage: number;
  avgShopRating: number;
  color: string;
}

export interface BarberLeaderboardItem {
  name: string;
  avgRating: number;
  count: number;
  isLowSample: boolean; // count < 5
  positiveCount: number;
  negativeCount: number;
}

export interface WeeklyTrendItem {
  week: string; // e.g. "Week 42" or "10/14 - 10/20"
  avgShop: number;
  avgBarber: number;
  count: number;
}

export interface ThemeMetricItem {
  id: string;
  labelAr: string;
  labelEn: string;
  positiveMentions: number;
  negativeMentions: number;
  totalMentions: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  ageDistribution: AgeGroupDistributionItem[];
  shopRatingByAge: { ageGroup: string; avgRating: number; count: number }[];
  barberLeaderboard: BarberLeaderboardItem[];
  barberByAgeMatrix: { barber: string; [ageGroupId: string]: any }[];
  weeklyTrends: WeeklyTrendItem[];
  ratingHistogram: { stars: number; shopCount: number; barberCount: number }[];
  themeMetrics: ThemeMetricItem[];
  insights: { id: string; type: "alert" | "success" | "info"; textAr: string; textEn: string }[];
  recentFeedbacks: NormalizedFeedback[];
}
