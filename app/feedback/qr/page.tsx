"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageContext";
import { Scissors, Printer, Smartphone, Sparkles, MessageSquareQuote } from "lucide-react";

export default function QrCodePage() {
  const { locale } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      {/* Print Trigger Button (hidden in print) */}
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-xl font-bold text-ivory">
          {locale === "ar" ? "بطاقة رمز الاستجابة QR للصالون" : "In-Shop QR Stand Card"}
        </h2>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-bg text-sm font-bold shadow-gold-glow hover:bg-gold-light transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>{locale === "ar" ? "طباعة البطاقة" : "Print Stand"}</span>
        </button>
      </div>

      {/* The Printable Stand Card */}
      <div className="bg-[#101010] border-2 border-[#D4AF37] rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden print:border-black print:bg-white print:text-black">
        {/* Decorative corner flourishes */}
        <div className="w-14 h-14 mx-auto rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold">
          <Scissors className="w-7 h-7 -rotate-45" />
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-gold font-bold">
            GENTLEMAN BARBERSHOP
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory print:text-black">
            {locale === "ar" ? "رأيك يصنع الفارق" : "Your Opinion Matters"}
          </h1>
          <p className="text-xs text-ivory-muted print:text-gray-600 max-w-xs mx-auto">
            {locale === "ar"
              ? "امسح الرمز بكاميرا هاتفك وشاركنا تقييمك لخدمة اليوم في أقل من دقيقة."
              : "Scan with your phone camera to share your review directly with shop management."}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="w-56 h-56 mx-auto p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-gold/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
              typeof window !== "undefined"
                ? `${window.location.origin}/feedback`
                : "https://gentleman-barbershop.com/feedback"
            )}&color=0B0B0B`}
            alt="Feedback QR Code"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-gold">
          <Smartphone className="w-4 h-4" />
          <span>{locale === "ar" ? "استبيان سريع في 60 ثانية" : "Fast 60-second survey"}</span>
        </div>

        <p className="text-[10px] text-ivory-muted print:text-gray-500">
          صالون جنتل مان · المعادي، القاهرة · صالون الحلاقة الراقي
        </p>
      </div>
    </div>
  );
}
