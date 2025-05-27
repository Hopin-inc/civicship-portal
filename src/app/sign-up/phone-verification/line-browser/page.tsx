"use client";

import { Link as LinkIcon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OpenInBrowser() {
  const COPY_URL = "https://www.neo88.app/sign-up/phone-verification";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <h1 className="text-body-md font-bold">
          電話番号認証は
          <br />
          LINEブラウザでご利用いただけません
        </h1>

        <p className="text-left text-body-sm text-muted-foreground px-[40px]">
          正常にご利用いただくためには、SafariやChromeなどの通常のブラウザでこのページを開いてください。
        </p>

        <div className="space-y-2 px-[40px] w-full">
          <Button onClick={handleCopy} variant="secondary" className="w-full flex justify-center">
            <LinkIcon className="mr-2 h-4 w-4" />
            リンクをコピー
          </Button>
        </div>
      </div>
    </div>
  );
}
