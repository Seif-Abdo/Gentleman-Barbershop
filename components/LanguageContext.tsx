"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "ar" | "en";

interface LanguageContextType {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (l: Locale) => void;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  ar: {
    "nav.home": "الرئيسية",
    "nav.services": "الخدمات والأسعار",
    "nav.gallery": "معرض الصور",
    "nav.feedback": "شاركنا رأيك يا فندم",
    "nav.contact": "موقعنا والتواصل",
    "nav.admin": "لوحة الإدارة",
    "nav.qr": "كارت QR الصالون",
    "hero.badge": "صالون جنتل مان للرجال · القاهرة",
    "hero.title": "أهلاً بك في صالون جنتل مان · حلاقة راقية تليق بك",
    "hero.subtitle": "عناية متكاملة بالرجل العصري، دقة في تصفيف الشعر واللحية، مع باقة خدمات ملكية متميزة.",
    "hero.cta_feedback": "شاركنا تقييمك ورأيك يا فندم",
    "hero.cta_services": "قائمة الخدمات والأسعار",
    "common.loading": "لحظات ونجهز لك البيانات...",
    "common.error": "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى",
  },
  en: {
    "nav.home": "Home",
    "nav.services": "Services & Prices",
    "nav.gallery": "Gallery",
    "nav.feedback": "Feedback",
    "nav.contact": "Contact & Location",
    "nav.admin": "Admin Dashboard",
    "nav.qr": "Shop QR Code",
    "hero.badge": "Gentleman Barbershop · Cairo",
    "hero.title": "Luxury Grooming & Timeless Elegance",
    "hero.subtitle": "Where heritage craftsmanship meets contemporary styling for the modern gentleman.",
    "hero.cta_feedback": "Share Feedback in 60s",
    "hero.cta_services": "Explore Services",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "ar",
  toggleLocale: () => {},
  setLocale: () => {},
  dir: "rtl",
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("gentleman_lang") as Locale;
    if (saved === "ar" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("gentleman_lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const toggleLocale = () => {
    setLocale(locale === "ar" ? "en" : "ar");
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations["ar"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, setLocale, dir, t }}>
      <div dir={dir} className={dir === "rtl" ? "font-sans" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
