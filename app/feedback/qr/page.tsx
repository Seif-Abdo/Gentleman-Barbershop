"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBranch } from "@/components/BranchContext";

export default function GenericQrRedirect() {
  const router = useRouter();
  const { currentBranchId } = useBranch();

  useEffect(() => {
    router.replace(`/${currentBranchId}/feedback/qr`);
  }, [currentBranchId, router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-ivory-muted text-sm">
      جاري التوجيه إلى رمز QR الفرع...
    </div>
  );
}
