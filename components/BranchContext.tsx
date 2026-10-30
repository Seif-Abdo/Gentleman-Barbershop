"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Branch, DEFAULT_BRANCHES } from "@/config/branches";

interface BranchContextType {
  currentBranch: Branch;
  currentBranchId: string;
  branches: Branch[];
  switchBranch: (branchId: string) => void;
  isBranchModalOpen: boolean;
  setIsBranchModalOpen: (open: boolean) => void;
}

const BranchContext = createContext<BranchContextType>({
  currentBranch: DEFAULT_BRANCHES[0],
  currentBranchId: DEFAULT_BRANCHES[0].id,
  branches: DEFAULT_BRANCHES,
  switchBranch: () => {},
  isBranchModalOpen: false,
  setIsBranchModalOpen: () => {},
});

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [currentBranchId, setCurrentBranchId] = useState<string>("zahraa-maadi");
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  // Extract branch slug from pathname: e.g. /nasr-city/services -> nasr-city
  useEffect(() => {
    // Fetch modular branches from API or fallback
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBranches(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const branchCandidate = segments[0];

    const matched = branches.find((b) => b.id === branchCandidate);
    if (matched) {
      setCurrentBranchId(matched.id);
      localStorage.setItem("gentleman_branch", matched.id);
    } else {
      const saved = localStorage.getItem("gentleman_branch");
      if (saved && branches.some((b) => b.id === saved)) {
        setCurrentBranchId(saved);
      }
    }
  }, [pathname, branches]);

  const switchBranch = (newBranchId: string) => {
    setCurrentBranchId(newBranchId);
    localStorage.setItem("gentleman_branch", newBranchId);

    // If currently on a branch route (e.g. /zahraa-maadi/feedback), route to the new branch (/nasr-city/feedback)
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    const isBranchRoute = branches.some((b) => b.id === firstSegment);

    if (isBranchRoute) {
      const rest = segments.slice(1).join("/");
      router.push(`/${newBranchId}${rest ? `/${rest}` : ""}`);
    } else {
      router.push(`/${newBranchId}`);
    }
    setIsBranchModalOpen(false);
  };

  const currentBranch =
    branches.find((b) => b.id === currentBranchId) || branches[0] || DEFAULT_BRANCHES[0];

  return (
    <BranchContext.Provider
      value={{
        currentBranch,
        currentBranchId,
        branches,
        switchBranch,
        isBranchModalOpen,
        setIsBranchModalOpen,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  return useContext(BranchContext);
}
