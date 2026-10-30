"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { DEFAULT_BARBERS, Barber, getBarbersByBranch } from "@/config/barbers";
import { SERVICES } from "@/content/services";
import {
  Scissors,
  Sparkles,
  ShieldCheck,
  Flame,
  Award,
  ArrowRight,
  ArrowLeft,
  MessageSquareQuote,
  Clock,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";

export default function BranchHomePage({ params }: { params: Promise<{ branch: string }> }) {
  const resolvedParams = use(params);
  const branchSlug = resolvedParams.branch;

  const { locale, dir } = useLanguage();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const [branch, setBranch] = useState<Branch | null>(
    DEFAULT_BRANCHES.find((b) => b.id === branchSlug) || null
  );
  const [barbers, setBarbers] = useState<Barber[]>(getBarbersByBranch(branchSlug));

  useEffect(() => {
    // Sync current branch selection to storage
    localStorage.setItem("gentleman_branch", branchSlug);

    // Fetch dynamic branch and barbers from API
    fetch(`/api/branches`)
      .then((res) => res.json())
      .then((list: Branch[]) => {
        const found = list.find((b) => b.id === branchSlug);
        if (found) setBranch(found);
      })
      .catch(() => {});

    fetch(`/api/barbers?branchId=${branchSlug}`)
      .then((res) => res.json())
      .then((list: Barber[]) => {
        if (Array.isArray(list) && list.length > 0) {
          setBarbers(list);
        }
      })
      .catch(() => {});
  }, [branchSlug]);

  if (!branch) {
    // If not found in defaults, check if valid slug
    const matched = DEFAULT_BRANCHES.find((b) => b.id === branchSlug);
    if (!matched) return notFound();
  }

  const currentBranch = branch || DEFAULT_BRANCHES[0];
  const popularServices = SERVICES.filter((s) => s.popular);

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Branch Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-gold-dark/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
          {/* Branch Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2 border border-gold/40 shadow-sm animate-fade-in">
            <MapPin className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold tracking-wider text-gold-light uppercase">
              {locale === "ar"
                ? `صالون جنتل مان · فرع ${currentBranch.nameAr}`
                : `Gentleman Barbershop · ${currentBranch.nameEn} Branch`}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ivory leading-[1.15]">
            {locale === "ar" ? (
              <>
                فخامة الحلاقة الملكية في <br />
                <span className="gold-text-gradient font-serif">{currentBranch.nameAr}</span>
              </>
            ) : (
              <>
                Luxury Grooming at <br />
                <span className="gold-text-gradient font-serif">{currentBranch.nameEn}</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-ivory-muted leading-relaxed">
            {locale === "ar" ? currentBranch.taglineAr : currentBranch.taglineEn}
          </p>

          {/* Branch address and quick info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-ivory-muted">
            <span className="flex items-center gap-1.5 bg-surface-2 px-3 py-1.5 rounded-full border border-border">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>{locale === "ar" ? currentBranch.addressAr : currentBranch.addressEn}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-surface-2 px-3 py-1.5 rounded-full border border-border">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>{locale === "ar" ? currentBranch.hoursAr : currentBranch.hoursEn}</span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/${branchSlug}/feedback`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all hover:scale-105"
            >
              <MessageSquareQuote className="w-5 h-5" />
              <span>
                {locale === "ar"
                  ? `شاركنا رأيك في فرع ${currentBranch.nameAr}`
                  : `Review ${currentBranch.nameEn}`}
              </span>
              <ArrowIcon className="w-4 h-4" />
            </Link>

            <Link
              href={`/${branchSlug}/services`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-ivory bg-surface border border-border hover:border-gold/50 hover:bg-surface-2 transition-all"
            >
              <Scissors className="w-4 h-4 text-gold" />
              <span>{locale === "ar" ? "قائمة الخدمات والأسعار" : "Services & Prices"}</span>
            </Link>
          </div>

          {/* Quick stats */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border/80 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gold font-serif">{barbers.length}</p>
              <p className="text-xs text-ivory-muted mt-1">
                {locale === "ar" ? "حلاقين محترفين بالفرع" : "Branch Barbers"}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gold font-serif">100%</p>
              <p className="text-xs text-ivory-muted mt-1">
                {locale === "ar" ? "أدوات معقمة طبياً" : "Sanitized Tools"}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gold font-serif">4.9 ★</p>
              <p className="text-xs text-ivory-muted mt-1">
                {locale === "ar" ? "متوسط تقييم الفرع" : "Customer Satisfaction"}
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gold font-serif">VIP</p>
              <p className="text-xs text-ivory-muted mt-1">
                {locale === "ar" ? "خدمة استثنائية" : "Royal Experience"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Barbers Team Dedicated to THIS Branch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">
            {locale === "ar" ? `فريق عمل فرع ${currentBranch.nameAr}` : `${currentBranch.nameEn} Barbers`}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ivory">
            {locale === "ar" ? "أمهر الحلاقين في خدمتكم" : "Meet Our Master Barbers"}
          </h2>
          <p className="text-sm text-ivory-muted">
            {locale === "ar"
              ? "فريق محترف متخصص يقدم أعلى مستويات الإتقان والدقة في التدريج والعناية باللحية."
              : "Dedicated artisans equipped with mastery in fades, beard sculpting, and luxury grooming."}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="gold-card rounded-2xl p-5 text-center space-y-3 group hover:border-gold transition-all"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-surface-2 border border-border group-hover:border-gold flex items-center justify-center text-gold shadow-sm">
                <Scissors className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-ivory group-hover:text-gold transition-colors">
                  {locale === "ar" ? barber.nameAr : barber.nameEn}
                </h4>
                <p className="text-[11px] text-gold mt-0.5 line-clamp-1">
                  {locale === "ar" ? barber.titleAr : barber.titleEn}
                </p>
                <p className="text-[11px] text-ivory-muted mt-1">
                  {barber.experienceYears} {locale === "ar" ? "سنوات خبرة" : "yrs exp"}
                </p>
                <p className="text-[10px] text-ivory-muted/80 mt-1 line-clamp-2">
                  {locale === "ar" ? barber.specialtyAr : barber.specialtyEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              {locale === "ar" ? "باقاتنا المميزة" : "Signature Services"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-ivory mt-1">
              {locale === "ar" ? "أرقى خدمات الحلاقة والعناية" : "Executive Grooming Menu"}
            </h2>
          </div>
          <Link
            href={`/${branchSlug}/services`}
            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light font-semibold group"
          >
            <span>{locale === "ar" ? "عرض جميع الخدمات والأسعار" : "View Full Menu"}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularServices.map((service) => (
            <div
              key={service.id}
              className="gold-card rounded-2xl p-7 flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gold/15 text-gold border border-gold/30">
                    {service.category === "package"
                      ? locale === "ar" ? "باقة شاملة" : "Full Package"
                      : locale === "ar" ? "الأكثر طلباً" : "Popular"}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gold font-serif">
                      {service.priceEgp}
                    </span>
                    <span className="text-xs text-ivory-muted ml-1">EGP</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-ivory group-hover:text-gold transition-colors">
                  {locale === "ar" ? service.titleAr : service.titleEn}
                </h3>
                <p className="text-sm text-ivory-muted leading-relaxed">
                  {locale === "ar" ? service.descriptionAr : service.descriptionEn}
                </p>
              </div>

              <div className="pt-6 border-t border-border mt-6 flex items-center justify-between text-xs text-ivory-muted">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>{service.durationMinutes} {locale === "ar" ? "دقيقة" : "min"}</span>
                </div>
                <a
                  href={`https://wa.me/${currentBranch.whatsapp}?text=${encodeURIComponent(
                    locale === "ar"
                      ? `مرحباً صالون جنتل مان (فرع ${currentBranch.nameAr})، أود الاستفسار عن خدمة: ${service.titleAr}`
                      : `Hello Gentleman Barbershop (${currentBranch.nameEn}), I'd like to book: ${service.titleEn}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-gold hover:underline"
                >
                  {locale === "ar" ? "حجز بالواتساب" : "Book via WhatsApp"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Feedback CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-surface-2 via-surface to-surface-2 border border-gold/40 p-8 sm:p-12 shadow-gold-glow">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold/15 text-gold border border-gold/30">
              {locale === "ar" ? "رأيك يهمنا ويصنع الفارق" : "Your Feedback Matters"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-ivory">
              {locale === "ar"
                ? `هل زرت فرع ${currentBranch.nameAr} مؤخراً؟ قيّم تجربتك`
                : `Visited ${currentBranch.nameEn} recently? Share your feedback`}
            </h2>
            <p className="text-sm text-ivory-muted leading-relaxed">
              {locale === "ar"
                ? "استبيان سريع في أقل من 60 ثانية لمساعدتنا على استمرار تقديم الخدمة الملكية التي تستحقها."
                : "A quick 60-second survey directly reviewed by management to uphold VIP standard care."}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/${branchSlug}/feedback`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all hover:scale-105"
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>{locale === "ar" ? "ابدأ الاستبيان الآن" : "Start Survey Now"}</span>
              </Link>
              <Link
                href={`/${branchSlug}/feedback/qr`}
                className="text-xs text-ivory-muted hover:text-gold underline"
              >
                {locale === "ar" ? "رمز QR الخاص بالفرع" : "In-Shop QR Stand"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
