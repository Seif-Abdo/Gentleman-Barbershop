"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "./LanguageContext";
import { BranchProvider } from "./BranchContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BranchModal } from "./BranchModal";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/portal") || pathname.startsWith("/admin");

  // Standalone Portal Layout (no customer Navbar, no customer Footer)
  if (isPortal) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-bg text-ivory antialiased">{children}</div>
      </LanguageProvider>
    );
  }

  // Customer Facing Layout
  return (
    <LanguageProvider>
      <BranchProvider>
        <div className="flex flex-col min-h-screen bg-bg text-ivory antialiased">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <BranchModal />
        </div>
      </BranchProvider>
    </LanguageProvider>
  );
}
