"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Inbox } from "lucide-react";
import React, { useEffect } from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = "ページ",
  message = `現在${title}は準備中です。しばらくしてからご確認ください。`,
}: EmptyStateProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <div className="bg-muted rounded-full p-4 mx-auto w-fit">
          <Inbox className="h-10 w-10 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-bold">
          お探しの{title}は
          <br />
          まだありません
        </h1>

        <p className="text-left text-body-sm text-muted-foreground px-[40px]">{message}</p>

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
}
