"use client";

import React from "react";
import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  title?: string;
  actionText?: string;
  actionHref?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "エラーが発生しました",
  title = "エラーが発生しました",
  actionText,
  actionHref,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <div className="bg-muted rounded-full p-4 mx-auto w-fit">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold">問題が発生しました</h1>
        <p className="text-left text-body-sm text-muted-foreground px-[40px]">
          一時的にアクセスができない状態です。
          <br />
          時間をおいて再度お試しください。
        </p>

        <div className="w-full px-[40px]">
          <Link href="/" passHref>
            <Button className="w-full flex justify-center">
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
