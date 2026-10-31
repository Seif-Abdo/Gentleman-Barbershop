"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { useBranch } from "./BranchContext";
import { Scissors, Menu, X, Globe, MessageSquareQuote, MapPin, ChevronDown } from "lucide-react";

export function Navbar() {
  const { locale, toggleLocale, t } = useLanguage();
  const { currentBranch, currentBranchId, setIsBranchModalOpen } = useBranch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: `/${currentBranchId}`, label: t("nav.home") },
    { href: `/${currentBranchId}/services`, label: t("nav.services") },
    { href: `/${currentBranchId}/gallery`, label: t("nav.gallery") },
    { href: `/${currentBranchId}/contact`, label: t("nav.contact") },
  ];

  const isActive = (href: string) => {
    if (href === `/${currentBranchId}` && pathname === `/${currentBranchId}`) return true;
    return href !== `/${currentBranchId}` && pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/90 border-b border-border/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Active Branch Indicator */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link href={`/${currentBranchId}`} className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center p-[2px] shadow-gold-glow group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-bg rounded-full flex items-center justify-center">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-gold transform -rotate-45" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-wider text-lg sm:text-xl font-bold text-ivory group-hover:text-gold transition-colors">
                  GENTLEMAN
                </span>
                <span className="text-[10px] sm:text-[11px] text-ivory-muted tracking-widest uppercase">
                  {locale === "ar" ? "صالون الحلاقة الراقي" : "Luxury Barbershop"}
                </span>
              </div>
            </Link>

            {/* Active Branch Selector Pill */}
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-surface-2 border border-gold/40 hover:border-gold text-[11px] sm:text-xs text-ivory hover:text-gold transition-all shadow-sm"
              title="تغيير الفرع / Switch Branch"
            >
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold shrink-0" />
              <span className="font-bold truncate max-w-[85px] sm:max-w-none">
                {locale === "ar" ? currentBranch.nameAr : currentBranch.nameEn}
              </span>
              <ChevronDown className="w-3 h-3 text-gold" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive(link.href)
                    ? "text-gold font-semibold"
                    : "text-ivory/80 hover:text-gold"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-ivory-muted hover:text-gold border border-border hover:border-gold/50 rounded-full transition-all"
              title="Switch Language / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Feedback Wizard CTA (branch specific) */}
            <Link
              href={`/${currentBranchId}/feedback`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all hover:scale-105"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>{t("nav.feedback")}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLocale}
              className="px-2.5 py-1 text-xs border border-border rounded text-gold"
            >
              {locale === "ar" ? "EN" : "عربي"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ivory hover:text-gold rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top">
          <div className="pb-2 mb-2 border-b border-border flex justify-between items-center">
            <span className="text-xs text-ivory-muted">
              {locale === "ar" ? "الفرع الحالي:" : "Current Branch:"}
            </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsBranchModalOpen(true);
              }}
              className="text-xs text-gold font-bold underline flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? currentBranch.nameAr : currentBranch.nameEn} (تغيير)</span>
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive(link.href) ? "bg-surface-2 text-gold font-bold" : "text-ivory hover:bg-surface-2"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <Link
              href={`/${currentBranchId}/feedback`}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-bg font-bold shadow-gold-glow text-center"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>{t("nav.feedback")}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
