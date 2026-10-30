"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { DEFAULT_BARBERS, Barber, getBarbersByBranch } from "@/config/barbers";
import { classifyAge, AGE_GROUPS } from "@/config/age-groups";
import { FORM_RATING_SCALES } from "@/config/form.config";
import {
  Scissors,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Phone,
  User,
  MapPin,
} from "lucide-react";

export default function BranchFeedbackPage({ params }: { params: Promise<{ branch: string }> }) {
  const resolvedParams = use(params);
  const branchSlug = resolvedParams.branch;

  const { locale, dir } = useLanguage();
  const router = useRouter();
  const ArrowNext = dir === "rtl" ? ArrowLeft : ArrowRight;
  const ArrowPrev = dir === "rtl" ? ArrowRight : ArrowLeft;

  const [branch, setBranch] = useState<Branch>(
    DEFAULT_BRANCHES.find((b) => b.id === branchSlug) || DEFAULT_BRANCHES[0]
  );
  const [barbers, setBarbers] = useState<Barber[]>(getBarbersByBranch(branchSlug));

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [age, setAge] = useState<string>("26");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [barberRating, setBarberRating] = useState<number>(5);
  const [barberLikes, setBarberLikes] = useState<string>("");
  const [barberImprovements, setBarberImprovements] = useState<string>("");

  const [shopRating, setShopRating] = useState<number>(5);
  const [shopLikes, setShopLikes] = useState<string>("");
  const [shopImprovements, setShopImprovements] = useState<string>("");
  const [suggestion, setSuggestion] = useState<string>("");

  // Honeypot spam field
  const [honeypot, setHoneypot] = useState<string>("");

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((list: Branch[]) => {
        const found = list.find((b) => b.id === branchSlug);
        if (found) setBranch(found);
      })
      .catch(() => {});

    fetch(`/api/barbers?branchId=${branchSlug}`)
      .then((res) => res.json())
      .then((list: Barber[]) => {
        if (Array.isArray(list) && list.length > 0) {
          setBarbers(list);
          if (!selectedBarber && list[0]) {
            setSelectedBarber(list[0].nameAr);
          }
        }
      })
      .catch(() => {});
  }, [branchSlug]);

  useEffect(() => {
    if (!selectedBarber && barbers.length > 0) {
      setSelectedBarber(barbers[0].nameAr);
    }
  }, [barbers, selectedBarber]);

  const derivedAgeGroup = classifyAge(age ? parseInt(age, 10) : null);
  const ageGroupCfg = AGE_GROUPS[derivedAgeGroup];

  const handleNext = () => {
    if (!selectedBarber) {
      setErrorMsg(locale === "ar" ? "يرجى اختيار اسم الحلاق" : "Please select your barber");
      return;
    }
    setErrorMsg(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: branchSlug,
          clientName,
          clientPhone,
          age: age ? parseInt(age, 10) : null,
          barber: selectedBarber,
          barberRating,
          barberLikes,
          barberImprovements,
          shopRating,
          shopLikes,
          shopImprovements,
          suggestion,
          website_url_check: honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Submission error");
      }

      router.push("/thank-you");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg(
        locale === "ar"
          ? "تعذر إرسال التقييم حالياً، يرجى المحاولة مرة أخرى."
          : "Could not submit review at this moment. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8">
      {/* Title & Progress Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? `تقييم فرع ${branch.nameAr}` : `Review ${branch.nameEn} Branch`}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">
          {locale === "ar" ? "شاركنا رأيك في 60 ثانية" : "Share Your Experience"}
        </h1>
        <p className="text-sm text-ivory-muted">
          {locale === "ar"
            ? `تقييمك يصل مباشرة لإدارة فرع ${branch.nameAr} لمواصلة الارتقاء بالخدمة.`
            : `Your feedback goes directly to ${branch.nameEn} management.`}
        </p>

        {/* 2-Step Progress Indicator */}
        <div className="pt-6 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={step === 1 ? "text-gold" : "text-ivory-muted"}>
              {locale === "ar" ? "1. تقييم الحلاق" : "1. Barber Review"}
            </span>
            <span className={step === 2 ? "text-gold" : "text-ivory-muted"}>
              {locale === "ar" ? "2. تقييم الصالون" : "2. Shop Review"}
            </span>
          </div>
          <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gold transition-all duration-500 rounded-full"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-sm flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Wizard Form */}
      <form onSubmit={handleSubmit} className="gold-card rounded-3xl p-6 sm:p-10 space-y-8">
        <input
          type="text"
          name="website_url_check"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          autoComplete="off"
          tabIndex={-1}
        />

        {/* STEP 1: Barber & Personal Info */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            {/* Optional Client Name & Phone (Feeds WhatsApp VIP campaigns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-border">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-ivory flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gold" />
                  <span>{locale === "ar" ? "الاسم (اختياري)" : "Name (Optional)"}</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={locale === "ar" ? "اسمك الكريم" : "Your name"}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-ivory flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gold" />
                  <span>{locale === "ar" ? "رقم الهاتف / واتساب (اختياري)" : "Phone / WhatsApp (Optional)"}</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
                />
                <p className="text-[10px] text-ivory-muted">
                  {locale === "ar"
                    ? "لتلقي عروض الخصم الملكية وهدايا الـ VIP عبر الواتساب."
                    : "To receive exclusive VIP offers & discounts via WhatsApp."}
                </p>
              </div>
            </div>

            {/* Question 1: Age */}
            <div className="space-y-3 pb-6 border-b border-border">
              <div className="flex items-center justify-between">
                <label className="text-sm sm:text-base font-bold text-ivory flex items-center gap-2">
                  <span>{locale === "ar" ? "1. سنك كام؟" : "1. What is your age?"}</span>
                  <span className="text-gold text-xs">*</span>
                </label>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${ageGroupCfg.badgeClass}`}
                >
                  {locale === "ar" ? ageGroupCfg.labelAr : ageGroupCfg.labelEn} (
                  {locale === "ar" ? ageGroupCfg.rangeLabelAr : ageGroupCfg.rangeLabelEn})
                </span>
              </div>
              <input
                type="number"
                min="5"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={locale === "ar" ? "مثال: 28" : "e.g. 28"}
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-base"
              />
            </div>

            {/* Question 2: Barber Selection (Only for THIS branch) */}
            <div className="space-y-4 pb-6 border-b border-border">
              <label className="text-sm sm:text-base font-bold text-ivory flex items-center gap-2">
                <Scissors className="w-4 h-4 text-gold" />
                <span>
                  {locale === "ar"
                    ? `2. اسم حلاق المرة السابقة في فرع ${branch.nameAr}؟`
                    : `2. Name of your last barber at ${branch.nameEn}?`}
                </span>
                <span className="text-gold text-xs">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {barbers.map((barber) => {
                  const isSelected = selectedBarber === barber.nameAr;
                  return (
                    <button
                      type="button"
                      key={barber.id}
                      onClick={() => setSelectedBarber(barber.nameAr)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                        isSelected
                          ? "bg-gold/15 border-gold shadow-gold-glow scale-[1.02]"
                          : "bg-surface-2 border-border hover:border-gold/50 text-ivory"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isSelected ? "bg-gold text-bg" : "bg-surface text-ivory-muted"
                        }`}
                      >
                        {barber.nameAr[0]}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${isSelected ? "text-gold" : "text-ivory"}`}>
                          {locale === "ar" ? barber.nameAr : barber.nameEn}
                        </p>
                        <p className="text-[10px] text-ivory-muted line-clamp-1">
                          {locale === "ar" ? barber.specialtyAr : barber.specialtyEn}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3: Barber Rating (1-5) */}
            <div className="space-y-4 pb-6 border-b border-border">
              <div className="flex items-center justify-between">
                <label className="text-sm sm:text-base font-bold text-ivory">
                  {locale === "ar"
                    ? `3. قيّم حلاق المرة السابقة فقط (${selectedBarber || "الحلاق"})`
                    : `3. Rate your last barber (${selectedBarber})`}
                  <span className="text-gold text-xs ml-1">*</span>
                </label>
                <span className="text-xs font-bold text-gold">
                  {FORM_RATING_SCALES[barberRating]}
                </span>
              </div>

              {/* Star Rating Buttons */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setBarberRating(stars)}
                    className="flex flex-col items-center gap-1 group focus:outline-none"
                  >
                    <Star
                      className={`w-9 h-9 sm:w-12 sm:h-12 transition-transform group-hover:scale-110 ${
                        stars <= barberRating
                          ? "text-gold fill-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                          : "text-border hover:text-gold/50"
                      }`}
                    />
                    <span
                      className={`text-[10px] sm:text-xs font-semibold ${
                        stars === barberRating ? "text-gold" : "text-ivory-muted"
                      }`}
                    >
                      {FORM_RATING_SCALES[stars]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Barber Likes */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-ivory">
                {locale === "ar"
                  ? "4. إيه اللي عجبك في الحلاق؟ (اختياري)"
                  : "4. What did you like about the barber? (optional)"}
              </label>
              <textarea
                rows={2}
                value={barberLikes}
                onChange={(e) => setBarberLikes(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مثال: دقة التدريج، الأمانة، حسن الاستماع للطلب..."
                    : "e.g. Sharp lines, polite, listened well..."
                }
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
              />
            </div>

            {/* Question 5: Barber Improvements */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-ivory">
                {locale === "ar"
                  ? "5. إيه اللي ممكن يتحسن في الحلاق؟ (اختياري)"
                  : "5. What could the barber improve? (optional)"}
              </label>
              <textarea
                rows={2}
                value={barberImprovements}
                onChange={(e) => setBarberImprovements(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مثال: السرعة، مراعاة طول الشعر المطلوب..."
                    : "e.g. Pacing, more attention to requested length..."
                }
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all hover:scale-[1.01]"
            >
              <span>
                {locale === "ar" ? "المتابعة لتقييم الفرع" : "Proceed to Shop Review"}
              </span>
              <ArrowNext className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Shop Review & Suggestions */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            {/* Question 6: Overall Shop Rating */}
            <div className="space-y-4 pb-6 border-b border-border">
              <div className="flex items-center justify-between">
                <label className="text-sm sm:text-base font-bold text-ivory">
                  {locale === "ar"
                    ? `6. تقييمك لفرع ${branch.nameAr} ككل`
                    : `6. Your overall rating of ${branch.nameEn}`}
                  <span className="text-gold text-xs ml-1">*</span>
                </label>
                <span className="text-xs font-bold text-gold">
                  {FORM_RATING_SCALES[shopRating]}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setShopRating(stars)}
                    className="flex flex-col items-center gap-1 group focus:outline-none"
                  >
                    <Star
                      className={`w-9 h-9 sm:w-12 sm:h-12 transition-transform group-hover:scale-110 ${
                        stars <= shopRating
                          ? "text-gold fill-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                          : "text-border hover:text-gold/50"
                      }`}
                    />
                    <span
                      className={`text-[10px] sm:text-xs font-semibold ${
                        stars === shopRating ? "text-gold" : "text-ivory-muted"
                      }`}
                    >
                      {FORM_RATING_SCALES[stars]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 7: Shop Likes */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-ivory">
                {locale === "ar"
                  ? `7. إيه اللي عجبك في فرع ${branch.nameAr}؟ (اختياري)`
                  : "7. What did you like about the shop? (optional)"}
              </label>
              <textarea
                rows={2}
                value={shopLikes}
                onChange={(e) => setShopLikes(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مثال: النظافة، الديكور، المعاملة والضيافة، تعقيم الفوط..."
                    : "e.g. Cleanliness, atmosphere, hospitality, fresh towels..."
                }
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
              />
            </div>

            {/* Question 8: Shop Improvements */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-ivory">
                {locale === "ar"
                  ? "8. إيه اللي ممكن يتحسن في المحل؟ (اختياري)"
                  : "8. What could the shop improve? (optional)"}
              </label>
              <textarea
                rows={2}
                value={shopImprovements}
                onChange={(e) => setShopImprovements(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مثال: وقت الانتظار، درجة التكييف، مواعيد الحجز..."
                    : "e.g. Waiting time, AC temperature, queue management..."
                }
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
              />
            </div>

            {/* Question 9: Best Service Suggestion */}
            <div className="space-y-2 pb-6 border-b border-border">
              <label className="text-xs sm:text-sm font-semibold text-ivory">
                {locale === "ar"
                  ? "9. أضف اقتراحك للحصول على أفضل خدمة (اختياري)"
                  : "9. Your suggestion for the best service (optional)"}
              </label>
              <textarea
                rows={2}
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "أي فكرة جديدة تحب تشوفها في صالون جنتل مان..."
                    : "Any ideas or services you'd love to see..."
                }
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
              />
            </div>

            {/* Privacy notice */}
            <div className="p-3.5 rounded-xl bg-surface-2 border border-border text-[11px] text-ivory-muted flex items-start gap-2.5 leading-relaxed">
              <Shield className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>
                {locale === "ar"
                  ? "يتم استخدام إجاباتك حصرياً لتطوير وتجويد خدمات الصالون وتقديم عروض ملكية لعملائنا الكرام وفقاً لأعلى معايير الخصوصية."
                  : "Your responses are securely processed by management to improve shop standards and provide VIP client rewards."}
              </span>
            </div>

            {/* Back & Submit Actions */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="px-6 py-4 rounded-xl text-sm font-semibold border border-border hover:border-gold/50 bg-surface-2 text-ivory flex items-center gap-2"
              >
                <ArrowPrev className="w-4 h-4" />
                <span>{locale === "ar" ? "السابق" : "Back"}</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <span>{locale === "ar" ? "جاري الحفظ..." : "Saving..."}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{locale === "ar" ? "إرسال التقييم" : "Submit Review"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
