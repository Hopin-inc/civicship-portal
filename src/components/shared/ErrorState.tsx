"use client";

import React from "react";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  refetchRef?: React.MutableRefObject<(() => void) | null>;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "ページを読み込めませんでした",
  refetchRef,
}) => {
  const handleRetry = () => {
    if (refetchRef?.current) {
      refetchRef.current();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <div className="bg-muted rounded-full p-4 mx-auto w-fit">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-display-sm font-bold">{title}</h1>
        <p className="text-left text-body-sm text-muted-foreground px-[40px]">
          以下のボタンから再読み込みをお試しください。
          <br />
          <br />
          再試行しても改善しない場合は、時間をおいて再度アクセスするか、
          トップページにお戻りください。
        </p>

        <div className="w-full px-[40px]">
          {refetchRef?.current && (
            <Button className="w-full flex justify-center" onClick={handleRetry} variant="primary">
              <RefreshCcw className="mr-2 h-4 w-4" />
              再度読み込み
            </Button>
          )}
          <div className="h-3" />
          <Link href="/" passHref>
            <Button className="w-full flex justify-center" size={"sm"} variant="text">
              <Home className="mr-2 h-4 w-4" />
              トップページに戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
