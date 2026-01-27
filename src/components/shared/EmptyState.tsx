"use client";

import CommunityLink from "@/components/navigation/CommunityLink";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
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
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-mobile-l space-y-6 text-center">
        <h1 className="text-display-md font-bold">
          お探しの{title}は
          <br />
          まだありません
        </h1>

        <p className="text-left text-body-sm text-muted-foreground">{message}</p>

        <CommunityLink href="/" passHref>
          <Button className="w-full flex justify-center mt-6">
            <Home className="mr-2 h-4 w-4" />
            トップページに戻る
          </Button>
        </CommunityLink>
      </div>
    </div>
  );
}
