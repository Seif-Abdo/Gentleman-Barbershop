import { AgeGroupDistributionItem, DashboardKPIs, NormalizedFeedback, ThemeMetricItem } from "./types";

export interface InsightItem {
  id: string;
  type: "alert" | "success" | "info";
  textAr: string;
  textEn: string;
}

export function generateInsights(
  feedbacks: NormalizedFeedback[],
  kpis: DashboardKPIs,
  ageDistribution: AgeGroupDistributionItem[],
  themeMetrics: ThemeMetricItem[]
): InsightItem[] {
  const insights: InsightItem[] = [];

  // Age group insight
  const youths = ageDistribution.find((a) => a.id === "youths");
  const elderly = ageDistribution.find((a) => a.id === "elderly");
  if (youths && elderly && youths.count > 0 && elderly.count > 0) {
    if (Math.abs(youths.avgShopRating - elderly.avgShopRating) >= 0.3) {
      const higher = youths.avgShopRating > elderly.avgShopRating ? "الشباب" : "كبار السن";
      const higherEn = youths.avgShopRating > elderly.avgShopRating ? "Youths" : "Elderly";
      insights.push({
        id: "age-gap",
        type: "info",
        textAr: `تقييم شريحة ${higher} للمحل أعلى بوضوح (${youths.avgShopRating} مقابل ${elderly.avgShopRating}).`,
        textEn: `${higherEn} clients rate the shop noticeably higher (${youths.avgShopRating} vs ${elderly.avgShopRating}).`,
      });
    }
  }

  // Top complaint theme
  const topComplaint = [...themeMetrics].sort((a, b) => b.negativeMentions - a.negativeMentions)[0];
  if (topComplaint && topComplaint.negativeMentions > 0) {
    insights.push({
      id: "top-complaint",
      type: "alert",
      textAr: `أكثر ملاحظة سلبية تكراراً تدور حول "${topComplaint.labelAr}" (${topComplaint.negativeMentions} شكوى).`,
      textEn: `Most frequent area for improvement: "${topComplaint.labelEn}" (${topComplaint.negativeMentions} mentions).`,
    });
  }

  // Best barber recognition
  if (kpis.bestBarber && kpis.bestBarber.count >= 5) {
    insights.push({
      id: "best-barber",
      type: "success",
      textAr: `الحلاق الأعلى تقييماً هذا الشهر هو "${kpis.bestBarber.name}" بمتوسط ${kpis.bestBarber.avgRating} من 5 (${kpis.bestBarber.count} تقييم).`,
      textEn: `Highest-rated barber this period is "${kpis.bestBarber.name}" with ${kpis.bestBarber.avgRating} stars (${kpis.bestBarber.count} reviews).`,
    });
  }

  // Positive satisfaction rate
  if (kpis.positiveSharePct >= 80) {
    insights.push({
      id: "high-satisfaction",
      type: "success",
      textAr: `نسبة الرضا العام ممتازة: ${kpis.positiveSharePct}% من العملاء منحوا تقييماً 4 أو 5 نجوم.`,
      textEn: `Strong customer satisfaction: ${kpis.positiveSharePct}% of reviews are 4 or 5 stars.`,
    });
  } else if (kpis.lowRatingCount > 0) {
    insights.push({
      id: "low-rating-warning",
      type: "alert",
      textAr: `يوجد ${kpis.lowRatingCount} استجابات حصلت على نجمتين أو أقل تتطلب مراجعة فورية.`,
      textEn: `There are ${kpis.lowRatingCount} low-rating responses (<= 2 stars) flagged for follow-up.`,
    });
  }

  return insights;
}
