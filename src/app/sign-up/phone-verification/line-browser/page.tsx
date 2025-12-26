"use client";

import { Link as LinkIcon } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useTranslations } from "next-intl";

export default function OpenInBrowser() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  // Use runtime community config from context
  const communityConfig = useCommunityConfig();
  const nextParam = searchParams.get("next");
  const baseUrl = `${communityConfig?.domain || ""}/sign-up/phone-verification`;
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
      toast.success(t("phoneVerification.lineBrowser.copySuccess"));
    } catch (err) {
      toast.error(t("phoneVerification.lineBrowser.copyFailure"));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <div className="text-center space-y-6 max-w-mobile-l w-full">
        <h1 className="text-body-md font-bold">
          {t("phoneVerification.lineBrowser.title")}
          <br />
          {t("phoneVerification.lineBrowser.notAvailable")}
        </h1>

        <p className="text-sm text-muted-foreground">
          {t("phoneVerification.lineBrowser.instructions")}
        </p>

        <div className="space-y-2">
          <Button onClick={handleCopy} variant="secondary" className="w-full flex justify-center">
            <LinkIcon className="mr-2 h-4 w-4" />
            {t("phoneVerification.lineBrowser.copyLink")}
          </Button>
        </div>
      </div>
    </div>
  );
}
