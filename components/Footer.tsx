"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { SITE_CONFIG } from "@/config/site";
import { Scissors, Phone, MapPin, Clock, MessageCircle, QrCode } from "lucide-react";

export function Footer() {
  const { locale, t } = useLanguage();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold flex items-center justify-center">
                <Scissors className="w-5 h-5 text-gold -rotate-45" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-ivory">
                GENTLEMAN
              </span>
            </div>
            <p className="text-sm text-ivory-muted leading-relaxed">
              {locale === "ar" ? SITE_CONFIG.descriptionAr : SITE_CONFIG.descriptionEn}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/feedback/qr"
                className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
              >
                <QrCode className="w-4 h-4" />
                <span>{locale === "ar" ? "طباعة رمز الاستجابة QR" : "Print QR Stand"}</span>
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-gold text-sm font-semibold tracking-wider uppercase">
              {locale === "ar" ? "معلومات التواصل" : "Contact & Hours"}
            </h4>
            <div className="space-y-2.5 text-sm text-ivory-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{locale === "ar" ? SITE_CONFIG.addressAr : SITE_CONFIG.addressEn}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-gold transition-colors" dir="ltr">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{locale === "ar" ? SITE_CONFIG.hoursAr : SITE_CONFIG.hoursEn}</span>
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
                <Link href="/services" className="hover:text-gold transition-colors">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition-colors">
                  {t("nav.gallery")}
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-gold transition-colors">
                  {t("nav.feedback")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold transition-colors">
                  {t("nav.admin")}
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
                ? "جاهزون لاستقبال استفساراتك وتنسيق مواعيدك الملكية."
                : "Available for inquiries and personalized grooming consultations."}
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                locale === "ar" ? SITE_CONFIG.whatsappMessageAr : SITE_CONFIG.whatsappMessageEn
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
            <Link href="/feedback" className="hover:text-gold transition-colors">
              {locale === "ar" ? "استبيان رضا العملاء" : "Client Feedback"}
            </Link>
            <Link href="/admin" className="hover:text-gold transition-colors">
              {locale === "ar" ? "دخول الإدارة" : "Staff Portal"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
