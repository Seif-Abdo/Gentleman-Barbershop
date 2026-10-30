"use client";

import React, { useState, useEffect, use } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { SERVICES } from "@/content/services";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { Clock, MessageCircle, Scissors, Sparkles } from "lucide-react";

export default function BranchServicesPage({ params }: { params: Promise<{ branch: string }> }) {
  const resolvedParams = use(params);
  const branchSlug = resolvedParams.branch;

  const { locale } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
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

  const categories = [
    { id: "all", labelAr: "جميع الخدمات", labelEn: "All Services" },
    { id: "hair", labelAr: "قصات الشعر", labelEn: "Haircuts" },
    { id: "beard", labelAr: "اللحية والذقن", labelEn: "Beard & Shave" },
    { id: "package", labelAr: "باقات VIP الشاملة", labelEn: "VIP Packages" },
    { id: "treatment", labelAr: "العناية والبشرة", labelEn: "Facial & Treatments" },
  ];

  const filtered =
    activeCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-gold uppercase tracking-wider">
          {locale === "ar"
            ? `قائمة الأسعار والخدمات · فرع ${branch.nameAr}`
            : `Grooming Menu · ${branch.nameEn} Branch`}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ivory">
          {locale === "ar" ? "خدمات مخصصة تليق بالرجال" : "Bespoke Barbering Services"}
        </h1>
        <p className="text-sm sm:text-base text-ivory-muted leading-relaxed">
          {locale === "ar"
            ? `يقدم فرع ${branch.nameAr} أرقى تجارب الحلاقة والعناية مع أدوات معقمة طبياً لكل عميل.`
            : `Our ${branch.nameEn} branch delivers hospital-grade hygiene and Italian care products.`}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat.id
                ? "bg-gold text-bg shadow-gold-glow scale-105"
                : "bg-surface text-ivory-muted hover:text-gold hover:bg-surface-2 border border-border"
            }`}
          >
            {locale === "ar" ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="gold-card rounded-2xl p-7 flex flex-col justify-between relative group hover:border-gold transition-all"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold text-ivory group-hover:text-gold transition-colors">
                  {locale === "ar" ? service.titleAr : service.titleEn}
                </h3>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-bold text-gold font-serif">
                    {service.priceEgp}
                  </span>
                  <span className="text-xs text-ivory-muted ml-1">EGP</span>
                </div>
              </div>

              <p className="text-sm text-ivory-muted leading-relaxed">
                {locale === "ar" ? service.descriptionAr : service.descriptionEn}
              </p>
            </div>

            <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-ivory-muted">
                <Clock className="w-4 h-4 text-gold" />
                <span>
                  {service.durationMinutes} {locale === "ar" ? "دقيقة" : "mins"}
                </span>
              </div>

              <a
                href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                  locale === "ar"
                    ? `مرحباً فرع ${branch.nameAr}، أود الاستفسار عن خدمة: ${service.titleAr}`
                    : `Hello ${branch.nameEn} branch, I'd like to book: ${service.titleEn}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-surface-2 border border-gold/40 hover:border-gold text-gold hover:bg-gold hover:text-bg transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{locale === "ar" ? "حجز عبر الواتساب" : "Book via WhatsApp"}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
