"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import React, { useEffect } from "react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { currentCommunityConfig } from "@/lib/communities/metadata";

export default function NotFound() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const rootPath = currentCommunityConfig.rootPath ?? "/";

  return (
    <div className="flex items-center justify-center p-12">
      <Empty className="w-full max-w-mobile-l">
        <EmptyHeader>
          <EmptyMedia variant="default" size="lg">
            <AlertCircle className="h-10 w-10" />
          </EmptyMedia>
          <EmptyTitle>お探しのページが見つかりませんでした</EmptyTitle>
          <EmptyDescription>
            指定されたページ（URL）が見つかりません。下にあるボタンからご覧ください。
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild className="w-full">
            <Link href={rootPath}>
              <Home className="mr-2 h-4 w-4" />
              トップに戻る
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
