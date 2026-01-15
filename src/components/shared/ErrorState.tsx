"use client";

import React, { useEffect } from "react";
import { Home, RefreshCcw } from "lucide-react";
import CommunityLink from "@/components/navigation/CommunityLink";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ErrorStateProps {
  title?: string;
  refetchRef?: React.MutableRefObject<(() => void) | null>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  refetchRef,
}) => {
  const t = useTranslations();
  const displayTitle = title ?? t("common.errorState.defaultTitle");

  const handleRetry = () => {
    if (refetchRef?.current) {
      refetchRef.current();
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-mobile-l space-y-6 text-center">
        <h1 className="text-left text-display-md font-bold">{displayTitle}</h1>
        <p className="text-left text-body-sm text-muted-foreground">
          {t("common.errorState.description")}
        </p>

        <div className="mt-6">
          {refetchRef?.current && (
            <Button
              className="w-full flex justify-center mb-1"
              onClick={handleRetry}
              variant="primary"
            >
              <RefreshCcw className="h-4 w-4" />
              {t("common.errorState.retryButton")}
            </Button>
          )}

          <CommunityLink href="/" passHref>
            <Button className="w-full flex justify-center" size="sm" variant="text">
              <Home className="h-4 w-4" />
              {t("common.errorState.homeButton")}
            </Button>
          </CommunityLink>
        </div>
      </div>
    </div>
  );
};
