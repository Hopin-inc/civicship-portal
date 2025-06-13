"use client";

import { Link as LinkIcon } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { currentCommunityConfig } from "@/lib/communities/metadata";

export default function OpenInBrowser() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const baseUrl = `${currentCommunityConfig.domain}/sign-up/phone-verification`;
  const COPY_URL = nextParam ? `${baseUrl}?next=${nextParam}` : baseUrl;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
          正常にご利用いただくためには、SafariやChromeなどの通常のブラウザでこのページを開いてください。
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
