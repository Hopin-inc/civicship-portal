"use client";
import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { detectEnvironment, AuthEnvironment } from "@/lib/auth/environment-detector";

export default function LiffBootstrap() {
  useEffect(() => {
    if (detectEnvironment() !== AuthEnvironment.LIFF) return;
    const svc = LiffService.getInstance(process.env.NEXT_PUBLIC_LIFF_ID!);
    void svc.initialize();
  }, []);
  return null;
}
