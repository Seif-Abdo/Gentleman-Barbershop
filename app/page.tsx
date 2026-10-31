"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { Scissors, MapPin, Clock, Phone, Sparkles, ArrowLeft, ArrowRight, Users, CheckCircle2 } from "lucide-react";

export default function BranchSelectorLandingPage() {
  const { locale, dir } = useLanguage();
  const router = useRouter();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [savedBranch, setSavedBranch] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("gentleman_branch");
    if (saved) {
      setSavedBranch(saved);
    }

    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBranches(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectBranch = (branchId: string) => {
    localStorage.setItem("gentleman_branch", branchId);
    router.push(`/${branchId}`);
  };

  const getBarberCount = (branchId: string) => {
    if (branchId === "zahraa-maadi") return 6;
    if (branchId === "nasr-city") return 5;
    if (branchId === "new-maadi") return 3;
    return 4;
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2 border border-gold/40 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold tracking-wider text-gold uppercase">
              {locale === "ar" ? "صالون جنتل مان للرجال · 3 فروع بالقاهرة" : "Gentleman Barbershop · 3 Cairo Branches"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ivory tracking-tight leading-tight">
            {locale === "ar" ? (
              <>
                مرحباً بك في عالم <span className="gold-text-gradient font-serif">جنتل مان</span>
                <br />
                <span className="text-2xl sm:text-4xl font-bold text-ivory/90">
                  يرجى اختيار الفرع الأقرب إليك
                </span>
              </>
            ) : (
              <>
                Welcome to <span className="gold-text-gradient font-serif">Gentleman</span>
                <br />
                <span className="text-2xl sm:text-4xl font-bold text-ivory/90">
                  Please Select Your Preferred Branch
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-ivory-muted max-w-2xl mx-auto">
            {locale === "ar"
              ? "لكل فرع فريق عمله المميز وتفاصيل الخدمات والأسعار الخاصة به. اضغط على فرعك للمتابعة."
              : "Each branch features its dedicated master barbers and services menu. Click your branch to proceed."}
          </p>
        </div>

        {/* 3 Branches Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {branches.map((branch) => {
            const isPrevious = savedBranch === branch.id;
            const barberCount = getBarberCount(branch.id);

            return (
              <div
                key={branch.id}
                onClick={() => handleSelectBranch(branch.id)}
                className={`gold-card rounded-3xl p-7 flex flex-col justify-between cursor-pointer group hover:border-gold hover:scale-[1.02] transition-all relative ${
                  isPrevious ? "border-gold shadow-gold-glow" : ""
                }`}
              >
                {/* Badge if it was their previously visited branch */}
                {isPrevious && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[11px] font-bold bg-gold text-bg flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{locale === "ar" ? "زيارتك السابقة" : "Last Visited"}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border group-hover:border-gold flex items-center justify-center text-gold transition-colors">
                    <Scissors className="w-7 h-7 -rotate-45" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-ivory group-hover:text-gold transition-colors">
                      {locale === "ar" ? branch.nameAr : branch.nameEn}
                    </h3>
                    <p className="text-xs text-gold mt-1 font-medium">
                      {locale === "ar" ? branch.taglineAr : branch.taglineEn}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 text-xs text-ivory-muted">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{locale === "ar" ? branch.addressAr : branch.addressEn}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{locale === "ar" ? branch.hoursAr : branch.hoursEn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gold shrink-0" />
                      <span className="font-semibold text-ivory">
                        {barberCount} {locale === "ar" ? "حلاقين محترفين معتمدين" : "Master Barbers"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-6">
                  <button
                    type="button"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-surface-2 border border-gold/40 group-hover:bg-gold group-hover:text-bg group-hover:border-gold text-gold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{locale === "ar" ? "دخول صفحة الفرع" : "Enter Branch"}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <p className="text-center text-xs text-ivory-muted">
          {locale === "ar"
            ? "يمكنك تغيير الفرع في أي وقت من خلال الشريط العلوي بالموقع."
            : "You can change branches at any time using the selector in the top bar."}
        </p>
      </div>
    </div>
  );
}
