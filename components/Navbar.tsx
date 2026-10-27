"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { SITE_CONFIG } from "@/config/site";
import { Scissors, Menu, X, Globe, MessageSquareQuote, Shield } from "lucide-react";

export function Navbar() {
  const { locale, toggleLocale, dir, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/services", label: t("nav.services") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    return href !== "/" && pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/90 border-b border-border/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center p-[2px] shadow-gold-glow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-bg rounded-full flex items-center justify-center">
                <Scissors className="w-5 h-5 text-gold transform -rotate-45" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-wider text-xl font-bold text-ivory group-hover:text-gold transition-colors">
                GENTLEMAN
              </span>
              <span className="text-[11px] text-ivory-muted tracking-widest uppercase">
                {locale === "ar" ? "صالون الحلاقة الراقي" : "Luxury Barbershop"}
              </span>
            </div>
          </Link>

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

            {/* Admin Link */}
            <Link
              href="/admin"
              className="p-2 text-ivory-muted hover:text-gold transition-colors"
              title={t("nav.admin")}
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Feedback Wizard CTA */}
            <Link
              href="/feedback"
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
              href="/feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-bg font-bold shadow-gold-glow text-center"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>{t("nav.feedback")}</span>
            </Link>
            <div className="flex justify-between items-center px-2 pt-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-ivory-muted hover:text-gold flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t("nav.admin")}</span>
              </Link>
              <Link
                href="/feedback/qr"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-gold underline"
              >
                {t("nav.qr")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
