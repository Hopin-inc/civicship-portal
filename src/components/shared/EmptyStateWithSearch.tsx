"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Search } from "lucide-react";
import { currentCommunityConfig, getCurrentRegionName } from "@/lib/communities/metadata";

interface EmptyStateProps {
  title?: string;
  description?: string | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  hideActionButton?: boolean;
  icon?: React.ReactNode;
  images?: Array<{ url: string; alt: string }>;
}

export default function EmptyStateWithSearch({
  title,
  description = (
    <>
      {getCurrentRegionName()}の素敵な人と関わって
      <br />
      チケットをもらおう
    </>
  ),
  actionLabel = "関わりをみつける",
  onAction = () => (window.location.href = currentCommunityConfig.rootPath ?? "/"),
  hideActionButton = false,
  icon,
}: EmptyStateProps) {
  return (
    <Empty className="mt-8">
      <EmptyHeader>
        <EmptyMedia variant="gradient">
          {icon || <Search className="h-8 w-8" />}
        </EmptyMedia>
        {title && <EmptyTitle>{title}</EmptyTitle>}
        <EmptyDescription>
          {typeof description === "string" ? description : description}
        </EmptyDescription>
      </EmptyHeader>

      {!hideActionButton && (
        <EmptyContent>
          {currentCommunityConfig.enableFeatures.includes("opportunities") ? (
            <Button variant="primary" size="lg" className="px-16" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : (
            <Button variant="tertiary" disabled size="lg" className="px-16">
              🚧 開発中です
            </Button>
          )}
        </EmptyContent>
      )}
    </Empty>
  );
}
