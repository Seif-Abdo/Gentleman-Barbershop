"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { Shield, KeyRound, AlertCircle, Scissors, ArrowRight, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const { locale, dir } = useLanguage();
  const router = useRouter();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

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
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full gold-card rounded-3xl p-8 sm:p-10 space-y-6 shadow-gold-glow">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold shadow-sm">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-ivory">
            {locale === "ar" ? "لوحة تحليلات الإدارة" : "Manager Analytics Portal"}
          </h1>
          <p className="text-xs text-ivory-muted">
            {locale === "ar"
              ? "منطقة مخصصة لصاحب وإدارة صالون جنتل مان لمتابعة الأداء والتقييمات."
              : "Restricted to gentleman barbershop management."}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ivory-muted">
              {locale === "ar" ? "كلمة مرور الإدارة" : "Manager Password"}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-surface-2 border border-border focus:border-gold focus:outline-none text-ivory text-sm"
              />
              <KeyRound className="w-4 h-4 text-ivory-muted absolute top-3.5 left-4 pointer-events-none" />
            </div>
            <p className="text-[11px] text-ivory-muted pt-1">
              {locale === "ar"
                ? "كلمة المرور الافتراضية: gentleman2026"
                : "Default password: gentleman2026"}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold bg-gold hover:bg-gold-light text-bg shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>{locale === "ar" ? "جاري التحقق..." : "Authenticating..."}</span>
            ) : (
              <>
                <span>{locale === "ar" ? "تسجيل الدخول" : "Sign In"}</span>
                <ArrowIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
