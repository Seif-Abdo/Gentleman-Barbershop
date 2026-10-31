"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { Shield, Lock, User, AlertCircle, ArrowLeft, ArrowRight, Scissors, Sparkles } from "lucide-react";

export default function PortalLoginPage() {
  const { locale, dir } = useLanguage();
  const router = useRouter();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/portal");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-[#121212] border border-gold/40 rounded-3xl p-8 sm:p-10 space-y-7 shadow-gold-glow relative z-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold shadow-sm">
            <Scissors className="w-8 h-8 -rotate-45" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
              GENTLEMAN EXECUTIVE PORTAL
            </span>
            <h1 className="text-2xl font-extrabold text-ivory mt-1">
              {locale === "ar" ? "بوابة إدارة صالون جنتل مان" : "Executive Management Portal"}
            </h1>
          </div>

          <p className="text-xs text-ivory-muted">
            {locale === "ar"
              ? "نظام إدارة وتحليلات الفروع وحملات الواتساب للمدير العام ومديري الفروع."
              : "Secure portal for Master Admin and Branch Managers."}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ivory-muted">
              {locale === "ar" ? "اسم المستخدم أو البريد" : "Username"}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={locale === "ar" ? "اسم المستخدم" : "Username"}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
              />
              <User className="w-4 h-4 text-ivory-muted absolute top-3.5 left-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ivory-muted">
              {locale === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
              />
              <Lock className="w-4 h-4 text-ivory-muted absolute top-3.5 left-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>{locale === "ar" ? "جاري التحقق..." : "Authenticating..."}</span>
            ) : (
              <>
                <span>{locale === "ar" ? "تسجيل الدخول للمنظومة" : "Sign In to Portal"}</span>
                <ArrowIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
