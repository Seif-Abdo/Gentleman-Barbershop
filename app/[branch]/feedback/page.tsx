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
  Heart,
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

  // Form State - strictly un-filled by default
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [barberRating, setBarberRating] = useState<number>(0);
  const [barberLikes, setBarberLikes] = useState<string>("");
  const [barberImprovements, setBarberImprovements] = useState<string>("");

  const [shopRating, setShopRating] = useState<number>(0);
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
        }
      })
      .catch(() => {});
  }, [branchSlug]);

  const parsedAge = age ? parseInt(age, 10) : null;
  const derivedAgeGroup = classifyAge(parsedAge);
  const ageGroupCfg = parsedAge ? AGE_GROUPS[derivedAgeGroup] : null;

  const handleNext = () => {
    setErrorMsg(null);
    if (!age || parseInt(age, 10) < 5) {
      setErrorMsg(
        locale === "ar"
          ? "ياريت تكتب سنك يا غالي عشان نقدر تقييمك صح."
          : "Please enter your age to continue."
      );
      return;
    }
    if (!selectedBarber) {
      setErrorMsg(
        locale === "ar"
          ? "اختار الحلاق اللي ظبطلك الحلاقة يا باشا."
          : "Please select the barber who styled your hair."
      );
      return;
    }
    if (barberRating === 0) {
      setErrorMsg(
        locale === "ar"
          ? "ياريت تحدد تقييمك بالنجوم لشغل الحلاق."
          : "Please rate the barber's service (1-5 stars)."
      );
      return;
    }

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
    setErrorMsg(null);

    if (shopRating === 0) {
      setErrorMsg(
        locale === "ar"
          ? "ياريت تحدد تقييمك بالنجوم لفرع الصالون ككل."
          : "Please give an overall star rating for the shop."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: branchSlug,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          age: age ? parseInt(age, 10) : null,
          barber: selectedBarber,
          barberRating,
          barberLikes: barberLikes.trim(),
          barberImprovements: barberImprovements.trim(),
          shopRating,
          shopLikes: shopLikes.trim(),
          shopImprovements: shopImprovements.trim(),
          suggestion: suggestion.trim(),
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? `فرع: ${branch.nameAr}` : `${branch.nameEn} Branch`}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ivory tracking-tight">
          {locale === "ar" ? "نوّرتنا يا باشا.. قولنا رأيك بصراحة!" : "Share Your Experience with Us"}
        </h1>
        <p className="text-sm sm:text-base text-ivory-muted max-w-xl mx-auto leading-relaxed">
          {locale === "ar"
            ? `رأيك يهمنا من القلب، وبيوصل مباشرة لإدارة فرع ${branch.nameAr} عشان نفضل دايماً رقم واحد في حلاقتك وشياكتك.`
            : `Your honest feedback goes directly to management so we continually elevate your grooming experience.`}
        </p>

        {/* 2-Step Progress Indicator */}
        <div className="pt-6 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={step === 1 ? "text-gold font-extrabold" : "text-ivory-muted"}>
              {locale === "ar" ? "1. شغل وإيد الحلاق" : "1. Barber Feedback"}
            </span>
            <span className={step === 2 ? "text-gold font-extrabold" : "text-ivory-muted"}>
              {locale === "ar" ? "2. قعدة ومستوى المحل" : "2. Shop & Atmosphere"}
            </span>
          </div>
          <div className="h-2.5 w-full bg-[#181818] rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gold transition-all duration-500 rounded-full shadow-gold-glow"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/50 border border-red-500/60 text-red-200 text-sm flex items-center gap-3 animate-shake shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Wizard Form */}
      <form onSubmit={handleSubmit} className="gold-card rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
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
            {/* Optional Client Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-border">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-ivory flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gold" />
                  <span>{locale === "ar" ? "اسمك الكريم (اختياري)" : "Name (Optional)"}</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={locale === "ar" ? "اسمك يا محترم (مثلاً: أحمد، كريم...)" : "Your name"}
                  className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-border focus:border-gold focus:outline-none text-ivory text-sm placeholder:text-ivory-muted/40 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-ivory flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gold" />
                  <span>{locale === "ar" ? "رقم موبايلك / واتساب (اختياري)" : "Phone / WhatsApp (Optional)"}</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-border focus:border-gold focus:outline-none text-ivory text-sm placeholder:text-ivory-muted/40 transition-colors font-mono"
                />
                <p className="text-[11px] text-ivory-muted">
                  {locale === "ar"
                    ? "عشان نبعتلك عروض وخصومات وجلسات ترويق مخصوصة على الواتساب."
                    : "To receive exclusive VIP discounts and grooming treats via WhatsApp."}
                </p>
              </div>
            </div>

            {/* Question 1: Age */}
            <div className="space-y-3 pb-6 border-b border-border">
              <div className="flex items-center justify-between">
                <label className="text-sm sm:text-base font-bold text-ivory flex items-center gap-2">
                  <span>{locale === "ar" ? "1. سنك كام يا غالي؟" : "1. What is your age?"}</span>
                  <span className="text-gold text-xs">*</span>
                </label>
                {ageGroupCfg && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${ageGroupCfg.badgeClass}`}
                  >
                    {locale === "ar" ? ageGroupCfg.labelAr : ageGroupCfg.labelEn} (
                    {locale === "ar" ? ageGroupCfg.rangeLabelAr : ageGroupCfg.rangeLabelEn})
                  </span>
                )}
              </div>
              <input
                type="number"
                min="5"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={locale === "ar" ? "اكتب سنك هنا (مثلاً: 25)" : "e.g. 25"}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-border focus:border-gold focus:outline-none text-ivory text-base placeholder:text-ivory-muted/40 transition-colors"
              />
            </div>

            {/* Question 2: Barber Selection */}
            <div className="space-y-4 pb-6 border-b border-border">
              <div className="space-y-1">
                <label className="text-sm sm:text-base font-bold text-ivory flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-gold" />
                  <span>
                    {locale === "ar"
                      ? `2. مين الحلاق اللي حلقت معاه في فرع ${branch.nameAr}؟`
                      : `2. Which barber styled your hair at ${branch.nameEn}?`}
                  </span>
                  <span className="text-gold text-xs">*</span>
                </label>
                <p className="text-xs text-ivory-muted">
                  {locale === "ar"
                    ? "اضغط على اسم الحلاق لاختياره:"
                    : "Tap to select the barber who serviced you:"}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {barbers.map((barber) => {
                  const isSelected = selectedBarber === barber.nameAr;
                  return (
                    <button
                      type="button"
                      key={barber.id}
                      onClick={() => {
                        setSelectedBarber(barber.nameAr);
                        setErrorMsg(null);
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 group cursor-pointer ${
                        isSelected
                          ? "bg-gold/20 border-gold shadow-gold-glow scale-[1.03]"
                          : "bg-[#181818] border-border hover:border-gold/50 text-ivory"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base transition-colors ${
                          isSelected ? "bg-gold text-surface-dark font-extrabold" : "bg-surface-2 text-gold group-hover:bg-gold/15"
                        }`}
                      >
                        {barber.nameAr[0]}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${isSelected ? "text-gold font-extrabold" : "text-ivory"}`}>
                          {locale === "ar" ? barber.nameAr : barber.nameEn}
                        </p>
                        <p className="text-[10px] text-ivory-muted line-clamp-1 mt-0.5">
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
                    ? `3. تقييمك لشغل وإيد الحلاق (${selectedBarber || "الحلاق"}) كان إيه؟`
                    : `3. Rate your experience with (${selectedBarber || "Barber"})`}
                  <span className="text-gold text-xs ml-1">*</span>
                </label>
                {barberRating > 0 && (
                  <span className="text-xs font-bold text-gold">
                    {FORM_RATING_SCALES[barberRating]}
                  </span>
                )}
              </div>

              {/* Star Rating Buttons */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => {
                      setBarberRating(stars);
                      setErrorMsg(null);
                    }}
                    className="flex flex-col items-center gap-1 group focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-115 ${
                        stars <= barberRating
                          ? "text-gold fill-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                          : "text-border hover:text-gold/50"
                      }`}
                    />
                    <span
                      className={`text-[10px] sm:text-xs font-semibold ${
                        stars === barberRating ? "text-gold font-bold" : "text-ivory-muted"
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
                  ? "4. إيه أكتر حاجة عجبتك في إيد الحلاق وشغله؟ (اختياري)"
                  : "4. What did you like most about the barber? (optional)"}
              </label>
              <textarea
                rows={2}
                value={barberLikes}
                onChange={(e) => setBarberLikes(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مثال: إيده خفيفة، فاهم في التدريج والمقص، محترم وبيسمع الكلام، دقيق في التحديد..."
                    : "e.g. Precise fade, gentle hands, polite, listened carefully..."
                }
                className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-border focus:border-gold focus:outline-none text-ivory text-sm placeholder:text-ivory-muted/40 transition-colors"
              />
            </div>

            {/* Question 5: Barber Improvements */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-ivory">
                {locale === "ar"
                  ? "5. إيه اللي الحلاق محتاج ياخد باله منه المرة الجاية؟ (اختياري)"
                  : "5. What could the barber improve? (optional)"}
              </label>
              <textarea
                rows={2}
                value={barberImprovements}
                onChange={(e) => setBarberImprovements(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مثال: مياخدش وقت طويل، يظبط التحديد أكتر، ميركزش في الموبايل..."
                    : "e.g. Timing, more attention to edge lines, focus on the client..."
                }
                className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-border focus:border-gold focus:outline-none text-ivory text-sm placeholder:text-ivory-muted/40 transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>
                {locale === "ar" ? "المتابعة لتقييم المحل والخدمة" : "Proceed to Shop Review"}
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
                    ? `6. تقييمك العام لفرع ${branch.nameAr} والقعدة والضيافة؟`
                    : `6. Your overall rating of ${branch.nameEn} branch`}
                  <span className="text-gold text-xs ml-1">*</span>
                </label>
                {shopRating > 0 && (
                  <span className="text-xs font-bold text-gold">
                    {FORM_RATING_SCALES[shopRating]}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => {
                      setShopRating(stars);
                      setErrorMsg(null);
                    }}
                    className="flex flex-col items-center gap-1 group focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-115 ${
                        stars <= shopRating
                          ? "text-gold fill-gold drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                          : "text-border hover:text-gold/50"
                      }`}
                    />
                    <span
                      className={`text-[10px] sm:text-xs font-semibold ${
                        stars === shopRating ? "text-gold font-bold" : "text-ivory-muted"
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
                  ? `7. إيه اللي عجبك في المكان والفرع؟ (اختياري)`
                  : "7. What did you enjoy about the shop? (optional)"}
              </label>
              <textarea
                rows={2}
                value={shopLikes}
                onChange={(e) => setShopLikes(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مثال: النظافة والريحة الحلوة، التكييف، حسن الاستقبال، الفوط السخنة، شياكة الديكور..."
                    : "e.g. Hygiene, welcoming staff, cool AC, luxury vibe, hot towels..."
                }
                className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-border focus:border-gold focus:outline-none text-ivory text-sm placeholder:text-ivory-muted/40 transition-colors"
              />
            </div>

            {/* Question 8: Shop Improvements */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-ivory">
                {locale === "ar"
                  ? "8. في أي حاجة ضايقتك في المكان أو محتاجة تظبيط؟ (اختياري)"
                  : "8. Anything you'd like us to improve in the shop? (optional)"}
              </label>
              <textarea
                rows={2}
                value={shopImprovements}
                onChange={(e) => setShopImprovements(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "مثال: وقت الانتظار والدور، درجة التكييف، مواعيد الزحمة..."
                    : "e.g. Waiting time, AC temperature, rush hours management..."
                }
                className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-border focus:border-gold focus:outline-none text-ivory text-sm placeholder:text-ivory-muted/40 transition-colors"
              />
            </div>

            {/* Question 9: Best Service Suggestion */}
            <div className="space-y-2 pb-6 border-b border-border">
              <label className="text-xs sm:text-sm font-semibold text-ivory">
                {locale === "ar"
                  ? "9. نفسك نوفر إيه جديد في صالون جنتل مان؟ (اختياري)"
                  : "9. Suggestions for services or perks you'd love to see (optional)"}
              </label>
              <textarea
                rows={2}
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "أي فكرة أو خدمة تحب تلاقيها المرة الجاية... صالونك وتحت أمرك يا باشا!"
                    : "Any new treatment, grooming service or perk you'd love to enjoy..."
                }
                className="w-full px-4 py-3 rounded-xl bg-[#181818] border border-border focus:border-gold focus:outline-none text-ivory text-sm placeholder:text-ivory-muted/40 transition-colors"
              />
            </div>

            {/* Privacy notice */}
            <div className="p-4 rounded-xl bg-[#181818] border border-border text-xs text-ivory-muted flex items-start gap-3 leading-relaxed">
              <Shield className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>
                {locale === "ar"
                  ? "إجاباتك سرية تماماً وتصل مباشرة لإدارة صالون جنتل مان لمتابعة الجودة وتقديم أفضل تجربة لعملائنا."
                  : "Your answers are processed confidentially by Gentleman management to ensure top-notch service."}
              </span>
            </div>

            {/* Back & Submit Actions */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="px-6 py-4 rounded-xl text-sm font-semibold border border-border hover:border-gold/50 bg-[#181818] text-ivory flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowPrev className="w-4 h-4" />
                <span>{locale === "ar" ? "السابق" : "Back"}</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>{locale === "ar" ? "جاري الحفظ..." : "Saving..."}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{locale === "ar" ? "إرسال التقييم ✂️" : "Submit Review"}</span>
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
