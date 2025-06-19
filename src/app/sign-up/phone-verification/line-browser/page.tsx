"use client";

import { Link as LinkIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { LiffService } from "@/lib/auth/liff-service";
import { logger } from "@/lib/logging";

export default function OpenInBrowser() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const baseUrl = `${currentCommunityConfig.domain}/sign-up/phone-verification`;
  const COPY_URL = nextParam ? `${baseUrl}?next=${nextParam}` : baseUrl;
  const hasRedirected = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // LIFFへの自動リダイレクト
  useEffect(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    try {
      // Get LIFF ID from environment variable
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
      if (!liffId || liffId.trim() === "") {
        logger.warn("LIFF ID is not configured", {
          component: "OpenInBrowser",
          action: "redirect_to_liff",
        });
        return; // LIFFが設定されていない場合は現在のページを表示
      }

      // Initialize LIFF service
      const liffService = LiffService.getInstance(liffId);

      // LIFFからのリダイレクト後に識別できるようにパラメータを追加
      const redirectPath = nextParam
        ? `/sign-up/phone-verification?next=${encodeURIComponent(nextParam)}&from_liff=true`
        : "/sign-up/phone-verification?from_liff=true";

      // Get LIFF URL and redirect
      const liffUrl = liffService.getLiffUrl(redirectPath);
      logger.info("Redirecting to LIFF from line-browser page", {
        component: "OpenInBrowser",
        action: "redirect_to_liff",
        liffUrl,
      });

      // 少し遅延させてからリダイレクト（UIがちらつくのを防ぐため）
      setTimeout(() => {
        window.location.href = liffUrl;
      }, 100);
    } catch (error) {
      logger.error("Failed to redirect to LIFF", {
        component: "OpenInBrowser",
        action: "redirect_to_liff",
        error: error instanceof Error ? error.message : String(error),
      });
      // エラーの場合は現在のページを表示（手動でリンクをコピーできるようにする）
    }
  }, [nextParam]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COPY_URL);
      toast.success("リンクをコピーしました");
    } catch (err) {
      toast.error("コピーに失敗しました");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <div className="text-center space-y-6 max-w-mobile-l w-full">
        <h1 className="text-body-md font-bold">
          電話番号認証は
          <br />
          LINEブラウザでご利用いただけません
        </h1>

        <p className="text-sm text-muted-foreground">
          LIFFアプリに自動的に遷移しています...
          <br />
          遷移しない場合は、SafariやChromeなどの通常のブラウザでこのページを開いてください。
        </p>

        <div className="space-y-2">
          <Button onClick={handleCopy} variant="secondary" className="w-full flex justify-center">
            <LinkIcon className="mr-2 h-4 w-4" />
            リンクをコピー
          </Button>
        </div>
      </div>
    </div>
  );
}
