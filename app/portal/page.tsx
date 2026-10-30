"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { DashboardData, NormalizedFeedback } from "@/lib/types";
import {
  Users,
  Star,
  TrendingUp,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  Search,
  CheckCircle,
  Award,
  Phone,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { AGE_GROUPS } from "@/config/age-groups";

export default function PortalDashboardPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  // Filters
  const [dateRange, setDateRange] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");
  const [barber, setBarber] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Check Auth & Load Branches
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.isAuthenticated) {
          router.push("/portal/login");
        } else {
          setCurrentUser(authData.user);
          if (authData.user.role === "branch_admin") {
            setSelectedBranch(authData.user.branchId || "zahraa-maadi");
          }
        }
      })
      .catch(() => router.push("/portal/login"));

    fetch("/api/branches")
      .then((res) => res.json())
      .then((bList) => {
        if (Array.isArray(bList) && bList.length > 0) {
          setBranches(bList);
        }
      })
      .catch(() => {});
  }, [router]);

  // 2. Fetch Analytics
  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        branchId: selectedBranch,
        dateRange,
        ageGroup,
        barber,
      });

      const res = await fetch(`/api/analytics?${params.toString()}`);
      if (res.status === 401) {
        router.push("/portal/login");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, selectedBranch, dateRange, ageGroup, barber]);

  const exportCSV = () => {
    if (!data || !data.recentFeedbacks.length) return;
    const headers = [
      "ID",
      "Branch",
      "Timestamp",
      "ClientName",
      "ClientPhone",
      "Age",
      "AgeGroup",
      "Barber",
      "BarberRating",
      "ShopRating",
      "BarberFeedback",
      "ShopFeedback",
      "Suggestion",
      "Sentiment",
    ];

    const rows = data.recentFeedbacks.map((f) => [
      f.id,
      f.branchId,
      f.timestamp,
      `"${(f.clientName || "").replace(/"/g, '""')}"`,
      `"${f.clientPhone || ""}"`,
      f.age ?? "",
      f.ageGroup,
      `"${f.barber.replace(/"/g, '""')}"`,
      f.barberRating,
      f.shopRating,
      `"${f.barberFeedback.replace(/"/g, '""')}"`,
      `"${f.shopFeedback.replace(/"/g, '""')}"`,
      `"${f.suggestion.replace(/"/g, '""')}"`,
      f.sentiment,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gentleman_${selectedBranch}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentUser) return null;

  const kpis = data?.kpis;
  const filteredFeedbacks = (data?.recentFeedbacks || []).filter((f) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (f.clientName && f.clientName.toLowerCase().includes(term)) ||
      (f.clientPhone && f.clientPhone.includes(term)) ||
      f.barber.toLowerCase().includes(term) ||
      f.barberFeedback.toLowerCase().includes(term) ||
      f.shopFeedback.toLowerCase().includes(term) ||
      f.suggestion.toLowerCase().includes(term)
    );
  });

  const activeBranchName =
    selectedBranch === "all"
      ? locale === "ar" ? "جميع الفروع (المجمّع)" : "All Branches (Consolidated)"
      : branches.find((b) => b.id === selectedBranch)?.nameAr || selectedBranch;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-ivory">
      {/* Executive Portal Navigation */}
      <PortalNav
        user={currentUser}
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={(b) => setSelectedBranch(b)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Scope Banner & Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-gold uppercase tracking-wider">
                {locale === "ar" ? "مؤشرات الأداء اللحظية" : "Live Executive Metrics"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-1">
              {activeBranchName}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl border border-border hover:border-gold text-ivory-muted hover:text-gold bg-surface transition-all"
              title="تحديث البيانات"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gold/40 hover:border-gold bg-surface-2 text-gold text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{locale === "ar" ? "تصدير البيانات CSV" : "Export CSV"}</span>
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="gold-card p-4 rounded-2xl flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gold shrink-0">
            <Filter className="w-4 h-4" />
            <span>{locale === "ar" ? "الفلاتر:" : "Filters:"}</span>
          </div>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
          >
            <option value="all">{locale === "ar" ? "كل الفترات" : "All Time"}</option>
            <option value="today">{locale === "ar" ? "اليوم فقط" : "Today"}</option>
            <option value="7d">{locale === "ar" ? "آخر 7 أيام" : "Last 7 Days"}</option>
            <option value="30d">{locale === "ar" ? "آخر 30 يوم" : "Last 30 Days"}</option>
            <option value="90d">{locale === "ar" ? "آخر 90 يوم" : "Last 90 Days"}</option>
          </select>

          {/* Age Group */}
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
          >
            <option value="all">{locale === "ar" ? "جميع الفئات العمرية" : "All Age Groups"}</option>
            <option value="young">{locale === "ar" ? "صغار (<18)" : "Young (<18)"}</option>
            <option value="youths">{locale === "ar" ? "شباب (18–44)" : "Youths (18–44)"}</option>
            <option value="elderly">{locale === "ar" ? "كبار السن (45+)" : "Elderly (45+)"}</option>
            <option value="unknown">{locale === "ar" ? "غير محدد" : "Unknown"}</option>
          </select>
        </div>

        {/* KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="gold-card p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-ivory-muted uppercase">
                {locale === "ar" ? "إجمالي التقييمات" : "Responses"}
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-gold font-serif">
                {kpis.totalResponses}
              </p>
              <span className="text-[10px] text-green-400 font-semibold">
                +{kpis.periodChangePct}% {locale === "ar" ? "مقارنة بالفترة السابقة" : "vs prev"}
              </span>
            </div>

            <div className="gold-card p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-ivory-muted uppercase">
                {locale === "ar" ? "تقييم الصالون العام" : "Shop Rating"}
              </span>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-gold font-serif">
                  {kpis.avgShopRating}
                </p>
                <span className="text-xs text-ivory-muted">/ 5</span>
              </div>
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${s <= Math.round(kpis.avgShopRating) ? "fill-gold" : "text-border"}`}
                  />
                ))}
              </div>
            </div>

            <div className="gold-card p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-ivory-muted uppercase">
                {locale === "ar" ? "متوسط تقييم الحلاقين" : "Barbers Rating"}
              </span>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-gold font-serif">
                  {kpis.avgBarberRating}
                </p>
                <span className="text-xs text-ivory-muted">/ 5</span>
              </div>
              <span className="text-[10px] text-ivory-muted">
                {locale === "ar" ? "عبر حلاقي الفرع" : "Across staff"}
              </span>
            </div>

            <div className="gold-card p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-ivory-muted uppercase">
                {locale === "ar" ? "نسبة الرضا العام" : "Positive Share"}
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-gold font-serif">
                {kpis.positiveSharePct}%
              </p>
              <span className="text-[10px] text-ivory-muted">
                {locale === "ar" ? "تقييم 4 أو 5 نجوم" : "Rated 4-5 stars"}
              </span>
            </div>

            <div className="gold-card p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-ivory-muted uppercase">
                {locale === "ar" ? "تنبيهات الملاحظات" : "Low Rating Alerts"}
              </span>
              <p
                className={`text-2xl sm:text-3xl font-extrabold font-serif ${
                  kpis.lowRatingCount > 0 ? "text-red-400" : "text-gold"
                }`}
              >
                {kpis.lowRatingCount}
              </p>
              <span className="text-[10px] text-ivory-muted">
                {locale === "ar" ? "نجمتين أو أقل" : "Rated <= 2 stars"}
              </span>
            </div>

            <div className="gold-card p-5 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-ivory-muted uppercase">
                {locale === "ar" ? "الحلاق الأكثر تميزاً" : "Top Barber"}
              </span>
              <p className="text-lg font-bold text-gold truncate">
                {kpis.bestBarber ? kpis.bestBarber.name : "—"}
              </p>
              <span className="text-[10px] text-ivory-muted">
                {kpis.bestBarber ? `${kpis.bestBarber.avgRating} ★ (${kpis.bestBarber.count})` : "N/A"}
              </span>
            </div>
          </div>
        )}

        {/* AI Rule-based Insights */}
        {data?.insights && data.insights.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{locale === "ar" ? "تحليلات وتوصيات النظام الذكية" : "Actionable Insights"}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.insights.map((ins) => (
                <div
                  key={ins.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    ins.type === "alert"
                      ? "bg-red-950/20 border-red-500/40 text-red-300"
                      : ins.type === "success"
                      ? "bg-green-950/20 border-green-500/40 text-green-300"
                      : "bg-surface-2 border-gold/40 text-gold-light"
                  }`}
                >
                  {ins.type === "alert" ? (
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 shrink-0 text-gold mt-0.5" />
                  )}
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {locale === "ar" ? ins.textAr : ins.textEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Age Distribution */}
          <div className="gold-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ivory">
                  {locale === "ar" ? "توزيع العملاء حسب الفئة العمرية" : "Age-Group Distribution"}
                </h3>
                <p className="text-xs text-ivory-muted">
                  {locale === "ar" ? "صغار (<18) · شباب (18–44) · كبار السن (45+)" : "Young · Youths · Elderly"}
                </p>
              </div>
              <Users className="w-5 h-5 text-gold" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.ageDistribution || []}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {(data?.ageDistribution || []).map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141414",
                      borderColor: "#2A2418",
                      borderRadius: "12px",
                      color: "#F5F0E1",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Shop Rating by Age */}
          <div className="gold-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ivory">
                  {locale === "ar" ? "متوسط تقييم الصالون حسب الفئة العمرية" : "Rating by Age Segment"}
                </h3>
                <p className="text-xs text-ivory-muted">
                  {locale === "ar" ? "يكشف أي الشرائح أكثر أو أقل رضا" : "Segment satisfaction"}
                </p>
              </div>
              <Star className="w-5 h-5 text-gold" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.shopRatingByAge || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2418" />
                  <XAxis dataKey="ageGroup" stroke="#A39E8F" fontSize={11} />
                  <YAxis domain={[0, 5]} stroke="#A39E8F" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141414",
                      borderColor: "#2A2418",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="avgRating" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Barber Leaderboard */}
          <div className="gold-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ivory">
                  {locale === "ar" ? "لوحة صدارة الحلاقين" : "Barbers Leaderboard"}
                </h3>
                <p className="text-xs text-ivory-muted">
                  {locale === "ar" ? "ترتيب الحلاقين حسب متوسط التقييم" : "Ranked by avg score"}
                </p>
              </div>
              <Award className="w-5 h-5 text-gold" />
            </div>

            <div className="space-y-3 pt-2">
              {(data?.barberLeaderboard || []).length === 0 ? (
                <p className="text-xs text-ivory-muted text-center py-6">لا توجد تقييمات للحلاقين في هذا النطاق.</p>
              ) : (
                (data?.barberLeaderboard || []).map((b, idx) => (
                  <div
                    key={b.name}
                    className="p-3.5 rounded-xl bg-surface-2 border border-border flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-bold text-gold font-serif">
                        #{idx + 1}
                      </span>
                      <span className="text-sm font-bold text-ivory">{b.name}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-gold font-serif">{b.avgRating} ★</span>
                      <span className="text-xs text-ivory-muted block">
                        {b.count} {locale === "ar" ? "تقييم" : "reviews"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Trends */}
          <div className="gold-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ivory">
                  {locale === "ar" ? "تطور التقييمات الأسبوعي" : "Weekly Rating Trends"}
                </h3>
                <p className="text-xs text-ivory-muted">
                  {locale === "ar" ? "مقارنة متوسط تقييم الصالون والحلاقين" : "Shop vs Barbers trend"}
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.weeklyTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2418" />
                  <XAxis dataKey="week" stroke="#A39E8F" fontSize={11} />
                  <YAxis domain={[3, 5]} stroke="#A39E8F" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141414",
                      borderColor: "#2A2418",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgShop"
                    name={locale === "ar" ? "تقييم الصالون" : "Shop"}
                    stroke="#D4AF37"
                    strokeWidth={2.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgBarber"
                    name={locale === "ar" ? "تقييم الحلاقين" : "Barbers"}
                    stroke="#E8CB6E"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Client Feedback Feed with Phone Numbers */}
        <div className="gold-card p-6 sm:p-7 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-ivory">
                {locale === "ar" ? "سجل آراء العملاء وأرقام الهواتف" : "Client Feedback & Contact Registry"}
              </h3>
              <p className="text-xs text-ivory-muted">
                {locale === "ar"
                  ? "يتضمن أرقام هواتف العملاء المسجلة لاستخدامها في المتابعة وحملات الواتساب"
                  : "Includes client phone numbers for VIP follow-ups & WhatsApp broadcasts"}
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={locale === "ar" ? "بحث بالاسم أو الهاتف أو الملاحظات..." : "Search name, phone, comments..."}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-ivory-muted absolute top-3 left-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-8 text-ivory-muted text-sm">
                {locale === "ar" ? "لا توجد ملاحظات تطابق معايير البحث." : "No records match search criteria."}
              </div>
            ) : (
              filteredFeedbacks.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border space-y-2 transition-all ${
                    item.isLowRating
                      ? "bg-red-950/15 border-red-500/40"
                      : "bg-surface-2 border-border hover:border-gold/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ivory">
                        {item.clientName || (locale === "ar" ? "عميل جنتل مان" : "Client")}
                      </span>
                      {item.clientPhone && (
                        <span className="flex items-center gap-1 font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
                          <Phone className="w-3 h-3" />
                          <span>{item.clientPhone}</span>
                        </span>
                      )}
                      <span className="text-ivory-muted">·</span>
                      <span className="text-gold font-semibold">
                        فرع: {branches.find((b) => b.id === item.branchId)?.nameAr || item.branchId}
                      </span>
                      <span className="text-ivory-muted">·</span>
                      <span className="text-ivory font-semibold">حلاق: {item.barber}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          AGE_GROUPS[item.ageGroup]?.badgeClass
                        }`}
                      >
                        {AGE_GROUPS[item.ageGroup]?.labelAr}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gold font-bold">
                        صالون: {item.shopRating}★ | حلاق: {item.barberRating}★
                      </span>
                      <span className="text-ivory-muted text-[11px]">{item.dateDisplay}</span>
                    </div>
                  </div>

                  {item.barberFeedback && (
                    <p className="text-xs text-ivory leading-relaxed">
                      <span className="text-gold font-semibold">عن الحلاق: </span>
                      {item.barberFeedback}
                    </p>
                  )}

                  {item.shopFeedback && (
                    <p className="text-xs text-ivory-muted leading-relaxed">
                      <span className="text-gold-light font-semibold">عن الفرع: </span>
                      {item.shopFeedback}
                    </p>
                  )}

                  {item.suggestion && (
                    <p className="text-xs text-ivory-muted italic bg-surface/60 p-2 rounded-lg border border-border">
                      <span className="text-gold font-semibold">اقتراح: </span>
                      {item.suggestion}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
