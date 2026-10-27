"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageContext";
import { SITE_CONFIG } from "@/config/site";
import { MapPin, Phone, Clock, MessageCircle, ExternalLink, Scissors } from "lucide-react";

export default function ContactPage() {
  const { locale } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-gold uppercase tracking-wider">
          {locale === "ar" ? "موقعنا وساعات العمل" : "Location & Hours"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ivory">
          {locale === "ar" ? "يسعدنا دائماً استقبالكم" : "Visit Gentleman Barbershop"}
        </h1>
        <p className="text-sm sm:text-base text-ivory-muted">
          {locale === "ar"
            ? "نرحب بزيارتكم يومياً لتجربة استثنائية من العناية والأناقة الرجالية."
            : "Drop by our exclusive gentlemen lounge or reach out on WhatsApp."}
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
              {locale === "ar" ? SITE_CONFIG.addressAr : SITE_CONFIG.addressEn}
            </p>
            <a
              href={SITE_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline pt-2"
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
              {locale === "ar" ? SITE_CONFIG.hoursAr : SITE_CONFIG.hoursEn}
            </p>
          </div>

          <div className="gold-card p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ivory">
              {locale === "ar" ? "الاتصال والحجز" : "Phone & WhatsApp"}
            </h3>
            <p className="text-sm text-ivory-muted" dir="ltr">
              {SITE_CONFIG.phoneDisplay}
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                locale === "ar" ? SITE_CONFIG.whatsappMessageAr : SITE_CONFIG.whatsappMessageEn
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gold hover:bg-gold-light text-bg font-bold text-sm shadow-gold-glow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{locale === "ar" ? "تواصل فوري عبر الواتساب" : "Chat on WhatsApp"}</span>
            </a>
          </div>
        </div>

        {/* Map Embed Container */}
        <div className="lg:col-span-2 gold-card rounded-3xl overflow-hidden border border-border h-[460px] relative">
          <iframe
            title="Gentleman Barbershop Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.61185066922!2d31.2584643!3d29.9602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458380ff9821267%3A0x6b63690d56ee255e!2sMaadi%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
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
