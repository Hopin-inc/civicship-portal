"use client";

import CommunityLink from "@/components/navigation/CommunityLink";
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
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export default function NotFound() {
  const communityConfig = useCommunityConfig();
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const rootPath = communityConfig?.rootPath ?? "/";

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
            <CommunityLink href={rootPath}>
              <Home className="mr-2 h-4 w-4" />
              トップに戻る
            </CommunityLink>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
