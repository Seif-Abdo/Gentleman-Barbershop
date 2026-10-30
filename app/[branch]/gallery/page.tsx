"use client";

import React, { useState, use } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { X, ZoomIn } from "lucide-react";

interface GalleryItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: "atmosphere" | "haircut" | "beard" | "tools";
  url: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    titleAr: "كراسي الحلاقة الملكية والتصميم الأسود الفاخر",
    titleEn: "Executive Vintage Barber Chairs & Gold Trim",
    category: "atmosphere",
    url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    titleAr: "تدريج الفيد المعاصر ولمسات السشوار الاحترافي",
    titleEn: "Precision Skin Fade & Textured Top",
    category: "haircut",
    url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    titleAr: "جلسة الفوط الساخنة وتحديد اللحية بالموس",
    titleEn: "Traditional Straight Razor Shave & Hot Towel",
    category: "beard",
    url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    titleAr: "أدوات الحلاقة المعقمة والمقصات اليابانية الدقيقة",
    titleEn: "Sterilized Stainless Steel Shears & Grooming Kit",
    category: "tools",
    url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    titleAr: "تحديد اللحية الكلاسيكي بالزيت الطبيعي",
    titleEn: "Beard Sculpting with Argan Oil Infusion",
    category: "beard",
    url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    titleAr: "صالة الانتظار الرجالية الفاخرة والضيافة المميزة",
    titleEn: "Gentlemen Lounge & Executive Waiting Area",
    category: "atmosphere",
    url: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80",
  },
];

export default function BranchGalleryPage({ params }: { params: Promise<{ branch: string }> }) {
  const resolvedParams = use(params);
  const branchSlug = resolvedParams.branch;

  const { locale } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-gold uppercase tracking-wider">
          {locale === "ar" ? "معرض الصور" : "Visual Experience"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ivory">
          {locale === "ar" ? "لحظات من الفخامة والإتقان" : "A Glimpse Inside Gentleman"}
        </h1>
        <p className="text-sm sm:text-base text-ivory-muted">
          {locale === "ar"
            ? "استكشف أجواء الصالون الراقية ونماذج من إبداع أمهر حلاقينا."
            : "Browse through our shop atmosphere, cutting precision, and signature grooming."}
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "all", ar: "الكل", en: "All" },
          { id: "atmosphere", ar: "أجواء الصالون", en: "Atmosphere" },
          { id: "haircut", ar: "قصات الشعر", en: "Haircuts" },
          { id: "beard", ar: "اللحية والذقن", en: "Beards" },
          { id: "tools", ar: "الأدوات والتعقيم", en: "Tools" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === tab.id
                ? "bg-gold text-bg shadow-gold-glow"
                : "bg-surface text-ivory-muted hover:text-gold border border-border"
            }`}
          >
            {locale === "ar" ? tab.ar : tab.en}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-border hover:border-gold/60 transition-all aspect-[4/3] bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={locale === "ar" ? item.titleAr : item.titleEn}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            <div className="absolute bottom-0 inset-x-0 p-5 space-y-1">
              <span className="text-[11px] font-bold text-gold uppercase tracking-wider">
                {locale === "ar" ? "جنتل مان" : "Gentleman"}
              </span>
              <h3 className="text-base font-bold text-ivory group-hover:text-gold transition-colors">
                {locale === "ar" ? item.titleAr : item.titleEn}
              </h3>
            </div>

            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center text-ivory group-hover:text-gold transition-colors opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-surface border border-gold/40 rounded-2xl overflow-hidden shadow-gold-glow"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-bg/80 text-ivory hover:text-gold transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.url}
              alt={locale === "ar" ? selectedImage.titleAr : selectedImage.titleEn}
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-6 bg-surface border-t border-border">
              <h3 className="text-lg font-bold text-ivory">
                {locale === "ar" ? selectedImage.titleAr : selectedImage.titleEn}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
