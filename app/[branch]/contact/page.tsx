"use client";

import React, { useState, useEffect, use } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { MapPin, Phone, Clock, MessageCircle, ExternalLink } from "lucide-react";

export default function BranchContactPage({ params }: { params: Promise<{ branch: string }> }) {
  const resolvedParams = use(params);
  const branchSlug = resolvedParams.branch;

  const { locale } = useLanguage();
  const [branch, setBranch] = useState<Branch>(
    DEFAULT_BRANCHES.find((b) => b.id === branchSlug) || DEFAULT_BRANCHES[0]
  );

  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((list: Branch[]) => {
        const found = list.find((b) => b.id === branchSlug);
        if (found) setBranch(found);
      })
      .catch(() => {});
  }, [branchSlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-gold uppercase tracking-wider">
          {locale === "ar"
            ? `موقعنا وساعات العمل · فرع ${branch.nameAr}`
            : `Location & Hours · ${branch.nameEn} Branch`}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ivory">
          {locale === "ar" ? "يسعدنا دائماً استقبالكم" : "Visit Gentleman Barbershop"}
        </h1>
        <p className="text-sm sm:text-base text-ivory-muted">
          {locale === "ar" ? branch.taglineAr : branch.taglineEn}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="gold-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ivory">
              {locale === "ar" ? "العنوان" : "Our Address"}
            </h3>
            <p className="text-sm text-ivory-muted leading-relaxed">
              {locale === "ar" ? branch.addressAr : branch.addressEn}
            </p>
            <a
              href={branch.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline pt-2 font-bold"
            >
              <span>{locale === "ar" ? "فتح في خرائط جوجل" : "Open in Google Maps"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="gold-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ivory">
              {locale === "ar" ? "مواعيد العمل" : "Opening Hours"}
            </h3>
            <p className="text-sm text-ivory-muted leading-relaxed">
              {locale === "ar" ? branch.hoursAr : branch.hoursEn}
            </p>
          </div>

          <div className="gold-card p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ivory">
              {locale === "ar"
                ? branchSlug === "zahraa-maadi"
                  ? "الاتصال وخدمة العملاء"
                  : "الاتصال والحجز"
                : branchSlug === "zahraa-maadi"
                ? "Direct Phone & WhatsApp"
                : "Phone & WhatsApp Booking"}
            </h3>
            <p className="text-sm text-ivory-muted font-mono" dir="ltr">
              {branch.phoneDisplay}
            </p>
            <a
              href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                locale === "ar"
                  ? branchSlug === "zahraa-maadi"
                    ? `مرحباً صالون جنتل مان (فرع ${branch.nameAr})، أود الاستفسار عن الخدمات المتاحة.`
                    : `مرحباً صالون جنتل مان (فرع ${branch.nameAr})، أود حجز موعد حلاقة.`
                  : branchSlug === "zahraa-maadi"
                  ? `Hello Gentleman Barbershop (${branch.nameEn}), I would like to inquire about available services.`
                  : `Hello Gentleman Barbershop (${branch.nameEn}), I would like to book an appointment.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gold hover:bg-gold-light text-bg font-bold text-sm shadow-gold-glow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {locale === "ar"
                  ? branchSlug === "zahraa-maadi"
                    ? "تواصل فوري عبر الواتساب"
                    : "حجز موعد عبر الواتساب"
                  : branchSlug === "zahraa-maadi"
                  ? "Chat on WhatsApp"
                  : "Book via WhatsApp"}
              </span>
            </a>
          </div>
        </div>

        {/* Map Embed Container */}
        <div className="lg:col-span-2 gold-card rounded-3xl overflow-hidden border border-border h-[460px] relative">
          <iframe
            title={`${branch.nameEn} Location`}
            src={branch.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(100%)" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
