"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "./LanguageContext";
import { useBranch } from "./BranchContext";
import { Scissors, Phone, MapPin, Clock, MessageCircle, QrCode } from "lucide-react";

export function Footer() {
  const { locale, t } = useLanguage();
  const { currentBranch, currentBranchId, setIsBranchModalOpen } = useBranch();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info & Active Branch */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-[1px] bg-gradient-to-br from-gold-dark via-gold to-gold-light shadow-gold-glow flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="Gentleman Barbershop"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-wider text-ivory">
                  GENTLEMAN
                </span>
                <span className="text-[10px] text-gold tracking-widest uppercase font-semibold">
                  MOHAMED RIFAI
                </span>
              </div>
            </div>
            <p className="text-sm text-ivory-muted leading-relaxed">
              {locale === "ar" ? currentBranch.taglineAr : currentBranch.taglineEn}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-bold text-start"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {locale === "ar"
                    ? `فرع: ${currentBranch.nameAr} (اضغط لتغيير الفرع)`
                    : `Branch: ${currentBranch.nameEn} (Click to switch)`}
                </span>
              </button>
            </div>
          </div>

          {/* Active Branch Contact Details */}
          <div className="space-y-3">
            <h4 className="text-gold text-sm font-semibold tracking-wider uppercase">
              {locale === "ar"
                ? `معلومات التواصل (${currentBranch.nameAr})`
                : `Branch Details (${currentBranch.nameEn})`}
            </h4>
            <div className="space-y-2.5 text-sm text-ivory-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{locale === "ar" ? currentBranch.addressAr : currentBranch.addressEn}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a
                  href={`tel:${currentBranch.phone}`}
                  className="hover:text-gold transition-colors"
                  dir="ltr"
                >
                  {currentBranch.phoneDisplay}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{locale === "ar" ? currentBranch.hoursAr : currentBranch.hoursEn}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-gold text-sm font-semibold tracking-wider uppercase">
              {locale === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2 text-sm text-ivory-muted">
              <li>
                <Link href={`/${currentBranchId}/services`} className="hover:text-gold transition-colors">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href={`/${currentBranchId}/gallery`} className="hover:text-gold transition-colors">
                  {t("nav.gallery")}
                </Link>
              </li>
              <li>
                <Link href={`/${currentBranchId}/feedback`} className="hover:text-gold transition-colors">
                  {t("nav.feedback")}
                </Link>
              </li>
              <li>
                <Link href={`/${currentBranchId}/contact`} className="hover:text-gold transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="space-y-4">
            <h4 className="text-gold text-sm font-semibold tracking-wider uppercase">
              {locale === "ar" ? "تواصل مباشر عبر الواتساب" : "Direct WhatsApp"}
            </h4>
            <p className="text-xs text-ivory-muted">
              {locale === "ar"
                ? `تواصل مباشرة مع إدارة واستقبال فرع ${currentBranch.nameAr}.`
                : `Connect directly with our ${currentBranch.nameEn} front desk.`}
            </p>
            <a
              href={`https://wa.me/${currentBranch.whatsapp}?text=${encodeURIComponent(
                locale === "ar"
                  ? `مرحباً صالون جنتل مان (فرع ${currentBranch.nameAr})، أود الاستفسار عن المواعيد والخدمات.`
                  : `Hello Gentleman Barbershop (${currentBranch.nameEn}), I would like to inquire about appointments.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-surface-2 border border-gold/40 hover:border-gold hover:bg-gold/10 text-gold text-sm font-semibold transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span>{locale === "ar" ? "محادثة فورية (واتساب)" : "Chat on WhatsApp"}</span>
            </a>
          </div>
        </div>

        <div className="border-t border-border/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-muted gap-4">
          <p>© {new Date().getFullYear()} Gentleman Barbershop. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="hover:text-gold transition-colors text-xs font-bold"
            >
              {locale === "ar" ? "اختيار فرع آخر" : "Change Branch"}
            </button>
            <Link href={`/${currentBranchId}/feedback`} className="hover:text-gold transition-colors">
              {locale === "ar" ? "استبيان رضا العملاء" : "Client Feedback"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
