"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { WhatsAppCampaign, WhatsAppTemplate, WhatsAppSettings } from "@/lib/types";
import {
  Send,
  Users,
  Settings,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Eye,
  Calendar,
  Lock,
  Layers,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function WhatsAppCampaignsPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [selectedBranchNav, setSelectedBranchNav] = useState<string>("all");

  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [audienceData, setAudienceData] = useState<{
    totalCount: number;
    withPhoneCount: number;
    sampleList: any[];
  }>({ totalCount: 0, withPhoneCount: 0, sampleList: [] });

  // Targeting Filters
  const [targetBranch, setTargetBranch] = useState<string>("all");
  const [targetAge, setTargetAge] = useState<string>("all");
  const [targetSentiment, setTargetSentiment] = useState<string>("all");

  // Selected Template & Form
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("tpl_vip_welcome");
  const [campaignName, setCampaignName] = useState<string>("");
  const [customDiscountCode, setCustomDiscountCode] = useState<string>("VIP20");

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [waSettings, setWaSettings] = useState<WhatsAppSettings>({
    phoneNumberId: "",
    wabaId: "",
    accessToken: "",
    testRecipientNumber: "+201001234567",
    isEnabled: false,
  });
  const [testNumber, setTestNumber] = useState("");
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [launchSuccess, setLaunchSuccess] = useState<string | null>(null);

  // 1. Auth check (Master Admin only)
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.isAuthenticated) {
          router.push("/portal/login");
        } else if (authData.user.role !== "master_admin") {
          // Restricted
          router.push("/portal");
        } else {
          setCurrentUser(authData.user);
        }
      })
      .catch(() => router.push("/portal/login"));

    fetch("/api/branches")
      .then((res) => res.json())
      .then((bList) => {
        if (Array.isArray(bList) && bList.length > 0) setBranches(bList);
      })
      .catch(() => {});

    fetch("/api/whatsapp-settings")
      .then((res) => res.json())
      .then((s) => {
        if (s && !s.error) {
          setWaSettings(s);
          setTestNumber(s.testRecipientNumber || "");
        }
      })
      .catch(() => {});
  }, [router]);

  // 2. Fetch Audience & Campaigns
  const loadCampaignData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        branchId: targetBranch,
        ageGroup: targetAge,
        sentiment: targetSentiment,
      });

      const res = await fetch(`/api/campaigns?${params.toString()}`);
      if (res.status === 403) {
        router.push("/portal");
        return;
      }
      const data = await res.json();
      setCampaigns(data.campaigns || []);
      setTemplates(data.templates || []);
      setAudienceData(data.audience || { totalCount: 0, withPhoneCount: 0, sampleList: [] });
    } catch (err) {
      console.error("Error loading campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadCampaignData();
    }
  }, [currentUser, targetBranch, targetAge, targetSentiment]);

  // Save WhatsApp Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/whatsapp-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waSettings),
      });
      const data = await res.json();
      if (data.success) {
        setIsSettingsOpen(false);
        setTestStatus("تم حفظ إعدادات واتساب للأعمال بنجاح.");
      }
    } catch {
      setTestStatus("فشل حفظ الإعدادات.");
    }
  };

  // Test Message
  const handleSendTest = async () => {
    setTestStatus("جاري إرسال رسالة الاختبار...");
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isTest: true,
          testNumber,
          templateId: selectedTemplateId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus(`✅ ${data.message}`);
      } else {
        setTestStatus(`❌ ${data.error || "فشل الإرسال"}`);
      }
    } catch (err: any) {
      setTestStatus(`❌ ${err.message}`);
    }
  };

  // Launch Campaign
  const handleLaunchCampaign = async () => {
    if (!campaignName) {
      alert(locale === "ar" ? "يرجى كتابة اسم للحملة" : "Please specify a campaign name");
      return;
    }

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignName,
          templateId: selectedTemplateId,
          targetFilter: {
            branchId: targetBranch,
            ageGroup: targetAge,
            sentiment: targetSentiment,
          },
          audienceCount: audienceData.withPhoneCount || audienceData.totalCount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLaunchSuccess(data.message);
        setCampaignName("");
        loadCampaignData();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!currentUser || currentUser.role !== "master_admin") {
    return null;
  }

  const activeTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const targetBranchName =
    targetBranch === "all"
      ? "جميع الفروع"
      : branches.find((b) => b.id === targetBranch)?.nameAr || targetBranch;

  // Render preview text
  const previewText = activeTemplate
    ? activeTemplate.bodyAr
        .replace(/\{\{name\}\}/g, "أحمد سراج")
        .replace(/\{\{branch\}\}/g, targetBranchName)
        .replace(/\{\{discount\}\}/g, customDiscountCode)
    : "";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-ivory">
      {/* Executive Portal Navigation */}
      <PortalNav
        user={currentUser}
        branches={branches}
        selectedBranch={selectedBranchNav}
        onSelectBranch={(b) => setSelectedBranchNav(b)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Meta API Settings Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-gold uppercase tracking-wider">
                WhatsApp Business Cloud API · Master Admin Suite
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-1">
              {locale === "ar" ? "إدارة حملات الواتساب والتسويق الذكي" : "WhatsApp Campaign Management"}
            </h1>
            <p className="text-xs text-ivory-muted mt-1">
              {locale === "ar"
                ? "استهداف شرائح العملاء بناءً على تقييماتهم، أعمارهم، وفروعهم وإرسال قوالب واتساب موثقة."
                : "Segment customer feedback, target audience groups, and broadcast approved WhatsApp templates."}
            </p>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/40 hover:border-gold bg-surface-2 text-gold text-xs font-bold transition-all shadow-sm"
          >
            <Settings className="w-4 h-4" />
            <span>{locale === "ar" ? "إعدادات الربط مع Meta API" : "Meta API Settings"}</span>
          </button>
        </div>

        {launchSuccess && (
          <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/50 text-green-300 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>{launchSuccess}</span>
            </div>
            <button onClick={() => setLaunchSuccess(null)} className="text-xs underline">
              إغلاق
            </button>
          </div>
        )}

        {/* 1. Target Group & Audience Segmentation Box */}
        <div className="gold-card p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ivory flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                <span>{locale === "ar" ? "1. تحديد شريحة الجمهور المستهدف من البيانات" : "1. Audience Segmentation"}</span>
              </h2>
              <p className="text-xs text-ivory-muted">
                {locale === "ar"
                  ? "اختر المعايير لتصفية العملاء المسجلين في النظام تلقائياً"
                  : "Filter customer database by branch, age, and feedback sentiment"}
              </p>
            </div>

            {/* Dynamic Audience Counter */}
            <div className="bg-surface-2 border border-gold/40 rounded-2xl px-5 py-3 text-right">
              <span className="text-[10px] text-ivory-muted uppercase font-semibold block">
                {locale === "ar" ? "العملاء المطابقين" : "Target Reach"}
              </span>
              <div className="flex items-baseline gap-2 justify-end">
                <span className="text-2xl font-extrabold text-gold font-serif">
                  {audienceData.withPhoneCount}
                </span>
                <span className="text-xs text-ivory-muted">
                  {locale === "ar" ? "برقم هاتف مسجل" : "with phone"}
                </span>
              </div>
            </div>
          </div>

          {/* Segmentation Filter Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ivory-muted">
                {locale === "ar" ? "تصفية حسب الفرع" : "Target Branch"}
              </label>
              <select
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
              >
                <option value="all">🌟 {locale === "ar" ? "جميع الفروع (شامل)" : "All Branches"}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    📍 {locale === "ar" ? b.nameAr : b.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ivory-muted">
                {locale === "ar" ? "الفئة العمرية" : "Target Age Group"}
              </label>
              <select
                value={targetAge}
                onChange={(e) => setTargetAge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
              >
                <option value="all">{locale === "ar" ? "جميع الأعمار" : "All Ages"}</option>
                <option value="young">{locale === "ar" ? "صغار (<18 سنة)" : "Young (<18)"}</option>
                <option value="youths">{locale === "ar" ? "شباب (18–44 سنة)" : "Youths (18–44)"}</option>
                <option value="elderly">{locale === "ar" ? "كبار السن (45+ سنة)" : "Elderly (45+)"}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ivory-muted">
                {locale === "ar" ? "مستوى الرضا والتقييم" : "Customer Sentiment"}
              </label>
              <select
                value={targetSentiment}
                onChange={(e) => setTargetSentiment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
              >
                <option value="all">{locale === "ar" ? "كل العملاء" : "All Sentiments"}</option>
                <option value="positive">{locale === "ar" ? "عملاء VIP والراضين (4-5 نجوم)" : "VIP Promoters (4-5★)"}</option>
                <option value="negative">{locale === "ar" ? "الشكاوى وأصحاب الملاحظات (<=2 نجمة)" : "Service Recovery (<=2★)"}</option>
                <option value="neutral">{locale === "ar" ? "المحايدين (3 نجوم)" : "Neutral (3★)"}</option>
              </select>
            </div>
          </div>

          {/* Sample Audience Table Preview */}
          <div className="space-y-2 pt-2 border-t border-border/80">
            <span className="text-xs font-bold text-ivory flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-gold" />
              <span>{locale === "ar" ? "معاينة عينة من أرقام العملاء المستهدفين:" : "Audience Sample Preview:"}</span>
            </span>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {audienceData.sampleList.length === 0 ? (
                <p className="text-xs text-ivory-muted py-2 text-center">
                  لا يوجد عملاء يطابقون هذه الفلاتر حالياً.
                </p>
              ) : (
                audienceData.sampleList.map((client) => (
                  <div
                    key={client.id}
                    className="p-2.5 rounded-xl bg-surface-2 text-xs flex items-center justify-between gap-2 border border-border/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ivory">{client.name}</span>
                      <span className="text-gold font-mono text-[11px] bg-gold/10 px-2 py-0.5 rounded-md">
                        {client.phone}
                      </span>
                      <span className="text-ivory-muted text-[10px]">
                        ({branches.find((b) => b.id === client.branchId)?.nameAr || client.branchId})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gold text-[11px]">تقييم: {client.shopRating}★</span>
                      <span className="text-ivory-muted text-[10px]">{client.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 2. WhatsApp Template Selector & Smartphone Live Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Template Selector & Launch Form */}
          <div className="lg:col-span-7 gold-card p-6 sm:p-7 rounded-3xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ivory flex items-center gap-2">
                <Send className="w-5 h-5 text-gold" />
                <span>{locale === "ar" ? "2. اختيار قالب رسالة الواتساب" : "2. Choose WhatsApp Template"}</span>
              </h2>
              <p className="text-xs text-ivory-muted">
                {locale === "ar"
                  ? "قوالب رسمية معتمدة تدعم التخصيص باسم العميل، الفرع، وكود الخصم."
                  : "Pre-approved templates with dynamic variables"}
              </p>
            </div>

            {/* Template Cards */}
            <div className="space-y-3">
              {templates.map((tpl) => {
                const isSelected = tpl.id === selectedTemplateId;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gold/15 border-gold shadow-gold-glow"
                        : "bg-surface-2 border-border hover:border-gold/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-ivory">{tpl.nameAr}</span>
                        <p className="text-xs text-ivory-muted line-clamp-2 mt-1">{tpl.bodyAr}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                          tpl.category === "recovery"
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-gold/10 text-gold border border-gold/30"
                        }`}
                      >
                        {tpl.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campaign Name & Launch Form */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ivory-muted">
                  {locale === "ar" ? "اسم الحملة التسويقية" : "Campaign Name"}
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder={locale === "ar" ? "مثال: حملة عروض نهاية الأسبوع فرع مدينة نصر" : "e.g. Weekend Special"}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ivory-muted">
                  {locale === "ar" ? "كود الخصم (إن وجد)" : "Discount Code"}
                </label>
                <input
                  type="text"
                  value={customDiscountCode}
                  onChange={(e) => setCustomDiscountCode(e.target.value)}
                  placeholder="VIP20"
                  className="w-full px-4 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleLaunchCampaign}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gold hover:bg-gold-light text-bg font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {locale === "ar"
                      ? `إطلاق الحملة لـ (${audienceData.withPhoneCount}) عميل`
                      : `Launch Campaign (${audienceData.withPhoneCount} clients)`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSendTest}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-surface-2 border border-gold/40 hover:border-gold text-gold text-xs font-semibold transition-all"
                >
                  {locale === "ar" ? "إرسال اختبار لرقمي" : "Send Test to My Phone"}
                </button>
              </div>

              {testStatus && (
                <p className="text-xs text-gold pt-1 animate-fade-in">{testStatus}</p>
              )}
            </div>
          </div>

          {/* Right: Live Interactive Smartphone Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>{locale === "ar" ? "معاينة الرسالة الحقيقية على هاتف العميل" : "Live WhatsApp Preview"}</span>
            </span>

            {/* Smartphone Frame */}
            <div className="w-[320px] h-[550px] bg-[#111B21] border-4 border-[#2A2F32] rounded-[40px] shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden">
              {/* Speaker & camera notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#2A2F32] rounded-full" />

              {/* WhatsApp Chat Header */}
              <div className="pt-4 pb-2 border-b border-[#222D34] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold font-bold text-xs">
                  G
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Gentleman Barbershop</span>
                  <span className="text-[9px] text-[#25D366]">حساب أعمال رسمي موثّق ✓</span>
                </div>
              </div>

              {/* Chat Message Bubble */}
              <div className="my-auto space-y-2">
                <div className="p-3.5 rounded-2xl rounded-tr-none bg-[#005C4B] text-white text-xs leading-relaxed shadow-md space-y-2">
                  <p>{previewText}</p>
                  <div className="text-right text-[9px] text-white/60">
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ✓✓
                  </div>
                </div>

                <div className="p-2 bg-[#1F2C34] rounded-xl text-center text-[10px] text-gold border border-gold/20">
                  كود الخصم الفوري: <span className="font-mono font-bold">{customDiscountCode}</span>
                </div>
              </div>

              {/* Bottom message input placeholder */}
              <div className="p-2 bg-[#202C33] rounded-2xl flex items-center justify-between text-white/40 text-[11px] px-3">
                <span>اكتب رسالة...</span>
                <span>🎙️</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Previous Broadcast History */}
        <div className="gold-card p-6 sm:p-7 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-ivory flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            <span>{locale === "ar" ? "سجل الحملات السابقة ونتائج الإرسال" : "Campaign History & Logs"}</span>
          </h2>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-xl bg-surface-2 border border-border flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ivory text-sm">{camp.name}</span>
                    <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-bold">
                      {camp.status === "sent" ? "تم الإرسال بنجاح" : camp.status}
                    </span>
                  </div>
                  <p className="text-xs text-ivory-muted">
                    استهداف: {camp.targetFilter.branchId === "all" ? "جميع الفروع" : camp.targetFilter.branchId} · شريحة {camp.targetFilter.ageGroup}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-gold font-serif block">
                    {camp.audienceCount} عميل مستلم
                  </span>
                  <span className="text-[10px] text-ivory-muted">
                    {camp.sentAt ? new Date(camp.sentAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Meta API Settings Modal */}
      {isSettingsOpen && (
        <div
          onClick={() => setIsSettingsOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-surface border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-gold-glow"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-ivory flex items-center gap-2">
                <Settings className="w-5 h-5 text-gold" />
                <span>إعدادات Meta Cloud API لواتساب للأعمال</span>
              </h3>
              <p className="text-xs text-ivory-muted">
                أدخل بيانات حساب المطور الخاص بك على developers.facebook.com
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-ivory-muted">Phone Number ID</label>
                <input
                  type="text"
                  value={waSettings.phoneNumberId}
                  onChange={(e) => setWaSettings({ ...waSettings, phoneNumberId: e.target.value })}
                  placeholder="109876543210..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ivory-muted">WhatsApp Business Account ID (WABA ID)</label>
                <input
                  type="text"
                  value={waSettings.wabaId}
                  onChange={(e) => setWaSettings({ ...waSettings, wabaId: e.target.value })}
                  placeholder="234567890123..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ivory-muted">Permanent System User Access Token</label>
                <input
                  type="password"
                  value={waSettings.accessToken}
                  onChange={(e) => setWaSettings({ ...waSettings, accessToken: e.target.value })}
                  placeholder="EAA..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ivory-muted">رقم هاتف الاختبار (تصلك عليه رسائل التجربة)</label>
                <input
                  type="text"
                  value={waSettings.testRecipientNumber}
                  onChange={(e) => setWaSettings({ ...waSettings, testRecipientNumber: e.target.value })}
                  placeholder="+201001234567"
                  className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gold text-bg font-bold text-xs shadow-gold-glow"
                >
                  حفظ الإعدادات
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-3 rounded-xl bg-surface-2 border border-border text-xs text-ivory-muted"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
