import { AgeGroupId } from "@/config/age-groups";

export type SentimentType = "positive" | "neutral" | "negative";

export interface NormalizedFeedback {
  id: string;
  timestamp: string; // ISO string
  dateDisplay: string; // e.g. 2026-10-30
  branchId: string; // 'zahraa-maadi' | 'nasr-city' | 'abou-dawoud'
  clientPhone?: string; // Captured for loyalty & WhatsApp campaigns
  clientName?: string;
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
  week: string;
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

export interface BranchComparisonItem {
  branchId: string;
  nameAr: string;
  nameEn: string;
  totalFeedbacks: number;
  percentageOfTotal: number;
  avgShopRating: number;
  avgBarberRating: number;
  overallRating: number;
  satisfactionRate: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  topBarber: { name: string; avgRating: number; count: number } | null;
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
  branchComparison?: BranchComparisonItem[];
}

// Multi-admin RBAC
export type AdminRole = "master_admin" | "branch_admin";

export interface AdminUser {
  id: string;
  username: string; // e.g. "admin" or email
  name: string;
  role: AdminRole;
  branchId?: string | "all"; // Specific branch or all
  password: string;
  createdAt: string;
}

// WhatsApp Campaign Management
export interface WhatsAppTemplate {
  id: string;
  name: string;
  nameAr: string;
  category: "promotional" | "satisfaction" | "welcome" | "recovery";
  bodyAr: string;
  bodyEn: string;
  variables: string[]; // ['{{name}}', '{{branch}}', '{{discount}}']
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  templateId: string;
  targetFilter: {
    branchId: string; // 'all' or branch slug
    ageGroup: string; // 'all' or age group
    sentiment: string; // 'all' | 'positive' | 'negative' | 'neutral'
  };
  audienceCount: number;
  status: "draft" | "sent" | "scheduled";
  sentAt?: string;
  createdAt: string;
}

export interface WhatsAppSettings {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  testRecipientNumber: string;
  isEnabled: boolean;
}

// ================= AUDIT LOGS =================
export type AuditLogCategory =
  | "feedback"
  | "barbers"
  | "branches"
  | "admins"
  | "campaigns"
  | "settings"
  | "auth";

export type AuditLogAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "CLEANUP"
  | "STATUS_CHANGE"
  | "LOGIN";

export interface AuditLog {
  id: string;
  timestamp: string; // ISO string
  dateDisplay: string;
  timeDisplay: string;
  userId: string;
  username: string;
  userName: string;
  userRole: "master_admin" | "branch_admin";
  branchId?: string;
  category: AuditLogCategory;
  action: AuditLogAction;
  titleAr: string;
  titleEn: string;
  detailsAr: string;
  detailsEn: string;
  metadata?: Record<string, any>;
}

