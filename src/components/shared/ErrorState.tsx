"use client";

import React, { useEffect } from "react";
import { Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  refetchRef?: React.MutableRefObject<(() => void) | null>;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "ページを読み込めませんでした",
  refetchRef,
}) => {
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
        <h1 className="text-left text-display-md font-bold">{title}</h1>
        <p className="text-left text-body-sm text-muted-foreground">
          以下のボタンから再読み込みをお試しください。
          再試行しても改善しない場合は、時間をおいて再度アクセスするか、
          トップページにお戻りください。
        </p>

        <div className="mt-6">
          {refetchRef?.current && (
            <Button
              className="w-full flex justify-center mb-1"
              onClick={handleRetry}
              variant="primary"
            >
              <RefreshCcw className="h-4 w-4" />
              再度読み込み
            </Button>
          )}

          <Link href="/" passHref>
            <Button className="w-full flex justify-center" size="sm" variant="text">
              <Home className="h-4 w-4" />
              トップに戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};