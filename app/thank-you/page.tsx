"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { SITE_CONFIG } from "@/config/site";
import { CheckCircle, Star, MapPin, ArrowRight, ArrowLeft, Home } from "lucide-react";

export default function ThankYouPage() {
  const { locale, dir } = useLanguage();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center space-y-8 animate-fade-in">
      {/* Gold Celebration Badge */}
      <div className="w-20 h-20 mx-auto rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center text-gold shadow-gold-glow animate-bounce">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ivory">
          {locale === "ar" ? "شكراً جزيلاً لتقييمك!" : "Thank You For Your Feedback!"}
        </h1>
        <p className="text-sm sm:text-base text-ivory-muted max-w-lg mx-auto leading-relaxed">
          {locale === "ar"
            ? "تم استلام تقييمك بنجاح. ملاحظاتك تدعمنا باستمرار لنظل وجهتك المفضلة للحلاقة والعناية في القاهرة."
            : "Your feedback has been recorded successfully. We appreciate your time in helping us elevate our craft."}
        </p>
      </div>

      {/* Google Review Encouragement Card */}
      <div className="gold-card rounded-2xl p-6 sm:p-8 space-y-5 text-center">
        <div className="flex items-center justify-center gap-1.5 text-gold">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-gold" />
          ))}
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-ivory">
            {locale === "ar"
              ? "هل استمتعت بتجربتك؟ ادعمنا على خرائط جوجل"
              : "Loved your cut? Support us on Google Maps"}
          </h3>
          <p className="text-xs text-ivory-muted">
            {locale === "ar"
              ? "رأيك على جوجل يساعد عملاء جدد في اكتشاف تجربة صالون جنتل مان."
              : "A quick review helps new gentlemen find our shop."}
          </p>
        </div>

        <a
          href={SITE_CONFIG.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all hover:scale-105"
        >
          <MapPin className="w-4 h-4" />
          <span>{locale === "ar" ? "كتابة تقييم على Google Maps" : "Review on Google Maps"}</span>
        </a>
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ivory-muted hover:text-gold transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>{locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Return to Homepage"}</span>
        </Link>
      </div>
    </div>
  );
}
