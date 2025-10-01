"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { detectEnvironment, AuthEnvironment } from "@/lib/auth/environment-detector";

export default function LiffBootstrap() {
  useEffect(() => {
    if (detectEnvironment() !== AuthEnvironment.LIFF) return;
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) return;
    
    LiffService.getInstance(liffId).initialize().catch(() => {});
  }, []);
  
  return null;
}
