"use client";

import React from "react";
import { useBranch } from "./BranchContext";
import { useLanguage } from "./LanguageContext";
import { MapPin, Clock, Phone, Scissors, Check, X, ArrowLeft, ArrowRight } from "lucide-react";

export function BranchModal() {
  const { branches, currentBranchId, switchBranch, isBranchModalOpen, setIsBranchModalOpen } =
    useBranch();
  const { locale, dir } = useLanguage();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  if (!isBranchModalOpen) return null;

  return (
    <div
      onClick={() => setIsBranchModalOpen(false)}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-surface border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-gold-glow max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={() => setIsBranchModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-surface-2 text-ivory-muted hover:text-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pr-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold">
            <Scissors className="w-6 h-6 -rotate-45" />
          </div>
          <h2 className="text-2xl font-bold text-ivory">
            {locale === "ar" ? "اختر فرع صالون جنتل مان" : "Select Your Gentleman Branch"}
          </h2>
          <p className="text-xs text-ivory-muted">
            {locale === "ar"
              ? "اختر الفرع الأقرب إليك لعرض الحلاقين، الخدمات، وتفاصيل التواصل الخاصة به."
              : "Choose the branch nearest to you to explore its master barbers and details."}
          </p>
        </div>

        <div className="space-y-3.5">
          {branches.map((branch) => {
            const isSelected = branch.id === currentBranchId;
            return (
              <div
                key={branch.id}
                onClick={() => switchBranch(branch.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-gold/15 border-gold shadow-gold-glow"
                    : "bg-surface-2 border-border hover:border-gold/50 text-ivory"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-ivory">
                      {locale === "ar" ? branch.nameAr : branch.nameEn}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold text-bg flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{locale === "ar" ? "الفرع الحالي" : "Current"}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gold">
                    {locale === "ar" ? branch.taglineAr : branch.taglineEn}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-ivory-muted pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{locale === "ar" ? branch.addressAr : branch.addressEn}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-gold text-bg"
                        : "bg-surface border border-border text-ivory hover:text-gold"
                    }`}
                  >
                    <span>{locale === "ar" ? "زيارة الفرع" : "Enter Branch"}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
