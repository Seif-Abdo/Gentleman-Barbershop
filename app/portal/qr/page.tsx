"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import {
  QrCode,
  Printer,
  Copy,
  Check,
  Scissors,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function PortalQrPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("zahraa-maadi");
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }

    fetch("/api/auth")
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.isAuthenticated) {
          router.push("/portal/login");
        } else {
          setCurrentUser(authData.user);
          if (authData.user.role === "branch_admin" && authData.user.branchId) {
            setSelectedBranchId(authData.user.branchId);
          }
        }
      })
      .catch(() => router.push("/portal/login"));

    fetch("/api/branches")
      .then((res) => res.json())
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) setBranches(list);
      })
      .catch(() => {});
  }, [router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-gold">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const isMaster = currentUser.role === "master_admin";
  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const targetUrl = `${origin || "https://gentleman-barbershop.com"}/${activeBranch.id}/feedback`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
    targetUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-ivory">
      {/* Hide on print */}
      <div className="print:hidden">
        <PortalNav
          user={currentUser}
          branches={branches}
          selectedBranch={selectedBranchId}
          onSelectBranch={(b) => {
            if (b !== "all") setSelectedBranchId(b);
          }}
        />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Controls (Hidden on print) */}
        <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/30">
                <QrCode className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
                  {locale === "ar"
                    ? "كارت رمز QR المطبوع للمرايا والكاونتر"
                    : "In-Shop Mirror & Counter QR Stand"}
                </h1>
                <p className="text-xs sm:text-sm text-ivory-muted mt-0.5">
                  {locale === "ar"
                    ? "توليد وطباعة ستاند التقييم الخاص بكل فرع ليوضع أمام العميل على الكراسي والكاونتر."
                    : "Generate and print high-resolution evaluation QR stands for mirrors and checkout counters."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isMaster && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-ivory-muted">
                  {locale === "ar" ? "اختر الفرع:" : "Select Branch:"}
                </span>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="bg-[#181818] border border-border focus:border-gold rounded-xl px-3 py-2 text-xs font-bold text-gold focus:outline-none cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#181818] text-ivory py-1">
                      {locale === "ar" ? b.nameAr : b.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border hover:border-gold text-xs font-bold text-ivory hover:text-gold flex items-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (locale === "ar" ? "تم النسخ!" : "Copied!") : (locale === "ar" ? "نسخ الرابط" : "Copy Link")}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-[#0B0B0B] text-xs font-bold shadow-gold-glow flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#0B0B0B]" />
              <span>{locale === "ar" ? "طباعة الكارت فوراً" : "Print Stand Card"}</span>
            </button>
          </div>
        </div>

        {/* Printable Stand Card Preview Area */}
        <div className="flex justify-center py-4">
          <div
            id="printable-qr-stand"
            className="w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#141414] via-[#0E0E0E] to-[#141414] border-2 border-gold/70 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-7 text-center relative overflow-hidden"
          >
            {/* Elegant corner accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold" />

            {/* Logo & Brand Header */}
            <div className="space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold shadow-gold-glow">
                <Scissors className="w-7 h-7 -rotate-45" />
              </div>
              <h2 className="font-serif tracking-widest text-2xl font-bold text-ivory">
                GENTLEMAN
              </h2>
              <p className="text-[11px] font-bold tracking-widest uppercase text-gold">
                BARBERSHOP & SPA
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-xs font-bold text-gold mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>فرع {activeBranch.nameAr}</span>
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-ivory">
                نوّرتنا يا باشا.. قولنا رأيك بصراحة!
              </h3>
              <p className="text-xs text-ivory-muted leading-relaxed">
                امسح الرمز بكاميرا موبايلك في ثواني، ورأيك بيوصل مباشرة لإدارة الصالون.
              </p>
            </div>

            {/* The QR Code Card Frame */}
            <div className="p-4 bg-white rounded-2xl shadow-xl inline-block border-4 border-gold/30 mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt={`${activeBranch.nameAr} Feedback QR`}
                width={250}
                height={250}
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto block"
              />
            </div>

            {/* Tagline / Footer */}
            <div className="space-y-1.5 pt-2 border-t border-border/80">
              <p className="text-xs font-semibold text-gold">
                أرقى حلاقة ورواقان في مصر ✂️
              </p>
              <p className="text-[10px] text-ivory-muted font-mono" dir="ltr">
                {activeBranch.phoneDisplay}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
