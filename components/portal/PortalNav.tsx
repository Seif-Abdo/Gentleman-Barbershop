"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  Scissors,
  LayoutDashboard,
  Send,
  Building2,
  Users2,
  ShieldCheck,
  LogOut,
  MapPin,
  ChevronDown,
  Sparkles,
  QrCode,
  Menu,
  X,
  Globe,
  User,
} from "lucide-react";
import { Branch } from "@/config/branches";

interface PortalNavProps {
  user: {
    id: string;
    username: string;
    name: string;
    role: "master_admin" | "branch_admin";
    branchId?: string;
  };
  branches: Branch[];
  selectedBranch: string;
  onSelectBranch: (branchId: string) => void;
}

export function PortalNav({
  user,
  branches,
  selectedBranch,
  onSelectBranch,
}: PortalNavProps) {
  const { locale, toggleLocale } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/portal/login");
    router.refresh();
  };

  const isMaster = user.role === "master_admin";

  const navItems = [
    {
      href: "/portal",
      labelAr: "لوحة التحليلات",
      labelEn: "Dashboard",
      icon: LayoutDashboard,
      roles: ["master_admin", "branch_admin"],
    },
    {
      href: "/portal/campaigns",
      labelAr: "حملات الواتساب",
      labelEn: "WhatsApp Campaigns",
      icon: Send,
      roles: ["master_admin"],
    },
    {
      href: "/portal/branches",
      labelAr: "إدارة الفروع",
      labelEn: "Branches",
      icon: Building2,
      roles: ["master_admin"],
    },
    {
      href: "/portal/barbers",
      labelAr: "فريق الحلاقين",
      labelEn: "Barbers & Staff",
      icon: Users2,
      roles: ["master_admin"],
    },
    {
      href: "/portal/admins",
      labelAr: "مديري النظام",
      labelEn: "Admin Users",
      icon: ShieldCheck,
      roles: ["master_admin"],
    },
    {
      href: "/portal/qr",
      labelAr: "طباعة كارت QR",
      labelEn: "In-Shop QR Stand",
      icon: QrCode,
      roles: ["master_admin", "branch_admin"],
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0E0E0E] border-b border-gold/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/portal" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold shadow-gold-glow group-hover:scale-105 transition-transform">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-widest text-base sm:text-lg font-bold text-ivory group-hover:text-gold transition-colors">
                  GENTLEMAN
                </span>
                <span className="text-[9px] sm:text-[10px] text-gold uppercase tracking-widest font-bold">
                  {locale === "ar" ? "بوابة الإدارة والتنفيذ" : "Executive Portal"}
                </span>
              </div>
            </Link>

            {/* Desktop Branch Scope Selector */}
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-border pr-4">
              <span className="text-xs text-ivory-muted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>{locale === "ar" ? "نطاق الفرع:" : "Branch Scope:"}</span>
              </span>

              {isMaster ? (
                <select
                  value={selectedBranch}
                  onChange={(e) => onSelectBranch(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-surface-2 border border-gold/40 text-xs font-bold text-gold focus:outline-none cursor-pointer"
                >
                  <option value="all">🌟 {locale === "ar" ? "جميع الفروع (المجمّع)" : "All Branches (Consolidated)"}</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      📍 {locale === "ar" ? b.nameAr : b.nameEn}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-bold">
                  📍 {branches.find((b) => b.id === user.branchId)?.nameAr || user.branchId}
                </span>
              )}
            </div>
          </div>

          {/* Desktop User Badge & Logout */}
          <div className="hidden md:flex items-center gap-3 sm:gap-5">
            {/* Language Switcher */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-ivory-muted hover:text-gold border border-border hover:border-gold/50 rounded-full transition-all"
              title="Switch Language / تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 bg-surface-2 px-3 py-1.5 rounded-2xl border border-border text-xs">
              <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold font-bold">
                {user.name ? user.name[0] : "A"}
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold text-ivory text-xs truncate max-w-[120px] sm:max-w-none">
                  {user.name}
                </span>
                <span className="text-[10px] text-gold">
                  {isMaster
                    ? locale === "ar" ? "👑 المدير العام" : "Master Admin"
                    : locale === "ar" ? "مدير فرع" : "Branch Admin"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-red-500/30 hover:border-red-500 bg-red-950/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{locale === "ar" ? "خروج" : "Logout"}</span>
            </button>
          </div>

          {/* Mobile Right Controls: Language Button & Burger Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLocale}
              className="px-2.5 py-1 text-xs border border-gold/40 hover:border-gold rounded-lg text-gold font-bold bg-surface-2 transition-all"
              title="Switch Language / تغيير اللغة"
            >
              {locale === "ar" ? "EN" : "عربي"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ivory hover:text-gold rounded-xl border border-border hover:border-gold focus:outline-none bg-surface-2 transition-all"
              aria-label="Toggle admin menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6 text-ivory" />}
            </button>
          </div>
        </div>

        {/* Desktop Portal Navigation Tabs (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto py-2 border-t border-border/70 scrollbar-none">
          {navItems
            .filter((item) => item.roles.includes(user.role))
            .map((item) => {
              const isActive =
                item.href === "/portal"
                  ? pathname === "/portal"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-gold text-bg shadow-gold-glow scale-105"
                      : "text-ivory-muted hover:text-gold hover:bg-surface-2"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{locale === "ar" ? item.labelAr : item.labelEn}</span>
                </Link>
              );
            })}
        </div>
      </div>

      {/* Mobile Burger Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-gold/30 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-2xl">
          {/* 1. User Profile Card on Mobile */}
          <div className="p-3.5 rounded-2xl bg-surface-2 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold font-bold text-sm">
                {user.name ? user.name[0] : "A"}
              </div>
              <div>
                <p className="font-bold text-ivory text-sm">{user.name}</p>
                <p className="text-[11px] text-gold font-medium">
                  {isMaster
                    ? locale === "ar" ? "👑 المدير العام" : "Master Admin"
                    : locale === "ar" ? "مدير فرع" : "Branch Admin"}
                </p>
              </div>
            </div>

            <span className="text-[10px] text-ivory-muted/70 font-mono">@{user.username}</span>
          </div>

          {/* 2. Branch Scope Selector on Mobile */}
          <div className="p-3 rounded-2xl bg-surface border border-border space-y-1.5">
            <span className="text-xs text-ivory-muted flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>{locale === "ar" ? "نطاق الفرع المعروض:" : "Active Branch Scope:"}</span>
            </span>

            {isMaster ? (
              <select
                value={selectedBranch}
                onChange={(e) => {
                  onSelectBranch(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#181818] border border-gold/40 text-xs font-bold text-gold focus:outline-none cursor-pointer"
              >
                <option value="all">🌟 {locale === "ar" ? "جميع الفروع (المجمّع)" : "All Branches (Consolidated)"}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    📍 {locale === "ar" ? b.nameAr : b.nameEn}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-bold">
                📍 {branches.find((b) => b.id === user.branchId)?.nameAr || user.branchId}
              </div>
            )}
          </div>

          {/* 3. Navigation Links List */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gold px-2">
              {locale === "ar" ? "أقسام الإدارة" : "Portal Navigation"}
            </span>

            <div className="space-y-1 mt-1">
              {navItems
                .filter((item) => item.roles.includes(user.role))
                .map((item) => {
                  const isActive =
                    item.href === "/portal"
                      ? pathname === "/portal"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-gold text-bg font-bold shadow-gold-glow"
                          : "text-ivory hover:text-gold hover:bg-surface-2"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{locale === "ar" ? item.labelAr : item.labelEn}</span>
                      {isActive && (
                        <span className="mr-auto rtl:ml-auto rtl:mr-0 w-2 h-2 rounded-full bg-[#0B0B0B]" />
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* 4. Logout Action Button */}
          <div className="pt-2 border-t border-border">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full py-3 rounded-xl border border-red-500/40 text-red-400 bg-red-950/20 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-900/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{locale === "ar" ? "تسجيل الخروج من المنظومة" : "Sign Out of Portal"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
